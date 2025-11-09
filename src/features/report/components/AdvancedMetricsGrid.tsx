import { Card, CardContent } from "@/components/ui/card";

interface MetricDetail {
  score: number;
  headline: string;
  goodHighlight?: string;
  nextTip?: string;
}

interface DetailedMetrics {
  technology?: MetricDetail;
  expertise?: MetricDetail;
  creativity?: MetricDetail;
  impact?: MetricDetail;
  overall?: MetricDetail;
}

interface Props {
  metrics?: DetailedMetrics;
}

const colorMap: Record<string, string> = {
  technology: "from-gray-500 to-gray-600",
  expertise: "from-blue-500 to-blue-600",
  creativity: "from-gray-400 to-gray-500",
  impact: "from-orange-500 to-orange-600",
  overall: "from-blue-600 to-blue-700",
};

export default function AdvancedMetricsGrid({ metrics }: Props) {
  // デモ用フォールバック
  const demo: DetailedMetrics = {
    technology: {
      score: 92,
      headline: "磐石の論理構成力",
      goodHighlight: "冒頭の問いかけで読者を一気に引き込む構成",
      nextTip: "図解を追加すると理解度がさらに向上",
    },
    expertise: {
      score: 90,
      headline: "一次情報の深掘り",
      goodHighlight: "業界トップへの独占インタビュー",
      nextTip: "データソースリンクで信頼性アップ",
    },
    creativity: {
      score: 88,
      headline: "逆説的アプローチ",
      goodHighlight: "「常識を疑え」というフック",
      nextTip: "読者への問いかけで余韻を増幅",
    },
    impact: {
      score: 85,
      headline: "行動を変える示唆",
      goodHighlight: "具体的アクションプランを提示",
      nextTip: "成功事例を追加し説得力強化",
    },
    overall: {
      score: 90,
      headline: "高完成度コンテンツ",
    },
  };

  const data = metrics && Object.keys(metrics).length > 0 ? metrics : demo;

  const renderCard = (key: string, detail: MetricDetail) => (
    <Card
      key={key}
      className="hover:shadow-md transition-shadow duration-200 flex flex-col"
    >
      <div
        className={`px-6 py-4 bg-gradient-to-r ${colorMap[key] || "from-slate-500 to-slate-600"} text-white`}
      >
        <h4 className="text-lg font-bold capitalize">
          {key === "technology"
            ? "技術力"
            : key === "expertise"
              ? "専門性"
              : key === "creativity"
                ? "創造性"
                : key === "impact"
                  ? "影響力"
                  : "総合"}
        </h4>
        <p className="text-sm opacity-80">{detail.score}/100</p>
      </div>
      <CardContent className="p-4 space-y-2 flex-grow flex flex-col">
        <p className="font-semibold text-slate-800">{detail.headline}</p>
        {detail.goodHighlight && (
          <p className="text-xs text-slate-600 line-clamp-3">
            {detail.goodHighlight}
          </p>
        )}
        <div className="mt-auto">
          {detail.nextTip && (
            <p className="text-[11px] text-blue-600 bg-blue-50 rounded px-2 py-1 inline-block">
              NEXT: {detail.nextTip}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {Object.entries(data).map(([k, v]) => renderCard(k, v as MetricDetail))}
    </div>
  );
}
