'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { fetcher } from '@/utils/fetcher'
import { NotificationDropdown } from './NotificationDropdown'
import { getSupabaseBrowserClient } from '@/lib/supabase'

interface NotificationData {
  notifications: Array<{
    id: string
    type: string
    message: string
    is_read: boolean
    created_at: string
    related_entity_id?: string
    related_entity_type?: string
  }>
  unreadCount: number
}

export function NotificationBell() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData['notifications']>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const subscriptionRef = useRef<any>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 通知データを取得（リトライ機能付き）
  const fetchNotifications = useCallback(async (retryCount = 0) => {
    if (!user) return

    try {
      setIsLoading(true)
      const data: NotificationData = await fetcher('/api/notifications?limit=10')
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('通知取得エラー:', error)
      
      // 3回まで再試行
      if (retryCount < 3) {
        retryTimeoutRef.current = setTimeout(() => {
          fetchNotifications(retryCount + 1)
        }, 1000 * (retryCount + 1)) // 1秒、2秒、3秒後に再試行
      }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // 通知を既読にマーク
  const markAsRead = async (notificationIds: string[]) => {
    if (!user) return

    try {
      await fetcher('/api/notifications', {
        method: 'PATCH',
        body: JSON.stringify({ notificationIds })
      })
      
      // ローカル状態を更新
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, is_read: true }
            : notification
        )
      )
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length))
    } catch (error) {
      console.error('既読マークエラー:', error)
    }
  }

  // すべての通知を既読にマーク
  const markAllAsRead = async () => {
    if (!user) return

    try {
      await fetcher('/api/notifications', {
        method: 'PATCH',
        body: JSON.stringify({ markAllAsRead: true })
      })
      
      // ローカル状態を更新
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('全既読マークエラー:', error)
    }
  }

  // リアルタイム通知の購読
  const subscribeToNotifications = useCallback(() => {
    if (!user) return

    try {
      const supabase = getSupabaseBrowserClient()
      
      // チャンネル名をユニークにする
      const channelName = `notifications_${user.id}_${Date.now()}`
      
      subscriptionRef.current = supabase
        .channel(channelName, {
          config: {
            presence: {
              key: user.id,
            },
          },
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          console.log('新しい通知を受信:', payload)
          const newNotification = payload.new as NotificationData['notifications'][0]
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          console.log('通知更新を受信:', payload)
          const updatedNotification = payload.new as NotificationData['notifications'][0]
          setNotifications(prev => 
            prev.map(notification => 
              notification.id === updatedNotification.id 
                ? updatedNotification 
                : notification
            )
          )
          
          // 既読になった場合は未読数を減らす
          if (updatedNotification.is_read && !payload.old?.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
          }
        })
        .subscribe((status, err) => {
          console.log('リアルタイム購読ステータス:', status, err)
          
          if (status === 'SUBSCRIBED') {
            console.log('✅ 通知のリアルタイム購読が開始されました')
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ リアルタイム通知でエラーが発生しました:', err)
            // フォールバック: ポーリングに切り替え
            setupPolling()
          } else if (status === 'TIMED_OUT') {
            console.warn('⚠️ リアルタイム接続がタイムアウトしました')
            // 再接続を試行
            setTimeout(() => {
              if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe()
              }
              subscribeToNotifications()
            }, 5000)
          } else if (status === 'CLOSED') {
            console.warn('⚠️ リアルタイム接続が閉じられました')
            // 自動的にポーリングに切り替え
            setupPolling()
          }
        })
    } catch (error) {
      console.error('リアルタイム購読の設定中にエラーが発生:', error)
      // エラーが発生した場合は即座にポーリングに切り替え
      setupPolling()
    }
  }, [user])

  // ポーリング設定（リアルタイム通知のフォールバック）
  const setupPolling = useCallback(() => {
    console.log('🔄 ポーリングモードに切り替えます')
    
    // 既存のインターバルがあればクリア
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    
    // 30秒ごとにポーリング
    const interval = setInterval(() => {
      console.log('📡 ポーリングで通知を取得中...')
      fetchNotifications()
    }, 30 * 1000)
    
    // インターバルIDを保存してクリーンアップできるようにする
    retryTimeoutRef.current = interval as any
    
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // 初回読み込みとリアルタイム通知の設定
  useEffect(() => {
    // ユーザーがログアウトしている場合は何もしない
    if (!user) {
      console.log('👻 ユーザーがログアウトしています')
      return
    }

    console.log('👤 ユーザーがログインしています。通知システムを初期化...')
    
    // 初回の通知取得
    fetchNotifications()
    
    // リアルタイム購読を試行
    subscribeToNotifications()
    
    // クリーンアップ関数を必ず返す
    return () => {
      console.log('🧹 通知システムをクリーンアップ中...')
      
      // リアルタイム購読の解除
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe()
          console.log('✅ リアルタイム購読を解除しました')
        } catch (error) {
          console.error('❌ リアルタイム購読の解除でエラー:', error)
        }
      }
      
      // タイマーやインターバルのクリア
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        clearInterval(retryTimeoutRef.current)
        console.log('✅ ポーリングインターバルをクリアしました')
      }
    }
  }, [user, fetchNotifications, subscribeToNotifications, setupPolling])

  if (!user) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        disabled={isLoading}
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClose={() => setIsOpen(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  )
} 