// 作品データの型定義
export interface WorkData {
  id: string;
  title: string;
  description: string;
  external_url: string;
  tags: string[];
  roles: string[];
  categories: string[];
  production_date?: string;
  banner_image_url?: string;
  view_count?: number;
  likes_count?: number;
  comments_count?: number;
  production_notes?: string; // 制作メモ: 制作過程、作品の背景、狙い、こだわりなど
  is_featured?: boolean; // 代表作フラグ
  featured_order?: number; // 代表作の表示順序
  // 記事統計フィールド
  content_type?: string;
  article_word_count?: number;
  article_has_content?: boolean;
  // デザイン用フィールド
  design_tools?: string[];
  color_palette?: string[];
  target_platform?: string[];
  preview_data?: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
  ai_analysis_result?: AIAnalysisResult;
  created_at: string;
  updated_at: string;
  likes?: { count: number }[];
  comments?: { count: number }[];
}

// 古い形式のAI評価スコア（後方互換性のため）
export interface LegacyEvaluationScores {
  overall?: {
    score: number;
    reason?: string;
  };
  logic?: {
    score: number;
    reason?: string;
  };
  practicality?: {
    score: number;
    reason?: string;
  };
  readability?: {
    score: number;
    reason?: string;
  };
  originality?: {
    score: number;
    reason?: string;
  };
  clarity?: {
    score: number;
    reason?: string;
  };
}

// AI分析結果の詳細型定義
export interface AIAnalysisResult {
  tags: string[];
  keywords: string[];
  /** @deprecated 後方互換用。tagClassification.genre を参照してください */
  genre?: string[];
  /** @deprecated 後方互換用。tagClassification.topic 等へ移行予定 */
  topic?: string[];
  /** @deprecated 後方互換用。keywords を参照してください */
  keyword?: string[];
  /** @deprecated 後方互換用。感情分析データ */
  sentiment?: string[];
  /** @deprecated 後方互換用。タグ分類 style へ移行予定 */
  style?: string[];
  /** @deprecated 後方互換用。ターゲット読者 */
  target?: string[];
  category: string;
  summary: string;
  strengths: {
    creativity: string[];
    expertise: string[];
    impact: string[];
  };
  // AI評価スコア（新形式）
  evaluation?: {
    /** 評価サマリー（各軸を1~2行で言語化したテキスト） */
    summaries?: {
      overall: string;
      technology: string;
      expertise: string;
      creativity: string;
      impact: string;
    };
    scores?: {
      overall: {
        score: number;
        reason: string;
      };
      technology: {
        score: number;
        reason: string;
      };
      expertise: {
        score: number;
        reason: string;
      };
      creativity: {
        score: number;
        reason: string;
      };
      impact: {
        score: number;
        reason: string;
      };
    };
  };
  // BtoB特化分析指標（新形式）
  btobAnalysis?: {
    /** BtoB分析サマリー */
    summaries?: {
      industryIdentification: string;
      problemPurposeAnalysis: string;
      achievementExtraction: string;
      targetReaderEstimation: string;
      btobContextUnderstanding: string;
    };
  };
  // コンテンツ分析（課題・目的 / 想定読者 / 解決策 / 成果）
  contentAnalysis?: {
    /** 課題・目的 */
    problemPurpose?: string;
    /** 想定読者 */
    targetAudience?: string;
    /** 解決策（切り口や構成） */
    solutionApproach?: string;
    /** 成果 */
    result?: string;
    /** @deprecated 後方互換用 */
    problem?: string;
    /** @deprecated 後方互換用 */
    solution?: string;
  };
  // 古い形式のAI評価スコア（後方互換性のため）
  legacyEvaluation?: {
    scores: LegacyEvaluationScores;
  };
  // 記事専用の詳細分析
  detailedAnalysis?: {
    genreClassification?: string;
    writingStyleAnalysis?: string;
    targetReaderProfile?: string;
    contentStructure?: string;
    uniqueValueProposition?: string;
    professionalAssessment?: string;
    // 一般コンテンツ用の分析
    technicalAnalysis?: string;
    styleCharacteristics?: string;
    targetAndPurpose?: string;
  };
  // タグの分類
  tagClassification?: {
    genre?: string[];
    style?: string[];
    audience?: string[];
    format?: string[];
    purpose?: string[];
    technique?: string[];
    quality?: string[];
    unique?: string[];
  };
  // 改善提案
  improvementSuggestions?: string[];
  // 専門的洞察
  professionalInsights?: {
    editorialQuality?: string;
    marketValue?: string;
    scalabilityPotential?: string;
    marketPositioning?: string;
    industryTrends?: string;
  };
  // 記事専用の分析（後方互換性のため保持）
  articleSpecificAnalysis?: {
    writingStyle?: string;
    structureQuality?: string;
    researchDepth?: string;
    readerValue?: string;
    editorialQuality?: string;
  };
  targetAudience?: string;
  uniqueValue?: string;
  contentTypeAnalysis?: string;
}

// カテゴリの型定義
export interface WorkCategory {
  id: string;
  name: string;
  color: string;
  works: WorkData[];
}

// 役割分布の型定義
export interface RoleDistribution {
  role: string;
  count: number;
  percentage: number;
  color: string;
}

// タグデータの型定義
export interface TagData {
  name: string;
  count: number;
  color: string;
}

// 統計データの型定義
export interface WorkStatistics {
  totalWorks: number;
  roleDistribution: RoleDistribution[];
  tagData: TagData[];
}
