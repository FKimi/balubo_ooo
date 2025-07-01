'use client'

import React from 'react'
import { useStaggeredAnimation } from '@/hooks'

interface Voice {
  name: string
  role: string
  comment: string
  avatarInitial: string
  bgColor: string
}

const voices: Voice[] = [
  {
    name: '田中 美咲',
    role: 'フリーランスライター',
    comment: 'これまで感覚的に伝えていた自分の強みが、客観的なデータで可視化されて驚きました。クライアントへの提案でも説得力が格段に上がり、単価アップにも繋がっています。',
    avatarInitial: '田',
    bgColor: 'bg-blue-500 text-white',
  },
  {
    name: '佐藤 健太',
    role: '編集者・ディレクター',
    comment: 'AIによる作品分析で、自分では気づかなかった得意分野が明らかになりました。今では特化した領域での案件依頼が増え、より充実した仕事ができています。',
    avatarInitial: '佐',
    bgColor: 'bg-emerald-500 text-white',
  },
  {
    name: '山田 雅子',
    role: 'コンテンツクリエイター',
    comment: 'ポートフォリオ作成にかけていた時間が大幅に短縮され、制作活動に集中できるように。AI分析の結果も実感とマッチしていて、信頼して活用しています。',
    avatarInitial: '山',
    bgColor: 'bg-purple-500 text-white',
  },
]

export default function VoicesSection() {
  const { ref, visibleItems } = useStaggeredAnimation(voices.length, 300)

  return (
    <section className="bg-slate-50 py-20 px-4 md:py-2">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-800 md:text-5xl">
            先行ユーザーからの期待の声
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            すでに多くの方々から、baluboが提供する新しい価値にご期待いただいています。
          </p>
        </div>

        <div ref={ref} className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3">
          {voices.map((voice, idx) => (
            <div 
              key={voice.name} 
              className={`flex flex-col rounded-3xl border border-blue-200/30 bg-white/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-700 ease-out ${
                visibleItems.includes(idx) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              } hover:scale-105 hover:shadow-xl hover:shadow-blue-100/50`}
              style={{ 
                transitionDelay: `${idx * 300}ms` 
              }}
            >
              <div className="flex-grow">
                <p className={`relative text-lg leading-relaxed text-slate-700 transition-all duration-500 ${
                  visibleItems.includes(idx) ? 'opacity-100' : 'opacity-0'
                }`}
                  style={{ 
                    transitionDelay: `${idx * 300 + 200}ms` 
                  }}
                >
                  <span className={`absolute -left-4 -top-2 text-6xl font-bold text-slate-100 transition-all duration-500 ${
                    visibleItems.includes(idx) ? 'scale-100 rotate-0' : 'scale-0 rotate-12'
                  }`}
                    style={{ 
                      transitionDelay: `${idx * 300 + 100}ms` 
                    }}
                  >&quot;</span>
                  <span className="relative">{voice.comment}</span>
                </p>
              </div>
              <div className={`mt-6 flex items-center pt-6 border-t border-blue-200/40 transition-all duration-500 ${
                visibleItems.includes(idx) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
                style={{ 
                  transitionDelay: `${idx * 300 + 400}ms` 
                }}
              >
                <div className={`mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${voice.bgColor} text-xl font-bold transition-all duration-500 ${
                  visibleItems.includes(idx) ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
                }`}
                  style={{ 
                    transitionDelay: `${idx * 300 + 300}ms` 
                  }}
                >
                  {voice.avatarInitial}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{voice.name}</div>
                  <div className="text-sm text-slate-500">{voice.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
