import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function PaperLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-cream">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton className="h-6 w-40" />
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 mb-8">
          <Skeleton className="h-10 w-3/4 mb-4" />

          <div className="flex flex-wrap gap-2 mb-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
            </div>

            <div className="md:w-64 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-20 w-full" />
              </div>

              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </main>
  )
}
