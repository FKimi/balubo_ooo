import { useState, useEffect } from 'react'

interface TagStatistic {
  tag: string
  count: number
  percentage: number
}

interface TagStatisticsData {
  totalWorks: number
  tagStatistics: TagStatistic[]
  topTags: TagStatistic[]
}

export function useTagStatistics() {
  const [data, setData] = useState<TagStatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTagStatistics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/profile/tag-statistics')
        
        if (!response.ok) {
          throw new Error('Failed to fetch tag statistics')
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTagStatistics()
  }, [])

  // 特定のタグの統計を取得
  const getTagStatistic = (tagName: string): TagStatistic | null => {
    if (!data) return null
    return data.tagStatistics.find(stat => stat.tag === tagName) || null
  }

  // タグの相対的な位置づけを計算
  const getTagRanking = (tagName: string): number | null => {
    if (!data) return null
    const index = data.tagStatistics.findIndex(stat => stat.tag === tagName)
    return index >= 0 ? index + 1 : null
  }

  return {
    data,
    loading,
    error,
    getTagStatistic,
    getTagRanking
  }
} 