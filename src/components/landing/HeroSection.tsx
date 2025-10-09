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
    <section id="hero" className="relative bg-white pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="grid w-full grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-24 xl:gap-32">
            {/* Left Content */}
            <div className="space-y-8 md:space-y-12 text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                <span className="block leading-[1.05]">
                  無料で<span className="text-[#0A66C2]">「価値」</span>を可視化
                </span>
              </h1>

              <div className="mx-auto max-w-2xl space-y-6 lg:mx-0">
                <p className="text-2xl md:text-3xl text-gray-900 leading-relaxed font-bold">
                  その専門性、証明できますか？
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  <span className="text-[#0A66C2] font-semibold">balubo</span>は、BtoB領域で活躍するプロクリエイターのためのAIポートフォリオプラットフォームです。
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  あなたの制作実績を登録するだけで、AIがその背景にある「業界への解像度」や「課題解決力」を分析・可視化。これまで言語化が難しかったあなたの本当の価値を、客観的なデータとして証明します。
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  専門性を正しく伝え、その価値を理解するクライアントと出会う。baluboは、プロクリエイターと発注者のミスマッチを解消し、日本のビジネスをさらに前進させます。
                </p>
                <p className="text-sm text-gray-500 italic mt-4">
                  ※マッチング機能は開発中です
                </p>
              </div>

              {/* 対象クリエイター表示 */}
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                    <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">ライター・編集者</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                    <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">デザイナー</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                    <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">カメラマン</span>
                  </div>
                </div>
                <p className="text-center lg:text-left text-sm text-gray-600 font-medium">
                  BtoBで戦う、すべてのクリエイターへ
                </p>
              </div>

              {/* 社会的証明バッジ */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200 shadow-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A66C2]">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">β版参加者募集中</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Button
                    size="lg"
                    className="w-full rounded-lg bg-[#0A66C2] px-10 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#004182] sm:w-auto disabled:opacity-60"
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
                        無料であなたの「価値」を可視化する
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
                {/* 信頼性表示の強化 */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
                  <p className="flex items-center text-sm text-gray-700 font-medium">
                    <svg className="mr-2 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-label="確認済み" role="img">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    多くのプロフェッショナルが、すでに価値証明を始めています
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="mr-1.5 h-4 w-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    登録無料
                  </span>
                  <span className="flex items-center">
                    <svg className="mr-1.5 h-4 w-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    1分で完了
                  </span>
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
                      alt="baluboクリエイタープロフィール画面のイメージ" 
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