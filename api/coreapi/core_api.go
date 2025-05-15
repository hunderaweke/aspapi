package coreapi

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

type CoreApi struct {
	redisClient *redis.Client
	apiKey      string
	httpClient  *http.Client
}

type CoreApiResponse struct {
	TotalHits int     `json:"totalHits"`
	Limit     int     `json:"limit"`
	Offset    int     `json:"offset"`
	Papers    []Paper `json:"results"`
}

func NewCoreApi() (*CoreApi, error) {
	if err := godotenv.Load(); err != nil {
		return nil, fmt.Errorf("error loading .env file: %v", err)
	}
	redisDB, err := strconv.Atoi(os.Getenv("REDIS_DB"))
	if err != nil {
		return nil, fmt.Errorf("error converting REDIS_DB to int: %v", err)
	}
	redisClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       redisDB,
	})
	if err := redisClient.Ping(context.TODO()).Err(); err != nil {
		return nil, fmt.Errorf("error connecting to Redis: %v", err)
	}
	return &CoreApi{
		redisClient: redisClient,
		apiKey:      os.Getenv("CORE_API_KEY"),
		httpClient:  &http.Client{Timeout: 10 * time.Second},
	}, nil
}
func (a *CoreApi) GetPapers(p *Params) ([]Paper, error) {
	baseUrl := "https://api.core.ac.uk/v3/search/works/"
	queryParams := url.Values{}
	queryParts := []string{}
	if p.Abstract != "" {
		queryParts = append(queryParts, "abstract:"+p.Abstract)
	}
	if !p.AcceptedDate.IsZero() {
		queryParts = append(queryParts, "acceptedDate:"+p.AcceptedDate.Format("2006-01-02"))
	}
	if p.ArvixId != "" {
		queryParts = append(queryParts, "arvixId:"+p.ArvixId)
	}
	if p.CitationCount != 0 {
		queryParts = append(queryParts, fmt.Sprintf("citationCount:%d", p.CitationCount))
	}
	if len(p.Contributors) > 0 {
		queryParts = append(queryParts, "contributors:"+strings.Join(p.Contributors, ","))
	}
	if !p.CreatedDate.IsZero() {
		queryParts = append(queryParts, "createdDate:"+p.CreatedDate.Format("2006-01-02"))
	}
	if p.DocumentType != "" {
		queryParts = append(queryParts, "documentType:"+p.DocumentType)
	}
	if p.Doi != "" {
		queryParts = append(queryParts, "doi:"+p.Doi)
	}
	if p.FullText != "" {
		queryParts = append(queryParts, "fullText:"+p.FullText)
	}
	if p.Id != 0 {
		queryParts = append(queryParts, fmt.Sprintf("id:%d", (p.Id)))
	}
	if p.MagId != "" {
		queryParts = append(queryParts, "magId:"+p.MagId)
	}
	if p.Publisher != "" {
		queryParts = append(queryParts, "publisher:"+p.Publisher)
	}
	if p.Title != "" {
		queryParts = append(queryParts, "title:"+p.Title)
	}
	if p.YearPublished != "" {
		queryParts = append(queryParts, "yearPublished:"+p.YearPublished)
	}
	if p.Title != "" {
		queryParts = append(queryParts, "title:"+p.Title)
	}
	if len(p.Authors) > 0 {
		queryParts = append(queryParts, "authors:"+strings.Join(p.Authors, ","))
	}
	if len(queryParts) > 0 {
		queryParams.Add("query", strings.Join(queryParts, " AND "))
	}
	if p.Limit != 0 {
		queryParams.Add("limit", fmt.Sprintf("%d", p.Limit))
	}
	fullUrl := baseUrl + "?" + queryParams.Encode()
	req, err := http.NewRequest("GET", fullUrl, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %v", err)
	}
	req.Header.Set("Authorization", "Bearer "+a.apiKey)
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "Academic Papers Search")
	cacheKey := fmt.Sprintf("coreapi:%s", strings.Join(queryParts, "+"))
	cacheKey += fmt.Sprintf("&limit=%d", p.Limit)
	cached, err := a.redisClient.Get(context.TODO(), cacheKey).Result()
	if err == nil {
		var papers []Paper
		err = json.Unmarshal([]byte(cached), &papers)
		if err == nil {
			return papers, nil
		}
		return nil, fmt.Errorf("error unmarshalling cached response: %v", err)
	}
	resp, err := a.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %v", err)
	}
	defer resp.Body.Close()
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error: received status code %d", resp.StatusCode)
	}
	var response CoreApiResponse
	err = json.Unmarshal(data, &response)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling response: %v", err)
	}
	serialized, err := json.Marshal(response.Papers)
	if err != nil {
		return nil, fmt.Errorf("error marshalling response: %v", err)
	}
	if err = a.redisClient.Set(context.TODO(), cacheKey, serialized, 24*time.Hour).Err(); err != nil {
		return nil, fmt.Errorf("error setting cache: %v", err)
	}
	return response.Papers, nil
}
