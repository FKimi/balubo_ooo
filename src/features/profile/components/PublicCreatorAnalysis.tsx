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
import { InputData } from "../types";

interface PublicCreatorAnalysisProps {
    works: WorkData[];
    inputs?: InputData[];
}

export function PublicCreatorAnalysis({ works, inputs }: PublicCreatorAnalysisProps) {
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
                    message="作品が追加されると、AIによる強み分析や活動傾向が表示されます"
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
