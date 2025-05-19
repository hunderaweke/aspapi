import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { searchCoreApi } from "@/lib/core-api"
import type { Paper } from "@/types/paper"

interface PaperResultsProps {
  query?: string
  field?: string
}

export async function PaperResults({ query = "", field = "" }: PaperResultsProps) {
  // Fetch papers from CORE API
  const { papers, total } = await searchCoreApi(query || "*", field)

  if (papers.length === 0) {
    return (
      <div className="border rounded-lg bg-white p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">No papers found</h3>
        <p className="text-gray-600">
          We couldn't find any papers matching your search criteria. Try adjusting your search terms.
        </p>
      </div>
    )
  }

  // Function to determine the logo based on institution
  const getLogo = (paper: Paper) => {
    const institution = paper.institution?.toLowerCase() || ""

    if (institution.includes("google") || institution.includes("alphabet")) {
      return "google"
    } else if (institution.includes("meta") || institution.includes("facebook") || institution.includes("instagram")) {
      return "meta"
    } else if (
      institution.includes("microsoft") ||
      institution.includes("github") ||
      institution.includes("linkedin")
    ) {
      return "microsoft"
    }

    return ""
  }

  // Function to determine tags
  const getTags = (paper: Paper) => {
    const tags: string[] = []

    // Check if paper is recent (published in the last 30 days)
    const publishDate = new Date(paper.publishedDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (publishDate > thirtyDaysAgo) {
      tags.push("new")
    }

    // Check if paper has high citations
    if (paper.citationCount && paper.citationCount > 100) {
      tags.push("cited")
    }

    // Check if paper is from a prestigious institution
    const institution = paper.institution?.toLowerCase() || ""
    if (
      institution.includes("harvard") ||
      institution.includes("stanford") ||
      institution.includes("mit") ||
      institution.includes("oxford") ||
      institution.includes("cambridge") ||
      institution.includes("google") ||
      institution.includes("meta") ||
      institution.includes("microsoft")
    ) {
      tags.push("featured")
    }

    // Check if paper is trending (this would normally be based on recent views/downloads)
    // For mock purposes, we'll just mark some as hot
    if (String(paper.id).includes("2") || String(paper.id).includes("5") || String(paper.id).includes("8")) {
      tags.push("hot")
    }

    return tags
  }

  // Function to extract key points from abstract
  const getKeyPoints = (paper: Paper) => {
    if (!paper.abstract) {
      return ["No abstract available"]
    }

    // For a real implementation, you might use NLP to extract key points
    // For now, we'll just split the abstract into sentences and take the first 2
    const sentences = paper.abstract.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    return sentences.slice(0, 2).map((s) => s.trim())
  }

  return (
    <div className="space-y-6">
      {papers.map((paper) => {
        const logo = getLogo(paper)
        const tags = getTags(paper)
        const keyPoints = getKeyPoints(paper)

        return (
          <div key={String(paper.id)} className="border rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 flex-shrink-0">
                {logo === "google" && (
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                )}
                {logo === "meta" && (
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#1877F2"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                  </div>
                )}
                {logo === "microsoft" && (
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#f25022" d="M0 0h11.5v11.5H0z" />
                      <path fill="#00a4ef" d="M0 12.5h11.5V24H0z" />
                      <path fill="#7fba00" d="M12.5 0H24v11.5H12.5z" />
                      <path fill="#ffb900" d="M12.5 12.5H24V24H12.5z" />
                    </svg>
                  </div>
                )}
                {!logo && (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-gray-500"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <Link href={`/paper/${paper.id}`} className="hover:underline">
                    <h3 className="text-lg font-semibold">{paper.title}</h3>
                  </Link>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{paper.institution || paper.journal}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{paper.authors.join(", ")}</p>
                <div className="flex gap-2 my-2">
                  {tags.includes("featured") && <span className="tag-featured">Featured</span>}
                  {tags.includes("hot") && <span className="tag-hot">Hot</span>}
                  {tags.includes("new") && <span className="tag-new">New</span>}
                  {tags.includes("cited") && <span className="tag-cited">Highly Cited</span>}
                </div>
                <ul className="mt-2 space-y-1">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="text-sm">
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href={`/paper/${paper.id}`}>View Details</Link>
              </Button>
              <Button className="bg-accent_red hover:bg-red-700" asChild>
                <a href={paper.url || `https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                  Read Now
                </a>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
