'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useStaggeredAnimation } from '@/hooks'

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
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-slate-400"><path d="M18 9v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 15v3"/><path d="M12 3v10"/></svg>
    ),
    title: 'クライアントとの出会い',
    description: '説得力のあるポートフォリオを通じて、あなたのスキルにマッチした最適な案件と出会えます。',
    isComingSoon: true,
  },
]

export default function StepsSection() {
  const { ref, visibleItems } = useStaggeredAnimation(steps.length, 300)

  return (
    <section className="bg-white py-20 px-4 md:py-1">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            簡単3ステップで始める
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            複雑な設定は一切不要。今すぐ始めて、
            <br className="hidden sm:block" />
            あなたの作品の真の価値を発見しましょう。
          </p>
        </div>
        
        <div ref={ref} className="relative mt-16 md:mt-20">
          {/* Connecting line - animates based on visible items */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200" aria-hidden="true">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-1000 ease-out"
              style={{ 
                width: `${(visibleItems.length / steps.length) * 100}%` 
              }}
            />
          </div>
          
          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            {steps.map((step, idx) => (
              <div 
                key={step.title} 
                className={`relative flex flex-col items-center text-center transition-all duration-700 ease-out ${
                  visibleItems.includes(idx) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${idx * 150}ms` 
                }}
              >
                {step.isComingSoon && (
                  <div className={`absolute -top-2 right-0 md:translate-x-0 bg-blue-100/80 text-blue-600 text-xs px-4 py-2 rounded-full font-semibold shadow-sm transition-all duration-300 ${
                    visibleItems.includes(idx) ? 'animate-pulse' : ''
                  }`}>
                    Coming Soon
                  </div>
                )}
                
                {/* Circle and Icon */}
                <div className={`z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-200/40 bg-white shadow-lg transition-all duration-500 ${
                  visibleItems.includes(idx) 
                    ? 'scale-100 shadow-xl hover:scale-105' 
                    : 'scale-90'
                } ${step.isComingSoon ? 'border-slate-200 bg-slate-50' : 'hover:shadow-blue-200/30'}`}>
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${
                    step.isComingSoon ? 'bg-slate-100' : 'bg-blue-50/50 hover:bg-blue-100/70'
                  }`}>
                    {step.icon}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className={`text-lg font-bold transition-all duration-300 ${
                    step.isComingSoon ? 'text-slate-500' : 'text-slate-800'
                  }`}>
                    <span className={`mb-1 block text-sm font-semibold transition-all duration-300 ${
                      visibleItems.includes(idx) && !step.isComingSoon 
                        ? 'text-blue-500' 
                        : 'text-slate-400'
                    }`}>
                      Step {idx + 1}
                    </span>
                    {step.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed transition-all duration-300 ${
                    step.isComingSoon ? 'text-slate-500' : 'text-slate-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center md:mt-20">
          <Button
            asChild
            size="lg"
            className="transform-gpu rounded-2xl bg-blue-500 px-12 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-300/30 hover:scale-105"
          >
            <Link href="/register">
              今すぐ無料で始める
              <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Button>
          <p className="mt-4 text-sm text-slate-500">
            アカウント登録は無料・クレジットカード不要
          </p>
        </div>
      </div>
    </section>
  )
}