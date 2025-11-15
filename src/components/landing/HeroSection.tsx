"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-white pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-blue-50/80 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 top-20 -z-10 h-64 w-64 rounded-full bg-blue-100 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="grid w-full grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-24 xl:gap-32">
            {/* Left Content */}
            <div className="space-y-8 md:space-y-12 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                <span className="block leading-[1.05]">
                  専門性を証明して
                  <br />
                  正しく評価されるポートフォリオへ
                </span>
              </h1>

              <div className="mx-auto max-w-2xl space-y-6 lg:mx-0">
                <p className="text-xl md:text-2xl text-gray-900 leading-relaxed font-bold">
                  AIが記事を読み解き、業界知識や思考プロセスまで可視化します。
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  baluboはBtoB領域のライター・編集者向けAIポートフォリオ。記事URLを登録するだけで専門性スコアと提案に使える要約が自動生成されます。
                </p>
              </div>

              {/* 対象クリエイター表示 */}
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">ライター・編集者</span>
                  </div>
                </div>
                <p className="text-center lg:text-left text-sm text-gray-600 font-medium">
                  BtoB記事・金融IR・SaaS事例など専門領域を扱うプロに最適
                </p>
              </div>

              {/* 社会的証明バッジ */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-50/80 rounded-full border border-blue-200 shadow-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">β版 / 完全無料で利用可能</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Button
                    size="lg"
                    className="w-full rounded-xl bg-blue-600 px-10 py-4 text-base font-semibold text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:bg-blue-700 sm:w-auto disabled:opacity-60"
                    disabled={isRedirecting}
                    onClick={() => {
                      setIsRedirecting(true);
                      router.push("/register");
                    }}
                  >
                    {isRedirecting ? (
                      "読み込み中…"
                    ) : (
                      <span className="inline-flex items-center">
                        無料登録して専門性スコアを確認する
                        <svg
                          className="ml-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    )}
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full rounded-lg border border-gray-200 bg-white px-10 py-4 text-base font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-50 sm:w-auto"
                  >
                    <Link href="/login">ログイン</Link>
                  </Button>
                </div>
                {/* CTA補足 */}
                <div className="flex justify-center lg:justify-start">
                  <p className="text-sm text-gray-600 font-medium">
                    登録3分、作品は後から追加できます。
                  </p>
                </div>
                {/* 信頼性表示の強化 */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
                  <p className="flex items-center text-sm text-gray-700 font-medium">
                    <svg className="mr-2 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="確認済み" role="img">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    β版は無料。すでに多くのプロがAI分析を試しています。
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual - Service Preview */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Main Service Preview Card */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                  <div className="relative">
                    <Image 
                      src="/balubo_profile.png" 
                      alt="baluboライター・編集者プロフィール画面のイメージ" 
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-2xl"
                      priority
                    />
                    {/* Overlay for interactive elements */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                    
                    {/* イメージ画面の注釈 */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      イメージ画面
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}