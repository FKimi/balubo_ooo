'use client'

import React from 'react'

const highlights = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500 transition-colors duration-300 group-hover:text-blue-600"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.432 0l6.568-6.568a2.426 2.426 0 0 0 0-3.432l-8.704-8.704Z"/><path d="M6 9h.01"/></svg>
    ),
    title: 'AI分析型ポートフォリオ',
    description:
      '作品を登録するだけでAIがあなたの専門分野や強みを多角的に分析・可視化。説得力のあるポートフォリオが自動で完成します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500 transition-colors duration-300 group-hover:text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: 'クリエイター・コミュニティ',
    description:
      '作品や日々のインプットを仲間と共有。フィードバックや新たな発見を通じて、キャリアを加速させる繋がりが生まれます。',
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

        <div className="mt-16 grid gap-8 md:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="group relative cursor-pointer rounded-3xl border border-blue-200/30 bg-white/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-blue-300/60 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05), transparent 50%)',
                }}
              ></div>
              
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200/40 bg-blue-50/60 transition-colors duration-300 group-hover:bg-white shadow-sm">
                  {item.icon}
                </div>

                <h3 className="mb-3 text-xl font-semibold text-slate-800 transition-colors duration-300 group-hover:text-blue-700">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-600">
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
