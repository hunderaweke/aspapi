export interface Paper {
  id: string
  title: string
  authors: string[]
  abstract: string
  pdfUrl: string | null
  url: string | null
  publishedDate: string
  journal: string
  doi: string
  topics: string[]
  citationCount?: number
  institution?: string
  language?: string
  isOpenAccess?: boolean
}
