"use server"

import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"

// System prompt that instructs the model to only answer academic paper related questions
const SYSTEM_PROMPT = `
You are an AI assistant for an academic paper search engine. Your purpose is to help users find academic papers, 
understand academic concepts, and navigate scholarly research.

IMPORTANT RULES:
1. ONLY respond to queries related to academic papers, research, scholarly articles, academic concepts, or the academic search process.
2. If a query is not related to academic papers or research, politely refuse to answer and explain that you can only help with academic paper related questions.
3. Do not provide responses to personal questions, general knowledge questions unrelated to academia, or any topic outside the academic research domain.
4. When refusing, be polite but firm, and suggest that the user ask about academic papers or research instead.
5. Always provide helpful responses for legitimate academic paper related questions.

Examples of ACCEPTABLE queries:
- "Can you help me find papers on quantum computing?"
- "What are the most cited papers in machine learning?"
- "How do I read academic papers efficiently?"
- "Explain the peer review process"
- "What journals publish papers on climate science?"

Examples of queries to REFUSE:
- "What's the weather like today?"
- "Write me a poem"
- "Tell me a joke"
- "What's your opinion on politics?"
- "Help me with my personal problems"
`

export async function chatWithAI(message: string) {
  try {
    if (!message || typeof message !== "string") {
      return {
        response: "Please provide a valid message.",
        isRefusal: false,
        error: true,
      }
    }

    // First, validate if the query is related to academic papers
    const validationResult = await validateAcademicQuery(message)

    if (!validationResult.isValid) {
      return {
        response: validationResult.refusalMessage,
        isRefusal: true,
      }
    }

    // If valid, generate a helpful response
    const { text } = await generateText({
      model: cohere("command"),
      messages: [{ role: "user", content: message }],
      system: SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 500,
    })

    return { response: text, isRefusal: false }
  } catch (error) {
    console.error("Error in chat action:", error)
    return {
      response: "Sorry, there was an error processing your request. Please try again later.",
      isRefusal: false,
      error: true,
    }
  }
}

// Function to validate if a query is related to academic papers
async function validateAcademicQuery(query: string): Promise<{ isValid: boolean; refusalMessage?: string }> {
  try {
    const { text } = await generateText({
      model: cohere("command"),
      prompt: `
Determine if the following query is related to academic papers, research, scholarly articles, academic concepts, or the academic search process.
Respond with ONLY "YES" if it is related to academic topics, or "NO" if it is not.

Query: "${query}"

Response (ONLY "YES" or "NO"):`,
      temperature: 0,
      maxTokens: 5,
    })

    const isValid = text.trim().toUpperCase().includes("YES")

    if (!isValid) {
      return {
        isValid: false,
        refusalMessage: `I'm sorry, but I can only assist with questions related to academic papers, research, and scholarly topics. Your question appears to be outside my area of focus. Please feel free to ask me about finding academic papers, understanding research concepts, or navigating scholarly resources.`,
      }
    }

    return { isValid: true }
  } catch (error) {
    console.error("Error validating query:", error)
    // If validation fails, default to allowing the query
    return { isValid: true }
  }
}
