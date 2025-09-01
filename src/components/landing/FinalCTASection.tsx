'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: '完全無料',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: '1分で登録完了',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    text: 'すぐにAI分析開始',
  },
]

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 px-4 sm:py-24">
      
      <div className="container relative z-10 mx-auto max-w-4xl">
        {/* メッセージセクション削除済み */}

        {/* 区切り */}
        <div className="flex justify-center py-16 md:py-10">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        </div>

        {/* CTA部分 */}
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            あなたの才能は、まだ見ぬ
            <br />
            <span className="text-blue-600">
              可能性に満ちています
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            baluboで、その扉を開きませんか？
            <br className="hidden sm:block" />
            新しい自分、新しい仕事、新しい仲間が、あなたを待っています。
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              asChild
              size="lg"
              className="w-full max-w-xs transform-gpu rounded-lg bg-gray-900 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl sm:w-auto"
            >
              <Link href="/register">
                今すぐbaluboを始める
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white shadow-sm">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium text-gray-600">{feature.text}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-16">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
              <p className="text-lg italic text-gray-600">
                &ldquo;あなたのクリエイティビティを、世界はまだ知らない&rdquo;
              </p>
              <p className="mt-2 text-sm text-gray-500">
                — 今日から、それを変えてみませんか？
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 