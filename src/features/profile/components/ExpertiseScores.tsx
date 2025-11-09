"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { WorkData } from "@/features/work/types";

interface ExpertiseScoresProps {
  strengths?: Array<{ title: string; description: string }>;
  works?: WorkData[];
}

export function ExpertiseScores({ strengths, works = [] }: ExpertiseScoresProps) {
  // タグデータからより詳細な情報を生成
  const enhancedStrengths = useMemo(() => {
    if (!strengths || strengths.length === 0) {
      return [];
    }

    // 各カテゴリに関連する作品とタグを集計
    const categoryWorks = new Map<string, { works: WorkData[]; tags: string[] }>();
    
    strengths.forEach((strength) => {
      const relatedWorks: WorkData[] = [];
      const relatedTags = new Set<string>();

      works.forEach((work) => {
        const tags = work.ai_analysis_result?.tags || work.tags || [];
        // カテゴリタイトルに基づいて関連作品を判定
        const isRelated = tags.some((tag) => {
          const tagLower = tag.toLowerCase();
          const titleLower = strength.title.toLowerCase();
          return tagLower.includes(titleLower) || titleLower.includes(tagLower);
        });

        if (isRelated) {
          relatedWorks.push(work);
          tags.forEach((tag) => relatedTags.add(tag));
        }
      });

      categoryWorks.set(strength.title, {
        works: relatedWorks,
        tags: Array.from(relatedTags),
      });
    });

    return strengths.map((strength, index) => {
      const categoryData = categoryWorks.get(strength.title);
      const workCount = categoryData?.works.length || 0;
      const tags = categoryData?.tags || [];
      const topTags = tags.slice(0, 5);

      // タイトルに適切な表現を追加（重複を避けるため、バリエーションを持たせる）
      const getTitleSuffix = (index: number): string => {
        const suffixes = [
          "の専門性",
          "への深い理解",
          "での実績",
        ];
        return suffixes[index % suffixes.length] || "の専門性";
      };

      // より具体的な説明文を生成
      let description = strength.description;
      if (workCount > 0) {
        // 元の説明がタグのリスト形式（" / "区切り）の場合
        if (strength.description.includes(" / ")) {
          const originalTags = strength.description.split(" / ");
          const mainTag = originalTags[0];
          description = `${mainTag}を中心とした専門性を発揮しています。${topTags.length > 0 && topTags.length <= 3 ? `特に「${topTags.join("」「")}」などの分野で実績があります。` : "この分野での実績と経験が豊富です。"}`;
        } else {
          // 説明文が既にある場合は、タグ情報を追加
          const tagList = topTags.length > 0 && topTags.length <= 3
            ? `「${topTags.join("」「")}」`
            : "";
          description = `${tagList ? tagList + "を中心に" : ""}${strength.title}の専門性を発揮しています。${tagList ? "この分野での実績と経験が豊富です。" : strength.description}`;
        }
      }

      return {
        ...strength,
        title: `${strength.title}${getTitleSuffix(index)}`,
        description,
        workCount,
        tags: topTags,
      };
    });
  }, [strengths, works]);

  if (enhancedStrengths.length === 0) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            強み・魅力
          </h3>
          <div className="text-center py-8 text-gray-500 text-sm">
            まだ強みが分析されていません
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          強み・魅力
        </h3>
        <div className="space-y-4">
          {enhancedStrengths.map((strength, index) => (
            <div
              key={index}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 mb-2">
                  {strength.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                  {strength.description}
                </p>
                {strength.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {strength.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {strength.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-400 text-xs">
                        +{strength.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

