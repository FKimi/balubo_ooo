'use client'

import React from 'react'
import { useScrollAnimation } from '@/hooks'

//【推敲後】クリエイターの悩みをより具体的に
const creatorPains = [
  'ポートフォリオ作りに追われ、本業の制作時間を削られてしまう',
  '自分のスキルや作風の強みをうまく言葉にできず、効果的な自己PRが苦手',
  '作品の本当の価値やこだわりが、クライアントに伝わっているか不安',
  'スキルと依頼内容が合わない案件が多く、消耗してしまう',
]

//【推敲後】クライアントの悩みをより具体的に
const clientPains = [
  'ポートフォリオだけでは、クリエイターの本当のスキルレベルを見極められない',
  '作風は良くても、実際の仕事の進め方や品質までは予測できない',
  '期待していたイメージと、実際の納品物との間にズレが生じてしまう',
  'プロジェクトに本当に合うクリエイターを探すのに、時間と手間がかかりすぎる',
]

//【推敲後】解決策の表現を、メリットが分かりやすいように調整
const solutions = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="M3 15h6"/><path d="m5 12 2 2-2 2"/></svg>
    ),
    title: 'ポートフォリオを“自動”で最適化',
    description: '作品のURLやファイルを登録するだけ。AIがあなたのスキルや実績から強みを自動で引き出し、クライアントに響くポートフォリオを作成します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M12 20V4"/><path d="m6 14 6 6 6-6"/><path d="M12 20V4"/><path d="m18 14-6-6-6 6"/></svg>
    ),
    title: 'AIが“隠れた強み”を分析',
    description: '作品をAIが多角的に分析し、「専門性」「創造性」といったスキルを客観的にスコア化。自分では気づきにくい強みや作風の特徴を可視化します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m21.3 16.5-1.8-1.8-1.8 1.8-1.8-1.8 1.8-1.8-1.8-1.8 1.8-1.8 1.8 1.8 1.8-1.8 1.8 1.8 1.8-1.8-1.8 1.8 1.8 1.8z"/></svg>
    ),
    title: '“理想の出会い”を創出',
    description: 'AIの分析データが、あなたのスキルや個性を正しく理解したクライアントとの出会いを創出。スキルとニーズのミスマッチを防ぎます。',
  },
]

export default function PainPointsSection() {
  const { ref: problemsRef, isVisible: problemsVisible } = useScrollAnimation(0.2)
  const { ref: solutionsRef, isVisible: solutionsVisible } = useScrollAnimation(0.2)

  return (
    <section className="bg-white py-20 px-4 md:py-1">
      <div className="container mx-auto max-w-5xl">
        {/* 問題提起部分 */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            こんな“悩み”、ありませんか？
          </h2>
          {/*【推敲後】より共感を呼ぶ表現に */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            従来のポートフォリオでは、
            <span className="whitespace-nowrap">クリエイターが持つ本当の実力</span>も、
            <span className="whitespace-nowrap">クライアントが求める真のニーズ</span>も、
            <br className="hidden sm:block" />
            互いに伝わりきらないのが現状です。
          </p>
        </div>

        <div ref={problemsRef} className="mt-16 grid gap-8 md:mt-20 md:grid-cols-2">
          {/* Creator Pains */}
          <div className={`rounded-3xl border border-blue-200/30 bg-blue-50/30 p-8 shadow-sm transition-all duration-700 ease-out ${
            problemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h3 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V14c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"/><path d="M15 2v5h5"/></svg>
              クリエイターの悩み
            </h3>
            <ul className="space-y-4">
              {creatorPains.map((pain, idx) => (
                <li key={pain} className={`flex items-start gap-3 transition-all duration-500 ease-out ${
                  problemsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <svg className="h-5 w-5 flex-shrink-0 text-amber-500 mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" /></svg>
                  <span className="text-slate-600">{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Pains */}
          <div className={`rounded-3xl border border-blue-200/30 bg-blue-50/30 p-8 shadow-sm transition-all duration-700 ease-out ${
            problemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '200ms' }}>
            <h3 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              クライアントの悩み
            </h3>
            <ul className="space-y-4">
              {clientPains.map((pain, idx) => (
                <li key={pain} className={`flex items-start gap-3 transition-all duration-500 ease-out ${
                  problemsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`} style={{ transitionDelay: `${(idx + 4) * 100}ms` }}>
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
            className={`text-slate-300 transition-all duration-700 ease-out ${
              problemsVisible ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-75'
            }`}
            style={{ transitionDelay: '1000ms' }}
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
        <div ref={solutionsRef} className="text-center">
          <h2 className={`text-4xl font-bold text-slate-800 md:text-5xl transition-all duration-700 ease-out ${
            solutionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            その悩み、
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              balubo
            </span>
            が解決します
          </h2>
          {/*【推敲後】より力強く、サービスの価値を伝える表現に */}
          <p className={`mx-auto mt-6 max-w-3xl text-lg text-slate-600 transition-all duration-700 ease-out ${
            solutionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '200ms' }}>
            AI分析ポートフォリオ「balubo」は、あなたの作品に眠る
            「見えない価値」を客観的なデータで可視化し、
            あなたの実力を正しく、力強く証明します。
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:mt-20 md:grid-cols-3">
          {solutions.map((solution, idx) => (
            <div 
              key={solution.title} 
              className={`rounded-3xl border border-transparent bg-transparent p-8 transition-all duration-700 ease-out hover:border-blue-200/40 hover:bg-white/90 hover:shadow-xl hover:backdrop-blur-sm hover:scale-105 ${
                solutionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(idx + 2) * 200}ms` }}
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100/80 shadow-sm transition-all duration-300 hover:bg-blue-200/80 hover:scale-110">
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