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
    catchCopy: "感覚的だった強みが「データ」になり、専門性が正しく評価されるようになりました",
    comment:
      "これまで感覚的に伝えていた自分の強みが、「SaaS業界への解像度」といった客観的なデータで可視化されて驚きました。クライアントへの提案でも説得力が格段に上がり、専門家として認識され、より高い付加価値の案件につながっています。",
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
      className="relative isolate overflow-hidden bg-[#F4F7FF] py-24 px-4 md:py-32"
    >
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mb-16">
          <div className="mx-auto max-w-3xl text-left">
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              すでに多くのプロが、baluboで「価値の証明」を始めています。
            </h2>
            <p className="text-lg text-gray-600">
              導入後の変化や、専門性がどう伝わるようになったか。その具体的な声を一部ご紹介します。
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-3">
          {voices.map((voice) => (
            <article
              key={voice.name}
              className="relative flex flex-col rounded-[28px] border border-blue-50/90 bg-white/95 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(37,99,235,0.18)]"
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
                  <div className="mr-3 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 shadow-[0_12px_28px_rgba(191,219,254,0.95)]">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${voice.avatarBg} text-white text-base font-bold shadow-[0_10px_26px_rgba(37,99,235,0.45)]`}
                    >
                      {voice.avatarText}
                    </div>
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
