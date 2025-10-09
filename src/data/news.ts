export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category:
    | "アップデート"
    | "お知らせ"
    | "新機能"
    | "メンテナンス"
    | "リリース";
  link?: string;
  featured?: boolean;
}

// 実際のプロダクションでは、これらのデータはAPIやCMSから取得します
export const newsData: NewsItem[] = [
  {
    id: "1",
    title: "AI分析エンジンの精度向上アップデート",
    description:
      "クリエイターの専門性分析がより正確になりました。新しいアルゴリズムにより、細かいスキルや経験値も適切に評価されるようになり、より具体的なフィードバックを提供できます。",
    date: "2024-01-15",
    category: "アップデート",
    featured: true,
    link: "#",
  },
  {
    id: "2",
    title: "ポートフォリオ自動生成機能リリース",
    description:
      "アップロードした作品から自動的に美しいポートフォリオを生成する機能を追加しました。デザイナーやクリエイターの方により効率的な作品展示が可能になります。",
    date: "2024-01-10",
    category: "新機能",
    featured: true,
    link: "#",
  },
  {
    id: "3",
    title: "プレミアムプランの提供開始",
    description:
      "高度な分析機能やカスタマイズ機能を含むプレミアムプランを開始しました。より詳細な分析レポートや優先サポートなどをご利用いただけます。",
    date: "2024-01-05",
    category: "お知らせ",
    featured: false,
    link: "#",
  },
  {
    id: "4",
    title: "レスポンシブデザイン対応完了",
    description:
      "スマートフォンやタブレットでの表示を最適化し、どのデバイスからでも快適にご利用いただけるようになりました。",
    date: "2024-01-01",
    category: "アップデート",
    featured: false,
    link: "#",
  },
  {
    id: "5",
    title: "セキュリティ強化のお知らせ",
    description:
      "ユーザーデータ保護のため、セキュリティ機能を強化しました。二段階認証の導入や暗号化の強化により、より安全にサービスをご利用いただけます。",
    date: "2023-12-28",
    category: "お知らせ",
    featured: false,
    link: "#",
  },
  {
    id: "6",
    title: "AIによる興味傾向分析カードが新登場",
    description:
      "あなたのインプット傾向から“おすすめジャンル”や“今は遠いかもしれないジャンル”をAIが自動で可視化。提案型のアウトプットで、より深い自己分析が可能になりました。",
    date: "2024-06-10", // 適宜日付を調整
    category: "新機能",
    featured: true,
    link: "#",
  },
];

// カテゴリーごとのスタイル設定
export const categoryStyles = {
  アップデート: {
    badge: "bg-slate-100 text-slate-800",
    icon: "🔄",
    color: "slate",
  },
  お知らせ: {
    badge: "bg-slate-100 text-slate-800",
    icon: "📢",
    color: "slate",
  },
  新機能: {
    badge: "bg-slate-100 text-slate-800",
    icon: "✨",
    color: "slate",
  },
  メンテナンス: {
    badge: "bg-slate-100 text-slate-800",
    icon: "🔧",
    color: "slate",
  },
  リリース: {
    badge: "bg-slate-100 text-slate-800",
    icon: "🚀",
    color: "slate",
  },
};

// フィーチャーされたニュースを取得
export const getFeaturedNews = (): NewsItem[] => {
  return newsData.filter((item) => item.featured).slice(0, 3);
};

// 最新のニュースを取得
export const getLatestNews = (limit: number = 3): NewsItem[] => {
  return newsData
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// カテゴリー別のニュースを取得
export const getNewsByCategory = (category: string): NewsItem[] => {
  return newsData.filter((item) => item.category === category);
};
