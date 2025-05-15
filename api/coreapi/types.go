package coreapi

import (
	"fmt"
	"strings"
	"time"
)

type Params struct {
	Abstract      string   `json:"abstract,omitempty"`
	AcceptedDate  CoreTime `json:"accepted_date"`
	ArvixId       string   `json:"arvixId,omitempty"`
	Authors       []string `json:"authors,omitempty"`
	CitationCount int      `json:"citationCount,omitempty"`
	Contributors  []string `json:"contributors,omitempty"`
	CreatedDate   CoreTime `json:"createdDate"`
	DocumentType  string   `json:"documentType,omitempty"`
	Doi           string   `json:"doi,omitempty"`
	FullText      string   `json:"fullText,omitempty"`
	Id            int      `json:"id,omitempty"`
	MagId         string   `json:"magId,omitempty"`
	Publisher     string   `json:"publisher,omitempty"`
	Title         string   `json:"title,omitempty"`
	UpdatedDate   CoreTime `json:"updatedDate"`
	YearPublished string   `json:"yearPublished,omitempty"`
	Limit         int      `json:"limit,omitempty"`
}

type Paper struct {
	Abstract           string      `json:"abstract,omitempty"`
	AcceptedDate       CoreTime    `json:"acceptedDate"`
	Authors            []Author    `json:"authors,omitempty"`
	Contributors       []string    `json:"contributors,omitempty"`
	CreatedDate        CoreTime    `json:"createdDate"`
	Deleted            string      `json:"deleted,omitempty"`
	DepositedDate      CoreTime    `json:"depositedDate"`
	Disabled           bool        `json:"disabled,omitempty"`
	DownloadUrl        string      `json:"downloadUrl,omitempty"`
	FullText           string      `json:"fullText,omitempty"`
	FullTextStatus     string      `json:"fullTextStatus,omitempty"`
	Id                 int         `json:"id,omitempty"`
	LastUpdate         CoreTime    `json:"lastUpdate"`
	License            string      `json:"license,omitempty"`
	PublishedDate      CoreTime    `json:"publishedDate"`
	Publisher          string      `json:"publisher,omitempty"`
	References         []Reference `json:"references,omitempty"`
	SourceFullTextUrls []string    `json:"sourceFullTextUrls,omitempty"`
	Title              string      `json:"title,omitempty"`
	UpdatedDate        CoreTime    `json:"updatedDate"`
	YearPublished      int         `json:"yearPublished,omitempty"`
}

type Author struct {
	Name string `json:"name,omitempty"`
}
type Reference struct {
	Id      int      `json:"id,omitempty"`
	Title   string   `json:"title,omitempty"`
	Authors []string `json:"authors,omitempty"`
	Date    string   `json:"date,omitempty"`
	Raw     string   `json:"raw,omitempty"`
	Cites   []string `json:"cites,omitempty"`
}

type CoreTime struct {
	time.Time
}

func (ct *CoreTime) UnmarshalJSON(b []byte) error {
	if string(b) == `""` || string(b) == `null` {
		ct.Time = time.Time{}
		return nil
	}
	str := strings.Trim(string(b), `"`)
	formats := []string{
		"2006-01-02T15:04:05Z07:00",
		"2006-01-02T15:04:05Z",
		"2006-01-02T15:04:05",
		"2006-01-02",
	}
	var t time.Time
	var err error
	for _, format := range formats {
		t, err = time.Parse(format, str)
		if err == nil {
			ct.Time = t.UTC()
			return nil
		}
	}
	return fmt.Errorf("invalid date format: %s", str)
}
