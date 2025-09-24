'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  const [isRedirecting, setIsRedirecting] = useState(false)



  return (
    <section className="relative overflow-hidden bg-white">
      {/* Clean professional background with subtle gradient - Figma inspired */}
      <div className="absolute inset-x-0 top-0 z-0 h-[600px] bg-gradient-to-br from-slate-50/50 to-white"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-20 md:py-24">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block leading-tight">
                  あなたの
                  <span className="ml-2 text-indigo-600">
                    隠れた強み
                  </span>
                  を発見・証明
                </span>
              </h1>

              <div className="mx-auto max-w-2xl space-y-6 text-base text-gray-600 sm:text-lg lg:mx-0">
                <p>
                  <span className="font-semibold text-gray-900">balubo</span>は、副業を探すクリエイターのためのAI分析型ポートフォリオサービスです。
                </p>
                <p>
                  作品を登録することで、強み・特徴を可視化。AIが<span className="font-medium text-indigo-600">「技術力」「創造性」「専門性」「影響力」そして「総合評価」</span>の5つの視点から分析し、
                  あなたのスキルを客観的に証明します。
                </p>
                <p>
                  また抽出されたタグデータから、親和性の高い仕事とのマッチングを実現。クリエイターと発注者のミスマッチの課題を解決し、コンテンツの力で日本全体のビジネスを加速させることを目指します。
                </p>
              </div>
              
              <p className="text-sm text-gray-500">※マッチング機能は開発中です</p>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
                <Button
                  size="lg"
                  className="w-full transform-gpu rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md sm:w-auto disabled:opacity-60"
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 sm:w-auto"
                >
                  <Link href="/login">ログイン</Link>
                </Button>
              </div>
            </div>

            {/* Right Visual - Professional Portfolio Demo */}
            <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md">
                  <div className="relative z-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">ポートフォリオ分析</h3>
                        <p className="text-sm text-gray-500">スキル評価レポート</p>
                      </div>
                    </div>

                    {/* Static Professional Report */}
                    <div className="space-y-6">
                      {/* スキル評価セクション */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          スキル評価
                        </h4>

                        {/* 技術力 */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-900">技術力</span>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1"></div>
                          </div>
                          <p className="text-xs text-gray-600 leading-tight">文章構成力が高く、表現技術も優れている</p>
                        </div>

                        {/* 創造性 */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-900">創造性</span>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1"></div>
                          </div>
                          <p className="text-xs text-gray-600 leading-tight">独自の視点から革新的なアイデアを展開</p>
                        </div>

                        {/* 専門性 */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-900">専門性</span>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1"></div>
                          </div>
                          <p className="text-xs text-gray-600 leading-tight">業界知識が深く、正確な情報提供が可能</p>
                        </div>

                        {/* 影響力 */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-900">影響力</span>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1"></div>
                          </div>
                          <p className="text-xs text-gray-600 leading-tight">読者の共感を効果的に引き起こす</p>
                        </div>
                      </div>

                      {/* タグセクション */}
                      <div className="border-t border-slate-200 pt-4">
                        <div className="mb-3 flex items-center gap-2">
                          <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">関連タグ</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">経営戦略</span>
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">インタビュー</span>
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">リーダーシップ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}