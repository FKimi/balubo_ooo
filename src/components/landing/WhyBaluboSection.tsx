"use client";

import React from "react";
import Image from "next/image";

const solutions = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "URL入力だけで楽々制作物登録",
    description:
      "WebサイトやBehance、noteなどのURLを入力するだけで、AIが自動的に制作物のタイトル、説明文、画像を抽出。一から入力する手間を省いて、簡単にポートフォリオに登録できます。",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AIがあなたの「価値」を言語化",
    description:
      "制作物をAIが深く分析し、「SaaS業界のビジネスモデルへの深い理解」「複雑な情報を整理し、本質を突く構成力」など、あなたのビジネス貢献度や思考プロセスまで踏み込んで、専門性を具体的な言葉で表現します。",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "価値がわかるクライアントと出会える",
    description:
      "AIが分析したあなたのスキルデータを基に、専門性を求めるクライアントとの高精度なマッチングを実現。不毛な価格競争から脱却し、あなたの価値を正当に評価してくれるクライアントと繋がれます。",
  },
];

export default function WhyBaluboSection() {

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 px-4 md:py-28">
      <div className="container mx-auto max-w-7xl relative">
        <div>
          {/* メインメッセージ */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight">
              その課題、<span className="text-[#0A66C2]">balubo</span>が解決します
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AIがあなたの「第三者の目」となり、実績に隠された価値を客観的に分析・言語化
              <br />
              あなたの専門性を、誰にでも伝わる「証明書」へと変換します。
              <br />
              これまで言語化が難しかったあなたの本当の価値を、客観的なデータとして証明します。
            </p>
          </div>

          {/* 3つのソリューション */}
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto mb-16">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#0A66C2] hover:shadow-2xl transition-all duration-500"
              >
                {/* アイコン */}
                <div className="mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0A66C2] to-[#004182] rounded-xl flex items-center justify-center text-white">
                    {solution.icon}
                  </div>
                </div>

                {/* タイトル */}
                <h3 className="mb-4 text-xl font-bold text-gray-900 leading-tight">
                  {solution.title}
                </h3>

                {/* 説明 */}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>

          {/* AI分析画面のプレビュー */}
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                サービスのイメージ
              </h3>
              <p className="text-gray-600">
                あなたの専門性が、このように詳細に分析・可視化される予定です
              </p>
            </div>
            
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
              <Image 
                src="/balubo_analysis.png" 
                alt="balubo AI専門性分析画面のイメージ" 
                width={800}
                height={600}
                className="w-full h-auto"
              />
              {/* Overlay for interactive elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
              
              {/* イメージ画面の注釈 */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full">
                イメージ画面
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}

