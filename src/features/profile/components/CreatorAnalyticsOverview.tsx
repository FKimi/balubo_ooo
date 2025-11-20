"use client";

import { useMemo, useCallback } from "react";
import type { WorkData } from "@/features/work/types";
import type { CreatorContentAnalysisSummary } from "@/features/profile/lib/profileUtils";

interface CreatorAnalyticsOverviewProps {
  savedWorks: WorkData[];
  topTags: [string, number][];
  strengthsAnalysis?: {
    strengths: Array<{ title: string; description: string }>;
  } | null;
  creatorContentAnalysis?: CreatorContentAnalysisSummary | null;
}

interface SignatureStyleInfo {
  label: string;
  description: string;
  bestFor: string;
  tags: string[];
  icon: JSX.Element;
}

const parseBulletLines = (text?: string) => {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^[・\-\*]\s*/, "").trim())
    .filter((line) => line.length > 0);
};

export function CreatorAnalyticsOverview({
  savedWorks,
  topTags,
  strengthsAnalysis,
  creatorContentAnalysis,
}: CreatorAnalyticsOverviewProps) {
  const brandKeywords = useMemo(
    () => topTags.slice(0, 5).map(([tag]) => tag),
    [topTags],
  );

  const audienceLines = useMemo(
    () => parseBulletLines(creatorContentAnalysis?.targetAudience),
    [creatorContentAnalysis?.targetAudience],
  );

  const deriveStyleInfo = useCallback(
    (text: string): SignatureStyleInfo => {
      const lower = text.toLowerCase();
      if (/比較|図解|ステップ|構造/i.test(text)) {
        return {
          label: "複雑情報の図解・構造化",
          description:
            "技術仕様や制度を比較表・図解で整理し、意思決定者が即座に理解できる骨子を組み立てます。",
          bestFor: "ホワイトペーパー／機能比較記事／導入手順書",
          tags: ["図解", "構成力", "BtoB"],
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          ),
        };
      }
      if (/通知|政策|分析|厚労|行政|規制/.test(text)) {
        return {
          label: "専門知見の『翻訳』ライティング",
          description:
            "一次情報の精度を保ちながら、医療・政策領域の専門用語をクライアント向け資料として再編集します。",
          bestFor: "医療法規解説／IR資料／公共政策レポート",
          tags: ["一次情報", "リサーチ", "ファクトチェック"],
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4h10l2 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>
          ),
        };
      }
      if (/専門用語|噛み砕|読者|共感/.test(text)) {
        return {
          label: "共感ストーリーテリング",
          description:
            "専門トピックでも読者の”自分事化”を促す導入・展開を設計し、読了率を高めるトーンを整えます。",
          bestFor: "採用広報／インタビュー／コミュニティ記事",
          tags: ["トーン＆マナー", "読者理解", "インタビュー"],
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15a7 7 0 0014 0V9a7 7 0 10-14 0v6z"
              />
            </svg>
          ),
        };
      }
      if (/取組み|ロードマップ|動向|ラグ解消|クラウド/.test(text) || lower.includes("future")) {
        return {
          label: "未来志向のシナリオ設計",
          description:
            "市場動向や政策トレンドを俯瞰し、次の一手を示すストーリーボードで経営層のアクションを促します。",
          bestFor: "業界レポート／経営者インタビュー／カンファレンスレポート",
          tags: ["ストラテジー", "トレンド分析", "エグゼクティブ向け"],
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1"
              />
            </svg>
          ),
        };
      }
      return {
        label: "ロジカルエディティング & ファクト管理",
        description:
          "データと裏付けを軸に、誤読を防ぎながら説得力ある骨子とファクトチェック体制を構築します。",
        bestFor: "決算解説／BtoBマーケ記事／ナレッジベース",
        tags: ["ファクトチェック", "構成力", "BtoB"],
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v12m6-6H6"
            />
          </svg>
        ),
      };
    },
    [],
  );

  const styleCards = useMemo(() => {
    const counts = new Map<string, number>();
    savedWorks.forEach((work) => {
      const structureSource =
        work.ai_analysis_result?.detailedAnalysis?.contentStructure ||
        work.ai_analysis_result?.contentAnalysis?.solution ||
        work.ai_analysis_result?.contentAnalysis?.solutionApproach ||
        work.production_notes;
      parseBulletLines(structureSource).forEach((line) => {
        if (!line) return;
        counts.set(line, (counts.get(line) || 0) + 1);
      });
    });
    const styles = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([line, count]) => ({
        ...deriveStyleInfo(line),
        proof: line,
        count,
      }));

    const seenLabels = new Set<string>();
    const uniqueStyles = styles.filter((style) => {
      if (seenLabels.has(style.label)) {
        return false;
      }
      seenLabels.add(style.label);
      return true;
    });

    return uniqueStyles.slice(0, 3);
  }, [savedWorks, deriveStyleInfo]);

  const personaHighlights = strengthsAnalysis?.strengths?.slice(0, 3) || [];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-start gap-3 mb-5">
            {/* クレイモーフィズム風アイコンコンテナ */}
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.15)]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-inner">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618V15.5a1 1 0 01-.553.894L15 18m0-8v8m0-8L9 6m6 10l-6 3-6-3V6l6 3 6-3"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
                専門性の強み
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                作品から読み取れるトーン・編集スタイルを要約。発注者が「この人に任せたらどうなるか」を掴めるように整理しています。
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {personaHighlights.length > 0 ? (
              personaHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-gray-50 p-4 border border-gray-200 shadow-[0_12px_35px_rgba(15,23,42,0.04)]"
                >
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                作品を追加するとAIが強みを可視化します。
              </p>
            )}
            {brandKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {brandKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-start gap-3 mb-5">
            {/* クレイモーフィズム風アイコンコンテナ */}
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center shadow-[0_4px_12px_rgba(6,182,212,0.15)]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-inner">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
                ファンの関心と属性
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                ターゲット読者の属性や反応を要約。想定訴求先や媒体選定のヒントとして活用できます。
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {audienceLines.length > 0 ? (
              audienceLines.map((line, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700 shadow-[0_12px_35px_rgba(15,23,42,0.04)]"
                >
                  {line}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                読者インサイトは、作品にターゲット情報を入力すると表示されます。
              </p>
            )}
          </div>
        </div>

      </div>

      <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex items-start gap-3">
          {/* クレイモーフィズム風アイコンコンテナ */}
          <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center shadow-[0_4px_12px_rgba(139,92,246,0.15)]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-inner">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418-4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
              得意とする執筆スタイル・表現技法
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              作業手順ではなく「どんな価値を提供できるか」を抽出。構成・トーン・検証力など武器になるスタイルを提示します。
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {styleCards.length > 0 ? (
            styleCards.map((style, idx) => (
              <div
                key={`${style.label}-${idx}`}
                className="rounded-[28px] bg-gray-50 border border-gray-200 px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] flex flex-col xl:flex-row gap-6"
              >
                <div className="flex gap-4 xl:w-1/2">
                  {/* クレイモーフィズム風アイコンコンテナ */}
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(139,92,246,0.15)]">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-inner">
                      <div className="text-white">
                        {style.icon}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{style.label}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {style.count}作品で確認
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{style.description}</p>
                    {style.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {style.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs rounded-full bg-violet-50 text-violet-700 font-medium border border-violet-100"
                          >
                            #{tag.replace(/^#/, "")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid w-full xl:w-1/2 grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 h-full shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      活用シーン
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{style.bestFor}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 h-full shadow-[0_12px_35px_rgba(15,23,42,0.04)]">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      根拠 / 実績
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{style.proof}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              作品の構成や取り組みメモを入力するとスタイル分析が表示されます。
            </p>
          )}
        </div>
      </div>

    </section>
  );
}

