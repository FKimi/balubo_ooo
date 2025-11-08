import type { ReportData, MockReportConfig } from "./types";

// モックデータ生成関数
export function generateMockReportData(config: MockReportConfig): ReportData {
  const { userId: _userId, worksCount = 10 } = config;

  return {
    aiSummary: {
      catchphrase:
        "複雑な技術情報を、顧客を動かすストーリーに変えるB2Bコンテンツの戦略家。",
      coreCompetencies: [
        "データに基づき、読者の課題解決に直結する論理的な記事構成力",
        "専門家への深い取材を通じ、一次情報の価値を最大化する編集能力",
        "SEOと読後満足度を両立させる、絶妙なUXライティング技術",
      ],
    },

    specialtyAnalysis: {
      investigativeDepth: 85,
      logicalStructure: 92,
      seoExpertise: 78,
      industrySpecificity: 88,
      readerEngagement: 82,
    },

    keywordAnalysis: [
      { keyword: "B2B SaaS", frequency: 15, weight: 5 },
      { keyword: "マーケティング", frequency: 12, weight: 4 },
      { keyword: "データ分析", frequency: 10, weight: 4 },
      { keyword: "UX/UI", frequency: 8, weight: 3 },
      { keyword: "SEO", frequency: 7, weight: 3 },
      { keyword: "コンテンツ戦略", frequency: 6, weight: 3 },
      { keyword: "プロダクトマネジメント", frequency: 5, weight: 2 },
      { keyword: "スタートアップ", frequency: 4, weight: 2 },
      { keyword: "デジタル変革", frequency: 3, weight: 1 },
      { keyword: "カスタマーサクセス", frequency: 3, weight: 1 },
    ],

    performanceMetrics: {
      totalWorks: worksCount,
      totalViews: 125000,
      averageLikes: 8.5,
      uniqueClients: 12,
      averageWordCount: 2800,
      engagementRate: 6.8,
    },

    clientIndustryBreakdown: [
      { industry: "SaaS", percentage: 35, count: 4, color: "#3b82f6" },
      { industry: "製造業", percentage: 25, count: 3, color: "#10b981" },
      { industry: "金融", percentage: 20, count: 2, color: "#f59e0b" },
      { industry: "医療", percentage: 10, count: 1, color: "#ef4444" },
      { industry: "小売", percentage: 10, count: 1, color: "#8b5cf6" },
    ],

    featuredWorks: [
      {
        id: "1",
        title: "B2B SaaS企業の成長戦略：データドリブンなマーケティングの実践",
        summary:
          "SaaS企業が直面する成長の壁を、実際のデータと事例を交えながら解説。読者の95%が「実践的で参考になった」と評価。",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
        url: "https://example.com/article1",
        views: 15000,
        likes: 45,
        tags: ["B2B SaaS", "マーケティング", "データ分析"],
        publishedAt: "2024-01-15T00:00:00Z",
      },
      {
        id: "2",
        title: "製造業DXの本質：テクノロジーよりも重要な「人」の変革",
        summary:
          "製造業におけるDXの成功要因を、現場取材を通じて深掘り。特に人的要因の重要性を強調した記事として話題に。",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400",
        url: "https://example.com/article2",
        views: 12000,
        likes: 38,
        tags: ["製造業", "DX", "デジタル変革"],
        publishedAt: "2024-02-10T00:00:00Z",
      },
      {
        id: "3",
        title: "金融業界のAI活用：顧客体験向上と業務効率化の両立",
        summary:
          "金融機関でのAI導入事例を詳しく調査。技術的な詳細とビジネスインパクトの両面から分析した包括的なレポート。",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400",
        url: "https://example.com/article3",
        views: 9800,
        likes: 32,
        tags: ["金融", "AI", "顧客体験"],
        publishedAt: "2024-03-05T00:00:00Z",
      },
    ],
  };
}

// デフォルトのモックデータ
export const defaultMockReportData: ReportData = generateMockReportData({
  userId: "mock-user-id",
  worksCount: 15,
});

// プロフィール用のモックデータ
export const mockProfile = {
  id: "mock-user-id",
  display_name: "田中 太郎",
  full_name: "田中 太郎",
  headline: "B2Bコンテンツ専門ライター",
  bio: "5年間のB2Bマーケティング経験を活かし、複雑な技術情報を分かりやすく伝える記事制作を得意としています。SaaS、製造業、金融など多様な業界での実績があります。",
  avatar_url:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
};
