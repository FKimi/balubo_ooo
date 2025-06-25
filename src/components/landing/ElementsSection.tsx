'use client'

import React from 'react'

const elements = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
    ),
    title: '創造性',
    subtitle: 'オリジナリティ',
    description: '作品の独創性や新しい視点を分析し、他者との差別化ポイントを明確化します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3"/><path d="M10 10.3c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3"/><path d="M10 10.3c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3"/><path d="m2.8 15.1.7-1.2 1.2.7-1.2.7-.7-1.2Zm1.5-8.2.7-1.2 1.2.7-1.2.7-.7-1.2Zm8.9 4.3.7-1.2 1.2.7-1.2.7-.7-1.2Z"/></svg>
    ),
    title: '専門性',
    subtitle: 'クオリティ',
    description: '専門知識や技術的熟練度を評価し、作品の完成度を客観的に測定します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M10 17a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v5a5 5 0 0 0 5 5h3Z"/><path d="M21 17a5 5 0 0 0 0-10h-1a5 5 0 0 0-5 5v3a5 5 0 0 0 5 5h1Z"/></svg>
    ),
    title: '影響力',
    subtitle: 'エンゲージメント',
    description: '作品が読者や視聴者に与える影響や共感を分析し、人の心を動かす力を可視化します。',
  },
]

export default function ElementsSection() {
  return (
    <section className="bg-white pt-32 pb-2 px-4 md:pt-1 md:pb-1">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            AIが作品の価値を多角的に分析
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            balubo独自のアルゴリズムが、3つの主要素からあなたの作品が持つ多面的な価値と魅力を発見します。
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3">
          {elements.map((el) => (
            <div key={el.title} className="rounded-3xl border border-blue-200/30 bg-white/90 p-8 shadow-lg backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-4">
                                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100/80 shadow-sm">
                  {el.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{el.title}</h3>
                  <p className="text-sm font-semibold text-blue-500">{el.subtitle}</p>
                </div>
              </div>
              <p className="text-base leading-relaxed text-slate-600">{el.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
