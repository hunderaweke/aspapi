package coreapi

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type CoreApi struct {
	apiKey     string
	httpClient *http.Client
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
	return &CoreApi{
		apiKey:     os.Getenv("CORE_API_KEY"),
		httpClient: &http.Client{Timeout: 10 * time.Second},
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
	return response.Papers, nil
}
