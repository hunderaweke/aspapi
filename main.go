package main

import (
	"academic-papers-search/api/coreapi"
	"fmt"
	"log"
)

func main() {
	api, err := coreapi.NewCoreApi()
	if err != nil {
		log.Fatal(err)
	}
	papers, err := api.GetPapers(&coreapi.Params{Abstract: "machine learning", Authors: []string{"David", "Peter"}, Limit: 10})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(len(papers))
}
