'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-x-0 top-0 z-0 h-[600px] bg-gradient-to-b from-blue-50 to-white"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-20 md:py-24">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block leading-tight">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                    クリエイター
                  </span>
                  の
                </span>
                <span className="mt-2 block leading-tight">
                  新しい魅力を発見・証明
                </span>
              </h1>

              <div className="mx-auto max-w-xl space-y-6 text-lg text-slate-600 sm:text-xl lg:mx-0">
                <p>
                  <span className="font-semibold text-slate-900">balubo</span>は、ライター・編集者などクリエイターのためのポートフォリオサービスです。
                </p>
                <p>
                  AIがあなたの作品を<br className="hidden sm:block" />
                  <span className="font-semibold text-blue-600">「創造性」「専門性」「影響力」</span>の3つの指標と、
                  内容に応じたタグで多角的に分析。
                  作品一つひとつの魅力と価値を客観的に可視化します。
                </p>
                <p>
                  さらに、登録された作品全体の傾向から、
                  <span className="font-semibold text-blue-600">あなた自身の強みや得意な領域</span>も明らかに。
                </p>
                <p>
                  説得力のあるポートフォリオで、スキルや個性を正しく伝え、
                  <span className="font-semibold text-blue-600">ミスマッチのない最適な仕事</span>と出会えます。
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="w-full transform-gpu rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl sm:w-auto"
                >
                  <Link href="/register">
                    無料で始める
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full rounded-lg border-2 border-slate-300 bg-transparent px-8 py-4 text-lg font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto"
                >
                  <Link href="/login">ログイン</Link>
                </Button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="relative z-10 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8">
                    <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                      AI Analysis
                    </div>
                    
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">AI分析結果</h3>
                        <p className="text-sm text-slate-500">自動生成レポート</p>
                      </div>
                    </div>

                    <div className="mb-6 space-y-4">
                      {/* Score Item */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100"><svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg></div>
                          <span className="font-medium text-slate-700">創造性</span>
                        </div>
                        <div className="flex flex-1 items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-4/5 rounded-full bg-blue-500"></div></div>
                          <span className="min-w-[32px] text-right text-lg font-bold text-slate-800">85</span>
                        </div>
                      </div>
                      {/* Score Item */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100"><svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg></div>
                          <span className="font-medium text-slate-700">専門性</span>
                        </div>
                        <div className="flex flex-1 items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-5/6 rounded-full bg-blue-500"></div></div>
                          <span className="min-w-[32px] text-right text-lg font-bold text-slate-800">92</span>
                        </div>
                      </div>
                      {/* Score Item */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100"><svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                          <span className="font-medium text-slate-700">影響力</span>
                        </div>
                        <div className="flex flex-1 items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-3/4 rounded-full bg-blue-500"></div></div>
                          <span className="min-w-[32px] text-right text-lg font-bold text-slate-800">78</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                      <div className="mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        <span className="text-sm font-medium text-slate-600">AIによる自動タグ付け</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">リーダーシップ</span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">経営戦略</span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">インタビュー</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -right-4 -top-4 z-20 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </div>
                  <div className="absolute -bottom-6 -left-6 z-0 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90 shadow-lg">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}