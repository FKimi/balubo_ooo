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
      "分析データを基に、専門性を求めるクライアントとマッチング予定（開発中）。単なる工数ではなく、思考や専門性そのものを評価してくれる出会いをつくります。",
  },
];

export default function WhyBaluboSection() {
  return (
    <section
      id="features"
      className="relative isolate overflow-hidden bg-[#F4F7FF] py-24 px-4 md:py-32"
    >
      <div className="container relative mx-auto max-w-7xl">
        {/* セクションヘッダー */}
        <div className="mb-12">
          <div className="mx-auto max-w-5xl text-left">
            <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              baluboで専門性をデータ化
            </h2>
            <p className="mb-3 text-xl font-bold leading-relaxed text-gray-900 md:text-2xl">
              AIが第三者視点で記事を分解し、強み・思考・成果をレポート化します。
            </p>
            <p className="text-lg leading-relaxed text-gray-600">
              手作業で説明していた価値を、客観的なスコアと文章で提示。商談や提案の土台になる「専門性の証明書」を作るプラットフォームです。
            </p>
          </div>
        </div>

        {/* 3つのソリューション */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {solutions.map((solution, index) => (
            <div
              key={solution.title}
              className="relative flex flex-col rounded-[32px] border border-blue-50/90 bg-white/95 p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(37,99,235,0.18)]"
            >
              {/* クレイ風アイコン */}
              <div className="mb-5 flex items-center justify-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 shadow-[0_12px_28px_rgba(191,219,254,0.95)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 text-white shadow-[0_10px_26px_rgba(37,99,235,0.45)]">
                    <span className="flex items-center justify-center">{solution.icon}</span>
                  </div>
                </div>
              </div>

              {/* タイトル */}
              <h3 className="mb-3 text-left text-lg font-bold leading-snug text-gray-900">
                {`0${index + 1}. ${solution.title}`}
              </h3>

              {/* 説明 */}
              <p className="text-left text-sm leading-relaxed text-gray-700">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

