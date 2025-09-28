// 価値可視化レポート用のデータ型定義

export interface ReportData {
  aiSummary: AISummaryData;
  specialtyAnalysis: SpecialtyAnalysisData;
  keywordAnalysis: KeywordData[];
  performanceMetrics: PerformanceMetricsData;
  clientIndustryBreakdown: IndustryData[];
  featuredWorks: FeaturedWorkData[];
  achievements?: AchievementsData;
  careerNarrative?: CareerNarrativeData;
  recommendations?: RecommendationsData;
}

export interface AISummaryData {
  catchphrase: string;
  coreCompetencies: string[];
}

export interface SpecialtyAnalysisData {
  investigativeDepth: number; // 取材・調査力 (0-100)
  logicalStructure: number; // 論理構成力 (0-100)
  seoExpertise: number; // SEO専門性 (0-100)
  industrySpecificity: number; // 業界専門性 (0-100)
  readerEngagement: number; // 読者エンゲージメント (0-100)
}

export interface KeywordData {
  keyword: string;
  frequency: number;
  weight: number; // 表示サイズ用 (1-5)
}

export interface PerformanceMetricsData {
  totalWorks: number;
  totalViews: number;
  averageLikes: number;
  uniqueClients: number;
  averageWordCount: number;
  engagementRate: number;
  experienceYears?: number;
}

export interface IndustryData {
  industry: string;
  percentage: number;
  count: number;
  color: string;
}

export interface FeaturedWorkData {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  url?: string;
  views: number;
  likes: number;
  tags: string[];
  publishedAt: string;
}

// 追加: 新機能用のデータ型
export interface AchievementsData {
  skills: string[];
}

export interface CareerNarrativeData {
  archetype: string; // 例: 翻訳者/問題解決者/世界観構築者
  storyline: string; // 物語テキスト
  turningPoints: Array<{ date: string; title: string; description: string }>;
}

export interface RecommendationsData {
  positioning: string; // 立ち位置の要約
  profileVariants: Array<{ title: string; tagline: string; summary: string }>; // 肩書/紹介文案
  nextProjects: Array<{ title: string; desc: string }>; // 提案プロジェクト
  keywords: string[]; // 推奨キーワード
}

// APIレスポンス用の型
export interface GenerateReportRequest {
  works: any[];
  userId: string;
}

export interface GenerateReportResponse {
  success: boolean;
  data: ReportData;
  error?: string;
}

// モックデータ生成用の型
export interface MockReportConfig {
  userId: string;
  worksCount: number;
  includeIndustryData?: boolean;
  includePerformanceData?: boolean;
}
