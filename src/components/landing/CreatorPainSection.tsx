"use client";

import React from "react";

//【3つの悩み】
const problems = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: "記事だけでは思考プロセスが伝わらない",
    description:
      "完成記事を提示しても、業界知識の深さや調査プロセスが見えず、作業時間や専門性が正当に評価されない。",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "強みを客観的に示す手段がない",
    description:
      "「SaaSに強い」「IR記事が得意」といった価値を数字や第三者視点で証明できず、他の書き手と同列に扱われる。",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "結果的に文字単価でしか語れない",
    description:
      "思考・リサーチ・編集設計といった貢献が伝わらず、報酬交渉も文字数基準になり、不毛な価格競争に巻き込まれる。",
  },
];

export default function CreatorPainSection() {
  return (
    <section className="relative isolate bg-gradient-to-b from-white via-gray-50 to-white py-24 px-4 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.35),_transparent_60%)]"
        aria-hidden="true"
      />
      <div className="container relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight tracking-tight">
            プロの価値、正しく伝わっていますか？
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ビジネスコンテンツに強いライターほど、専門性の見せ方に悩みが生まれます。その代表的な壁を３つにまとめました。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="relative rounded-2xl border border-gray-100 bg-white/90 p-8 shadow-lg shadow-blue-500/5 transition-all duration-500 hover:-translate-y-1 hover:border-blue-400"
            >
              {/* アイコン */}
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {problem.icon}
                </div>
              </div>

              {/* タイトル */}
              <h3 className="mb-4 text-center text-lg font-bold text-gray-900 leading-snug">
                {problem.title}
              </h3>

              {/* 説明文 */}
              <p className="text-base text-center leading-relaxed text-gray-700">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

