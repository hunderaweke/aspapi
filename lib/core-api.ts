import type { Paper } from "@/types/paper"

const CORE_API_URL = "https://api.core.ac.uk/v3"

// Simple in-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // Start with 1 second delay

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY,
): Promise<Response> {
  try {
    const response = await fetch(url, options)

    // If rate limited, wait and retry
    if (response.status === 429 && retries > 0) {
      console.log(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchWithRetry(url, options, retries - 1, delay * 2) // Exponential backoff
    }

    return response
  } catch (error) {
    if (retries > 0) {
      console.log(`Fetch error. Retrying in ${delay}ms... (${retries} retries left)`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return fetchWithRetry(url, options, retries - 1, delay * 2)
    }
    throw error
  }
}

export async function searchCoreApi(query: string, field = ""): Promise<{ papers: Paper[]; total: number }> {
  try {
    console.log("Searching with query:", query, "field:", field)

    // Construct the appropriate query based on search parameters
    let searchQuery = query

    // Add field of study if provided
    if (field) {
      searchQuery = `${searchQuery} AND fields_of_study.name:"${field}"`
    }

    console.log("Final search query:", searchQuery)

    // Create a cache key
    const cacheKey = `search:${searchQuery}`

    // Check cache first
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
      console.log("Returning cached results")
      return cache[cacheKey].data
    }

    // If not in cache, make the API request
    const requestBody = JSON.stringify({
      q: searchQuery,
      limit: 10,
      offset: 0,
      fields: [
        "id",
        "title",
        "authors",
        "abstract",
        "downloadUrl",
        "doi",
        "topics",
        "publisher",
        "year",
        "journals",
        "fieldsOfStudy",
        "citedByCount",
        "urls",
        "language",
        "fullText",
      ],
    })

    // Use mock data if in development and no API key
    if (process.env.NODE_ENV === "development" && !process.env.CORE_API_KEY) {
      console.log("Using mock data (no API key in development)")
      const mockData = getMockPapers(query, field)
      cache[cacheKey] = { data: { papers: mockData, total: mockData.length }, timestamp: Date.now() }
      return { papers: mockData, total: mockData.length }
    }

    const response = await fetchWithRetry(`${CORE_API_URL}/search/works`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CORE_API_KEY}`,
      },
      body: requestBody,
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 429) {
        console.error("CORE API rate limit exceeded. Using fallback data.")
        const fallbackData = getMockPapers(query, field)
        cache[cacheKey] = { data: { papers: fallbackData, total: fallbackData.length }, timestamp: Date.now() }
        return { papers: fallbackData, total: fallbackData.length }
      }
      throw new Error(`CORE API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the CORE API response to our Paper type
    const papers = data.results.map((item: any) => ({
      id: item.id,
      title: item.title || "Untitled Paper",
      authors: item.authors?.map((author: any) => author.name) || [],
      abstract: item.abstract || "",
      pdfUrl: item.downloadUrl || null,
      url: item.doi ? `https://doi.org/${item.doi}` : item.urls && item.urls.length > 0 ? item.urls[0] : null,
      publishedDate: item.year ? `${item.year}-01-01` : new Date().toISOString(),
      journal: item.journals?.[0]?.title || item.publisher || "",
      doi: item.doi || "",
      topics: item.fieldsOfStudy || [],
      citationCount: item.citedByCount || 0,
      institution: item.publisher || "Unknown Institution",
      language: item.language || "en",
      isOpenAccess: !!item.downloadUrl,
    }))

    const result = { papers, total: data.totalHits || papers.length }

    // Cache the results
    cache[cacheKey] = { data: result, timestamp: Date.now() }

    return result
  } catch (error) {
    console.error("Error searching CORE API:", error)
    // Return mock data as fallback
    const mockData = getMockPapers(query, field)
    return { papers: mockData, total: mockData.length }
  }
}

export async function getPaperById(id: string): Promise<Paper | null> {
  try {
    // Check cache first
    const cacheKey = `paper:${id}`
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
      console.log("Returning cached paper")
      return cache[cacheKey].data
    }

    // Use mock data if in development and no API key
    if (process.env.NODE_ENV === "development" && !process.env.CORE_API_KEY) {
      console.log("Using mock paper (no API key in development)")
      const mockPaper = getMockPaperById(id)
      if (mockPaper) {
        cache[cacheKey] = { data: mockPaper, timestamp: Date.now() }
      }
      return mockPaper
    }

    const response = await fetchWithRetry(`${CORE_API_URL}/works/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.CORE_API_KEY}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      if (response.status === 429) {
        console.error("CORE API rate limit exceeded. Using fallback data.")
        const fallbackPaper = getMockPaperById(id)
        if (fallbackPaper) {
          cache[cacheKey] = { data: fallbackPaper, timestamp: Date.now() }
        }
        return fallbackPaper
      }
      throw new Error(`CORE API error: ${response.status}`)
    }

    const item = await response.json()

    const paper = {
      id: item.id,
      title: item.title || "Untitled Paper",
      authors: item.authors?.map((author: any) => author.name) || [],
      abstract: item.abstract || "",
      pdfUrl: item.downloadUrl || null,
      url: item.doi ? `https://doi.org/${item.doi}` : item.urls && item.urls.length > 0 ? item.urls[0] : null,
      publishedDate: item.year ? `${item.year}-01-01` : new Date().toISOString(),
      journal: item.journals?.[0]?.title || item.publisher || "",
      doi: item.doi || "",
      topics: item.fieldsOfStudy || [],
      citationCount: item.citedByCount || 0,
      institution: item.publisher || "Unknown Institution",
      language: item.language || "en",
      isOpenAccess: !!item.downloadUrl,
    }

    // Cache the paper
    cache[cacheKey] = { data: paper, timestamp: Date.now() }

    return paper
  } catch (error) {
    console.error("Error fetching paper by ID:", error)
    return getMockPaperById(id)
  }
}

// Mock data for fallback when API is unavailable or rate limited
function getMockPapers(query: string, field = ""): Paper[] {
  const currentYear = new Date().getFullYear()

  // Create some variation based on the query and field
  const queryTerm = query.toLowerCase()
  const fieldTerm = field.toLowerCase()

  // Base papers that we'll customize based on query
  let papers = [
    {
      id: "mock-1",
      title: `Research on ${query || "Academic Topics"}: A Comprehensive Review`,
      authors: ["Jane Smith", "John Doe"],
      abstract: `This paper provides a comprehensive review of research related to ${
        query || "various academic topics"
      }. We analyze the current state of the field and identify gaps in the literature.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear - 1}-06-15`,
      journal: "Journal of Advanced Research",
      doi: "10.1234/jar.2023.001",
      topics: ["Research Methods", query || "Academic Research", "Literature Review"],
      citationCount: 45,
      institution: "Stanford University",
      language: "en",
      isOpenAccess: true,
    },
    {
      id: "mock-2",
      title: `Advances in ${query || "Technology"} Research`,
      authors: ["Robert Johnson", "Maria Garcia"],
      abstract: `Recent technological advances have significantly impacted ${
        query || "various fields"
      }. This paper examines these developments and their implications for future research.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear - 2}-11-03`,
      journal: "Technology Innovation Review",
      doi: "10.5678/tir.2022.002",
      topics: ["Technology", "Innovation", query || "Research"],
      citationCount: 128,
      institution: "MIT",
      language: "en",
      isOpenAccess: false,
    },
    {
      id: "mock-3",
      title: `The Impact of ${query || "Research"} on Modern Society`,
      authors: ["David Wilson", "Sarah Chen"],
      abstract: `This study investigates the societal impact of ${
        query || "academic research"
      }, with a focus on economic and social implications. We present a framework for understanding these effects.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear - 1}-03-22`,
      journal: "Social Science Quarterly",
      doi: "10.9101/ssq.2023.003",
      topics: ["Society", "Economics", query || "Research Impact", "Social Impact"],
      citationCount: 67,
      institution: "Harvard University",
      language: "en",
      isOpenAccess: true,
    },
    {
      id: "mock-4",
      title: `A New Approach to ${query || "Data"} Analysis`,
      authors: ["Michael Brown", "Lisa Wang"],
      abstract: `We propose a novel methodology for analyzing ${
        query || "research data"
      }. Our approach demonstrates improved accuracy and efficiency compared to traditional methods.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear}-01-10`,
      journal: "Analytical Methods Journal",
      doi: "10.1122/amj.2024.004",
      topics: ["Methodology", "Analysis", query || "Data Science"],
      citationCount: 12,
      institution: "Google Research",
      language: "en",
      isOpenAccess: false,
    },
    {
      id: "mock-5",
      title: `${query || "Scientific Research"} in the Context of Global Challenges`,
      authors: ["James Taylor", "Emma Rodriguez"],
      abstract: `This paper examines ${
        query || "scientific research"
      } in relation to global challenges such as climate change and resource scarcity. We identify key areas for future research and policy development.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear - 3}-09-05`,
      journal: "Global Challenges Review",
      doi: "10.3344/gcr.2021.005",
      topics: ["Global Issues", "Policy", query || "Research", "Sustainability"],
      citationCount: 203,
      institution: "Oxford University",
      language: "en",
      isOpenAccess: true,
    },
    {
      id: "mock-6",
      title: `Experimental Studies on ${query || "Scientific"} Phenomena`,
      authors: ["Thomas Anderson", "Jennifer Martinez"],
      abstract: `Through a series of controlled experiments, we investigate key phenomena related to ${
        query || "scientific research"
      }. Our findings challenge several established theories and suggest new directions for research.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear - 1}-08-17`,
      journal: "Experimental Science",
      doi: "10.7788/es.2023.006",
      topics: ["Experiments", "Methodology", query || "Research Methods"],
      citationCount: 34,
      institution: "California Institute of Technology",
      language: "en",
      isOpenAccess: true,
    },
    {
      id: "mock-7",
      title: `Theoretical Foundations of ${query || "Academic Research"}`,
      authors: ["Richard Lee", "Amanda White"],
      abstract: `This paper establishes a theoretical framework for understanding ${
        query || "academic research"
      }. We integrate concepts from multiple disciplines to create a comprehensive model that explains observed phenomena.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear - 4}-05-29`,
      journal: "Theoretical Studies",
      doi: "10.2233/ts.2020.007",
      topics: ["Theory", "Framework", query || "Research", "Conceptual Model"],
      citationCount: 187,
      institution: "Princeton University",
      language: "en",
      isOpenAccess: false,
    },
    {
      id: "mock-8",
      title: `Machine Learning Applications in ${query || "Research"}`,
      authors: ["Daniel Kim", "Sophia Patel"],
      abstract: `We demonstrate how machine learning techniques can be applied to problems in ${
        query || "academic research"
      }. Our results show significant improvements over traditional approaches in terms of accuracy and computational efficiency.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear - 1}-11-12`,
      journal: "Journal of Machine Learning Applications",
      doi: "10.6655/jmla.2023.008",
      topics: ["Machine Learning", "Artificial Intelligence", query || "Research Methods", "Algorithms"],
      citationCount: 76,
      institution: "Meta Research",
      language: "en",
      isOpenAccess: true,
    },
    {
      id: "mock-9",
      title: `A Comparative Analysis of ${query || "Research"} Methods`,
      authors: ["Christopher Davis", "Olivia Johnson"],
      abstract: `This study compares different methodological approaches to ${
        query || "academic research"
      }. We evaluate their strengths and weaknesses across multiple dimensions and provide recommendations for researchers.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear - 2}-07-08`,
      journal: "Comparative Research Methods",
      doi: "10.4477/crm.2022.009",
      topics: ["Comparative Analysis", "Methodology", query || "Research", "Research Methods"],
      citationCount: 42,
      institution: "University of Chicago",
      language: "en",
      isOpenAccess: false,
    },
    {
      id: "mock-10",
      title: `Future Directions in ${query || "Academic"} Research`,
      authors: ["Elizabeth Brown", "William Chen"],
      abstract: `Based on a systematic review of current literature, we identify emerging trends and future directions in ${
        query || "academic"
      } research. We highlight promising areas for investigation and potential challenges.`,
      pdfUrl: null,
      url: null,
      publishedDate: `${currentYear}-02-25`,
      journal: "Future Research Perspectives",
      doi: "10.8899/frp.2024.010",
      topics: ["Future Trends", "Research Directions", query || "Academic Research", "Emerging Topics"],
      citationCount: 8,
      institution: "Microsoft Research",
      language: "en",
      isOpenAccess: true,
    },
  ]

  // If a field is specified, filter papers to include that field
  if (field) {
    // Add the field to topics for some papers
    papers = papers.map((paper) => ({
      ...paper,
      topics:
        paper.id.includes("mock-2") || paper.id.includes("mock-5") || paper.id.includes("mock-8")
          ? [...paper.topics, fieldTerm]
          : paper.topics,
    }))
  }

  return papers
}

function getMockPaperById(id: string): Paper | null {
  const mockPapers = getMockPapers("research")
  const paper = mockPapers.find((p) => String(p.id) === String(id))

  if (!paper && id.startsWith("mock-")) {
    // Generate a paper for any mock ID
    const idNumber = Number.parseInt(id.replace("mock-", ""), 10) || 6
    return {
      id,
      title: `Detailed Study #${idNumber}: Advanced Research Methods`,
      authors: ["Academic Author", "Research Specialist"],
      abstract:
        "This comprehensive study explores advanced research methodologies and their applications in various fields. We present case studies, comparative analyses, and propose new frameworks for understanding complex research problems.",
      pdfUrl: null,
      url: null,
      publishedDate: `${new Date().getFullYear() - 1}-05-20`,
      journal: "Comprehensive Research Journal",
      doi: `10.5555/crj.2023.${idNumber.toString().padStart(3, "0")}`,
      topics: ["Research Methods", "Methodology", "Academic Research", "Case Studies"],
      citationCount: 45 + idNumber,
      institution: "University of Research",
      language: "en",
      isOpenAccess: idNumber % 2 === 0,
    }
  }

  return paper || null
}
