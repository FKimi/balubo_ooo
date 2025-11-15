"use client";

import React from "react";

const solutions = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "URL入力だけで楽々記事登録",
    description:
      "URLを貼るだけで記事情報を取得し、必要な項目を自動入力。面倒な整備なしでポートフォリオが整います。",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AIがあなたの「価値」を言語化",
    description:
      "AIが業界知識・分析力・構成力といった思考プロセスを抽出し、専門性スコアや要点サマリに変換します。",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "価値がわかるクライアントと出会える",
    description:
      "分析データを基に、専門性を求めるクライアントとマッチング予定（開発中）。文字単価交渉から脱却できます。",
  },
];

export default function WhyBaluboSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white py-20 px-4 md:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-60 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.7),_transparent_60%)]"
        aria-hidden="true"
      />
      <div className="container relative mx-auto max-w-7xl">
        <div>
          {/* メインメッセージ */}
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 mb-4">
              Why balubo?
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight">
              <span className="text-blue-600">balubo</span>で専門性をデータ化
            </h2>
            <p className="text-xl md:text-2xl text-gray-900 font-bold mb-4 leading-relaxed">
              AIが第三者視点で記事を分解し、強み・思考・成果をレポート化します。
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              手作業で説明していた価値を、客観的なスコアと文章で提示。商談や提案の土台になる「専門性の証明書」を作るプラットフォームです。
            </p>
          </div>

          {/* 3つのソリューション */}
          <div className="mb-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              専門性可視化までの3ステップ
            </h3>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto mb-16">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="relative rounded-2xl border border-blue-100/80 bg-white/95 p-8 shadow-lg shadow-blue-500/5 hover:border-blue-500/70 hover:shadow-xl transition-all duration-500"
              >
                {/* アイコン */}
                <div className="mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white">
                    {solution.icon}
                  </div>
                </div>

                {/* タイトル */}
                <h3 className="mb-4 text-xl font-bold text-gray-900 leading-tight">
                  {solution.title === "URL入力だけで楽々記事登録" && "1. URL入力だけで記事を登録"}
                  {solution.title === "AIがあなたの「価値」を言語化" && "2. AIがあなたの「価値」を言語化"}
                  {solution.title === "価値がわかるクライアントと出会える" && "3. 価値がわかるクライアントと出会える"}
                </h3>

                {/* 説明 */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

