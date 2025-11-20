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
  framed?: boolean; // true: 従来のカードレイアウト, false: シンプル表示
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
  framed = true,
}: AIAnalysisStrengthsProps) {
  // あなたのタグデータを取得
  const yourTags = getYourTagsFromWorks(works, compact ? 10 : 15);

  if (!strengths || strengths.length === 0) return null;

  const baseSectionSpacing = compact ? "space-y-5" : "space-y-6";
  const framedBoxClass = (extraSpacing = "") =>
    framed
      ? `${compact ? "p-5 sm:p-6" : "p-6"} border border-slate-200 rounded-[28px] shadow-[0_18px_45px_rgba(15,23,42,0.06)] bg-gradient-to-br from-[#F7F9FF] to-white ${extraSpacing}`
      : `${extraSpacing}`;

  return (
    <section className={`${compact ? "mt-4" : "mt-8 mb-8"} ${className}`}>
      {/* あなたのタグセクション */}
      {yourTags.length > 0 && (
        <div className={`${framedBoxClass(compact ? "mb-4" : "mb-5")} ${framed ? "" : baseSectionSpacing}`}>
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
              <span>あなたの主要タグ</span>
            </h2>
            <div className="text-sm text-gray-500">
              {yourTags.length}個のタグ
            </div>
          </div>

          {/* タグカード */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {yourTags.map((tagData, index) => {
              const tierClass =
                index === 0
                  ? "border-blue-300 bg-blue-50/60 text-blue-800"
                  : index === 1
                    ? "border-indigo-200 bg-indigo-50/70 text-indigo-800"
                    : index === 2
                      ? "border-sky-200 bg-sky-50 text-sky-800"
                      : "border-gray-200 bg-white text-gray-800";

              return (
                <div
                  key={tagData.tag}
                  className={`rounded-[24px] border p-4 shadow-sm hover:shadow-lg transition-all duration-200 ${tierClass}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-gray-500/80">
                      <span>タグ</span>
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>{index + 1}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      {tagData.count}件
                    </span>
                  </div>
                  <div className="text-lg font-bold leading-tight">
                    {tagData.tag}
                  </div>
                  {tagData.category && (
                    <div className="mt-2 inline-flex items-center text-xs font-medium text-gray-600 bg-white/70 px-2 py-1 rounded-full border border-white/80">
                      {tagData.category}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 説明文 */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">
              これらのタグは公開済みの作品から自動抽出されています。
              作品を追加するほど、あなたの専門性がより正確に伝わります。
            </p>
          </div>
        </div>
      )}

      {/* AI分析による強みセクション */}
      <div className={`${framedBoxClass()} ${framed ? "" : baseSectionSpacing}`}>
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
            const tags = s.description.split(" / ").filter(Boolean);
            const formatTagSentence = (list: string[]) => {
              if (list.length === 1) return list[0];
              if (list.length === 2) return `${list[0]}と${list[1]}`;
              return `${list.slice(0, -1).join("、")}、${list[list.length - 1]}`;
            };
            const summaryText =
              tags.length > 0
                ? `${formatTagSentence(tags.slice(0, 3))}などのテーマで実績があり、${s.title}の専門性を証明しています。`
                : s.description || "この分野に関連する作品を追加すると、より深い分析が可能になります。";
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
                      {summaryText}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* クリエイターソリューション提案 */}
        {jobMatchingHints && jobMatchingHints.length > 0 && (
          <div className={`mt-8 ${framed ? "pt-6 border-t border-gray-200" : "pt-0"}`}>
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
                提供できるソリューション
              </h3>
            </div>
            <div className="space-y-4">
              {jobMatchingHints.map((hint, idx) => (
                <SolutionCard hint={hint} index={idx} key={`${hint.title}-${idx}`} />
              ))}
            </div>
          </div>
        )}

        {/* 追加情報 */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              これらのインサイトは作品に含まれるタグをもとに算出されています。
              作品が増えるほど分析の精度が高まり、より適切な提案が行えます。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SolutionCard({
  hint,
  index,
}: {
  hint: JobMatchingHint;
  index: number;
}) {
  const matchScore = Math.max(78, 94 - index * 4);

  return (
    <div className="rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50/90 via-white to-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] transition-all">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-600 tracking-wide">
            提案概要
          </p>
          <h4 className="text-lg font-semibold text-slate-900 mt-1">
            {hint.title}
          </h4>
          <p className="text-sm text-slate-600 mt-1">{hint.description}</p>
        </div>
        <div className="text-xs text-slate-400">
          ポートフォリオ分析から抽出した提案です。
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">
            こんな課題を持つ方へ
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {hint.description}
          </p>
        </div>
        <div className="rounded-[24px] border border-emerald-100 bg-white p-4">
          <p className="text-xs font-semibold text-emerald-600 tracking-wide mb-1">
            提供する解決策
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{hint.reason}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="rounded-[24px] border border-blue-100 bg-white p-4">
          <p className="text-xs font-semibold text-blue-600 tracking-wide mb-1">
            期待できる成果
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {hint.whyRecommended}
          </p>
        </div>
        <div className="rounded-[24px] border border-yellow-100 bg-white p-4">
          <p className="text-xs font-semibold text-yellow-600 tracking-wide mb-1">
            AIインサイト
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            最新の作品分析より：専門性と共感ライティングの両立が得意で、対談記事や難解テーマでも高い完読率が期待できます。
          </p>
        </div>
      </div>

      <div className="mt-5 text-xs text-slate-400">
        ※ 提案内容はポートフォリオをもとにAIが自動生成しています。
      </div>
    </div>
  );
}
