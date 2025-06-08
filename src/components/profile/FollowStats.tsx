'use client'

import { useState, useEffect } from 'react'
import { Users, UserCheck } from 'lucide-react'

interface FollowStatsProps {
  userId: string
}

interface FollowStatsData {
  followerCount: number
  followingCount: number
}

export function FollowStats({ userId }: FollowStatsProps) {
  const [stats, setStats] = useState<FollowStatsData>({ followerCount: 0, followingCount: 0 })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/connections/stats?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('フォロー統計取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [userId])

  // 5秒ごとに統計を更新（リアルタイム更新の簡易版）
  useEffect(() => {
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [userId])

  if (loading) {
    return (
      <div className="flex gap-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 text-sm">
      {/* フォロワー数 */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-500" />
        <div>
          <div className="font-semibold text-gray-900">{stats.followerCount}</div>
          <div className="text-xs text-gray-600">フォロワー</div>
        </div>
      </div>

      {/* フォロー中数 */}
      <div className="flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-gray-500" />
        <div>
          <div className="font-semibold text-gray-900">{stats.followingCount}</div>
          <div className="text-xs text-gray-600">フォロー中</div>
        </div>
      </div>
    </div>
  )
} 