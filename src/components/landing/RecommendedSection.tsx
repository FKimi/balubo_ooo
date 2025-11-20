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

  return (
    <section
      id="recommended"
      className="bg-white py-20 sm:py-32"
    >
      <div
        className="pointer-events-none absolute -bottom-24 right-12 -z-10 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div className="container mx-auto max-w-6xl px-4">
        {/* セクションヘッダー */}
        <FadeIn className="mb-16 text-left">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            このようなプロフェッショナルに最適です
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
            baluboは、あなたの専門性を客観的に証明し、<br className="hidden sm:block" />
            次のキャリアや案件獲得につなげるためのツールです。
          </p>
        </FadeIn>

        {/* ペルソナカード */}
        <StaggerContainer className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {personas.map((persona) => (
            <StaggerItem
              key={persona.title}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/50 ${persona.bgClass} p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              {/* ヘッダー部分 */}
              <div className="mb-6 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${persona.accentClass} ${persona.colorClass}`}>
                  {persona.icon}
                </div>
                <div>
                  <p className={`text-sm font-bold ${persona.colorClass}`}>{persona.subtitle}</p>
                  <h3 className="text-xl font-bold text-gray-900">{persona.title}</h3>
                </div>
              </div>

              {/* 課題リスト */}
              <div className="flex-1 rounded-2xl bg-white/60 p-5 backdrop-blur-sm">
                <p className="mb-3 text-xs font-bold text-gray-500">こんな悩みはありませんか？</p>
                <ul className="space-y-3">
                  {persona.painPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className={`mt-0.5 h-4 w-4 flex-shrink-0 ${persona.colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
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

