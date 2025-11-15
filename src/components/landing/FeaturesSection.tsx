"use client";

import React from "react";
import Image from "next/image";

const analysisHighlights = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "業界タグ",
    subtitle: "Industry Tags",
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
    subtitle: "Expertise Tags",
    description: "分析力・戦略思考・調査設計などの抽象的な強みをタグ化し、専門領域を短い言葉で伝えます。",
    chips: ["市場分析", "ビジネス戦略", "リサーチ設計", "課題解決プロセス"],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "成果物と概要",
    subtitle: "Content Summary",
    description: "成果物の種類や狙いを要約し、商談資料に転用できる紹介文を生成します。",
    highlight: "成果物: 記事",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "課題・解決策・成果",
    subtitle: "Problem / Solution / Result",
    description: "課題・解決策・得られた結果を分解し、提案の骨子にそのまま使える形で出力します。",
    lists: [
      {
        title: "課題",
        items: [
          "業界特有の課題や商習慣に関する最新情報が断片的で共有しづらい",
          "競合動向や市場変化を体系的に整理した一次情報が不足していた",
        ],
      },
      {
        title: "解決策",
        items: [
          "経営層への取材を通じて一次情報を確保し、戦略や意思決定の背景を言語化",
          "定量・定性データを組み合わせ、課題の全体像が分かるストーリー構成を設計",
        ],
      },
      {
        title: "成果",
        items: [
          "業界の課題と解決策を体系化したレポートとして、クライアント提案に活用",
          "意思決定者の理解を深め、次のアクション設計につながる洞察を提供",
        ],
      },
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="analysis"
      className="relative isolate overflow-hidden bg-white py-24 px-4 text-gray-900 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.3),_transparent_65%)]"
        aria-hidden="true"
      />
      <div className="container relative mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 mb-4">
            Analysis
          </p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight">
            baluboが可視化する<span className="text-blue-600">4つの価値</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AIが作品を多角的に分析し、業界適性・専門性・成果までをビジネス視点で説明します。
          </p>
          
          {/* 小さなサービス画面プレビュー */}
          <div className="mt-12 flex justify-center">
            <div className="relative max-w-sm">
              <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-2xl">
                <Image 
                  src="/balubo_profile.png" 
                  alt="baluboライター・編集者プロフィール画面のイメージ" 
                  width={400}
                  height={300}
                  className="w-full h-auto opacity-95"
                />
                
                {/* イメージ画面の注釈 */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  イメージ
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {analysisHighlights.map((highlight) => (
            <div
              key={highlight.title}
                className="relative rounded-2xl border border-gray-100 bg-white/95 p-6 shadow-lg shadow-blue-500/5 transition-all duration-500 hover:-translate-y-1 hover:border-blue-400"
            >
              {/* アイコン */}
                <div className="mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {highlight.icon}
                </div>
              </div>

              {/* タイトル */}
                <h3 className="mb-2 text-lg font-bold text-gray-900 leading-tight">
                {highlight.title}
              </h3>

              {/* サブタイトル */}
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-600">
                {highlight.subtitle}
              </p>

              {/* 説明 */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {highlight.description}
              </p>

              {/* タグやハイライト */}
              {highlight.chips && (
                <div className="flex flex-wrap gap-2">
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

                {highlight.highlight && (
                  <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-sm font-semibold text-gray-900">
                  {highlight.highlight}
                </div>
              )}

              {highlight.lists && (
                <div className="mt-4 space-y-4">
                  {highlight.lists.map((list) => (
                    <div key={list.title}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                        {list.title}
                      </p>
                      <ul className="space-y-2">
                        {list.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
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
          ))}
        </div>

        {/* CTAセクション */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-4xl rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50/80 p-8 md:p-10 shadow-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              あなたも、専門性を証明しませんか？
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              baluboがあなたの専門性を客観的に分析し、クライアントに伝わる「証明書」を作成します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
              >
                無料で専門性スコアを見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
              <p className="text-sm text-gray-600 mt-4">
                登録無料・3分で完了
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
