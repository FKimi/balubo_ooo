'use client'

import React from 'react'

const creatorPains = [
  'ポートフォリオ作成に時間がかかり、本業に集中できない',
  '自分の強みや専門性を客観的に言語化できず、自己PRが苦手',
  '作品の価値がクライアントに正しく伝わっているか不安',
  'スキルと案件のミスマッチが多く、疲弊してしまう',
]

const clientPains = [
  'クリエイターの実際のスキルや専門性を見極めるのが難しい',
  'ポートフォリオだけでは仕事の品質が予測できない',
  '期待した成果物と納品物の間にギャップが生じてしまう',
  '最適なクリエイターを効率的に見つけられない',
]

const solutions = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="M3 15h6"/><path d="m5 12 2 2-2 2"/></svg>
    ),
    title: 'ポートフォリオ自動最適化',
    description: 'URLやファイルを登録するだけで、AIが自動で強みを抽出し、説得力のあるポートフォリオを作成。手間をかけずに、あなたの価値を最大化します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M12 20V4"/><path d="m6 14 6 6 6-6"/><path d="M12 20V4"/><path d="m18 14-6-6-6 6"/></svg>
    ),
    title: 'AIによる多角的なスキル分析',
    description: '作品の内容から「専門性」「創造性」などを定量的にスコア化。自分では気づけなかった客観的な強みや特徴を言語化・可視化します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m21.3 16.5-1.8-1.8-1.8 1.8-1.8-1.8 1.8-1.8-1.8-1.8 1.8-1.8 1.8 1.8 1.8-1.8 1.8 1.8 1.8-1.8-1.8 1.8 1.8 1.8z"/></svg>
    ),
    title: '最適なマッチングを促進',
    description: '客観的な分析データに基づき、スキルや作風に本当にマッチした案件やクライアントとの出会いを創出。ミスマッチを防ぎます。',
  },
]

export default function PainPointsSection() {
  return (
    <section className="bg-white py-20 px-4 md:py-1">
      <div className="container mx-auto max-w-5xl">
        {/* 問題提起部分 */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            こんな悩み、ありませんか？
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            クリエイターの真の実力も、クライアントの本当のニーズも、
            <br className="hidden sm:block" />
            従来のやり方では見えづらくなっています。
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:mt-20 md:grid-cols-2">
          {/* Creator Pains */}
          <div className="rounded-3xl border border-blue-200/30 bg-blue-50/30 p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-slate-800">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V14c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/><path d="M15 2v5h5"/></svg>
              クリエイターの悩み
            </h3>
            <ul className="space-y-4">
              {creatorPains.map((pain) => (
                <li key={pain} className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-amber-500 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" /></svg>
                  <span className="text-slate-600">{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Pains */}
          <div className="rounded-3xl border border-blue-200/30 bg-blue-50/30 p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-slate-800">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              クライアントの悩み
            </h3>
            <ul className="space-y-4">
              {clientPains.map((pain) => (
                <li key={pain} className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-amber-500 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" /></svg>
                  <span className="text-slate-600">{pain}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 区切り矢印 */}
        <div className="flex justify-center py-16 md:py-20">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-slate-300"
          >
            <path
              d="M24 6L24 42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 34L24 42L32 34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* 解決策部分 */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            その悩み、
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              balubo
            </span>
            が解決します
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            AI分析型ポートフォリオサービス「balubo」は、
            あなたがこれまで積み上げてきた「見えない価値」を客観的な指標で可視化し、証明します。
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:mt-20 md:grid-cols-3">
          {solutions.map((solution) => (
            <div key={solution.title} className="rounded-3xl border border-transparent bg-transparent p-8 transition-all duration-300 hover:border-blue-200/40 hover:bg-white/90 hover:shadow-xl hover:backdrop-blur-sm">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100/80 shadow-sm">
                {solution.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-800">{solution.title}</h3>
              <p className="text-base leading-relaxed text-slate-600">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
