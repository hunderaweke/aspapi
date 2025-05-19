import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Download, ExternalLink, BookOpen, Users, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPaperById } from "@/lib/core-api"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const paper = await getPaperById(params.id)

  if (!paper) {
    return {
      title: "Paper Not Found",
      description: "The requested academic paper could not be found.",
    }
  }

  return {
    title: `${paper.title} | Academic Paper Search Portal`,
    description: paper.abstract?.substring(0, 160) || "View details about this academic paper",
    openGraph: {
      title: paper.title,
      description: paper.abstract?.substring(0, 160) || "Academic paper details",
      type: "article",
      authors: paper.authors,
      publishedTime: paper.publishedDate,
    },
  }
}

export default async function PaperDetailPage({ params }: { params: { id: string } }) {
  const paper = await getPaperById(params.id)

  if (!paper) {
    notFound()
  }

  // Format the publication date
  const formattedDate = new Date(paper.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-cream">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/search" className="inline-flex items-center text-accent_red hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to search results
          </Link>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{paper.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {paper.topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="bg-beige">
                {topic}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Abstract</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {paper.abstract || "No abstract available for this paper."}
              </p>
            </div>

            <div className="md:w-64 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2" />
                    Authors
                  </h3>
                  <ul className="space-y-1">
                    {paper.authors.map((author, index) => (
                      <li key={index} className="text-sm">
                        {author}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold flex items-center mb-2">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Publication
                  </h3>
                  <p className="text-sm mb-1">{paper.journal}</p>
                  <p className="text-sm flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formattedDate}
                  </p>
                  {paper.doi && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">DOI:</span>{" "}
                      <a
                        href={`https://doi.org/${paper.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent_red hover:underline"
                      >
                        {paper.doi}
                      </a>
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold flex items-center mb-2">
                    <Award className="h-4 w-4 mr-2" />
                    Metrics
                  </h3>
                  <p className="text-sm">
                    <span className="font-medium">Citations:</span> {paper.citationCount || 0}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Access:</span>{" "}
                    {paper.isOpenAccess ? "Open Access" : "Subscription Required"}
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                {paper.pdfUrl && (
                  <Button className="w-full bg-accent_red hover:bg-red-700" asChild>
                    <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                )}

                {paper.url && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Source
                    </a>
                  </Button>
                )}

                {paper.doi && !paper.url && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View via DOI
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Cite this paper</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">APA</h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  {paper.authors.join(", ")} ({new Date(paper.publishedDate).getFullYear()}). {paper.title}.{" "}
                  <em>{paper.journal}</em>.{paper.doi && ` https://doi.org/${paper.doi}`}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">MLA</h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  {paper.authors.join(", ")}. "{paper.title}." <em>{paper.journal}</em>,{" "}
                  {new Date(paper.publishedDate).getFullYear()}.{paper.doi && ` DOI: ${paper.doi}`}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Chicago</h3>
                <div className="bg-gray-50 p-3 rounded-md text-sm">
                  {paper.authors.join(", ")}. "{paper.title}." <em>{paper.journal}</em> (
                  {new Date(paper.publishedDate).getFullYear()}).
                  {paper.doi && ` https://doi.org/${paper.doi}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Related Papers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* This would normally fetch related papers based on topics or citations */}
            {/* For now, we'll just show a placeholder */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">
                  Related papers would be displayed here based on similar topics, authors, or citations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
