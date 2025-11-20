"use client";

import { useState, useEffect, useMemo } from "react";
import { AIAnalysisResult } from "@/features/work/types";
import { Textarea } from "@/components/ui/textarea";

interface BtoBAnalysisSectionProps {
  aiAnalysis?: Partial<AIAnalysisResult> | null;
  onUpdate?: (_updatedAnalysis: Partial<AIAnalysisResult>) => void;
  editable?: boolean; // 編集可能かどうか（デフォルト: true）
  variant?: "card" | "plain";
  tone?: "works" | "creator";
  title?: string;
  description?: string;
}

export function BtoBAnalysisSection({
  aiAnalysis,
  onUpdate,
  editable = true,
  variant = "card",
  tone = "works",
  title = "課題・目的／想定読者／解決策／成果",
  description = "コンテンツから抽出したビジネス視点の骨子です。編集で自分の言葉に整えられます。",
}: BtoBAnalysisSectionProps) {
  const [editedContent, setEditedContent] = useState({
    problemPurpose: "",
    targetAudience: "",
    solutionApproach: "",
    result: "",
  });

  const contentAnalysis = aiAnalysis?.contentAnalysis;
  const sections = useMemo(
    () => [
      {
        key: "problemPurpose" as const,
        title: "課題・目的",
        description: "なぜこのコンテンツが必要か",
        icon: (
          <svg
            className="w-4 h-4 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M5.938 19h12.124c1.54 0 2.502-1.667 1.732-3L13.732 5c-.77-1.333-2.694-1.333-3.464 0L4.206 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
        iconBg: tone === "creator" ? "bg-orange-500/10" : "bg-orange-100/80",
        accent:
          tone === "creator"
            ? "from-orange-500/5 to-white"
            : "from-orange-50 to-white",
        placeholder:
          tone === "creator"
            ? "なぜこのアウトプットが求められたのかを箇条書きで記述してください"
            : "解決すべきビジネス課題や制作の目的を箇条書きで記述してください（例：・課題1）",
      },
      {
        key: "targetAudience" as const,
        title: "想定読者",
        description: "誰に届けるのか",
        icon: (
          <svg
            className="w-4 h-4 text-sky-600"
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
        ),
        iconBg: tone === "creator" ? "bg-blue-500/10" : "bg-sky-100/80",
        accent:
          tone === "creator"
            ? "from-blue-500/5 to-white"
            : "from-sky-50 to-white",
        placeholder:
          tone === "creator"
            ? "どのような読者・関係者を想定したか、役職や課題感と合わせて記述してください"
            : "想定した読者層や意思決定者を箇条書きで記述してください（例：・経営企画、・マーケ責任者）",
      },
      {
        key: "solutionApproach" as const,
        title: "解決策（切り口や構成）",
        description: "どのように解決したか",
        icon: (
          <svg
            className="w-4 h-4 text-violet-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-9-9 9 9 0 019 9z"
            />
          </svg>
        ),
        iconBg: tone === "creator" ? "bg-violet-500/10" : "bg-violet-100/80",
        accent:
          tone === "creator"
            ? "from-violet-500/5 to-white"
            : "from-violet-50/80 to-white",
        placeholder:
          tone === "creator"
            ? "どのような切り口や構成、リサーチ手法で価値を出したかを記述してください"
            : "章立てやリサーチ方法など、実施したアプローチを箇条書きで記述してください（例：・定量調査×インタビュー）",
      },
      {
        key: "result" as const,
        title: "成果",
        description: "どんな価値を生んだか",
        icon: (
          <svg
            className="w-4 h-4 text-emerald-600"
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
        ),
        iconBg: tone === "creator" ? "bg-emerald-500/10" : "bg-emerald-100/80",
        accent:
          tone === "creator"
            ? "from-emerald-500/5 to-white"
            : "from-emerald-50/80 to-white",
        placeholder:
          tone === "creator"
            ? "どんな成果・学び・顧客への価値につながったかを記述してください"
            : "得られた成果やKPI、現場の変化を箇条書きで記述してください（例：・資料DL率120%）",
      },
    ],
    [tone],
  );

  // 初期値を設定
  useEffect(() => {
    if (contentAnalysis) {
      setEditedContent({
        problemPurpose:
          contentAnalysis.problemPurpose ||
          contentAnalysis.problem ||
          "",
        targetAudience:
          contentAnalysis.targetAudience ||
          aiAnalysis?.targetAudience ||
          "",
        solutionApproach:
          contentAnalysis.solutionApproach ||
          contentAnalysis.solution ||
          "",
        result: contentAnalysis.result || "",
      });
    }
  }, [contentAnalysis, aiAnalysis?.targetAudience]);

  // 編集内容を親コンポーネントに通知
  const handleChange = (
    field: "problemPurpose" | "targetAudience" | "solutionApproach" | "result",
    value: string,
  ) => {
    const updated = {
      ...editedContent,
      [field]: value,
    };
    setEditedContent(updated);

    // 親コンポーネントに変更を通知
    if (onUpdate) {
      onUpdate({
        contentAnalysis: updated,
      });
    }
  };

  // テキストを箇条書きとして表示する関数
  const renderBulletList = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    const items = lines
      .map((line) => line.replace(/^[・\-\*]\s*/, "").trim())
      .filter((item) => item.length > 0);

    if (items.length === 0) return null;

    return (
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => {
          const bulletNumber = (index + 1).toString().padStart(2, "0");
          return (
            <li
              key={index}
              className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-white/90 px-3 py-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition hover:border-blue-100"
            >
              <span className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-400 transition group-hover:text-blue-500">
                {bulletNumber}
              </span>
              <span className="flex-1 text-sm text-slate-700 leading-relaxed">
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  // contentAnalysisが存在しない場合は、デフォルトの分析結果を表示
  if (!contentAnalysis) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548-.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-2 font-medium text-sm">
            {aiAnalysis && Object.keys(aiAnalysis).length > 0
              ? "コンテンツ分析データを処理中です..."
              : "コンテンツ分析データを準備中です..."}
          </p>
          <p className="text-xs text-gray-500">
            {aiAnalysis && Object.keys(aiAnalysis).length > 0
              ? "AI分析が完了しましたが、コンテンツ分析データが見つかりません。"
              : "AI分析が完了すると、課題・目的／想定読者／解決策／成果の詳細な分析が表示されます。"}
          </p>
        </div>
      </div>
    );
  }

  const renderSection = (
    key: "problemPurpose" | "targetAudience" | "solutionApproach" | "result",
  ) => {
    const config = sections.find((section) => section.key === key);
    if (!config) return null;

    const value = editedContent[key];
    const cardBase =
      variant === "plain"
        ? "bg-white/95 border border-slate-200/80 shadow-sm"
        : `bg-gradient-to-b ${config.accent} border border-transparent shadow-lg/5`;

    return (
      <div
        key={config.key}
        className={`${cardBase} rounded-2xl p-5 transition-all duration-200 hover:border-blue-200 flex flex-col h-full`}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBg}`}
          >
            {config.icon}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{config.title}</p>
            <p className="text-xs text-slate-500">{config.description}</p>
          </div>
        </div>
        {editable ? (
          <Textarea
            value={value}
            onChange={(e) => handleChange(config.key, e.target.value)}
            className="min-h-[140px] text-sm text-gray-700 leading-relaxed resize-none border border-slate-200 rounded-xl bg-white/80 focus-visible:ring-2 focus-visible:ring-blue-200"
            placeholder={config.placeholder}
          />
        ) : (
          <div className="min-h-[140px] text-sm text-gray-700 leading-relaxed">
            {renderBulletList(value) || (
              <p className="text-sm text-gray-400">データがまだ反映されていません</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const analysisContent = (
    <div className="space-y-5">
      <div className="flex flex-col gap-1 pl-0.5">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-400 flex items-center gap-2">
          <svg
            className="w-3.5 h-3.5 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-2.209 0-4 1.791-4 4v4h8v-4c0-2.209-1.791-4-4-4z"
            />
          </svg>
          {description}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {renderSection("problemPurpose")}
        {renderSection("targetAudience")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {renderSection("solutionApproach")}
        {renderSection("result")}
      </div>
    </div>
  );

  if (variant === "plain") {
    return analysisContent;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      {analysisContent}
    </div>
  );
}
