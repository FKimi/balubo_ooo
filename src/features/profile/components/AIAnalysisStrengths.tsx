import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getYourTagsFromWorks } from "@/features/profile/lib/profileUtils";

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
  jobMatchingHints?: string[];
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
  variant = "default",
  showDetails = false,
  jobMatchingHints,
  works = [],
}: AIAnalysisStrengthsProps) {
  const [showJobHints, setShowJobHints] = useState(false);

  // あなたのタグデータを取得
  const yourTags = getYourTagsFromWorks(works, compact ? 10 : 15);

  if (!strengths || strengths.length === 0) return null;

  return (
    <section className={`${compact ? "mt-4" : "mt-8 mb-8"} ${className}`}>
      {/* あなたのタグセクション */}
      {yourTags.length > 0 && (
        <div
          className={`${compact ? "border border-gray-200/80 rounded-xl p-5 sm:p-6 mb-5 shadow-elegant" : "border border-gray-200/80 rounded-2xl p-8 mb-8 shadow-elegant"}`}
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
                    px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer
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
        className={`${compact ? "border border-gray-200/80 rounded-xl p-5 sm:p-6 shadow-elegant" : "border border-gray-200/80 rounded-2xl p-8 shadow-elegant"}`}
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
        <div
          className={`${variant === "horizontal" ? "grid grid-cols-1 md:grid-cols-3 items-stretch gap-3.5 sm:gap-4" : `grid grid-cols-1 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"} gap-4`}`}
        >
          {strengths.slice(0, 3).map((s, idx) => (
            <div
              key={idx}
              className={`${compact ? "p-4 sm:p-5" : "p-6"} rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300 ${variant === "horizontal" ? "flex items-start gap-3 sm:gap-3.5 h-full" : "h-full"}`}
            >
              <div className="flex-1">
                <div
                  className={`shrink-0 text-slate-900 font-semibold ${compact ? "text-base" : "text-lg"} mb-2`}
                >
                  {s.title}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 仕事マッチングのヒント */}
        {jobMatchingHints && jobMatchingHints.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setShowJobHints(!showJobHints)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-700"
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
                こんな仕事が向いているかも
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${showJobHints ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showJobHints && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
                {jobMatchingHints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/60 hover:border-gray-300 hover:bg-gray-100/80 hover:shadow-sm transition-all duration-200"
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
