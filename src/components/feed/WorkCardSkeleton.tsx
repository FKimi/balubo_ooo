import { Skeleton } from "@/components/ui";

export function WorkCardSkeleton() {
    return (
        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.06)] border-none">
            {/* 画像スケルトン */}
            <Skeleton className="aspect-video w-full" />

            {/* コンテンツスケルトン */}
            <div className="p-5 space-y-4">
                {/* タイトル */}
                <Skeleton className="h-6 w-3/4" />

                {/* 説明 */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                {/* タグ */}
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>

                {/* ユーザー情報 */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-16 rounded-xl" />
                        <Skeleton className="h-8 w-16 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
