// 作品データの型定義
export interface WorkData {
  id: string
  title: string
  description: string
  external_url: string
  tags: string[]
  roles: string[]
  categories: string[]
  production_date?: string
  banner_image_url?: string
  production_notes?: string  // 制作メモ: 制作過程、作品の背景、狙い、こだわりなど
  is_featured?: boolean      // 代表作フラグ
  featured_order?: number    // 代表作の表示順序
  // 記事統計フィールド
  content_type?: string
  article_word_count?: number
  article_has_content?: boolean
  preview_data?: {
    title: string
    description: string
    image: string
    url: string
  }
  ai_analysis_result?: AIAnalysisResult
  created_at: string
  updated_at: string
}

// AI分析結果の詳細型定義
export interface AIAnalysisResult {
  tags: string[]
  keywords: string[]
  category: string
  summary: string
  strengths: {
    creativity: string[]
    expertise: string[]
    impact: string[]
  }
  // 記事専用の詳細分析
  detailedAnalysis?: {
    genreClassification?: string
    writingStyleAnalysis?: string
    targetReaderProfile?: string
    contentStructure?: string
    uniqueValueProposition?: string
    professionalAssessment?: string
    // 一般コンテンツ用の分析
    technicalAnalysis?: string
    styleCharacteristics?: string
    targetAndPurpose?: string
  }
  // タグの分類
  tagClassification?: {
    genre?: string[]
    style?: string[]
    audience?: string[]
    format?: string[]
    purpose?: string[]
    technique?: string[]
    quality?: string[]
    unique?: string[]
  }
  // 改善提案
  improvementSuggestions?: string[]
  // 専門的洞察
  professionalInsights?: {
    editorialQuality?: string
    marketValue?: string
    scalabilityPotential?: string
    marketPositioning?: string
    industryTrends?: string
  }
  // 記事専用の分析（後方互換性のため保持）
  articleSpecificAnalysis?: {
    writingStyle?: string
    structureQuality?: string
    researchDepth?: string
    readerValue?: string
    editorialQuality?: string
  }
  targetAudience?: string
  uniqueValue?: string
  contentTypeAnalysis?: string
}

// カテゴリの型定義
export interface WorkCategory {
  id: string
  name: string
  color: string
  works: WorkData[]
}

// 役割分布の型定義
export interface RoleDistribution {
  role: string
  count: number
  percentage: number
  color: string
}

// タグデータの型定義
export interface TagData {
  name: string
  count: number
  color: string
}

// 統計データの型定義
export interface WorkStatistics {
  totalWorks: number
  roleDistribution: RoleDistribution[]
  tagData: TagData[]
} 