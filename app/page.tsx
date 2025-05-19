import { SearchForm } from "@/components/search-form"
import { PaperResults } from "@/components/paper-results"
import { Features } from "@/components/features"

export const metadata = {
  title: "Academic Paper Search Portal",
  description: "A privacy-conscious search engine for academic papers",
  keywords: "academic papers, research, search engine, privacy",
  openGraph: {
    title: "Academic Paper Search Portal",
    description: "A privacy-conscious search engine for academic papers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Academic Paper Search Portal",
    description: "A privacy-conscious search engine for academic papers",
  },
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-cream">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">Find your Academic Papers</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Looking for research? Browse our latest academic papers to read & cite the best research today
          </p>
        </div>

        <SearchForm />

        <Features />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Featured Papers</h2>
          </div>

          <div className="w-full">
            <PaperResults query="" field="" />
          </div>
        </div>
      </div>
    </main>
  )
}
