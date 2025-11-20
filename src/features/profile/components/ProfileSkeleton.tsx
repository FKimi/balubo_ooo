import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#F4F7FF] w-full animate-pulse">
      <main className="w-full">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row w-full">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0">
            <div className="p-6 space-y-6">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 min-w-0 bg-[#F4F7FF] flex flex-col">
            {/* Header Area Skeleton */}
            <div className="hidden lg:block border-b border-gray-200 bg-white px-8 py-6">
              <Skeleton className="h-8 w-64 mb-2 rounded-lg" />
              <Skeleton className="h-4 w-96 rounded-lg" />
            </div>

            <div className="flex-1 px-4 sm:px-6 lg:px-8 lg:py-8">
              {/* Profile Header Skeleton */}
              <div className="mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-4">
                      <Skeleton className="h-8 w-48 rounded-lg" />
                      <Skeleton className="h-4 w-full max-w-md rounded-lg" />
                      <div className="flex gap-3">
                        <Skeleton className="h-5 w-24 rounded-md" />
                        <Skeleton className="h-5 w-32 rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Content Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="rounded-2xl border-none shadow-sm">
                    <CardContent className="p-6">
                      <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                      <Skeleton className="h-8 w-20 mb-2 rounded-lg" />
                      <Skeleton className="h-4 w-16 rounded-lg" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="rounded-2xl border-none shadow-sm h-64">
                    <CardHeader>
                      <Skeleton className="h-6 w-32 rounded-lg" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <Card className="rounded-2xl border-none shadow-sm h-64">
                    <CardHeader>
                      <Skeleton className="h-6 w-24 rounded-lg" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

