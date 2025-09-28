"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SuggestedEngagementsProps {
  strengths?: string[];
  industries?: string[];
}

// 依頼イメージを喚起する提案カード
export function SuggestedEngagements({
  strengths = [],
  industries = [],
}: SuggestedEngagementsProps) {
  const has = (needle: string) => strengths.some((s) => s.includes(needle));
  const inIndustry = (name: string) =>
    industries.some((i) => i.toLowerCase().includes(name.toLowerCase()));

  const base: Array<{ title: string; desc: string }> = [];

  // 業界ベースの提案
  if (inIndustry("SaaS")) {
    base.push({
      title: "導入事例コンテンツ制作",
      desc: "顧客価値を言語化し、営業・CS・採用に再利用できるストーリーを設計",
    });
    base.push({
      title: "プロダクト解説記事/LP原稿",
      desc: "難解な機能をユースケース中心に翻訳し、意思決定を後押し",
    });
  }
  if (inIndustry("製造")) {
    base.push({
      title: "技術解説・工場取材レポート",
      desc: "一次情報に基づき、現場とビジネスを橋渡しする記事を作成",
    });
  }
  if (inIndustry("金融")) {
    base.push({
      title: "解説レポート/ナレッジ記事",
      desc: "専門用語を噛み砕き、意思決定者に届く構成で整理",
    });
  }

  // 強みベースの提案
  if (has("一次情報") || has("取材")) {
    base.push({
      title: "ホワイトペーパー/ケーススタディ",
      desc: "専門家・ユーザー取材に基づく検証可能なドキュメントを作成",
    });
  }
  if (has("構造") || has("情報") || has("編集")) {
    base.push({
      title: "オウンドメディア編集・運用",
      desc: "編集基準/トーン設計から運用プロセスまで一気通貫で支援",
    });
  }
  if (has("UX") || has("デザイン")) {
    base.push({
      title: "情報設計/コンテンツデザイン",
      desc: "情報の優先順位づけとレイアウト指針を策定し読みやすさを最大化",
    });
  }

  // デフォルトの補完
  if (base.length === 0) {
    base.push(
      {
        title: "専門テーマの記事制作",
        desc: "読者の意思決定に寄与する、一次情報と検証可能性に基づく記事",
      },
      {
        title: "事例コンテンツの体系化",
        desc: "取材〜原稿〜再利用設計まで、横展開に耐えるフォーマットを構築",
      },
      {
        title: "編集ガイドラインの整備",
        desc: "品質の再現性を高める執筆・編集ルールを策定しチームに導入",
      },
    );
  }

  // 重複除去して上位3件
  const seen = new Set<string>();
  const items = base
    .filter((it) => (seen.has(it.title) ? false : (seen.add(it.title), true)))
    .slice(0, 3);

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          適した業務例
        </CardTitle>
        <p className="text-sm text-gray-600">強みが発揮されやすい領域の参考</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm"
            >
              <div className="font-semibold text-gray-900 mb-1">{it.title}</div>
              <div className="text-sm text-gray-600 leading-relaxed">
                {it.desc}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
