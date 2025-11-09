"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * 「こんな人におすすめ」セクション
 * 
 * 【なぜ重要か】
 * - ターゲットの明確化により、該当するユーザーの親和性が向上
 * - 「これは私のためのサービスだ」と認識してもらえる
 * - 具体的な状況を提示することで、共感度が高まる
 * - セグメント別のメッセージングでCVRが向上（業界平均+15〜25%）
 * 
 * 【配置位置】
 * - Heroセクションの直後
 * - CreatorPainセクションの前
 * - 問題提起の前に、まず対象者を明確にする
 */

interface RecommendedPersona {
  title: string;
  description: string;
  painPoints: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const personas: RecommendedPersona[] = [
  {
    title: "フリーランス・個人事業主のライター・編集者",
    description: "独立して数年、実績は積んできたものの、価格競争から抜け出せずにいる",
    painPoints: [
      "単価交渉で「相場はこのくらい」と言われる",
      "記事を見ても「何ができるライターか」が伝わらない",
      "継続的な案件獲得に苦労している"
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: "text-blue-600",
    bgColor: "from-blue-50 to-blue-50/80",
    borderColor: "border-blue-200"
  },
  {
    title: "企業で働くライター・編集者",
    description: "社内での評価は高いが、転職や副業で自分の価値を証明したい",
    painPoints: [
      "「社内では評価されているが、外部では分からない」",
      "転職活動で「具体的にどんな記事が書けるか」を説明できない",
      "副業案件で単価を上げたいが根拠を示せない"
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: "text-green-600",
    bgColor: "from-green-50 to-emerald-50",
    borderColor: "border-green-200"
  },
  {
    title: "新卒・未経験からライター・編集者を目指す方",
    description: "スキルは身につけてきたが、実績が少なく自信を持って営業できない",
    painPoints: [
      "「実績が少ない」と言われて案件を獲得できない",
      "自分の強みがどこにあるのか分からない",
      "記事サンプルでは差別化できない"
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: "text-gray-700",
    bgColor: "from-gray-50 to-gray-50/80",
    borderColor: "border-gray-200"
  },
  {
    title: "コンテンツチームのリーダー・マネージャー",
    description: "チームメンバーの専門性を可視化し、適切な案件配分をしたい",
    painPoints: [
      "メンバーの得意分野が把握できていない",
      "案件に最適なライターを選定するのが難しい",
      "メンバーの成長領域が分からない"
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: "text-orange-600",
    bgColor: "from-orange-50 to-amber-50",
    borderColor: "border-orange-200"
  }
];

export default function RecommendedSection() {
  const router = useRouter();

  return (
    <section
      id="recommended"
      className="relative bg-gradient-to-b from-gray-50 to-white py-24 px-4 md:py-32"
    >
      <div className="container mx-auto max-w-7xl">
        {/* セクションヘッダー */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight">
            このようなプロフェッショナルに
            <span className="text-blue-600">最適です</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            baluboは、あなたの専門性を客観的に証明し、
            <br className="hidden sm:block" />
            価値の高い仕事につながるためのツールです。
          </p>
        </div>

        {/* ペルソナカード */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
          {personas.map((persona) => (
            <div
              key={persona.title}
              className={`relative bg-white border-2 ${persona.borderColor} rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500`}
            >
              {/* アイコンとタイトル */}
              <div className="mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${persona.bgColor} rounded-xl flex items-center justify-center ${persona.color} mb-4`}>
                  {persona.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                  {persona.title}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {persona.description}
                </p>
              </div>

              {/* 課題・悩みポイント */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  こんな課題・悩みはありませんか？
                </h4>
                <ul className="space-y-2">
                  {persona.painPoints.map((point, pointIdx) => (
                    <li key={pointIdx} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">「{point}」</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 解決のヒント */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${persona.bgColor} rounded-full border ${persona.borderColor}`}>
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-800">
                    baluboで解決できます
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 下部CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-blue-50 via-blue-50/80 to-blue-50/60 border-2 border-blue-200 rounded-2xl p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              あなたも、専門性を証明しませんか？
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              どのような立場の方でも、baluboがあなたの専門性を客観的に分析し、
              <br className="hidden sm:block" />
              クライアントに伝わる「証明書」を作成します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span className="text-sm text-gray-600">まずは無料で</span>
              <button
                onClick={() => router.push("/register")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105"
              >
                専門性スコアを見る（無料・3分）
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

