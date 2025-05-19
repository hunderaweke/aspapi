import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PaperNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-cream">
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Paper Not Found</h1>
        <p className="text-gray-600 mb-6">
          The academic paper you're looking for could not be found. It may have been removed or the ID is incorrect.
        </p>
        <Button asChild>
          <Link href="/search">Return to Search</Link>
        </Button>
      </div>
    </main>
  )
}
