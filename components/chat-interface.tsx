"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { chatWithAI } from "@/app/actions/chat"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  isRefusal?: boolean
}

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I can help you find academic papers and answer questions about scholarly research. What would you like to know?",
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Clear any previous errors
    setError(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const result = await chatWithAI(input)

      if (result.error) {
        setError("There was an error processing your request. Please try again.")
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.response,
          role: "assistant",
          isRefusal: result.isRefusal,
        }

        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Academic Paper Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-[400px] overflow-y-auto space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-max max-w-[80%] rounded-lg px-4 py-2",
              message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
              message.isRefusal && "border-l-4 border-amber-500",
            )}
          >
            {message.content}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-pulse">●</div>
            <div className="animate-pulse animation-delay-200">●</div>
            <div className="animate-pulse animation-delay-400">●</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Ask about academic papers..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
