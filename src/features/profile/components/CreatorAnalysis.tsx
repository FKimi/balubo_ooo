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
import { useLayout } from "@/contexts/LayoutContext";
import { InputData } from "../types";

interface CreatorAnalysisProps {
    works: WorkData[];
    strengthsAnalysis?: any; // 後方互換性のため残すが使用しない
    inputs?: InputData[];
}

export function CreatorAnalysis({ works, inputs }: CreatorAnalysisProps) {
    const { openContentTypeSelector } = useLayout();

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

    if (works.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <EmptyState
                    title="まだ分析データがありません"
                    message="作品を追加すると、AIによる強み分析や活動傾向が表示されます"
                    ctaLabel="作品を追加"
                    onCtaClick={openContentTypeSelector}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ヒーローセクション: クリエイタープロフィール */}
            <CreatorProfileHero works={convertedWorks} inputs={inputs || []} />

            {/* 3つの強み・専門性 */}
            <CreatorStrengths works={convertedWorks} inputs={inputs || []} />

            {/* キャリアフィット分析 */}
            <CareerFitAnalysis works={convertedWorks} inputs={inputs || []} />

            {/* Phase 2: 成長タイムライン */}
            <GrowthTimeline works={convertedWorks} />



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
