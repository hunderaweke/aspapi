package cohereapi

import (
	"context"
	"fmt"
	"os"

	cohere "github.com/cohere-ai/cohere-go/v2"
	cohereclient "github.com/cohere-ai/cohere-go/v2/client"
	"github.com/joho/godotenv"
)

type CohereApi struct {
	client *cohereclient.Client
	ctx    context.Context
}

func NewCohereApi(ctx context.Context) (*CohereApi, error) {
	if err := godotenv.Load(".env"); err != nil {
		return nil, fmt.Errorf("failed to load .env file: %w", err)
	}
	client := cohereclient.NewClient(cohereclient.WithToken(os.Getenv("COHERE_API_KEY")))
	if client == nil {
		return nil, fmt.Errorf("failed to create cohere client")
	}
	return &CohereApi{client: client, ctx: ctx}, nil
}

func (api *CohereApi) HandleChat(prompt string) (string, error) {
	response, err := api.client.Chat(api.ctx, &cohere.ChatRequest{
		Message: fmt.Sprintf(`
		Role: You are an academic paper search engine assistant if the message is not about academic papers politefully refuse to answer.
		Message: %s
		`, prompt),
	})
	if err != nil {
		return "", err
	}
	return response.Text, nil
}
