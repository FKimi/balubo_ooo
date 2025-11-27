import { Skeleton } from '@/components/ui';

export const DiscoverySectionSkeleton = () => (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 pb-8 pt-6 mb-8 rounded-3xl shadow-sm border border-gray-100/50 animate-pulse">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
            <div className="space-y-8">
                {/* タイトルスケルトン */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gray-200 rounded-xl w-10 h-10" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                {/* フィーチャード作品スケルトン */}
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-80 space-y-3">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
                {/* タグスケルトン */}
                <div className="flex flex-wrap gap-2">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    </section>
);
