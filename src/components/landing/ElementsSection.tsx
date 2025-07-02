'use client'

import React from 'react'
import { useStaggeredAnimation } from '@/hooks'

const elements = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
    ),
    title: '創造性',
    subtitle: 'オリジナリティ',
    description: '作品の独創性や新しい視点を分析し、他者との差別化ポイントを明確化します。',
    color: 'purple',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3"/><path d="M10 10.3c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3"/><path d="M10 10.3c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3"/><path d="m2.8 15.1.7-1.2 1.2.7-1.2.7-.7-1.2Zm1.5-8.2.7-1.2 1.2.7-1.2.7-.7-1.2Zm8.9 4.3.7-1.2 1.2.7-1.2.7-.7-1.2Z"/></svg>
    ),
    title: '専門性',
    subtitle: 'クオリティ',
    description: '専門知識や技術的熟練度を評価し、作品の完成度を客観的に測定します。',
    color: 'emerald',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M10 17a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v5a5 5 0 0 0 5 5h3Z"/><path d="M21 17a5 5 0 0 0 0-10h-1a5 5 0 0 0-5 5v3a5 5 0 0 0 5 5h1Z"/></svg>
    ),
    title: '影響力',
    subtitle: 'エンゲージメント',
    description: '作品が読者や視聴者に与える影響や共感を分析し、人の心を動かす力を可視化します。',
    color: 'orange',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="m7 21 5-5 5 5"/><path d="m7 14 5-5 5 5"/></svg>
    ),
    title: '技術力',
    subtitle: 'スキル',
    description: 'コード品質や実装スキルなど技術面を分析し、あなたの強みを明確化します。',
    color: 'sky',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l3 3"/></svg>
    ),
    title: '総合評価',
    subtitle: 'バランス',
    description: '4つの指標を統合し、作品の総合的な価値を分かりやすく言語化します。',
    color: 'rose',
  },
]

const colorClasses = {
  purple: 'border-purple-200/40 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-300/60',
  emerald: 'border-emerald-200/40 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-300/60',
  orange: 'border-orange-200/40 bg-orange-50/50 hover:bg-orange-100/70 hover:border-orange-300/60',
  sky: 'border-sky-200/40 bg-sky-50/50 hover:bg-sky-100/70 hover:border-sky-300/60',
  rose: 'border-rose-200/40 bg-rose-50/50 hover:bg-rose-100/70 hover:border-rose-300/60',
} as const

export default function ElementsSection() {
  const { ref, visibleItems } = useStaggeredAnimation(elements.length, 250)

  return (
    <section className="bg-white pt-32 pb-2 px-4 md:pt-1 md:pb-1">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            AIが作品の価値を多角的に分析
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            balubo独自のAIが、5つの視点（技術力・創造性・専門性・影響力・総合評価）から作品価値を多角的に分析します。
          </p>
        </div>

        <div ref={ref} className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3">
          {elements.map((el, idx) => {
            return (
              <div 
                key={el.title} 
                className={`rounded-3xl border p-8 shadow-lg backdrop-blur-sm transition-all duration-700 ease-out ${
                  colorClasses[el.color as keyof typeof colorClasses]
                } ${
                  visibleItems.includes(idx) 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                } hover:scale-105 hover:shadow-xl`}
                style={{ 
                  transitionDelay: `${idx * 250}ms` 
                }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm transition-all duration-500 ${
                    visibleItems.includes(idx) ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
                  } ${
                    el.color === 'purple' ? 'bg-purple-100/80 hover:bg-purple-200/80' :
                    el.color === 'emerald' ? 'bg-emerald-100/80 hover:bg-emerald-200/80' :
                    'bg-orange-100/80 hover:bg-orange-200/80'
                  } hover:scale-110`}
                    style={{ 
                      transitionDelay: `${idx * 250 + 200}ms` 
                    }}
                  >
                    {el.icon}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold text-slate-800 transition-all duration-500 ${
                      visibleItems.includes(idx) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                      style={{ 
                        transitionDelay: `${idx * 250 + 300}ms` 
                      }}
                    >
                      {el.title}
                    </h3>
                    <p className={`text-sm font-semibold transition-all duration-500 ${
                      el.color === 'purple' ? 'text-purple-500' :
                      el.color === 'emerald' ? 'text-emerald-500' :
                      'text-orange-500'
                    } ${
                      visibleItems.includes(idx) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                      style={{ 
                        transitionDelay: `${idx * 250 + 400}ms` 
                      }}
                    >
                      {el.subtitle}
                    </p>
                  </div>
                </div>
                <p className={`text-base leading-relaxed text-slate-600 transition-all duration-500 ${
                  visibleItems.includes(idx) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                  style={{ 
                    transitionDelay: `${idx * 250 + 500}ms` 
                  }}
                >
                  {el.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}