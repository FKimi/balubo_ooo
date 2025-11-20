"use client";

import React from "react";

import { FadeIn } from "@/components/ui/motion";

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
        <FadeIn className="mb-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              AIがあなたの記事を<br className="hidden sm:block" />
              <span className="text-blue-600">「ビジネス資産」</span>に変える
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              baluboの独自AIは、単なる要約ではありません。<br className="hidden sm:block" />
              あなたの記事から「専門性」と「ビジネス価値」を抽出し、<br className="hidden sm:block" />
              クライアントが即座に判断できるレポートを生成します。
            </p>
          </div>
        </FadeIn>

        {/* Feature 1: Tags Analysis */}
        <FadeIn delay={0.2} className="mx-auto mb-20 grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="relative rounded-3xl border border-blue-100 bg-white p-8 shadow-soft-lg transition-transform hover:scale-[1.01]">
              <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>

              {/* Mock UI for Tags */}
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">INDUSTRY TAGS</p>
                  <div className="flex flex-wrap gap-2">
                    {["製造DX", "BtoB SaaS", "サプライチェーン", "IoT"].map((tag) => (
                      <span key={tag} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">EXPERTISE TAGS</p>
                  <div className="flex flex-wrap gap-2">
                    {["経営層インタビュー", "課題解決プロセス", "市場分析", "技術解説"].map((tag) => (
                      <span key={tag} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              01. 業界・専門性をタグ化
            </h3>
            <p className="text-lg leading-relaxed text-gray-600">
              記事に登場する業界用語や企業、テーマをAIが解析。「どの業界に詳しいか」「どんなスキルがあるか」をタグとして自動抽出します。
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">ニッチな業界用語も正確にキャッチ</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">「取材」「分析」などのスキルもタグ化</span>
              </li>
            </ul>
          </div>
        </FadeIn>

        {/* Feature 2: Structured Summary */}
        <FadeIn delay={0.4} className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              02. 思考プロセスを構造化
            </h3>
            <p className="text-lg leading-relaxed text-gray-600">
              「課題・目的」「想定読者」「解決策」「成果」の4項目で記事を再構成。あなたがどのように情報を整理し、誰に何を伝えたかったのか、その思考プロセスを言語化します。
            </p>
            <p className="mt-4 text-sm text-gray-500">
              ※このサマリは、そのままポートフォリオの解説文や提案資料として活用できます。
            </p>
          </div>
          <div>
            <div className="relative rounded-3xl border border-indigo-100 bg-white p-8 shadow-soft-lg transition-transform hover:scale-[1.01]">
              <div className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              {/* Mock UI for Summary */}
              <div className="space-y-5">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400"></span>
                    <span className="text-xs font-bold text-gray-500">課題・目的</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    業界特有のKPI設定が複雑で、現場が疲弊している現状を打破したい
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                    <span className="text-xs font-bold text-gray-500">想定読者</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    製造業のDX推進担当者および経営企画室のメンバー
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                    <span className="text-xs font-bold text-gray-500">成果</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    「なぜDXが必要か」のロジックが整理され、社内稟議の通過率が向上したとの声を獲得
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}

