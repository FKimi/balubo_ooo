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

      {/* 1. ファーストビュー (FV) */}
      <section className="py-24 px-4 bg-gradient-to-br from-base-white via-base-light-gray to-primary-light-blue/10">
        <div className="container mx-auto text-center max-w-5xl">
          {/* 共感・課題提起 */}
          <div className="mb-8">
            <p className="text-lg text-text-secondary font-medium mb-2">
              &ldquo;私の強み、もっと伝わればいいのに…&rdquo;
            </p>
            <p className="text-base text-text-tertiary">
              そう感じていませんか？
            </p>
          </div>

          {/* メインキャッチコピー */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
            その才能、<span className="text-accent-dark-blue">AIが言語化</span>。<br />
            <span className="text-primary-blue">balubo</span>で、まだ見ぬキャリアへ。
          </h1>

          {/* サブキャッチコピー */}
          <p className="text-lg md:text-xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto">
            作品をアップするだけで、AIがあなたの強みを発見し言語化。<br />
            ポートフォリオが進化し、新しい仕事と仲間との出会いが始まります。
          </p>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register">
              <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                AIで自分の才能を分析する
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-accent-dark-blue text-accent-dark-blue hover:bg-accent-dark-blue hover:text-white transition-all duration-300">
              サービスを詳しく見る
            </Button>
          </div>

          {/* メインビジュアル（アイコンによる表現） */}
          <div className="flex justify-center items-center space-x-8 opacity-70">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-light-blue/20 rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-accent-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-sm text-text-tertiary">作品投稿</span>
            </div>
            <div className="hidden sm:block">
              <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-light-blue/20 rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-accent-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-sm text-text-tertiary">AI分析</span>
            </div>
            <div className="hidden sm:block">
              <svg className="w-8 h-8 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-light-blue/20 rounded-full flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-accent-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm text-text-tertiary">新たな出会い</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 課題提起・共感セクション */}
      <section className="py-20 px-4 bg-base-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              baluboで、あなたのクリエイター人生が変わる<br />
              <span className="text-accent-dark-blue">3つの理由</span>
            </h2>
            <p className="text-lg text-text-secondary">
              これまでにない新しい体験が、あなたを待っています
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* ベネフィット1: AI分析で強みの発見 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-dark-blue to-primary-blue rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning-yellow rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                AIがあなたの&ldquo;隠れた強み&rdquo;を発見
              </h3>
              
              <p className="text-text-secondary leading-relaxed mb-6">
                作品をアップするだけで、AIがあなたの作風、得意分野、潜在的なスキルまで客観的に分析。今まで気づかなかった自分の価値に、きっと驚くはず。
              </p>
              
              <div className="bg-base-light-gray rounded-lg p-4">
                <p className="text-sm text-text-tertiary italic">
                  &ldquo;自分では当たり前だと思っていたことが、実は大きな強みだったんですね！&rdquo;
                </p>
              </div>
            </div>

            {/* ベネフィット2: ポートフォリオの進化 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-blue to-primary-light-blue rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-green rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">2</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                &ldquo;見せる&rdquo;ポートフォリオから、<br />
                &ldquo;伝わる&rdquo;ポートフォリオへ
              </h3>
              
              <p className="text-text-secondary leading-relaxed mb-6">
                AI分析が加わることで、あなたの作品はただの作品集ではなく、あなたの思考やスキルを雄弁に語る強力なツールに進化します。
              </p>
              
              <div className="bg-base-light-gray rounded-lg p-4">
                <p className="text-sm text-text-tertiary italic">
                  &ldquo;ポートフォリオを見た人から『こんな視点があったんですね』と言われるように！&rdquo;
                </p>
              </div>
            </div>

            {/* ベネフィット3: 質の高い出会い */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-success-green to-info-blue rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-info-blue rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                もう&ldquo;待ち&rdquo;の姿勢は終わり。<br />
                質の高い&ldquo;出会い&rdquo;を引き寄せる
              </h3>
              
              <p className="text-text-secondary leading-relaxed mb-6">
                あなたの才能を本当に理解してくれる企業や、刺激し合える仲間と、baluboで繋がりましょう。新しいチャンスが向こうからやってきます。
              </p>
              
              <div className="bg-base-light-gray rounded-lg p-4">
                <p className="text-sm text-text-tertiary italic">
                  &ldquo;想像もしていなかった分野から声をかけていただけました！&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link href="/register">
              <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                今すぐ体験してみる
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. 主要機能紹介セクション */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent-dark-blue/5 via-base-light-gray to-primary-light-blue/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              baluboだけの、<span className="text-accent-dark-blue">AI体験</span>をあなたに
            </h2>
            <p className="text-lg text-text-secondary">
              これまでにない新しい機能で、あなたのクリエイティビティを最大限に引き出します
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* 機能1: AI作品分析 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-dark-blue to-primary-blue rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    あなたの作品、AIが徹底解剖！
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    アップロードするだけで、色使いの傾向から表現スタイル、得意とするテーマまでAIが多角的に分析。自分では言語化できなかった作品の魅力を再発見できます。
                  </p>
                  <div className="bg-base-light-gray rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">分析例：</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• 作風：&ldquo;温かみのある親しみやすいトーン&rdquo;</li>
                      <li>• 得意分野：&ldquo;ライフスタイル・グルメ系コンテンツ&rdquo;</li>
                      <li>• 潜在スキル：&ldquo;感情に訴える表現力&rdquo;</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 機能2: AI強み言語化 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-light-blue rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    AIがあなたの&ldquo;キャッチコピー&rdquo;を生成
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    経歴や作品から、あなたのユニークな強みをAIが発見し、魅力的な自己紹介文やスキルタグを提案。もう自己PRに悩む必要はありません。
                  </p>
                  <div className="bg-base-light-gray rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">生成例：</h4>
                    <div className="text-sm text-text-secondary">
                      <p className="mb-2">&ldquo;読者の心に響く、ストーリーテリングのスペシャリスト&rdquo;</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-accent-dark-blue/10 text-accent-dark-blue px-2 py-1 rounded-full text-xs">感情表現</span>
                        <span className="bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full text-xs">共感力</span>
                        <span className="bg-success-green/10 text-success-green px-2 py-1 rounded-full text-xs">体験重視</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 機能3: SNS機能 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-success-green to-info-blue rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    信頼できるクリエイターコミュニティ
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    他のクリエイターの作品から刺激を受けたり、フィードバックを交換したり、自分の作品を気軽にシェアできる場。質の高いつながりを築けます。
                  </p>
                  <div className="bg-base-light-gray rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">できること：</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• 双方向承認でのつながり形成</li>
                      <li>• タグベースでの相互レビュー</li>
                      <li>• 他クリエイターの活動をフィードで確認</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 機能4: スマートポートフォリオ */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-warning-yellow to-info-blue rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    AI統合型スマートポートフォリオ
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6">
                    作品を投稿・整理しやすく、AI分析結果も統合された、見やすく魅力的なポートフォリオが簡単に作成・管理できます。
                  </p>
                  <div className="bg-base-light-gray rounded-lg p-4">
                    <h4 className="font-semibold text-text-primary mb-2">特徴：</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• レスポンシブ対応の美しいレイアウト</li>
                      <li>• AI分析結果の自動統合表示</li>
                      <li>• カスタマイズ可能な公開設定</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-lg text-text-secondary mb-6">
              これらの機能を、<span className="font-semibold text-accent-dark-blue">完全無料</span>でお試しいただけます
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                無料でAI機能を体験する
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. 利用者の声セクション */}
      <section className="py-20 px-4 bg-base-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              すでにbaluboを体験した<br />
              <span className="text-accent-dark-blue">クリエイターの声</span>
            </h2>
            <p className="text-lg text-text-secondary">
              実際に使ってみた方々の、リアルな体験談をお聞きください
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 体験談1: フリーランスデザイナー */}
            <div className="bg-gradient-to-br from-base-light-gray to-primary-light-blue/10 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-dark-blue to-primary-blue rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">A.Tanaka さん</h4>
                  <p className="text-sm text-text-secondary">フリーランスデザイナー</p>
                </div>
              </div>
              
              <blockquote className="text-text-secondary leading-relaxed mb-4">
                <svg className="w-6 h-6 text-accent-dark-blue mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
                baluboのAI分析は衝撃でした！自分のデザインの傾向を客観的な言葉で示してくれて、クライアントへの提案にも自信が持てるように。もっと早く出会いたかった！
              </blockquote>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-accent-dark-blue/10 text-accent-dark-blue px-3 py-1 rounded-full text-xs font-medium">自己理解深化</span>
                <span className="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-xs font-medium">提案力向上</span>
              </div>
            </div>

            {/* 体験談2: 副業ライター */}
            <div className="bg-gradient-to-br from-base-light-gray to-success-green/10 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-success-green to-info-blue rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">K.Sato さん</h4>
                  <p className="text-sm text-text-secondary">副業ライター</p>
                </div>
              </div>
              
              <blockquote className="text-text-secondary leading-relaxed mb-4">
                <svg className="w-6 h-6 text-success-green mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
                作品を登録しておくだけで、AIが強みをまとめてくれるのが本当に助かります。おかげで新しいジャンルの執筆依頼も舞い込むようになりました！
              </blockquote>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-success-green/10 text-success-green px-3 py-1 rounded-full text-xs font-medium">作業効率化</span>
                <span className="bg-info-blue/10 text-info-blue px-3 py-1 rounded-full text-xs font-medium">新規案件獲得</span>
              </div>
            </div>

            {/* 体験談3: 動画クリエイター */}
            <div className="bg-gradient-to-br from-base-light-gray to-warning-yellow/10 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-warning-yellow to-info-blue rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">M.Yamada さん</h4>
                  <p className="text-sm text-text-secondary">動画クリエイター</p>
                </div>
              </div>
              
              <blockquote className="text-text-secondary leading-relaxed mb-4">
                <svg className="w-6 h-6 text-warning-yellow mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
                クリエイター同士のつながりが本当に価値ある！他の方の作品から刺激を受けて、自分の表現の幅も広がりました。質の高いコミュニティです。
              </blockquote>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-warning-yellow/10 text-warning-yellow px-3 py-1 rounded-full text-xs font-medium">コミュニティ</span>
                <span className="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-xs font-medium">表現力向上</span>
              </div>
            </div>
          </div>

          {/* 追加の声 */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-accent-dark-blue/5 rounded-full px-6 py-3">
              <svg className="w-5 h-5 text-accent-dark-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-accent-dark-blue font-medium">ユーザー満足度 94%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 利用開始ステップセクション */}
      <section className="py-20 px-4 bg-gradient-to-br from-base-light-gray via-primary-light-blue/5 to-base-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              最短1分！<span className="text-accent-dark-blue">balubo</span>で<br />
              新しいキャリアを始めよう
            </h2>
            <p className="text-lg text-text-secondary">
              必要なのは<span className="font-semibold text-accent-dark-blue">メールアドレスだけ</span>。カンタン3ステップで完了！
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {/* ステップ1 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent-dark-blue to-primary-blue rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-warning-yellow rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  無料アカウント登録
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  メールアドレスで簡単登録。<br />
                  SNS認証も利用可能です。
                </p>
              </div>

              {/* ステップ2 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-blue to-primary-light-blue rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-success-green rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  プロフィール&作品投稿
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  基本情報を入力して、<br />
                  お気に入りの作品をアップロード。
                </p>
              </div>

              {/* ステップ3 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-success-green to-info-blue rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-info-blue rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">3</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  AI分析&オファー受信！
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  AIがあなたを分析開始！<br />
                  新しい出会いとチャンスが待っています。
                </p>
              </div>
            </div>
          </div>

          {/* 追加情報 */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-success-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-text-primary">すべて無料</span>
              </div>
              <p className="text-text-secondary mb-6">
                登録料、月額費用、すべて無料。クリエイターの皆様に気軽にお試しいただけます。
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  今すぐ無料で始める
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 開発者の想いセクション */}
      <section className="py-20 px-4 bg-base-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              クリエイターの努力が報われる場所を創りたい
            </h2>
            <p className="text-lg text-text-secondary">
              開発者からのメッセージ
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-base-light-gray to-primary-light-blue/10 rounded-3xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
                {/* 開発者プロフィール画像部分 */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-accent-dark-blue to-primary-blue rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-4xl font-bold text-white">君</span>
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="font-bold text-text-primary">君和田 文也</h3>
                    <p className="text-sm text-text-secondary">balubo 開発者</p>
                    <p className="text-xs text-text-tertiary">編集者・ライター</p>
                  </div>
                </div>

                {/* メッセージ部分 */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg relative">
                    {/* 吹き出しの矢印 */}
                    <div className="absolute left-0 top-8 transform -translate-x-2 w-0 h-0 border-t-[8px] border-b-[8px] border-r-[12px] border-t-transparent border-b-transparent border-r-white"></div>
                    
                    <div className="space-y-4 text-text-secondary leading-relaxed">
                      <p>
                        こんにちは、balubo開発者の君和田です。
                      </p>
                      
                      <p>
                        編集者として多くの素晴らしいクリエイターと仕事をする中で、<br />
                        <span className="font-semibold text-accent-dark-blue">&ldquo;もっとこの人の才能が正しく評価されればいいのに&rdquo;</span><br />
                        と常に感じていました。
                      </p>
                      
                      <p>
                        クリエイターの皆さんは、作品を生み出すことには長けていても、<br />
                        <span className="text-text-primary font-medium">自分の価値を言語化し、適切にアピールすること</span>には<br />
                        苦手意識を持つ方が多いように思います。
                      </p>
                      
                      <p>
                        baluboは、そんなクリエイター一人ひとりの努力と経験が、<br />
                        AIの力で確かな<span className="font-semibold text-success-green">&ldquo;信頼&rdquo;</span>となり、<br />
                        新しいチャンスへと繋がる場所です。
                      </p>
                      
                      <p className="text-accent-dark-blue font-semibold">
                        あなたの作品に込められた想いを、<br />
                        私たちは全力でサポートします。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ビジョン */}
          <div className="text-center mt-16">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-text-primary mb-6">
                私たちのビジョン
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-accent-dark-blue/5 rounded-xl p-6">
                  <div className="w-12 h-12 bg-accent-dark-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">実力ある人が評価される未来</h4>
                  <p className="text-sm text-text-secondary">
                    成長意欲の高い人やより実力ある人が、正当に評価・信頼される社会を目指します。
                  </p>
                </div>
                
                <div className="bg-primary-blue/5 rounded-xl p-6">
                  <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">努力の軌跡を証明できる場所</h4>
                  <p className="text-sm text-text-secondary">
                    クリエイターの努力の軌跡を記録し、それが確かな価値として認められる場所を提供します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. よくある質問（FAQ）セクション */}
      <section className="py-20 px-4 bg-base-light-gray">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              よくある質問
            </h2>
            <p className="text-lg text-text-secondary">
              baluboについて、よく寄せられる質問にお答えします
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-dark-blue transition-colors">
                  本当に無料で利用できますか？
                </h3>
                <svg className="w-5 h-5 text-text-tertiary group-hover:text-accent-dark-blue transition-all duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-border-color">
                <p className="text-text-secondary leading-relaxed">
                  はい、baluboは完全無料でご利用いただけます。登録料、月額費用、機能利用料など、一切の費用はかかりません。クリエイターの皆様に気軽にお試しいただき、価値を感じていただくことを最優先にしています。
                </p>
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-dark-blue transition-colors">
                  AIはどんな作品を分析できますか？
                </h3>
                <svg className="w-5 h-5 text-text-tertiary group-hover:text-accent-dark-blue transition-all duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-border-color">
                <p className="text-text-secondary leading-relaxed">
                  現在、テキストベースの作品（記事、コピー、企画書など）を中心に分析を行っています。画像や動画作品の場合は、作品の説明文や制作背景から分析を行います。今後、より多様な形式の作品に対応予定です。
                </p>
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-dark-blue transition-colors">
                  作品や個人情報のセキュリティは大丈夫ですか？
                </h3>
                <svg className="w-5 h-5 text-text-tertiary group-hover:text-accent-dark-blue transition-all duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-border-color">
                <p className="text-text-secondary leading-relaxed">
                  セキュリティを最重要視しています。すべてのデータは暗号化されて保存され、厳格なアクセス制御のもと管理されています。また、作品の公開範囲は細かく設定でき、非公開での利用も可能です。個人情報の取り扱いについても、プライバシーポリシーに従って適切に管理いたします。
                </p>
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-dark-blue transition-colors">
                  必ず仕事の依頼がくるのでしょうか？
                </h3>
                <svg className="w-5 h-5 text-text-tertiary group-hover:text-accent-dark-blue transition-all duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-border-color">
                <p className="text-text-secondary leading-relaxed">
                  baluboは仕事の確約をするサービスではありません。しかし、AI分析により自分の強みを明確にし、魅力的なポートフォリオを作成することで、より多くの機会につながりやすくなります。現在は主にクリエイター同士のネットワーキングに焦点を当てており、将来的に企業とのマッチング機能も予定しています。
                </p>
              </div>
            </details>

            {/* FAQ 5 */}
            <details className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-dark-blue transition-colors">
                  どんなクリエイターが利用していますか？
                </h3>
                <svg className="w-5 h-5 text-text-tertiary group-hover:text-accent-dark-blue transition-all duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-border-color">
                <p className="text-text-secondary leading-relaxed">
                  ライター、編集者、デザイナー、カメラマン、動画クリエイターなど、幅広い分野のクリエイターにご利用いただいています。フリーランス、副業、転職を検討中の方まで、経験やキャリアステージも様々です。共通しているのは、自分の価値をより効果的に伝えたいという想いを持つ方々です。
                </p>
              </div>
            </details>
          </div>

          {/* 追加の案内 */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                他にもご質問がございましたら
              </h3>
              <p className="text-text-secondary mb-6">
                お気軽にお問い合わせください。クリエイターの皆様のご質問にお答えいたします。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="border-2 border-accent-dark-blue text-accent-dark-blue hover:bg-accent-dark-blue hover:text-white">
                  お問い合わせ
                </Button>
                <Link href="/register">
                  <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue">
                    まずは無料で体験する
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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