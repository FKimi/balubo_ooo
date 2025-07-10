'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { fetcher } from '@/utils/fetcher'
import { Users, Heart, MessageSquare, User } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { getNotificationIconName, getNotificationColor } from '@/lib/notificationUtils'

interface Notification {
  id: string
  type: string
  message: string
  is_read: boolean
  created_at: string
  related_entity_id?: string
  related_entity_type?: string
}

interface NotificationData {
  notifications: Notification[]
  unreadCount: number
  pagination: {
    page: number
    limit: number
    hasMore: boolean
  }
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // 通知データを取得
  const fetchNotifications = async (page = 1) => {
    if (!user) return

    try {
      setIsLoading(true)
      const data: NotificationData = await fetcher(`/api/notifications?page=${page}&limit=20`)
      
      if (page === 1) {
        setNotifications(data.notifications)
      } else {
        setNotifications(prev => [...prev, ...data.notifications])
      }
      
      setUnreadCount(data.unreadCount)
      setHasMore(data.pagination.hasMore)
      setCurrentPage(page)
    } catch (error) {
      console.error('通知取得エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  // 通知を削除（実装予定）
  const deleteNotification = async (notificationId: string) => {
    // TODO: 削除APIを実装
    console.log('通知削除:', notificationId)
  }

  // 通知タイプに応じたアイコンを取得
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead([notification.id])
    }
    
    // 関連エンティティに応じた遷移
    if (notification.related_entity_type === 'user' && notification.related_entity_id) {
      window.open(`/share/profile/${notification.related_entity_id}`, '_blank')
    } else if (notification.related_entity_type === 'work' && notification.related_entity_id) {
      window.open(`/works/${notification.related_entity_id}`, '_blank')
    }
  }

  // 日時をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 初回読み込み
  useEffect(() => {
    if (user) {
      fetchNotifications(1)
    }
  }, [user])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* ページヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              通知
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              あなたのアクティビティに関する最新の通知をお届けします
            </p>
          </div>

          {/* アクションボタン */}
          {unreadCount > 0 && (
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                未読: {unreadCount}件
              </div>
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                すべて既読にする
              </Button>
            </div>
          )}

          {/* 通知一覧 */}
          <div className="space-y-4">
            {isLoading && notifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-500">読み込み中...</p>
                </CardContent>
              </Card>
            ) : notifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    通知はありません
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    新しい通知が届くとここに表示されます
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    !notification.is_read ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* アイコン */}
                      <div className={`flex-shrink-0 p-3 rounded-lg border ${getNotificationColor(notification.type)}`}>
                        {(() => {
                          const iconName = getNotificationIconName(notification.type)
                          switch (iconName) {
                            case 'Users':
                              return <Users className="w-5 h-5" />
                            case 'Heart':
                              return <Heart className="w-5 h-5" />
                            case 'MessageSquare':
                              return <MessageSquare className="w-5 h-5" />
                            case 'User':
                              return <User className="w-5 h-5" />
                            default:
                              return <User className="w-5 h-5" />
                          }
                        })()}
                      </div>
                      
                      {/* コンテンツ */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-slate-800 dark:text-slate-100 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-sm text-slate-500 mt-2">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                          
                          {/* アクションボタン */}
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead([notification.id])}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <CheckCheck className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* クリック可能なエリア */}
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          詳細を見る →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* ページネーション */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                onClick={() => fetchNotifications(currentPage + 1)}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? '読み込み中...' : 'さらに読み込む'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 