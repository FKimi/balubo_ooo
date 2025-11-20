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
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "ポートフォリオ作成に時間と手間がかかりすぎる",
    description:
      "案件ごとに実績を整理したり、紹介文を書き直したりするのが面倒で、後回しになってしまう。結果として、せっかくの実績や専門性が十分に伝わる形で整理されていない。",
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
    title: "自分の専門性や強みを言語化しきれていない",
    description:
      "「SaaSに強い」「IR記事が得意」といった感覚はあるものの、どんな専門性があるのか、どこが他の書き手と違うのかを客観的な言葉や指標で整理できておらず、自分でもうまく説明しきれない。",
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "もっと専門性を活かせる仕事と出会えていない",
    description:
      "思考・リサーチ・編集設計といった強みが活きる案件よりも、「とりあえず記事を量産する」タイプの仕事に寄ってしまい、自分の専門性や価値観とフィットしたプロジェクトや役割に十分アクセスできていない感覚がある。",
  },
];

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function CreatorPainSection() {
  return (
    <section className="bg-base-soft-blue py-24 sm:py-32">
      <div
        className="pointer-events-none absolute -bottom-24 left-8 -z-10 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative mx-auto max-w-7xl">
        {/* セクションヘッダー */}
        <FadeIn className="mb-12">
          <div className="mx-auto max-w-5xl text-left">
            <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              こんなお悩みはありませんか？
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              ビジネスコンテンツに強いライターほど、専門性の見せ方に悩みが生まれます。その代表的な壁を３つにまとめました。
            </p>
          </div>
        </FadeIn>

        {/* 課題カード */}
        <StaggerContainer className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {problems.map((problem) => (
            <StaggerItem
              key={problem.title}
              className="relative h-full overflow-hidden rounded-[32px] bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-soft-lg"
            >
              {/* アイコン */}
              <div className="mb-5 flex items-center justify-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 shadow-[0_12px_28px_rgba(191,219,254,0.95)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 text-white shadow-[0_10px_26px_rgba(37,99,235,0.45)]">
                    <span className="flex items-center justify-center">{problem.icon}</span>
                  </div>
                </div>
              </div>

              {/* タイトル */}
              <h3 className="mb-3 min-h-[3.75rem] text-left text-lg font-bold leading-snug text-gray-900">
                {problem.title}
              </h3>

              {/* 説明文 */}
              <p className="text-left text-base leading-relaxed text-gray-700">
                {problem.description}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

