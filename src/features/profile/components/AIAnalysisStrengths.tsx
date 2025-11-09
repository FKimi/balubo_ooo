import React from "react";
import { Badge } from "@/components/ui/badge";
import { getYourTagsFromWorks } from "@/features/profile/lib/profileUtils";
import type { JobMatchingHint } from "@/features/profile/lib/profileUtils";

interface Strength {
  title: string;
  description: string;
}

interface AIAnalysisStrengthsProps {
  strengths: Strength[];
  compact?: boolean;
  className?: string;
  variant?: "default" | "horizontal";
  showDetails?: boolean;
  jobMatchingHints?: JobMatchingHint[];
  works?: any[]; // タグ表示用に作品データを追加
}

/**
 * プロフィール下部に表示する「AI分析による強み」セクション。
 * 最⼤3件の強みをカード形式で横並びに表示します。
 */
export function AIAnalysisStrengths({
  strengths,
  compact = false,
  className = "",
  showDetails = false,
  jobMatchingHints,
  works = [],
}: AIAnalysisStrengthsProps) {
  // あなたのタグデータを取得
  const yourTags = getYourTagsFromWorks(works, compact ? 10 : 15);

  if (!strengths || strengths.length === 0) return null;

  return (
    <section className={`${compact ? "mt-4" : "mt-8 mb-8"} ${className}`}>
      {/* あなたのタグセクション */}
      {yourTags.length > 0 && (
        <div
          className={`${compact ? "border border-gray-200 rounded-lg p-5 sm:p-6 mb-5 shadow-sm bg-white" : "border border-gray-200 rounded-lg p-6 mb-6 shadow-sm bg-white"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`${compact ? "text-base" : "text-lg"} font-semibold flex items-center gap-2`}
            >
              <svg
                className="w-5 h-5 text-gray-700"
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
              <span>あなたのタグ</span>
            </h2>
            <div className="text-sm text-gray-500">
              {yourTags.length}個のタグ
            </div>
          </div>

          {/* タグクラウド */}
          <div className="flex flex-wrap gap-2">
            {yourTags.map((tagData, index) => (
              <div key={tagData.tag} className="group relative">
                <Badge
                  variant="outline"
                  className={`
                    px-3 py-1.5 rounded-lg border transition-colors cursor-pointer
                    ${
                      index < 3
                        ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                    }
                  `}
                >
                  <span className="font-medium">{tagData.tag}</span>
                  <span className="ml-2 text-xs text-gray-500 font-medium">
                    {tagData.count}
                  </span>
                </Badge>

                {/* ツールチップ（ホバー時にカテゴリ表示） */}
                {tagData.category && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {tagData.category}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 説明文 */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">
              これらのタグは、あなたの作品に含まれるキーワードから自動抽出されたものです。
              作品を追加するほど、あなたの専門性がより正確に表現されます。
            </p>
          </div>
        </div>
      )}

      {/* AI分析による強みセクション */}
      <div
        className={`${compact ? "border border-gray-200 rounded-lg p-5 sm:p-6 shadow-sm bg-white" : "border border-gray-200 rounded-lg p-6 shadow-sm bg-white"}`}
      >
        {/* ヘッダーセクション */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`${compact ? "text-base" : "text-lg"} font-semibold flex items-center gap-2`}
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>AI分析による強み</span>
          </h2>
        </div>

        {/* 強みカード */}
        <div className="space-y-4">
          {strengths.slice(0, 3).map((s, idx) => {
            // 説明文からタグを抽出
            const tags = s.description.split(" / ").filter(Boolean);
            return (
              <div
                key={idx}
                className={`${compact ? "p-4 sm:p-5" : "p-6"} rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-blue-600">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-slate-900 font-semibold ${compact ? "text-base" : "text-lg"} mb-2`}
                    >
                      {s.title}
                    </h3>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag, tagIdx) => (
                          <Badge
                            key={tagIdx}
                            variant="outline"
                            className="px-2.5 py-1 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {tags.length > 0
                        ? `${tags[0]}を中心に、${tags.slice(1, 3).join("、")}${
                            tags.length > 3 ? `など` : ""
                          }の専門性を発揮しています。この分野での実績と経験が豊富です。`
                        : s.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 仕事マッチングのヒント */}
        {jobMatchingHints && jobMatchingHints.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6v2a2 2 0 002 2h4a2 2 0 002-2V6m0 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">
                こんな仕事が向いているかも
              </h3>
            </div>
            <div className="space-y-4">
              {jobMatchingHints.map((hint, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {hint.title}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {hint.description}
                      </p>
                      <div className="space-y-2">
                        <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-blue-700 flex-shrink-0">
                              理由:
                            </span>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {hint.reason}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-blue-700 flex-shrink-0">
                              おすすめの理由:
                            </span>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {hint.whyRecommended}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 追加情報 */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              この分析は、あなたの作品に含まれるタグデータを基にAIが自動生成しています。
              作品を追加するほど分析精度が向上し、より適切な仕事マッチングが可能になります。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
