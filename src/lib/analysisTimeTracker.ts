// AI分析時間の追跡と予測機能

interface AnalysisTimeRecord {
  contentType: string
  contentLength: number
  hasImages: boolean
  analysisTime: number
  timestamp: number
}

class AnalysisTimeTracker {
  private records: AnalysisTimeRecord[] = []
  private readonly STORAGE_KEY = 'analysis_time_records'
  private readonly MAX_RECORDS = 50 // 最新50件のみ保持

  constructor() {
    this.loadRecords()
  }

  // 記録を読み込み
  private loadRecords() {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.records = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('分析時間記録の読み込みに失敗:', error)
      this.records = []
    }
  }

  // 記録を保存
  private saveRecords() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.records))
    } catch (error) {
      console.warn('分析時間記録の保存に失敗:', error)
    }
  }

  // 分析開始を記録
  recordAnalysisStart(contentType: string, contentLength: number, hasImages: boolean): string {
    const sessionId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // セッション情報を一時保存
    sessionStorage.setItem('current_analysis', JSON.stringify({
      sessionId,
      contentType,
      contentLength,
      hasImages,
      startTime: Date.now()
    }))
    
    return sessionId
  }

  // 分析完了を記録
  recordAnalysisEnd(_sessionId: string) {
    try {
      const sessionData = sessionStorage.getItem('current_analysis')
      if (!sessionData) return

      const { contentType, contentLength, hasImages, startTime } = JSON.parse(sessionData)
      const analysisTime = Date.now() - startTime

      // 記録を追加
      this.records.push({
        contentType,
        contentLength,
        hasImages,
        analysisTime,
        timestamp: Date.now()
      })

      // 古い記録を削除（最新50件のみ保持）
      if (this.records.length > this.MAX_RECORDS) {
        this.records = this.records.slice(-this.MAX_RECORDS)
      }

      this.saveRecords()
      sessionStorage.removeItem('current_analysis')
    } catch (error) {
      console.warn('分析時間記録の保存に失敗:', error)
    }
  }

  // 予想時間を計算
  predictAnalysisTime(contentType: string, contentLength: number, hasImages: boolean): number {
    // 類似の記録をフィルタリング
    const similarRecords = this.records.filter(record => 
      record.contentType === contentType &&
      Math.abs(record.contentLength - contentLength) < contentLength * 0.5 && // 50%以内の長さ
      record.hasImages === hasImages
    )

    if (similarRecords.length === 0) {
      // デフォルトの予想時間（秒）
      const defaultTimes: Record<string, number> = {
        'article': 25,
        'design': 35,
        'photo': 20,
        'other': 30
      }
      return defaultTimes[contentType] || 30
    }

    // 平均時間を計算（最新の記録により重み付け）
    const weights = similarRecords.map((_, index) => Math.pow(0.9, index))
    const weightedSum = similarRecords.reduce((sum, record, index) => 
      sum + ((record.analysisTime || 0) / 1000) * (weights[index] || 0), 0
    )
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

    return Math.round(weightedSum / totalWeight)
  }

  // 統計情報を取得
  getStatistics() {
    const totalRecords = this.records.length
    if (totalRecords === 0) {
      return {
        totalRecords: 0,
        averageTime: 0,
        contentTypeStats: {}
      }
    }

    const averageTime = this.records.reduce((sum, record) => 
      sum + record.analysisTime, 0
    ) / totalRecords / 1000

    const contentTypeStats = this.records.reduce((stats, record) => {
      if (!stats[record.contentType]) {
        stats[record.contentType] = { count: 0, totalTime: 0 }
      }
      stats[record.contentType].count++
      stats[record.contentType].totalTime += record.analysisTime / 1000
      return stats
    }, {} as Record<string, { count: number, totalTime: number }>)

    // 平均時間を計算
    Object.keys(contentTypeStats).forEach(contentType => {
      const stat = contentTypeStats[contentType]
      stat.averageTime = stat.totalTime / stat.count
    })

    return {
      totalRecords,
      averageTime: Math.round(averageTime),
      contentTypeStats
    }
  }

  // 記録をクリア
  clearRecords() {
    this.records = []
    this.saveRecords()
  }
}

// シングルトンインスタンス
export const analysisTimeTracker = new AnalysisTimeTracker()

// 便利な関数
export function startAnalysisTracking(contentType: string, contentLength: number, hasImages: boolean): string {
  return analysisTimeTracker.recordAnalysisStart(contentType, contentLength, hasImages)
}

export function endAnalysisTracking(sessionId: string) {
  analysisTimeTracker.recordAnalysisEnd(sessionId)
}

export function predictAnalysisTime(contentType: string, contentLength: number, hasImages: boolean): number {
  return analysisTimeTracker.predictAnalysisTime(contentType, contentLength, hasImages)
}

export function getAnalysisStatistics() {
  return analysisTimeTracker.getStatistics()
}
