'use client'

import React from 'react'
import { useStaggeredAnimation } from '@/hooks'

const highlights = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500 transition-colors duration-300 group-hover:text-blue-600"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M12 6v6l4 2"/></svg>
    ),
    title: '瞬間的な価値の可視化',
    description:
      'URLやファイルを登録するだけで、AIがわずか数秒で作品を分析。今まで言語化できなかった強みや特徴を即座に可視化します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500 transition-colors duration-300 group-hover:text-blue-600"><path d="M16 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8z"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M12 15h.01"/></svg>
    ),
    title: '自動生成のポートフォリオ',
    description:
      '分析結果をもとに、見た目も美しいポートフォリオを自動生成。作成にかかる時間を大幅に短縮し、本来の業務に集中できます。',
  },
  {
    icon: (
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500 transition-colors duration-300 group-hover:text-blue-600"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
    ),
    title: '成長を可視化するレポート',
    description:
      'AIの分析結果をダッシュボードで詳細にレポート。あなたの強みやスキルの変化を時系列で追い、成長を実感できます。',
  },
]

export default function HighlightsSection() {
  const { ref, visibleItems } = useStaggeredAnimation(highlights.length, 250)

  return (
    <section className="bg-slate-50 py-2 px-4 md:py-2">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            新しいクリエイター体験を、今すぐ
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            証明する、繋がる、成長する。baluboは単なるツールではありません。
            <br className="hidden sm:block" />
            あなたのキャリアを加速させるパートナーです。
          </p>
        </div>

        <div ref={ref} className="mt-16 grid gap-8 md:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, idx) => (
            <div
              key={item.title}
              className={`group relative cursor-pointer rounded-3xl border border-blue-200/30 bg-white/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-700 ease-in-out hover:-translate-y-2 hover:border-blue-300/60 hover:shadow-xl hover:shadow-blue-500/10 ${
                visibleItems.includes(idx) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
              style={{ 
                transitionDelay: `${idx * 250}ms` 
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05), transparent 50%)',
                }}
              ></div>
              
              <div className="relative z-10">
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200/40 bg-blue-50/60 transition-all duration-500 group-hover:bg-white shadow-sm ${
                  visibleItems.includes(idx) ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
                }`}
                  style={{ 
                    transitionDelay: `${idx * 250 + 200}ms` 
                  }}
                >
                  {item.icon}
                </div>

                <h3 className={`mb-3 text-xl font-semibold text-slate-800 transition-all duration-500 group-hover:text-blue-700 ${
                  visibleItems.includes(idx) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                  style={{ 
                    transitionDelay: `${idx * 250 + 300}ms` 
                  }}
                >
                  {item.title}
                </h3>
                <p className={`text-base leading-relaxed text-slate-600 transition-all duration-500 ${
                  visibleItems.includes(idx) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                  style={{ 
                    transitionDelay: `${idx * 250 + 400}ms` 
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}