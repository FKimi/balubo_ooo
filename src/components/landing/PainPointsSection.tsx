'use client'

import React from 'react'
import { useScrollAnimation } from '@/hooks'

//【推敲後】BtoBプロフェッショナルの悩みをより具体的に（3つに厳選）
const creatorPains = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    title: "制作実績の背景にある価値まで伝えるのが難しい",
    description: "完成した制作物を見せるだけでは、その裏にある業界知識や、課題解決までの思考プロセスが伝わらない。"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="m12 1 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"/>
      </svg>
    ), 
    title: "自分の専門性が、客観的に伝わらない",
    description: "自分の強みや得意領域を説明しようとしても、主観的なアピールになってしまい、相手に納得感を与えられない。"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="m19 8 2 2-2 2"/>
        <path d="m17 12h4"/>
      </svg>
    ),
    title: "専門性の価値が伝わらず、価格競争に陥りがち",
    description: "スキルの本質的な価値が理解されず、「同じようなことができる人」として扱われ、適正な評価や報酬を得られない。"
  }
]


//【推敲後】解決策の表現を、メリットが分かりやすいように調整
const solutions = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    ),
    title: 'URL入力だけで楽々制作物登録',
    description: 'WebサイトやBehance、noteなどのURLを入力するだけで、AIが自動的に制作物のタイトル、説明文、画像を抽出。一から入力する手間を省いて、簡単にポートフォリオに登録できます。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    ),
    title: 'AIがあなたの「価値」を言語化',
    description: '制作物をAIが深く分析し、「SaaS業界のビジネスモデルへの深い理解」「複雑な情報を整理し、本質を突く構成力」など、あなたのビジネス貢献度や思考プロセスまで踏み込んで、専門性を具体的な言葉で表現します。',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
    title: '価値がわかるクライアントと出会える',
    description: 'AIが分析したあなたのスキルデータを基に、専門性を求めるクライアントとの高精度なマッチングを実現。不毛な価格競争から脱却し、あなたの価値を正当に評価してくれるクライアントと繋がれます。',
  },
]

export default function PainPointsSection() {
  const { ref: problemsRef, isVisible: problemsVisible } = useScrollAnimation(0.2)
  const { ref: solutionsRef, isVisible: solutionsVisible } = useScrollAnimation(0.2)

  return (
    <section className="relative bg-white py-24 px-4 md:py-32">
      <div className="container mx-auto max-w-7xl relative">
        {/* 問題提起部分 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
            <span className="text-sm font-medium text-slate-700">&ldquo;専門家&rdquo;である、あなたの悩み</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl mb-6">
            深い知見と高いスキルを持つプロフェッショナルだからこそ、<br className="sm:hidden" />
            <span className="text-indigo-600">直面する壁があります。</span>
          </h2>
          
          <p className="mx-auto max-w-3xl text-lg text-gray-600 leading-relaxed">
            BtoB領域で活躍するプロクリエイターが抱える
            <span className="font-semibold text-gray-900">専門性の可視化</span>と
            <span className="font-semibold text-gray-900">価値の伝達</span>の課題。
            <br className="hidden sm:block" />
            あなたも同じような経験はありませんか？
          </p>
        </div>

        <div ref={problemsRef} className="mt-20 md:mt-24">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {creatorPains.map((pain, idx) => (
              <div
                key={pain.title}
                className={`group relative bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-500 ease-out hover:-translate-y-1 ${
                  problemsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                {/* アイコン */}
                <div className="mb-6 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
                    {pain.icon}
                  </div>
                </div>

                {/* タイトル */}
                <h3 className="mb-4 text-xl font-bold text-gray-900 text-center">
                  {pain.title}
                </h3>

                {/* 説明文 */}
                <p className="text-gray-600 text-center leading-relaxed">
                  {pain.description}
                </p>

                {/* ホバー時のアクセント */}
                <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-indigo-600 group-hover:w-16 group-hover:-translate-x-8 transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* シンプルな区切り */}
        <div className="flex justify-center py-20 md:py-24">
          <div className={`transition-all duration-1000 ease-out ${
            problemsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`} style={{ transitionDelay: '800ms' }}>
            <div className="w-12 h-12 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center group hover:border-slate-600 transition-colors duration-300">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-slate-400 group-hover:text-slate-600 transition-colors duration-300"
              >
                <path
                  d="M12 5v14m7-7l-7 7-7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 解決策部分 */}
        <div ref={solutionsRef} className="text-center">
          <div className={`inline-flex items-center gap-3 mb-6 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 transition-all duration-700 ease-out ${
            solutionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="text-sm font-medium text-slate-700">その課題、baluboが解決します</span>
          </div>
          
          <h2 className={`text-4xl font-bold text-gray-900 md:text-5xl mb-6 transition-all duration-700 ease-out ${
            solutionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '100ms' }}>
            AIがあなたの「第三者の目」となり、<br className="sm:hidden" />
            <span className="text-indigo-600 font-bold">
              実績に隠された価値を客観的に分析・言語化
            </span>
          </h2>
          
          <p className={`mx-auto max-w-3xl text-lg text-gray-600 leading-relaxed transition-all duration-700 ease-out ${
            solutionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '200ms' }}>
            あなたの専門性を、誰にでも伝わる「<span className="font-semibold text-gray-900">証明書</span>」へと変換します。
            <br className="hidden sm:block" />
            これまで言語化が難しかったあなたの本当の価値を、客観的なデータとして証明します。
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:mt-20 md:grid-cols-3 max-w-6xl mx-auto">
          {solutions.map((solution, idx) => (
            <div 
              key={solution.title} 
              className={`group relative bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-500 ease-out hover:-translate-y-1 ${
                solutionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              {/* アイコン */}
              <div className="mb-6 flex items-center justify-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-all duration-300">
                  {solution.icon}
                </div>
              </div>

              {/* タイトル */}
              <h3 className="mb-4 text-xl font-bold text-gray-900 text-center">
                {solution.title}
              </h3>

              {/* 説明文 */}
              <p className="text-gray-600 text-center leading-relaxed">
                {solution.description}
              </p>

              {/* ホバー時のアクセント */}
              <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-indigo-600 group-hover:w-16 group-hover:-translate-x-8 transition-all duration-300 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}