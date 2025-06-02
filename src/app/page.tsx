'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

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
      <header className="border-b border-border-color bg-base-white">
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
              <Button className="bg-accent-dark-blue hover:bg-primary-blue">
                新規登録
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
            クリエイターのための<br />
            <span className="text-accent-dark-blue">キャリアSNS</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed">
            AIで作品を分析・可視化し、他のクリエイターと双方向の「つながり」を築ける。<br />
            あなたの創造性を最大限に発揮し、お互いを高め合える場所。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-8 py-3">
                無料で始める
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                詳しく見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-4 bg-base-light-gray">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold text-center text-text-primary mb-12">
            baluboの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">AI分析で強みを可視化</CardTitle>
                <CardDescription>
                  作品をAIが分析し、あなたの強みや特徴を客観的に言語化。自己理解を深めて魅力的なポートフォリオを作成できます。
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">クリエイター同士のつながり</CardTitle>
                <CardDescription>
                  双方向承認型のつながり機能で、信頼できるクリエイターネットワークを構築。お互いの活動から刺激を受け合えます。
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-light-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">タグベースレビュー</CardTitle>
                <CardDescription>
                  他のクリエイターからタグ形式で評価を受けることで、多角的なフィードバックと信頼を獲得できます。
                </CardDescription>
              </CardHeader>
            </Card>
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
            © 2024 balubo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 