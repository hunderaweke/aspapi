"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchFormProps {
  initialQuery?: string
  initialField?: string
}

export function SearchForm({ initialQuery = "", initialField = "" }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [field, setField] = useState(initialField)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    const params = new URLSearchParams({
      q: query,
      field: field,
    })

    router.push(`/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Paper Title or Keyword"
          className="pl-10 w-full border-2 h-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
        />
      </div>
      {/* <div className="relative md:w-[180px]">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Field of Study"
          className="pl-10 w-full border-2 h-12"
          value={field}
          onChange={(e) => setField(e.target.value)}
          aria-label="Field of study"
        />
      </div> */}
      <Button type="submit" disabled={isLoading} className="h-12 px-6 bg-accent_red hover:bg-red-700">
        Search
      </Button>
    </form>
  )
}
