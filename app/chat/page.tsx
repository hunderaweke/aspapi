import { ChatInterface } from "@/components/chat-interface"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Chat with AI Assistant - Academic Paper Search Portal",
  description: "Chat with our AI assistant to find academic papers and get research help",
}

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-4">Chat with Academic Paper Assistant</h1>
        <p className="text-gray-600 mb-8">
          Ask questions about academic papers, research topics, or get help finding relevant scholarly articles. This
          assistant is specifically designed to help with academic research queries only.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">Example Queries</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>What are the most cited papers in machine learning?</li>
                <li>How do I read academic papers efficiently?</li>
                <li>Explain the peer review process</li>
                <li>What journals publish papers on climate science?</li>
                <li>How to find papers related to quantum computing?</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">Research Tips</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Ask about specific research methodologies</li>
                <li>Get help understanding academic concepts</li>
                <li>Learn about citation styles and practices</li>
                <li>Find top journals in your field</li>
                <li>Get recommendations for literature reviews</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <ChatInterface />
      </div>
    </main>
  )
}
