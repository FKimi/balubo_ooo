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
  preview_data?: {
    title: string
    description: string
    image: string
    url: string
  }
  ai_analysis_result?: {
    tags: string[]
    keywords: string[]
    category: string
    summary: string
    strengths: {
      creativity: string[]
      expertise: string[]
      impact: string[]
    }
  }
  created_at: string
  updated_at: string
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