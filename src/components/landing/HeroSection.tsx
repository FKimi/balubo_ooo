"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";

export default function HeroSection() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    setIsRedirecting(true);
    router.push("/register");
  };

  return (
    <section className="relative isolate overflow-hidden bg-white pt-14 pb-16 sm:pb-24 lg:pb-32">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Column: Text Content */}
          <FadeIn className="max-w-2xl text-center lg:text-left lg:mx-0 mx-auto">
            {/* Trust Badges */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/50 px-3 py-1 text-sm font-medium text-gray-600 backdrop-blur-sm">
                完全無料（β版）
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6 leading-[1.15]">
              AIがあなたの専門性を<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                「証明」する。
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 mb-10">
              記事URLを入力するだけ。AIがあなたの実績から「専門性」と「思考プロセス」を分析し、
              クライアントに価値が伝わるポートフォリオを自動生成します。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="h-14 w-full sm:w-auto rounded-full bg-blue-600 px-8 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-105 hover:shadow-blue-500/40"
                disabled={isRedirecting}
                onClick={handleStart}
              >
                {isRedirecting ? "読み込み中..." : "無料で始める"}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-14 w-full sm:w-auto rounded-full px-8 text-lg font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                asChild
              >
                <a href="#features">詳しく見る</a>
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                登録1分
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                クレカ不要
              </div>
            </div>
          </FadeIn>

          {/* Right Column: Visual Representation */}
          <FadeIn delay={0.2} className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative group">
              {/* Background Decor */}
              <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>
              <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow delay-1000"></div>

              {/* Main Profile Mockup */}
              <div className="relative rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5 overflow-hidden transition-transform duration-700 hover:scale-[1.01]">
                {/* Window Controls */}
                <div className="h-8 bg-white border-b border-gray-50 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                </div>

                {/* Profile Header */}
                <div className="relative">
                  <div className="h-32 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-900/30 z-10"></div>
                    <img
                      src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                      alt="Office Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="px-6 pb-5 relative">
                    <div className="flex justify-between items-end -mt-10 mb-4 relative z-20">
                      <div className="h-20 w-20 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-md">
                        <img
                          src="/SdEXQsh.png"
                          alt="User Avatar"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="mb-1">
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-[10px] font-bold text-white shadow-sm ring-1 ring-inset ring-white/20">
                          お仕事募集中
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">高野 将也</h3>
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">BtoBライター / 編集者</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-500 font-medium">#経営者インタビュー</span>
                      <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-500 font-medium">#半導体</span>
                      <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-500 font-medium">#製造業</span>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Section - Simplified */}
                <div className="relative overflow-hidden border-t border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-white/50 z-0"></div>

                  <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-sm">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">AI分析による強み</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-blue-100 shadow-sm">
                        <svg className="w-3 h-3 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-bold text-gray-600">Balubo認証済み</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {/* 課題・目的 */}
                      <div className="bg-white/90 p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 mt-0.5">🎯</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium mb-0.5">課題・目的</p>
                            <p className="text-xs text-gray-700">半導体業界の優秀なエンジニア確保における採用戦略の課題</p>
                          </div>
                        </div>
                      </div>

                      {/* 想定読者 */}
                      <div className="bg-white/90 p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 mt-0.5">👤</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium mb-0.5">想定読者</p>
                            <p className="text-xs text-gray-700">製造業のDX推進担当者や採用責任者</p>
                          </div>
                        </div>
                      </div>

                      {/* 成果 */}
                      <div className="bg-white/90 p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 mt-0.5">✨</span>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium mb-0.5">成果</p>
                            <p className="text-xs text-gray-700">218PVを獲得し、専門性の高さが評価された</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
