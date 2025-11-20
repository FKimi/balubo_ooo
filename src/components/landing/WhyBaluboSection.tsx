"use client";

import React from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

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
    title: "専門性が蓄積・可視化される",
    description: "記事を登録するたびに分析データが蓄積。あなたの得意領域やスキルが、客観的な「信頼」として可視化されていきます。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function WhyBaluboSection() {
  return (
    <section
      id="solution"
      className="bg-white py-24 sm:py-32"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* セクションヘッダー */}
        <FadeIn className="mb-20 text-left">
          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            使い方は、<br className="hidden sm:block" />
            驚くほどシンプル。
          </h2>
          <p className="text-lg text-gray-600">
            URLを貼るだけ。面倒な入力作業は一切不要です。<br className="hidden sm:block" />
            あなたの専門性が、すぐに可視化されます。
          </p>
        </FadeIn>

        {/* プロセスフロー */}
        <StaggerContainer className="relative grid gap-8 md:grid-cols-3">
          {/* 連結ライン (Desktop only) */}
          <div className="absolute top-12 left-[16%] hidden h-0.5 w-[68%] bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 md:block" aria-hidden="true" />

          {solutions.map((solution, index) => (
            <StaggerItem
              key={solution.title}
              className="relative flex flex-col items-start text-left"
            >
              {/* ステップ番号とアイコン */}
              <div className="mb-6 relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 shadow-[0_12px_28px_rgba(191,219,254,0.95)] z-10 relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 text-white shadow-[0_10px_26px_rgba(37,99,235,0.45)]">
                    {solution.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600 border-2 border-blue-100 shadow-sm">
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
