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
    title: "「記事」だけでは、プロセスが伝わらない",
    description:
      "完成記事を見せるだけでは、その裏にある業界知識、膨大なリサーチ、課題解決の思考プロセスが伝わらない。「これなら5,000円だ」と、かけた時間や労力を無視されてしまう。",
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
    title: "「専門性」を、客観的に示せない",
    description:
      "「SaaS業界に強い」という強みは、単価を決める重要な価値のはず。しかし、それを客観的に示す術がなく、「同じような記事が書ける人」として扱われてしまう。",
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
    title: "結果、「文字単価」でしか語れない",
    description:
      "あなたの価値は「文字数」でしか測られなくなり、不毛な価格競争に巻き込まれていく。スキルを磨くほど、その価値を伝えるのが難しくなるという、残酷な現実。",
  },
];

export default function CreatorPainSection() {

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-24 px-4 md:py-32">
      <div className="container mx-auto max-w-7xl relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight tracking-tight">
            あなたの「本当の価値」、
            <br />
            正しく伝わっていますか？
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            深い知見と高いスキルを持つプロフェッショナルだからこそ、直面する壁があります。
            <br />
            あなたも同じ経験はありませんか？
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="relative border-2 border-gray-200 bg-white rounded-2xl p-8 hover:border-blue-600 hover:shadow-xl transition-all duration-500"
            >
              {/* アイコン */}
              <div className="mb-6 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-gray-600">
                  {problem.icon}
                </div>
              </div>

              {/* タイトル */}
              <h3 className="mb-4 text-lg font-bold text-gray-900 text-center leading-snug">
                {problem.title}
              </h3>

              {/* 説明文 */}
              <p className="text-base text-gray-700 text-center leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

