import React from "react";

export const CreatorProfileHeroSkeleton: React.FC = () => {
    return (
        <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-100 shadow-sm animate-pulse">
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    {/* アイコン */}
                    <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-2xl"></div>

                    <div className="flex-grow w-full">
                        {/* タイトル */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 bg-gray-200 rounded w-48"></div>
                            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                        </div>
                        {/* 説明 */}
                        <div className="h-6 bg-gray-200 rounded w-72 mb-3"></div>

                        {/* タグ */}
                        <div className="flex items-center gap-2 mt-3">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="flex gap-2">
                                <div className="h-7 bg-gray-200 rounded w-24"></div>
                                <div className="h-7 bg-gray-200 rounded w-32"></div>
                                <div className="h-7 bg-gray-200 rounded w-28"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 統計情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-2xl bg-gray-100 bg-opacity-50">
                            <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                            <div className="h-7 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CreatorStrengthsSkeleton: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 animate-pulse">
            <div className="mb-6">
                <div className="h-7 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-5 rounded-2xl border border-gray-200 bg-white">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1">
                                <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TagsSectionSkeleton: React.FC = () => {
    return (
        <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border border-gray-100 shadow-sm animate-pulse">
            <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-grow">
                        <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <div key={i} className="h-9 bg-gray-200 rounded-full" style={{ width: `${80 + Math.random() * 60}px` }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const GrowthTimelineSkeleton: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 animate-pulse">
            <div className="mb-8">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>

            <div className="relative pl-8 border-l-2 border-gray-100 space-y-12 mb-12">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="relative">
                        <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-gray-200"></div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="sm:w-32 flex-shrink-0">
                                <div className="h-6 bg-gray-200 rounded-full w-20 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="flex-1">
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="h-7 bg-gray-200 rounded w-20"></div>
                                    <div className="h-7 bg-gray-200 rounded w-24"></div>
                                    <div className="h-7 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CareerOutlookSkeleton: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 animate-pulse">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                    <div className="h-6 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-56"></div>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-5 rounded-2xl border border-gray-200 bg-white">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                            <div className="flex-1">
                                <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 全体のスケルトン
export const CreatorAnalysisSkeleton: React.FC = () => {
    return (
        <div className="space-y-6">
            <CreatorProfileHeroSkeleton />
            <TagsSectionSkeleton />
            <CreatorStrengthsSkeleton />
            <GrowthTimelineSkeleton />
            <CareerOutlookSkeleton />
        </div>
    );
};
