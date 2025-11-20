"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface RecommendedPersona {
  title: string;
  subtitle: string;
  painPoints: string[];
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  accentClass: string;
}

const personas: RecommendedPersona[] = [
  {
    title: "フリーランス",
    subtitle: "ライター・編集者",
    painPoints: ["提案で「価値」を証明しづらい", "実績が整理できていない", "単価交渉の材料がほしい"],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50/50",
    accentClass: "bg-blue-100",
  },
  {
    title: "会社員",
    subtitle: "ライター・編集者",
    painPoints: ["社外での市場価値を知りたい", "転職・副業で実績を示したい", "専門性を客観視したい"],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50/50",
    accentClass: "bg-emerald-100",
  },
  {
    title: "チームリーダー",
    subtitle: "コンテンツマネージャー",
    painPoints: ["メンバーの強みを把握したい", "案件への適材適所を進めたい", "評価の客観的指標がほしい"],
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    colorClass: "text-orange-600",
    bgClass: "bg-orange-50/50",
    accentClass: "bg-orange-100",
  },
];

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function RecommendedSection() {
  const router = useRouter();

  const recommendations = [
    {
      title: "膨大な記事実績を「資産」に変える",
      description: "過去に執筆した導入事例やインタビュー記事が散乱している。忙しくてポートフォリオを更新する時間がない。",
      solution: "URLを貼るだけで、AIが自動で収集・整理。あなたの実績が、永続的なビジネス資産に変わります。",
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgGradient: "from-blue-50 to-white",
    },
    {
      title: "「得意分野」をデータで証明する",
      description: "「ITも金融も書けます」では強みが伝わりにくい。自分の専門性を客観的な指標で示したい。",
      solution: "AIが記事から専門知識やスキルを抽出。あなたの「得意領域」を客観的なデータとして可視化します。",
      icon: (
        <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgGradient: "from-indigo-50 to-white",
    },
    {
      title: "専門性が活きる仕事に出会う",
      description: "ミスマッチな案件相談を減らし、自分の強みを深く理解してくれるクライアントと仕事がしたい。",
      solution: "可視化された「強み」が、信頼の証に。あなたの専門性を求める企業からのオファーを引き寄せます。",
      icon: (
        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgGradient: "from-emerald-50 to-white",
    },
  ];

  return (
    <section
      id="recommended"
      className="bg-base-soft-blue py-20 sm:py-32"
    >
      <div
        className="pointer-events-none absolute -bottom-24 right-12 -z-10 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div className="container mx-auto max-w-7xl px-4">
        {/* セクションヘッダー */}
        <FadeIn className="mb-16 text-center">
          <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            ビジネス領域で活躍する<br className="sm:hidden" />
            ライター・編集者の方へ
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
            baluboは、あなたの「取材力」や「構成力」をデータで可視化。<br className="hidden sm:block" />
            専門性を武器に、キャリアを次のステージへ導きます。
          </p>
        </FadeIn>

        {/* バリューカード (Bento Grid Inspired) */}
        <StaggerContainer className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {recommendations.map((item, idx) => (
            <StaggerItem
              key={idx}
              className={`group relative flex flex-col overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-b ${item.bgGradient} p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg`}
            >
              {/* アイコン & タイトル */}
              <div className="mb-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold leading-tight text-gray-900">
                  {item.title}
                </h3>
              </div>

              {/* 課題 (Pain) */}
              <div className="mb-6 flex-1">
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>

              {/* 解決策 (Solution) - Highlighted */}
              <div className="relative rounded-2xl bg-white/80 p-5 backdrop-blur-sm ring-1 ring-gray-900/5">
                <div className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-[10px] font-bold text-white shadow-md">
                  <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  BALUBO SOLUTION
                </div>
                <p className="text-sm font-medium leading-relaxed text-gray-900">
                  {item.solution}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 下部CTA */}
        <FadeIn delay={0.3} className="mt-16 text-center">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-blue-100/80 bg-white/95 p-8 shadow-[0_22px_60px_rgba(37,99,235,0.12)] md:p-10">
            <h3 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
              あなたも、専門性を証明しませんか？
            </h3>
            <p className="mb-8 text-lg text-gray-700">
              どのような立場の方でも、baluboがあなたの専門性を客観的に分析し、<br className="hidden sm:block" />
              クライアントに伝わる「証明書」を作成します。
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <span className="text-sm font-medium text-gray-500">まずは無料で</span>
              <button
                onClick={() => router.push("/register")}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
              >
                専門性スコアを見る
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

