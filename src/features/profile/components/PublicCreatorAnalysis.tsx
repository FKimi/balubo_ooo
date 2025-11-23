"use client";

import { useMemo } from "react";
import { WorkData } from "@/features/work/types";
import { CreatorProfileHero } from "./CreatorProfileHero";
import { CreatorStrengths } from "./CreatorStrengths";
import { CareerFitAnalysis } from "./CareerFitAnalysis";
import { GrowthTimeline } from "./GrowthTimeline";
import { CareerOutlook } from "./CareerOutlook";
import { InputHabits } from "./InputHabits";
import { EmptyState } from "@/components/common";
import { InputData, ProfileData } from "../types";
import { CreatorAnalysisSkeleton } from "./skeletons/CreatorAnalysisSkeleton";

interface PublicCreatorAnalysisProps {
    works: WorkData[];
    inputs?: InputData[];
    profileData?: ProfileData | null;
    isLoading?: boolean;
}

export function PublicCreatorAnalysis({ works, inputs, profileData, isLoading = false }: PublicCreatorAnalysisProps) {
    // WorkData型をWork型に変換
    const convertedWorks = useMemo(() => {
        return works.map(work => ({
            id: work.id,
            title: work.title,
            description: work.description,
            type: work.content_type || "Unknown",
            date: work.production_date || work.created_at,
            tags: work.tags || [],
            imageUrl: work.banner_image_url,
            roles: work.roles || [],
            productionDate: work.production_date,
            externalUrl: work.external_url,
            aiAnalysisResult: work.ai_analysis_result
        }));
    }, [works]);

    // よく使用するタグを事前に計算（Hooksは条件分岐の前に呼ぶ必要がある）
    const topTags = useMemo(() => {
        const tagCounts = new Map<string, number>();
        convertedWorks.forEach(work => {
            (work.tags || []).forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });
        return Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1]);
    }, [convertedWorks]);

    // ローディング中はスケルトンを表示
    if (isLoading) {
        return <CreatorAnalysisSkeleton />;
    }

    if (works.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <EmptyState
                    title="まだ分析データがありません"
                    message="作品が追加されると、AIによる強み分析や活動傾向が表示されます"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ヒーローセクション: クリエイタープロフィール */}
            <CreatorProfileHero works={convertedWorks} inputs={inputs || []} />

            {/* よく使用するタグセクション */}
            {topTags.length > 0 && (
                <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border border-gray-100 shadow-sm">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center border border-gray-100">
                                <svg
                                    className="w-7 h-7 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    よく使用するタグ
                                </h3>
                                <p className="text-sm text-gray-500">
                                    作品から抽出された専門領域と得意分野
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {topTags.slice(0, 15).map(([tag, count]) => (
                                <div
                                    key={tag}
                                    className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 cursor-default"
                                >
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                                        #{tag}
                                    </span>
                                    <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-gray-100 group-hover:bg-blue-600 text-gray-600 group-hover:text-white text-xs font-bold transition-all duration-300">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 3つの強み・専門性 */}
            <CreatorStrengths works={convertedWorks} inputs={inputs || []} />

            {/* キャリアフィット分析 */}
            <CareerFitAnalysis works={convertedWorks} inputs={inputs || []} />

            {/* Phase 2: 成長タイムライン */}
            <GrowthTimeline works={convertedWorks} career={profileData?.career || []} />

            {/* インプット習慣 (New) */}
            {inputs && inputs.length > 0 && (
                <InputHabits inputs={inputs} />
            )}

            {/* Phase 3: アクションカード */}
            {/* 今後のキャリア展望 */}
            <CareerOutlook works={convertedWorks} inputs={inputs || []} />
        </div>
    );
}
