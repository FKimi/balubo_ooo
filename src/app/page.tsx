'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import {
  HeroSection,
  ReasonsSection,
  HighlightsSection,
  PainPointsSection,
  SolutionSection,
  ElementsSection,
  StepsSection,
} from '@/components/landing'



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
      <div className="min-h-screen bg-base-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">読み込み中...</p>
        </div>
      </div>
    )
  }

  // ログイン済みユーザーは何も表示しない（リダイレクト中）
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-base-white">
      {/* ヘッダー */}
      <header className="border-b border-border-color bg-base-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-accent-dark-blue">balubo</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-text-secondary hover:text-accent-dark-blue">
                ログイン
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-accent-dark-blue hover:bg-primary-blue font-medium">
                無料で始める
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 新ヒーローセクション */}
      <HeroSection />


      {/* 新3つの理由セクション */}
      <ReasonsSection />

      {/* 悩みセクション */}
      <PainPointsSection />

      {/* AIで解決セクション */}
      <SolutionSection />

      {/* AI要素分析セクション */}
      <ElementsSection />

      {/* balubo の特徴セクション */}
      <HighlightsSection />

      

      {/* 利用開始ステップセクション */}
      <StepsSection />





      {/* 10. 最終CTA（行動喚起）セクション */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent-dark-blue via-primary-blue to-primary-light-blue">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              あなたの才能は、まだ見ぬ<br />
              可能性に満ちています
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              baluboで、その扉を開きませんか？<br />
              新しい自分、新しい仕事、新しい仲間が、<br />
              あなたを待っています。
            </p>

            <div className="bg-white/10 rounded-2xl p-8 mb-8 backdrop-blur-sm">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">AI分析</div>
                  <div className="text-sm opacity-80">あなたの隠れた強みを発見</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">ポートフォリオ</div>
                  <div className="text-sm opacity-80">伝わる作品集に進化</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">新しい出会い</div>
                  <div className="text-sm opacity-80">質の高いつながりを構築</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Link href="/register">
                <Button size="lg" className="bg-white text-accent-dark-blue hover:bg-base-light-gray text-xl px-12 py-6 font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  今すぐbaluboを始める
                </Button>
              </Link>
              
              <div className="flex items-center justify-center space-x-4 text-sm opacity-80">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  完全無料
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  1分で登録完了
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  すぐにAI分析開始
                </div>
              </div>
            </div>

            {/* 追加メッセージ */}
            <div className="mt-12 opacity-90">
              <p className="text-lg italic">
                &ldquo;あなたのクリエイティビティを、世界はまだ知らない&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-ui-background-gray py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center space-x-8 mb-4">
            <Link href="/terms" className="text-text-secondary hover:text-accent-dark-blue">
              利用規約
            </Link>
            <Link href="/privacy" className="text-text-secondary hover:text-accent-dark-blue">
              プライバシーポリシー
            </Link>
          </div>
          <p className="text-text-tertiary text-sm">
            © 2025 balubo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 