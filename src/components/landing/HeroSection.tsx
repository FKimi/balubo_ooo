"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * HeroSection (First View)
 * 折りたたみを目的に `page.tsx` から切り出した最上部ヒーローセクション。
 * UI / 文言は既存実装をそのまま移植し、見た目の変更はありません。
 */
export default function HeroSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-base-white via-base-light-gray to-primary-light-blue/10">
      <div className="container mx-auto text-center max-w-5xl">
        {/* 共感・課題提起 */}
        <div className="mb-8">
          <p className="text-lg text-text-secondary font-medium mb-2">
            &ldquo;私の強み、もっと伝わればいいのに…&rdquo;
          </p>
          <p className="text-base text-text-tertiary">そう感じていませんか？</p>
        </div>

        {/* メインキャッチコピー */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
          あなたの挑戦の軌跡を、<span className="text-accent-dark-blue">AIが言語化</span>し世界へ。<br />
          <span className="text-primary-blue">balubo</span> — ライター・編集者のためのキャリアSNS
        </h1>

        {/* サブキャッチコピー */}
        <p className="text-lg md:text-xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
          これまで積み重ねてきた作品と努力を、AIが強みとして可視化。<br />
          ポートフォリオと SNS 機能で、新しい仲間とチャンスが広がります。
        </p>

        {/* CTAボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              AIで自分の才能を分析する
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-4 border-2 border-accent-dark-blue text-accent-dark-blue hover:bg-accent-dark-blue hover:text-white transition-all duration-300"
          >
            サービスを詳しく見る
          </Button>
        </div>

        {/* メインビジュアル（アイコンによる表現） */}
        <div className="flex justify-center items-center space-x-8 opacity-70">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-light-blue/20 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-accent-dark-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="text-sm text-text-tertiary">作品投稿</span>
          </div>

          <div className="hidden sm:block">
            <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-light-blue/20 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-accent-dark-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="text-sm text-text-tertiary">AI分析</span>
          </div>

          <div className="hidden sm:block">
            <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-light-blue/20 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-8 h-8 text-accent-dark-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm text-text-tertiary">新たな出会い</span>
          </div>
        </div>
      </div>
    </section>
  );
}
