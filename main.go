package main

import (
	"academic-papers-search/api/cohereapi"
	"academic-papers-search/api/coreapi"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type api struct {
	cohereApi *cohereapi.CohereApi
	coreApi   *coreapi.CoreApi
}

func main() {
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()
	cohereApi, err := cohereapi.NewCohereApi(context.TODO())
	if err != nil {
		log.Fatal(err)
	}
	coreApi, err := coreapi.NewCoreApi()
	if err != nil {
		log.Fatal(err)
	}
	api := &api{
		cohereApi: cohereApi,
		coreApi:   coreApi,
	}
	http.HandleFunc("/api/chat", api.handleChat)
	http.HandleFunc("/api/papers", api.handlePapers)
	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func jsonResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (api *api) handleChat(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Prompt string `json:"prompt"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	response, err := api.cohereApi.HandleChat(request.Prompt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	jsonResponse(w, map[string]string{"response": response})
}

func (api *api) handlePapers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	params := &coreapi.Params{
		Abstract:      r.URL.Query().Get("abstract"),
		ArvixId:       r.URL.Query().Get("arvixId"),
		DocumentType:  r.URL.Query().Get("documentType"),
		Doi:           r.URL.Query().Get("doi"),
		FullText:      r.URL.Query().Get("fullText"),
		MagId:         r.URL.Query().Get("magId"),
		Publisher:     r.URL.Query().Get("publisher"),
		Title:         r.URL.Query().Get("title"),
		YearPublished: r.URL.Query().Get("yearPublished"),
	}
	// Parse limit if present
	if limit := r.URL.Query().Get("limit"); limit != "" {
		if n, err := strconv.Atoi(limit); err == nil {
			params.Limit = n
		}
	}
	// Parse authors and contributors as comma-separated lists
	if authors := r.URL.Query().Get("authors"); authors != "" {
		params.Authors = splitAndTrim(authors)
	}
	if contributors := r.URL.Query().Get("contributors"); contributors != "" {
		params.Contributors = splitAndTrim(contributors)
	}
	// Parse createdDate and acceptedDate if present
	if created := r.URL.Query().Get("createdDate"); created != "" {
		_ = params.CreatedDate.UnmarshalJSON([]byte(`"` + created + `"`))
	}
	if accepted := r.URL.Query().Get("acceptedDate"); accepted != "" {
		_ = params.AcceptedDate.UnmarshalJSON([]byte(`"` + accepted + `"`))
	}
	papers, err := api.coreApi.GetPapers(params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	jsonResponse(w, papers)
}
func splitAndTrim(s string) []string {
	parts := strings.Split(s, ",")
	for i := range parts {
		parts[i] = strings.TrimSpace(parts[i])
	}
	return parts
}
