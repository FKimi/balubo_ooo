'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface Notification {
  id: string
  type: 'connection_request' | 'connection_approved' | 'new_review' | 'work_comment'
  message: string
  relatedEntityId?: string
  relatedEntityType?: 'user' | 'review' | 'work'
  isRead: boolean
  createdAt: string
  fromUser?: {
    id: string
    displayName: string
    avatarUrl?: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'connection_request',
      message: '田中 太郎さんからつながり申請が届きました',
      relatedEntityId: 'user1',
      relatedEntityType: 'user',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z',
      fromUser: {
        id: 'user1',
        displayName: '田中 太郎'
      }
    },
    {
      id: '2',
      type: 'connection_approved',
      message: '佐藤 花子さんがあなたのつながり申請を承認しました',
      relatedEntityId: 'user2',
      relatedEntityType: 'user',
      isRead: false,
      createdAt: '2024-01-14T16:45:00Z',
      fromUser: {
        id: 'user2',
        displayName: '佐藤 花子'
      }
    },
    {
      id: '3',
      type: 'new_review',
      message: '山田 次郎さんがあなたのプロフィールにレビューを投稿しました',
      relatedEntityId: 'review1',
      relatedEntityType: 'review',
      isRead: true,
      createdAt: '2024-01-13T14:20:00Z',
      fromUser: {
        id: 'user3',
        displayName: '山田 次郎'
      }
    },
    {
      id: '4',
      type: 'new_review',
      message: '鈴木 美咲さんがあなたの作品「Webサイトリニューアル」にレビューを投稿しました',
      relatedEntityId: 'review2',
      relatedEntityType: 'review',
      isRead: true,
      createdAt: '2024-01-12T09:15:00Z',
      fromUser: {
        id: 'user4',
        displayName: '鈴木 美咲'
      }
    }
  ])

  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [isLoading, setIsLoading] = useState(false)

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
        return (
          <div className="w-10 h-10 bg-primary-light-blue rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-dark-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        )
      case 'connection_approved':
        return (
          <div className="w-10 h-10 bg-success-green rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'new_review':
        return (
          <div className="w-10 h-10 bg-warning-yellow rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 bg-ui-background-gray rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H6l5 5v-5z" />
            </svg>
          </div>
        )
    }
  }

  const getNotificationAction = (notification: Notification) => {
    switch (notification.type) {
      case 'connection_request':
        return (
          <Link href="/connections">
            <Button size="sm" className="bg-accent-dark-blue hover:bg-primary-blue">
              確認する
            </Button>
          </Link>
        )
      case 'connection_approved':
        return (
          <Link href={`/profile/${notification.relatedEntityId}`}>
            <Button variant="outline" size="sm">
              プロフィールを見る
            </Button>
          </Link>
        )
      case 'new_review':
        return (
          <Link href="/profile">
            <Button variant="outline" size="sm">
              レビューを見る
            </Button>
          </Link>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'たった今'
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}日前`
    } else {
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const markAsRead = async (notificationId: string) => {
    setIsLoading(true)
    try {
      // TODO: 通知を既読にするAPI呼び出し
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Mark as read error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAllAsRead = async () => {
    setIsLoading(true)
    try {
      // TODO: すべての通知を既読にするAPI呼び出し
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      )
    } catch (error) {
      console.error('Mark all as read error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-light-gray">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* ページヘッダー */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">通知</h1>
                  <p className="text-text-secondary">
                    つながり申請やレビューなどの最新情報をお知らせします
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={markAllAsRead}
                    disabled={isLoading}
                  >
                    すべて既読にする
                  </Button>
                )}
              </div>

              {/* フィルター */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-accent-dark-blue text-white'
                      : 'bg-white text-text-secondary hover:text-text-primary'
                  }`}
                >
                  すべて ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-accent-dark-blue text-white'
                      : 'bg-white text-text-secondary hover:text-text-primary'
                  }`}
                >
                  未読 ({unreadCount})
                </button>
              </div>
            </div>

            {/* 通知一覧 */}
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-text-tertiary mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM11 17H6l5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    {filter === 'unread' ? '未読の通知はありません' : '通知はありません'}
                  </h3>
                  <p className="text-text-secondary">
                    {filter === 'unread' 
                      ? 'すべての通知を確認済みです'
                      : '新しい通知があるとここに表示されます'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`hover:shadow-md transition-shadow cursor-pointer ${
                      !notification.isRead ? 'border-l-4 border-l-accent-dark-blue bg-primary-light-blue/5' : ''
                    }`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* アイコン */}
                        {getNotificationIcon(notification.type)}

                        {/* 通知内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className={`text-sm ${!notification.isRead ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-text-tertiary mt-1">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                            
                            {/* 未読インジケーター */}
                            {!notification.isRead && (
                              <div className="w-3 h-3 bg-accent-dark-blue rounded-full flex-shrink-0 ml-2"></div>
                            )}
                          </div>

                          {/* アクションボタン */}
                          <div className="flex items-center space-x-3 mt-3">
                            {getNotificationAction(notification)}
                            
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                                disabled={isLoading}
                                className="text-text-tertiary hover:text-text-secondary"
                              >
                                既読にする
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 