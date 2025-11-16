"use client";

import React from "react";

const analysisHighlights = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "業界タグ",
    subtitle: "",
    description: "記事に登場する業界や企業、人名を抽出し、クライアントが探しているタグとして整理します。",
    chips: ["製造DX", "BtoB SaaS", "経営層インタビュー", "企業変革"],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "専門性タグ",
    subtitle: "",
    description: "分析力・戦略思考・調査設計などの抽象的な強みをタグ化し、専門領域を短い言葉で伝えます。",
    chips: ["市場分析", "ビジネス戦略", "リサーチ設計", "課題解決プロセス"],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "課題・解決策・成果",
    subtitle: "",
    description: "課題・解決策・得られた結果をコンパクトに整理し、提案や実績紹介の骨子にそのまま使える形で提示します。",
    lists: [
      {
        title: "課題",
        items: ["業界特有の課題や商習慣など、前提となる状況が整理されていない"],
      },
      {
        title: "解決策",
        items: ["取材やリサーチで一次情報を確保し、意思決定の背景をストーリーとして構造化"],
      },
      {
        title: "成果",
        items: ["課題・解決策・成果が一枚で伝わるレポートとして、提案や振り返りに活用"],
      },
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="analysis"
      className="relative isolate overflow-hidden bg-[#F4F7FF] py-24 px-4 text-gray-900 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.3),_transparent_65%)]"
        aria-hidden="true"
      />
      <div className="container relative mx-auto max-w-7xl">
        <div className="mb-16">
          <div className="mx-auto max-w-3xl text-left">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              baluboが可視化する3つの価値
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              AIが作品を多角的に分析し、業界適性・専門性・成果までをビジネス視点で説明します。
            </p>
          </div>
        </div>

        {/* フィーチャーリスト形式で3つの価値を縦に配置 */}
        <div className="mx-auto max-w-5xl space-y-8">
          {analysisHighlights.map((highlight) => (
            <div
              key={highlight.title}
              className="flex gap-5 rounded-[32px] border border-blue-50/90 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm"
            >
              {/* クレイ風アイコン（左） */}
              <div className="flex flex-shrink-0 items-start pt-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 shadow-[0_12px_28px_rgba(191,219,254,0.95)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 text-white shadow-[0_10px_26px_rgba(37,99,235,0.45)]">
                    <span className="flex items-center justify-center">{highlight.icon}</span>
                  </div>
                </div>
              </div>

              {/* テキストブロック（右） */}
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-bold leading-snug text-gray-900">
                  {highlight.title}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-gray-700">
                  {highlight.description}
                </p>

                {/* 業界タグ / 専門性タグのチップ */}
                {highlight.chips && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {highlight.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        #{chip}
                      </span>
                    ))}
                  </div>
                )}

                {/* 課題・解決策・成果の3カラムリスト */}
                {highlight.lists && (
                  <div className="mt-4 grid gap-6 md:grid-cols-3">
                    {highlight.lists.map((list) => (
                      <div key={list.title}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {list.title}
                        </p>
                        <ul className="space-y-1.5">
                          {list.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-gray-700">
                              <span className="mt-[6px] inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 中間CTAはストーリー上少し後に任せるため、このセクションでは説明に集中 */}
      </div>
    </section>
  );
}
