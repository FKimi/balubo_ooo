'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
  ElementsSection,
  HeroSection,
  HighlightsSection,
  PainPointsSection,
  StepsSection,
  VoicesSection,
  FinalCTASection,
} from '@/components/landing'
import SectionDivider from '@/components/landing/SectionDivider'

function Footer() {
  return (
    <footer className="bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
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
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
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
      {/* TODO: ヘッダーもコンポーネントに分離する */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-800">balubo</h1>
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button asChild variant="ghost" className="text-slate-600 hover:text-blue-600">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild className="rounded-lg bg-blue-600 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
              <Link href="/register">無料で始める</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        {/* HeroとPainPoints間の区切り (シンプル余白) */}
        <div className="h-10 bg-white" />
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
    </div>
  )
} 