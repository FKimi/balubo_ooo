"use client"

import { useStaggeredAnimation } from '@/hooks'
import React from 'react'

interface Step {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    number: 'STEP 1',
    title: '無料登録',
    description: 'メールアドレスまたはソーシャルログインですぐにアカウントを作成できます。',
    icon: (
      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0l4-4m-4 4l4 4" />
      </svg>
    ),
  },
  {
    number: 'STEP 2',
    title: '作品を追加',
    description: '記事・写真・デザインなど、ドラッグ＆ドロップで簡単にアップロード。',
    icon: (
      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: 'STEP 3',
    title: 'ポートフォリオ公開',
    description: 'AIが分析した魅力とともに、URLひとつでシェアできるポートフォリオが完成。',
    icon: (
      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function StepsSection() {
  const { ref, visibleItems } = useStaggeredAnimation(steps.length, 250)

  return (
    <section className="bg-slate-50 py-20 px-4 md:py-28">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">baluboをはじめる「3つのステップ」</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">登録からポートフォリオ公開まで、かんたん「3ステップ」でスタートできます。</p>
        </div>

        <div ref={ref} className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-700 ease-out ${
                visibleItems.includes(idx) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              } hover:scale-105 hover:shadow-xl`}
              style={{ transitionDelay: `${idx * 250}ms` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  {step.icon}
                </div>
                <div>
                  <span className="text-sm font-semibold text-indigo-600">{step.number}</span>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{step.title}</h3>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-base flex-grow">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}