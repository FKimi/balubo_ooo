"use client";

import Link from "next/link";
import { Footer as SharedFooter } from "@/components/layout/Footer";

export default function ReasonPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="balubo トップページ"
          >
            <span className="text-xl font-bold tracking-tight text-blue-600">
              balubo
            </span>
          </Link>
          <nav
            className="hidden items-center space-x-6 text-sm font-medium text-gray-700 md:flex"
            aria-label="グローバルナビゲーション"
          >
            <Link
              href="/"
              className="transition-colors hover:text-blue-600"
            >
              クリエイター向け
            </Link>
            <Link
              href="/enterprise"
              className="transition-colors hover:text-blue-600"
            >
              企業向けサービス
            </Link>
            <Link
              href="/vision"
              className="transition-colors hover:text-blue-600"
            >
              baluboが目指す世界
            </Link>
          </nav>
        </div>
      </header>

      <main className="bg-[#F4F7FF]">
        {/* Hero */}
        <section className="relative isolate overflow-hidden py-20 px-4 sm:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white via-white/80 to-transparent" />
          <div className="container mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Founder&apos;s Story
            </p>
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              私たちがbaluboを創った理由
            </h1>
            <p className="text-lg leading-relaxed text-gray-700">
              私は長年メディア編集者として、優れた技術を持つ企業と、高い専門性を持つクリエイター、その両者の間に立ち続けてきました。
            </p>
          </div>
        </section>

        {/* 本文 */}
        <section className="pt-4 pb-16 px-4">
          <div className="container mx-auto max-w-3xl space-y-8">
            <p className="text-lg leading-relaxed text-gray-700">
              その狭間で、いつも感じていたことがあります。
            </p>

            <div className="space-y-2 rounded-[28px] border border-blue-50/90 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <p className="text-base leading-relaxed text-gray-800">
                「技術は素晴らしいのに、伝え方があまり上手くなくてもったいない」
              </p>
              <p className="text-base leading-relaxed text-gray-800">
                「こんなに良いクリエイターがいるのに、知られてないなんてもったいない」
              </p>
            </div>

            <p className="text-lg leading-relaxed text-gray-700">
              この両者が出会えていない「もったいなさ」を、想いだけで終わらせない。
              自らの手でテクノロジーを学び、解決する。その覚悟で、株式会社baluboを創業しました。
            </p>

            <p className="text-lg leading-relaxed text-gray-700">
              日本のBtoB企業が持つ素晴らしい技術力に、クリエイターの力を掛け合わせれば、ビジネスはもっと面白くなる。
            </p>

            <p className="text-lg leading-relaxed text-gray-700">
              私たちは、日本の2つの才能を、世界へ届けるインフラになります。
            </p>
          </div>
        </section>

        {/* 企業向けサービスへの案内 */}
        <section className="pb-24 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="rounded-[32px] border border-blue-50/90 bg-white/95 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <h2 className="mb-3 text-xl font-bold text-gray-900 md:text-2xl">
                企業の方へ：baluboを活用したいとお考えの方へ
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-gray-700 md:text-base">
                「自社の事業を深く理解したプロクリエイターと出会いたい」「専門性でマッチングできる仕組みに興味がある」という企業の方のために、
                企業向けのご案内ページをご用意しています。
              </p>
              <div className="flex flex-col gap-3 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
                <p className="text-xs md:text-sm text-gray-600">
                  BtoB企業向けの価値・活用シーン・料金イメージなどを、分かりやすくまとめています。
                </p>
                <Link
                  href="/enterprise"
                  className="inline-flex items-center justify-center rounded-full bg-[#007AFF] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-400/40 transition-all duration-300 hover:translate-y-0.5 hover:bg-[#0063CC] hover:shadow-blue-500/40"
                >
                  企業向けサービスを見る
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SharedFooter />
    </div>
  );
}


