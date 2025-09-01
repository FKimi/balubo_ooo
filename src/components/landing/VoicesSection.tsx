'use client'

import React from 'react'

interface Voice {
  name: string
  role: string
  comment: string
  avatarInitial: string
}

const voices: Voice[] = [
  {
    name: '田中 美咲',
    role: 'フリーランスライター',
    comment: 'これまで感覚的に伝えていた自分の強みが、客観的なデータで可視化されて驚きました。クライアントへの提案でも説得力が格段に上がり、単価アップにも繋がっています。',
    avatarInitial: '田',
  },
  {
    name: '佐藤 健太',
    role: '編集者・ディレクター',
    comment: 'AIによる作品分析で、自分では気づかなかった得意分野が明らかになりました。今では特化した領域での案件依頼が増え、より充実した仕事ができています。',
    avatarInitial: '佐',
  },
  {
    name: '山田 雅子',
    role: 'コンテンツクリエイター',
    comment: 'ポートフォリオ作成にかかる時間が大幅に短縮され、制作活動に集中できるように。AI分析の結果も実感とマッチしていて、信頼して活用しています。',
    avatarInitial: '山',
  },
]

export default function VoicesSection() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 px-4 md:py-28">
      <div className="container relative z-10 mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            先行ユーザーからの期待の声
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            すでに多くの方々から、baluboが提供する新しい価値にご期待いただいています。
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3">
          {voices.map((voice) => (
            <div
              key={voice.name}
              className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 rounded-t-lg"/>
              <div className="flex-grow">
                <p className="relative text-base leading-relaxed text-gray-600">
                  <span className="absolute -left-3 -top-3 text-7xl font-bold text-gray-300 opacity-30">&quot;</span>
                  <span className="relative">{voice.comment}</span>
                </p>
              </div>
              <div className="mt-6 flex items-center pt-6 border-t border-gray-200">
                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-xl font-bold">
                  {voice.avatarInitial}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{voice.name}</div>
                  <div className="text-sm text-gray-500">{voice.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
