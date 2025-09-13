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
import { Footer as SharedFooter } from '@/components/layout/Footer'

// Footer moved to shared component

function ScrollProgressBar() {
  const scrollProgress = useScrollProgress()
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gray-900 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // ログイン済みユーザーはプロフィールページにリダイレクト
  useEffect(() => {
    if (!loading && user) {
      router.push('/profile')
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
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2" aria-label="balubo トップページ">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">balubo</span>
            </div>
          </Link>
          <nav className="flex items-center space-x-2 sm:space-x-4" aria-label="グローバルナビゲーション">
            <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild className="rounded-lg bg-gray-900 font-medium text-white shadow-sm transition-colors hover:bg-gray-800">
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

      <SharedFooter />
      <ScrollProgressBar />
    </div>
  )
} 