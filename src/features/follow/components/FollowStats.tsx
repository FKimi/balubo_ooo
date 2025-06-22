'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetcher } from '@/utils/fetcher'
import { Users, UserCheck } from 'lucide-react'
import { FollowModal } from './FollowModal'

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
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<'followers' | 'following'>('followers')

  const fetchStats = useCallback(async () => {
    if (!userId) return

    try {
      const data = await fetcher<FollowStatsData>(`/api/connections/stats?userId=${userId}`)
      setStats(data)
    } catch (error) {
      console.error('フォロー統計取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchStats()
  }, [userId, fetchStats])

  // 30秒ごとに統計を更新（軽量化）
  useEffect(() => {
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

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

  const openModal = (tab: 'followers' | 'following') => {
    setModalTab(tab)
    setModalOpen(true)
  }

  return (
    <>
      <div className="flex gap-6 text-sm">
        {/* フォロワー数 */}
        <button
          onClick={() => openModal('followers')}
          className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
        >
          <Users className="w-4 h-4 text-gray-500" />
          <div>
            <div className="font-semibold text-gray-900">{stats.followerCount}</div>
            <div className="text-xs text-gray-600">フォロワー</div>
          </div>
        </button>

        {/* フォロー中数 */}
        <button
          onClick={() => openModal('following')}
          className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
        >
          <UserCheck className="w-4 h-4 text-gray-500" />
          <div>
            <div className="font-semibold text-gray-900">{stats.followingCount}</div>
            <div className="text-xs text-gray-600">フォロー中</div>
          </div>
        </button>
      </div>

      {/* フォローモーダル */}
      <FollowModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={userId}
        initialTab={modalTab}
      />
    </>
  )
} 