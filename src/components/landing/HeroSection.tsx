'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePrefersReducedMotion } from '@/hooks'

export default function HeroSection() {
  const [animateAnalysis, setAnimateAnalysis] = useState(false)
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  // AI分析のアニメーション効果
  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = setInterval(() => {
      setAnimateAnalysis(true)
      setTimeout(() => setAnimateAnalysis(false), 2000)
    }, 5000)

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  // 分析ステップの切り替え
  useEffect(() => {
    if (prefersReducedMotion) return
    const stepInterval = setInterval(() => {
      setCurrentAnalysisStep(prev => (prev + 1) % 3)
    }, 3000)

    return () => clearInterval(stepInterval)
  }, [prefersReducedMotion])

  const analysisSteps = [
    { label: '概要', color: 'blue', content: '経営戦略をテーマにした深い洞察を提供する記事。業界の第一人者へのインタビューを通じて、読者に実践的な価値を提供' },
    { label: '強み分析', color: 'purple', content: '独自の視点から業界動向を分析し、深い経営知識と実践的なインサイトを提供' },
    { label: 'タグ生成', color: 'green', content: 'リーダーシップ、経営戦略、インタビューなどの関連タグを自動生成' }
  ]

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background elements with enhanced animation */}
      <div className="absolute inset-x-0 top-0 z-0 h-[600px] bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-20 md:py-24">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* ベータ版バッジ */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-orange-500 text-white animate-pulse">
                    BETA
                  </span>
                  <span className="text-sm font-medium text-orange-800">
                    現在ベータ版として無料でご利用いただけます
                  </span>
                </div>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block leading-tight">
                  あなたの
                  <span className="ml-2 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                    隠れた強み
                  </span>
                  を発見・証明
                </span>

              </h1>

              <div className="mx-auto max-w-2xl space-y-6 text-lg text-slate-600 sm:text-xl lg:mx-0">
                <p>
                  <span className="font-semibold text-slate-900">balubo</span>は、ライター・編集者などクリエイターのためのポートフォリオサービスです。
                </p>
                <p>
                  AIがあなたの作品を<span className="font-semibold text-blue-500">「技術力」「創造性」「専門性」「影響力」そして「総合評価」</span>の5つの視点と、
                  内容に応じたタグで分析。<br className="hidden sm:block" />
                  作品の特徴と傾向を客観的に整理します。
                </p>
                <p>
                  登録された作品全体から、<br className="hidden sm:block" />
                  <span className="font-semibold text-blue-500">あなたの傾向や得意分野</span>を把握。
                </p>
                <p>
                  整理されたポートフォリオで、スキルや経験を適切に伝え、<br className="hidden sm:block" />
                  <span className="font-semibold text-blue-500">より良い仕事の機会</span>につなげます。
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  className="w-full transform-gpu rounded-2xl bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-300/30 hover:scale-105 sm:w-auto disabled:opacity-60"
                  disabled={isRedirecting}
                  onClick={() => {
                    setIsRedirecting(true)
                    window.location.href = '/register'
                  }}
                >
                  {isRedirecting ? '読み込み中…' : (
                    <span className="inline-flex items-center">
                      無料で始める
                      <svg className="ml-2 h-5 w-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  )}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl border-2 border-blue-200/40 bg-transparent px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:bg-blue-50/30 hover:border-blue-300/60 hover:scale-105 hover:shadow-md sm:w-auto"
                >
                  <Link href="/login">ログイン</Link>
                </Button>
              </div>
            </div>

            {/* Right Visual - Enhanced Interactive AI Demo */}
            <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className={`relative z-10 rounded-3xl border border-blue-200/30 bg-white/90 p-8 shadow-xl backdrop-blur-sm sm:p-10 transition-all duration-500 ${animateAnalysis ? 'scale-105 shadow-2xl' : ''}`}>
                    <div className={`absolute right-4 top-4 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 ${animateAnalysis ? 'animate-pulse bg-green-500' : ''}`}>
                      {animateAnalysis ? 'Analyzing...' : 'AI Analysis'}
                    </div>
                    
                    <div className="mb-6 flex items-center gap-4">
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg transition-all duration-300 ${animateAnalysis ? 'animate-spin' : ''}`}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">AI分析結果</h3>
                        <p className="text-sm text-slate-500">自動生成レポート</p>
                      </div>
                    </div>

                    {/* Dynamic Content Based on Current Step */}
                    <div className="min-h-[300px]" aria-live="polite" aria-atomic="true">
                      {currentAnalysisStep === 0 && (
                        <div className="animate-fadeIn">
                          {/* 概要セクション */}
                          <div className="mb-6 bg-blue-50 rounded-lg p-4 transition-all duration-500 transform">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              概要
                            </h4>
                            <p className="text-xs text-blue-800 leading-relaxed">
                              経営戦略に関するインタビュー記事。業界の専門知識と実践的な洞察を提供する内容
                            </p>
                          </div>
                        </div>
                      )}

                      {currentAnalysisStep === 1 && (
                        <div className="animate-fadeIn">
                          {/* 強み分析セクション */}
                          <div className="mb-6 space-y-3">
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">強み分析</h4>
                            
                            {/* 創造性 */}
                            <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded transition-all duration-300 hover:bg-purple-100">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-purple-800">創造性</span>
                              </div>
                              <p className="text-xs text-purple-700 leading-tight">
                                独自の視点から業界動向を分析
                              </p>
                            </div>

                            {/* 専門性 */}
                            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-3 rounded transition-all duration-300 hover:bg-emerald-100">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <span className="text-xs font-medium text-emerald-800">専門性</span>
                              </div>
                              <p className="text-xs text-emerald-700 leading-tight">
                                専門知識に基づいた記事の構成
                              </p>
                            </div>

                            {/* 影響力 */}
                            <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded transition-all duration-300 hover:bg-orange-100">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                <span className="text-xs font-medium text-orange-800">影響力</span>
                              </div>
                              <p className="text-xs text-orange-700 leading-tight">
                                読者の課題解決に寄与する内容
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentAnalysisStep === 2 && (
                        <div className="animate-fadeIn">
                          <div className="border-t border-slate-200 pt-6">
                            <div className="mb-3 flex items-center gap-2">
                              <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                              <span className="text-sm font-medium text-slate-600">AIによる自動タグ付け</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 animate-fadeIn transition-all duration-300 hover:bg-blue-200">リーダーシップ</span>
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 animate-fadeIn transition-all duration-300 hover:bg-blue-200" style={{ animationDelay: '0.2s' }}>経営戦略</span>
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 animate-fadeIn transition-all duration-300 hover:bg-blue-200" style={{ animationDelay: '0.4s' }}>インタビュー</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}