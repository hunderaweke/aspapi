import { BookOpen, Shield, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Features() {
  return (
    <section className="w-full max-w-5xl mx-auto py-12 md:py-24">
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border">
          <BookOpen className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">AI-Powered Search</h3>
          <p className="text-gray-600 mb-4">
            Leveraging Cohere API for semantic search to find the most relevant academic papers based on your query.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border">
          <Shield className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Privacy-Focused</h3>
          <p className="text-gray-600 mb-4">
            No tracking, no cookies, no user profiling. Your search queries remain private.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg border">
          <MessageSquare className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">AI Research Assistant</h3>
          <p className="text-gray-600 mb-4">
            Chat with our specialized AI assistant to get help with academic research and paper recommendations.
          </p>
          <Link href="/chat">
            <Button>Try Chat Assistant</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
