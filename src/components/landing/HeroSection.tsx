"use client";


import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";

export default function HeroSection() {


  return (
    <section className="relative isolate overflow-hidden bg-white pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pb-32">
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
                asChild
                variant="cta"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/register">無料で始める</Link>
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
              {/* Background Decor - More subtle and premium */}
              <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow"></div>
              <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-indigo-100/50 blur-3xl opacity-50 mix-blend-multiply animate-pulse-slow delay-1000"></div>

              {/* Main Profile Page Mockup */}
              <div className="relative rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5 overflow-hidden transition-transform duration-700 hover:scale-[1.01]">
                {/* Window Controls - Sleeker */}
                <div className="h-8 bg-white border-b border-gray-50 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                </div>

                {/* Profile Header Section */}
                <div className="relative">
                  {/* Banner - High quality gradient overlay */}
                  <div className="h-32 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-900/30 z-10"></div>
                    <Image
                      src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                      alt="Office Banner"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="px-6 pb-6 relative">
                    <div className="flex justify-between items-end -mt-10 mb-4 relative z-20">
                      <div className="h-20 w-20 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-md relative">
                        <Image
                          src="/SdEXQsh.png"
                          alt="User Avatar"
                          fill
                          className="object-cover object-center"
                          sizes="80px"
                        />
                      </div>
                      <div className="mb-1">
                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-[10px] font-bold text-white shadow-sm ring-1 ring-inset ring-white/20">
                          お仕事募集中
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">高野 将也</h3>
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">SaaSライター / 編集者</p>
                      <div className="flex items-center text-xs text-gray-400 gap-1.5 pt-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        東京都 渋谷区
                      </div>
                    </div>

                    {/* User Defined Tags - Minimalist */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-500 font-medium">#インタビュー</span>
                      <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-500 font-medium">#導入事例</span>
                      <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-500 font-medium">#ホワイトペーパー</span>
                    </div>
                  </div>
                </div>

                {/* AI Analysis Section (The "Value" Part) - Premium Glassmorphism */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white/80 backdrop-blur-sm z-0"></div>

                  <div className="p-6 relative z-10">
                    {/* AI Label - Premium Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-blue-500/30 shadow-lg">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="font-bold text-gray-900 text-sm tracking-tight">AI分析による強み</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 border border-blue-100 shadow-sm">
                        <svg className="w-3 h-3 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[10px] font-bold text-gray-600">Balubo認証済み</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Analysis Item 1 */}
                      <div className="bg-white/80 p-3.5 rounded-2xl border border-blue-100/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded bg-blue-50 text-blue-600 font-bold text-[10px]">1</span>
                          <h4 className="font-bold text-gray-800 text-sm">スタートアップ・IPO</h4>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed pl-7.5">
                          <span className="font-bold text-gray-800">15本の記事を分析。</span>「資金調達」「PMF」「IPO戦略」に関する深い洞察が検出されました。
                        </p>
                      </div>

                      {/* Analysis Item 2 */}
                      <div className="bg-white/80 p-3.5 rounded-2xl border border-blue-100/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded bg-blue-50 text-blue-600 font-bold text-[10px]">2</span>
                          <h4 className="font-bold text-gray-800 text-sm">BtoBマーケティング</h4>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed pl-7.5">
                          <span className="font-bold text-gray-800">8本の記事を分析。</span>「リード獲得」「ナーチャリング」の手法において高い専門性が示されています。
                        </p>
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
