// 価値可視化レポート用のデータ型定義

export interface ReportData {
  aiSummary: AISummaryData;
  specialtyAnalysis: SpecialtyAnalysisData;
  keywordAnalysis: KeywordData[];
  performanceMetrics: PerformanceMetricsData;
  clientIndustryBreakdown: IndustryData[];
  featuredWorks: FeaturedWorkData[];
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
