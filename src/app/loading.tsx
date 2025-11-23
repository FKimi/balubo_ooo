import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#F4F7FF] w-full animate-pulse">
            <div className="flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto">
                {/* Sidebar Skeleton */}
                <div className="hidden lg:block lg:w-80 lg:flex-shrink-0 border-r border-gray-200 bg-white h-screen sticky top-0">
                    <div className="p-6 space-y-8">
                        <div className="flex items-center space-x-3 mb-8">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-6 w-32 rounded-lg" />
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <Skeleton className="h-4 w-full rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1 min-w-0 bg-[#F4F7FF] flex flex-col">
                    {/* Header Skeleton */}
                    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Skeleton className="h-8 w-32 rounded-lg" />
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>

                    {/* Page Content Skeleton */}
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-48 rounded-lg" />
                                <Skeleton className="h-4 w-64 rounded" />
                            </div>
                            <Skeleton className="h-10 w-32 rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
                                    <Skeleton className="h-40 w-full rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4 rounded" />
                                        <Skeleton className="h-4 w-1/2 rounded" />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
