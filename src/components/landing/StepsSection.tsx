'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const steps = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M18 9v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 15v3"/><path d="M12 3v10"/></svg>
    ),
    title: '無料アカウント登録',
    description: 'メールアドレスやSNSアカウントで、わずか30秒で登録完了。すぐに利用を開始できます。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6"/><path d="m15 15-3-3-3 3"/></svg>
    ),
    title: '作品を登録',
    description: '過去の作品URLやファイルをドラッグ＆ドロップで簡単に追加。AIが自動で内容を読み取ります。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
    ),
    title: 'AI分析レポートを確認',
    description: 'AIがあなたの作品を多角的に分析し、強みや特徴を可視化したレポートを自動生成します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: '価値を証明し、繋がる',
    description: '完成したポートフォリオを公開し、最適なクライアントや案件と出会う準備が整います。',
    isComingSoon: true,
  },
]

export default function StepsSection() {
  return (
    <section className="bg-white py-20 px-4 md:py-2">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            始め方は驚くほど簡単
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            わずか数ステップで、あなたのこれまでのキャリアが、
            <br className="hidden sm:block" />
            説得力のあるポートフォリオに生まれ変わります。
          </p>
        </div>
        
        <div className="relative mt-16 md:mt-20">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200" aria-hidden="true"></div>
          
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((step, idx) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {step.isComingSoon && (
                  <div className={`absolute -top-2 right-0 md:translate-x-0 bg-blue-100/80 text-blue-600 text-xs px-4 py-2 rounded-full font-semibold shadow-sm`}>
                    Coming Soon
                  </div>
                )}
                
                {/* Circle and Icon */}
                <div className="z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-200/40 bg-white shadow-lg">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50/50">
                    {step.icon}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    <span className="mb-1 block text-sm font-semibold text-blue-500">Step {idx + 1}</span>
                    {step.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed ${step.isComingSoon ? 'text-slate-500' : 'text-slate-600'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            className="w-full max-w-xs transform-gpu rounded-2xl bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-300/30 sm:w-auto"
          >
            <Link href="/register">
              今すぐ無料で始める
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}