import { Suspense } from "react";
import { SearchForm } from "@/components/search-form";
import { PaperResults } from "@/components/paper-results";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Search Results - Academic Paper Search Portal",
  description: "View search results for academic papers",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; field?: string }>; // Type as Promise
}) {
  const params = await searchParams; // Await the searchParams Promise
  const query = params.q || "";
  const field = params.field || "";

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-cream">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <SearchForm initialQuery={query} initialField={field} />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Results for: <span className="text-accent_red">{query || "All Papers"}</span>
              {field && <span className="ml-2">in {field}</span>}
            </h2>
          </div>

          <div className="w-full">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <PaperResults query={query} field={field} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <div className="flex gap-2 my-2">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
              </div>
            </div>
            <div className="mt-4 text-right">
              <Skeleton className="h-9 w-24 rounded-md ml-auto" />
            </div>
          </div>
        ))}
    </div>
  );
}