
"use client";

import React from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

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
      className="bg-base-soft-blue py-24 sm:py-32"
    >
      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        <FadeIn className="mb-20 text-left">
          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            すでに多くのプロが、<br className="hidden sm:block" />
            baluboで「価値の証明」を始めています。
          </h2>
          <p className="text-lg text-gray-600">
            導入後の変化や、専門性がどう伝わるようになったか。<br className="hidden sm:block" />
            その具体的な声を一部ご紹介します。
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-8 md:grid-cols-3">
          {voices.map((voice) => (
            <StaggerItem
              key={voice.name}
              className="flex flex-col rounded-[32px] border border-white/60 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              {/* ユーザー情報 */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-md">
                  {voice.avatarText}
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-600">{voice.role}</p>
                  <h3 className="text-lg font-bold text-gray-900">{voice.name}</h3>
                </div>
              </div>

              {/* キャッチコピー */}
              <p className="mb-4 text-lg font-bold leading-snug text-gray-900">
                {voice.catchCopy}
              </p>

              {/* コメント */}
              <p className="mb-6 flex-1 text-base leading-relaxed text-gray-600">
                {voice.comment}
              </p>

              {/* 強みタグ */}
              <div className="mt-auto">
                <p className="mb-2 text-xs font-bold text-gray-400">DETECTED STRENGTHS</p>
                <div className="flex flex-wrap gap-2">
                  {voice.strengths.map((strength) => (
                    <span
                      key={strength}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                    >
                      #{strength}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
