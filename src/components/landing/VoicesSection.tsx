"use client";

import React from "react";

interface Voice {
  name: string;
  role: string;
  avatarBg: string;
  avatarText: string;
  catchCopy: string;
  comment: string;
  strengths: string[];
}

const voices: Voice[] = [
  {
    name: "田中 美咲",
    role: "ビジネスコンテンツライター",
    avatarBg: "from-blue-600 to-blue-700",
    avatarText: "田",
    catchCopy: "感覚的だった強みが「データ」になり、単価UPに繋がりました",
    comment:
      "これまで感覚的に伝えていた自分の強みが、「SaaS業界への解像度」といった客観的なデータで可視化されて驚きました。クライアントへの提案でも説得力が格段に上がり、専門家として認識され、単価アップにも繋がっています。",
    strengths: ["SaaS業界の深い理解", "経営層向けインタビュー設計"],
  },
  {
    name: "佐藤 健太",
    role: "ビジネスマーケティングライター",
    avatarBg: "from-green-500 to-emerald-600",
    avatarText: "佐",
    catchCopy: "AI分析で「得意分野」が明確になり、専門領域の依頼が増えました",
    comment:
      "AIによる記事分析で、自分では気づかなかった得意分野が明らかになりました。今では特化した領域での案件依頼が増え、より充実した仕事ができています。",
    strengths: ["BtoBマーケの課題整理", "専門領域への深いリサーチ"],
  },
  {
    name: "山田 雅子",
    role: "専門領域ライター・編集者",
    avatarBg: "from-gray-400 to-gray-500",
    avatarText: "山",
    catchCopy: "ポートフォリオ作成の時間が激減。AI分析も信頼できます",
    comment:
      "ポートフォリオ作成にかかる時間が大幅に短縮され、制作活動に集中できるように。AI分析の結果も実感とマッチしていて、信頼して活用しています。",
    strengths: ["専門領域ライティング", "読者体験を意識した構成"],
  },
];

export default function VoicesSection() {
  return (
    <section
      id="voices"
      className="relative isolate overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-24 px-4 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.4),_transparent_55%)]"
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600 mb-4">
            Voices
          </p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight tracking-tight">
            すでに多くのプロが、
            <br />
            baluboで<span className="text-blue-600">「価値の証明」</span>を始めています。
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            具体的な成果と、働き方の変化
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:mt-24 lg:grid-cols-3">
          {voices.map((voice) => (
            <article
              key={voice.name}
              className="relative flex flex-col rounded-2xl border border-blue-100 bg-white/95 p-8 shadow-lg shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/70 hover:shadow-2xl"
              aria-label={`${voice.name}さんの事例`}
            >
              <div>
                {/* キャッチコピー */}
                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {voice.catchCopy}
                  </p>
                </div>
                {/* コメント */}
                <div className="flex-grow mb-6">
                  <p className="text-base leading-relaxed text-gray-700">
                    {voice.comment}
                  </p>
                </div>

                {/* プロフィール */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className={`mr-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${voice.avatarBg} text-white text-base font-bold shadow-md`}>
                      {voice.avatarText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-gray-900 text-base">
                          {voice.name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{voice.name} 様（{voice.role}）</div>
                    </div>
                  </div>
                </div>

                {voice.strengths.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      得意領域
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {voice.strengths.map((strength) => (
                        <span
                          key={strength}
                          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          #{strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
