"use client";

import React from "react";

const solutions = [
  {
    title: "URLを入力",
    description: "記事のURLを貼り付けるだけ。タイトルや画像、本文を自動で取得します。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    title: "AIが分析・抽出",
    description: "独自AIが記事を読み込み、業界知識・専門スキル・思考プロセスを抽出します。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "専門性を証明",
    description: "分析結果を「証明書」として可視化。ポートフォリオや提案資料として活用できます。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function WhyBaluboSection() {
  return (
    <section
      id="features"
      className="bg-white py-24 sm:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* セクションヘッダー */}
        <FadeIn className="mb-20 text-left">
          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            なぜ、baluboなら<br className="hidden sm:block" />
            「専門性」が伝わるのか？
          </h2>
          <p className="text-lg text-gray-600">
            ただのポートフォリオ作成ツールではありません。<br className="hidden sm:block" />
            あなたの実績を「データ」として解析し、ビジネス価値に変換するプロセスがあります。
          </p>
        </FadeIn>

        {/* プロセスフロー */}
        <StaggerContainer className="relative grid gap-8 md:grid-cols-3">
          {/* 連結ライン (Desktop only) */}
          <div className="absolute top-12 left-[16%] hidden h-0.5 w-[68%] bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 md:block" aria-hidden="true" />

          {solutions.map((solution, index) => (
            <StaggerItem
              key={solution.title}
              className="relative flex flex-col items-start text-left"
            >
              {/* ステップ番号とアイコン */}
              <div className="mb-6 relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white border-4 border-blue-50 shadow-lg z-10 relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                    {solution.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white border-2 border-white">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* コンテンツ */}
              <div className="pr-4">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  {solution.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-600">
                  {solution.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
