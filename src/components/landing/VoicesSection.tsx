"use client";

import React from "react";

interface Voice {
  name: string;
  role: string;
  avatarBg: string;
  avatarText: string;
  quantitativeResult?: string;
  emotionalChange?: string;
  comment: string;
}

const voices: Voice[] = [
  {
    name: "田中 美咲",
    role: "BtoBコンテンツマーケター",
    avatarBg: "from-blue-500 to-indigo-600",
    avatarText: "田",
    quantitativeResult: "",
    emotionalChange: "",
    comment:
      "これまで感覚的に伝えていた自分の強みが、「SaaS業界への解像度」といった客観的なデータで可視化されて驚きました。クライアントへの提案でも説得力が格段に上がり、専門家として認識され、単価アップにも繋がっています。",
  },
  {
    name: "佐藤 健太",
    role: "DXコンサルタント",
    avatarBg: "from-green-500 to-emerald-600",
    avatarText: "佐",
    quantitativeResult: "",
    emotionalChange: "",
    comment:
      "AIによる制作物分析で、自分では気づかなかった得意分野が明らかになりました。今では特化した領域での案件依頼が増え、より充実した仕事ができています。",
  },
  {
    name: "山田 雅子",
    role: "専門領域ライター",
    avatarBg: "from-purple-500 to-pink-600",
    avatarText: "山",
    quantitativeResult: "",
    emotionalChange: "",
    comment:
      "ポートフォリオ作成にかかる時間が大幅に短縮され、制作活動に集中できるように。AI分析の結果も実感とマッチしていて、信頼して活用しています。",
  },
];

export default function VoicesSection() {

  return (
    <section
      id="voices"
      className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-24 px-4 md:py-32"
    >
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight tracking-tight">
            すでに、
            <span className="text-[#0A66C2]">多くのプロ</span>が、
            <br />
            新たなキャリアを歩み始めています。
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            具体的な成果と、働き方の変化
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:mt-24 lg:grid-cols-3">
          {voices.map((voice) => (
            <article
              key={voice.name}
              className="relative flex flex-col rounded-2xl border-2 border-gray-200 bg-white p-8 hover:border-[#0A66C2] hover:shadow-2xl transition-all duration-500"
              aria-label={`${voice.name}さんの事例`}
            >
              <div>
                {/* コメント */}
                <div className="flex-grow mb-6">
                  <p className="text-base leading-relaxed text-gray-700">
                    <span className="text-4xl font-bold text-gray-200 opacity-50">&quot;</span>
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
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          認証済
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{voice.role}</div>
                    </div>
                  </div>
                  
                  {/* 専門性スコア表示 */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#0A66C2]">
                      {voice.name === "田中 美咲" && "92%"}
                      {voice.name === "佐藤 健太" && "88%"}
                      {voice.name === "山田 雅子" && "85%"}
                    </div>
                    <div className="text-xs text-gray-500">専門性スコア</div>
                  </div>
                </div>
                
                {/* 専門性バー */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {voice.name === "田中 美咲" && "SaaS業界への解像度"}
                      {voice.name === "佐藤 健太" && "DX領域の専門性"}
                      {voice.name === "山田 雅子" && "コンテンツ制作力"}
                    </span>
                    <span className="font-medium text-gray-900">
                      {voice.name === "田中 美咲" && "95%"}
                      {voice.name === "佐藤 健太" && "90%"}
                      {voice.name === "山田 雅子" && "87%"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full">
                    <div 
                      className="h-1.5 bg-gradient-to-r from-[#0A66C2] to-[#004182] rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: voice.name === "田中 美咲" ? "95%" : 
                               voice.name === "佐藤 健太" ? "90%" : "87%"
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
