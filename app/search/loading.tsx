import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-cream">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-12 w-full max-w-4xl mx-auto" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-64" />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="flex-1 space-y-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
