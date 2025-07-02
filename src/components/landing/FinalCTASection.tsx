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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-white py-20 px-4 sm:py-24">
      <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_15%_20%,_rgba(59,130,246,0.08)_0%,_transparent_40%)]"></div>
      <div className="absolute bottom-0 right-0 h-full w-full bg-[radial-gradient(circle_at_85%_80%,_rgba(99,162,255,0.05)_0%,_transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)]"></div>
      
      <div className="container relative z-10 mx-auto max-w-4xl">
        {/* メッセージ部分 */}
        <div className="text-center">
          <div className="space-y-8">
            <div className="space-y-6">
              {/* プレヘッダー */}
              <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-4">メッセージ</p>
              <h2 className="text-3xl font-bold leading-tight text-slate-800 md:text-5xl">
                <span className="block">駆け抜けてきた</span>
                <span className="block bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                  挑戦の軌跡を証明する。
                </span>
              </h2>
              
              <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-slate-600 md:text-xl">
                <p>
                  あなたが歩んできた創作の一歩一歩は、すべてが<strong className="font-semibold">あなた自身の物語</strong>です。
                </p>

                <p>
                  夜を徹して磨き上げた原稿、締切と戦いながら完成させた作品、
                  <br className="hidden md:block" />
                  試行錯誤の末に生まれたインスピレーションの欠片たち。
                </p>

                <p>
                  <span className="font-semibold text-blue-600">その軌跡を「流れ去る思い出」にせず、</span>
                  <br className="hidden md:block" />
                  <span className="font-semibold text-blue-600">&quot;資産&quot;として未来へ繋げよう。</span>
                </p>

                <p className="mt-8 text-xl font-medium text-slate-700 md:text-2xl">
                  いまこそ、あなたのクリエイティビティを世界に示すときです。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 md:gap-12">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-200/30 bg-white/90 shadow-xl">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-500">努力の蓄積</span>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-200/30 bg-white/90 shadow-xl">
                  <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-500">価値の発見</span>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-200/30 bg-white/90 shadow-xl">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-500">世界への証明</span>
              </div>
            </div>

            <div className="pt-12">
              <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-8">
                <blockquote className="text-xl font-light italic leading-relaxed text-slate-700 md:text-2xl">
                  &ldquo;あなたが積み重ねてきた一つひとつの作品は、
                  <br className="hidden md:block" />
                  かけがえのない創作の軌跡です。&rdquo;
                </blockquote>
                <div className="mt-4 text-sm text-slate-500">
                  — balubo チーム一同
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 区切り */}
        <div className="flex justify-center py-16 md:py-10">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        </div>

        {/* CTA部分 */}
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            あなたの才能は、まだ見ぬ
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              可能性に満ちています
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            baluboで、その扉を開きませんか？
            <br className="hidden sm:block" />
            新しい自分、新しい仕事、新しい仲間が、あなたを待っています。
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              asChild
              size="lg"
              className="w-full max-w-xs transform-gpu rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl sm:w-auto"
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100/80 shadow-sm">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium text-slate-600">{feature.text}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-16">
            <div className="rounded-3xl border border-blue-200/30 bg-white/90 p-8 backdrop-blur-sm shadow-lg">
              <p className="text-lg italic text-slate-600">
                &ldquo;あなたのクリエイティビティを、世界はまだ知らない&rdquo;
              </p>
              <p className="mt-2 text-sm text-slate-500">
                — 今日から、それを変えてみませんか？
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 