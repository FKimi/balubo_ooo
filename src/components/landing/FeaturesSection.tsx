"use client";

import React from "react";
import Image from "next/image";

const analysisMetrics = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "業界への解像度",
    subtitle: "Industry Expertise",
    description: "クライアントの業界特有の課題や言語をどれだけ深く理解しているか。専門用語や文脈から、あなたの「業界知識レベル」を証明します。",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "課題解決力",
    subtitle: "Problem Solving",
    description: "記事が「誰の、どんな課題を、どう解決したか」を分析。あなたの「思考プロセス」と「ビジネス貢献度」を可視化します。",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "専門品質",
    subtitle: "Quality & Skill",
    description: "情報の正確性、論理構成、読みやすさなど、プロライターとしての「記事の完成度」を客観的に測定します。",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: "実績インパクト",
    subtitle: "Performance",
    description: "記事がもたらした具体的な成果（CVR改善、リード獲得数など）を分析。あなたの仕事がビジネスに与えた「影響力」を定量的に示します。",
  },
];

export default function FeaturesSection() {

  return (
    <section id="analysis" className="relative bg-white py-24 px-4 md:py-32">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight">
            baluboが証明する<span className="text-[#0A66C2]">「4つの価値」</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            従来の指標では測れなかった「ビジネス貢献度」を可視化します。
          </p>
          
          {/* 小さなサービス画面プレビュー */}
          <div className="mt-12 flex justify-center">
            <div className="relative max-w-sm">
              <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <Image 
                  src="/balubo_profile.png" 
                  alt="baluboライター・編集者プロフィール画面のイメージ" 
                  width={400}
                  height={300}
                  className="w-full h-auto opacity-90"
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
          {analysisMetrics.map((metric) => (
            <div
              key={metric.title}
              className="relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-[#0A66C2] hover:shadow-2xl transition-all duration-500"
            >
              {/* アイコン */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0A66C2] to-[#004182] rounded-xl flex items-center justify-center text-white">
                  {metric.icon}
                </div>
              </div>

              {/* タイトル */}
              <h3 className="mb-2 text-lg font-bold text-gray-900 leading-tight">
                {metric.title}
              </h3>

              {/* サブタイトル */}
              <p className="mb-3 text-xs font-semibold text-[#0A66C2] uppercase tracking-wide">
                {metric.subtitle}
              </p>

              {/* 説明 */}
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {metric.description}
              </p>
              
              {/* 実際のスコア例を表示 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">スコア例</span>
                  <span className="text-sm font-bold text-[#0A66C2]">
                    {metric.title === "業界への解像度" && "95%"}
                    {metric.title === "課題解決力" && "88%"}
                    {metric.title === "専門品質" && "91%"}
                    {metric.title === "実績インパクト" && "87%"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full">
                  <div 
                    className="h-1.5 bg-gradient-to-r from-[#0A66C2] to-[#004182] rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: metric.title === "業界への解像度" ? "95%" :
                             metric.title === "課題解決力" ? "88%" :
                             metric.title === "専門品質" ? "91%" : "87%"
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTAセクション */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-8 md:p-10 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              あなたも、専門性を証明しませんか？
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              baluboがあなたの専門性を客観的に分析し、クライアントに伝わる「証明書」を作成します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                まずは無料で「専門性スコア」を見る
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
