'use client'

import React from 'react'

interface Voice {
  name: string
  role: string
  comment: string
  avatarInitial: string
  bgColor: string
}

const voices: Voice[] = [
  {
    name: 'Aya S.',
    role: 'フリーライター',
    comment: '自分の文章の強みやクセを客観的に分析してくれるなんて画期的。自分の成長が楽しみです。',
    avatarInitial: 'A',
    bgColor: 'bg-blue-100 text-blue-800'
  },
  {
    name: 'Ryo K.',
    role: 'Webメディア編集長',
    comment: 'ライターさんのスキルを定量的に把握できるのは非常に魅力的。採用のミスマッチが減ることに期待しています。',
    avatarInitial: 'R',
    bgColor: 'bg-indigo-100 text-indigo-800'
  },
  {
    name: 'Mika T.',
    role: 'コンテンツマーケター',
    comment: 'ポートフォリオが自動でリッチになるのは嬉しい。提案資料作成の手間が省け、本来の業務に集中できそうです。',
    avatarInitial: 'M',
    bgColor: 'bg-purple-100 text-purple-800'
  },
]

export default function VoicesSection() {
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

        <div className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3">
          {voices.map((voice) => (
            <div key={voice.name} className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
              <div className="flex-grow">
                <p className="relative text-lg leading-relaxed text-slate-700">
                  <span className="absolute -left-4 -top-2 text-6xl font-bold text-slate-100">“</span>
                  <span className="relative">{voice.comment}</span>
                </p>
              </div>
              <div className="mt-6 flex items-center pt-6 border-t border-slate-200">
                <div className={`mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${voice.bgColor} text-xl font-bold`}>
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
