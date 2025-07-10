'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useScrollProgress } from '@/hooks'
import {
  ElementsSection,
  HeroSection,
  HighlightsSection,
  PainPointsSection,
  StepsSection,
  VoicesSection,
  FinalCTASection,
} from '@/components/landing'
import { NewsTicker } from '@/components/landing/NewsTicker'
import SectionDivider from '@/components/landing/SectionDivider'

function Footer() {
  return (
    <footer className="bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a 
            href="https://x.com/AiBalubo56518" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="balubo公式X（旧Twitter）アカウント（新しいタブで開く）"
            className="text-sm leading-6 text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X (Twitter)
          </a>
          <Link href="/terms" className="text-sm leading-6 text-slate-600 hover:text-slate-900">
            利用規約
          </Link>
          <Link href="/privacy" className="text-sm leading-6 text-slate-600 hover:text-slate-900">
            プライバシーポリシー
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-slate-500">
            &copy; 2025 balubo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function ScrollProgressBar() {
  const scrollProgress = useScrollProgress()
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // ログイン済みユーザーはフィードページにリダイレクト
  useEffect(() => {
    if (!loading && user) {
      router.push('/feed')
    }
  }, [user, loading, router])

  // ローディング中は何も表示しない
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-500">読み込み中...</p>
        </div>
      </div>
    )
  }

  // ログイン済みユーザーは何も表示しない（リダイレクト中）
  if (user) {
    return null
  }

  return (
    <div className="bg-white">
      {/* アクセシビリティ: キーボード操作ユーザー向けにメインコンテンツへ直接移動できるスキップリンクを追加 */}
      <a
        href="#main"
        className="sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        メインコンテンツへスキップ
      </a>
      {/* TODO: ヘッダーもコンポーネントに分離する */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2" aria-label="balubo トップページ">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">balubo</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                BETA
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-2 sm:space-x-4" aria-label="グローバルナビゲーション">
            <Button asChild variant="ghost" className="text-slate-600 hover:text-blue-500">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild className="rounded-lg bg-blue-600 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
              <Link href="/register">無料で始める</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id="main">
        <HeroSection />
        {/* ニュースティッカー */}
        <NewsTicker />
        <PainPointsSection />
        {/* PainPoints (白) → Elements (白) : 波形で軽い変化 (同系色なので subtle) */}
        <SectionDivider colorClass="text-white" heightClass="h-12" />
        <ElementsSection />
        {/* Elements (白) → Highlights (slate-50) */}
        <SectionDivider colorClass="text-slate-50" heightClass="h-16" />
        <HighlightsSection />
        {/* Highlights (slate-50) → Steps (白) */}
        <SectionDivider colorClass="text-white" flip heightClass="h-16" />
        <StepsSection />
        {/* Steps (白) → Voices (slate-50) */}
        <SectionDivider colorClass="text-slate-50" heightClass="h-16" />
        <VoicesSection />
        {/* Voices (slate-50) → Final CTA (グラデーション) はそのまま余白 */}
        <SectionDivider colorClass="text-white" flip heightClass="h-16" />
        <FinalCTASection />
      </main>

      <Footer />
      <ScrollProgressBar />
    </div>
  )
} 