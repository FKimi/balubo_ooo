'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface Connection {
  id: string
  userId: string
  displayName: string
  bio: string
  professions: string[]
  location: string
  avatarUrl?: string
  status: 'pending' | 'approved' | 'declined'
  requestedAt: string
  isRequester: boolean // 自分が申請者かどうか
}

export default function ConnectionsPage() {
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'connected'>('received')
  const [isLoading, setIsLoading] = useState(false)

  // サンプルデータ（実際はSupabaseから取得）
  const sampleConnections: Connection[] = [
    {
      id: '1',
      userId: 'user1',
      displayName: '田中 太郎',
      bio: 'UI/UXデザイナーとして5年の経験があります。ユーザー中心設計を重視し、使いやすいインターフェースの設計を得意としています。',
      professions: ['UI/UXデザイナー', 'Webデザイナー'],
      location: '東京都',
      status: 'pending',
      requestedAt: '2024-01-15T10:30:00Z',
      isRequester: false
    },
    {
      id: '2',
      userId: 'user2',
      displayName: '佐藤 花子',
      bio: 'フロントエンドエンジニアとして、React/Next.jsを使った開発を専門としています。',
      professions: ['フロントエンドエンジニア'],
      location: '大阪府',
      status: 'approved',
      requestedAt: '2024-01-10T14:20:00Z',
      isRequester: false
    },
    {
      id: '3',
      userId: 'user3',
      displayName: '山田 次郎',
      bio: 'ライター・編集者として10年以上の経験があります。',
      professions: ['ライター', '編集者'],
      location: '神奈川県',
      status: 'pending',
      requestedAt: '2024-01-12T09:15:00Z',
      isRequester: true
    },
    {
      id: '4',
      userId: 'user4',
      displayName: '鈴木 美咲',
      bio: 'グラフィックデザイナーとして企業のブランディングを手がけています。',
      professions: ['グラフィックデザイナー'],
      location: '愛知県',
      status: 'approved',
      requestedAt: '2024-01-08T16:45:00Z',
      isRequester: true
    }
  ]

  const receivedRequests = sampleConnections.filter(
    conn => !conn.isRequester && conn.status === 'pending'
  )

  const sentRequests = sampleConnections.filter(
    conn => conn.isRequester && conn.status === 'pending'
  )

  const connectedUsers = sampleConnections.filter(
    conn => conn.status === 'approved'
  )

  const handleApproveRequest = async (connectionId: string) => {
    setIsLoading(true)
    try {
      // TODO: つながり申請承認API呼び出し
      console.log('Approving connection:', connectionId)
      // 実際の実装では状態を更新
    } catch (error) {
      console.error('Approve connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeclineRequest = async (connectionId: string) => {
    setIsLoading(true)
    try {
      // TODO: つながり申請拒否API呼び出し
      console.log('Declining connection:', connectionId)
      // 実際の実装では状態を更新
    } catch (error) {
      console.error('Decline connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRequest = async (connectionId: string) => {
    setIsLoading(true)
    try {
      // TODO: つながり申請取り消しAPI呼び出し
      console.log('Canceling connection request:', connectionId)
      // 実際の実装では状態を更新
    } catch (error) {
      console.error('Cancel connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveConnection = async (connectionId: string) => {
    if (!confirm('このつながりを解除しますか？')) return

    setIsLoading(true)
    try {
      // TODO: つながり解除API呼び出し
      console.log('Removing connection:', connectionId)
      // 実際の実装では状態を更新
    } catch (error) {
      console.error('Remove connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const ConnectionCard = ({ connection, showActions }: { connection: Connection; showActions: 'received' | 'sent' | 'connected' }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* アバター */}
          <div className="w-12 h-12 bg-primary-light-blue rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-accent-dark-blue font-bold">
              {connection.displayName.charAt(0)}
            </span>
          </div>

          {/* プロフィール情報 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  {connection.displayName}
                </h3>
                <p className="text-text-secondary text-sm">
                  {connection.location} • {formatDate(connection.requestedAt)}
                </p>
              </div>
            </div>

            {/* 職種タグ */}
            <div className="flex flex-wrap gap-2 mb-3">
              {connection.professions.map((profession) => (
                <span
                  key={profession}
                  className="px-2 py-1 bg-primary-light-blue/20 text-accent-dark-blue rounded text-sm"
                >
                  {profession}
                </span>
              ))}
            </div>

            {/* 自己紹介 */}
            <p className="text-text-secondary text-sm mb-4 line-clamp-2">
              {connection.bio}
            </p>

            {/* アクションボタン */}
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${connection.userId}`}>
                <Button variant="outline" size="sm">
                  プロフィールを見る
                </Button>
              </Link>

              {showActions === 'received' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApproveRequest(connection.id)}
                    disabled={isLoading}
                    className="bg-accent-dark-blue hover:bg-primary-blue"
                  >
                    承認
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeclineRequest(connection.id)}
                    disabled={isLoading}
                  >
                    拒否
                  </Button>
                </>
              )}

              {showActions === 'sent' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelRequest(connection.id)}
                  disabled={isLoading}
                >
                  申請を取り消し
                </Button>
              )}

              {showActions === 'connected' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveConnection(connection.id)}
                  disabled={isLoading}
                  className="text-error-red hover:text-error-red"
                >
                  つながりを解除
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = ({ type }: { type: 'received' | 'sent' | 'connected' }) => {
    const messages = {
      received: {
        title: 'つながり申請はありません',
        description: '他のクリエイターからのつながり申請があるとここに表示されます'
      },
      sent: {
        title: '送信した申請はありません',
        description: 'クリエイター検索からつながりを申請してみましょう'
      },
      connected: {
        title: 'つながりがありません',
        description: 'つながり申請を承認すると、ここにつながったクリエイターが表示されます'
      }
    }

    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-text-tertiary mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {messages[type].title}
          </h3>
          <p className="text-text-secondary mb-4">
            {messages[type].description}
          </p>
          {type === 'sent' && (
            <Link href="/search">
              <Button className="bg-accent-dark-blue hover:bg-primary-blue">
                クリエイターを検索
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-light-gray">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* ページヘッダー */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">つながり管理</h1>
              <p className="text-text-secondary">
                つながり申請の管理と、つながっているクリエイターの確認ができます
              </p>
            </div>

            {/* タブナビゲーション */}
            <div className="mb-8">
              <div className="border-b border-border-color">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('received')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'received'
                        ? 'border-accent-dark-blue text-accent-dark-blue'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-color'
                    }`}
                  >
                    受信した申請
                    {receivedRequests.length > 0 && (
                      <span className="ml-2 bg-accent-dark-blue text-white text-xs rounded-full px-2 py-1">
                        {receivedRequests.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'sent'
                        ? 'border-accent-dark-blue text-accent-dark-blue'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-color'
                    }`}
                  >
                    送信した申請
                    {sentRequests.length > 0 && (
                      <span className="ml-2 bg-ui-background-gray text-text-secondary text-xs rounded-full px-2 py-1">
                        {sentRequests.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('connected')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'connected'
                        ? 'border-accent-dark-blue text-accent-dark-blue'
                        : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-color'
                    }`}
                  >
                    つながり
                    {connectedUsers.length > 0 && (
                      <span className="ml-2 bg-success-green text-white text-xs rounded-full px-2 py-1">
                        {connectedUsers.length}
                      </span>
                    )}
                  </button>
                </nav>
              </div>
            </div>

            {/* タブコンテンツ */}
            <div className="space-y-6">
              {activeTab === 'received' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                      受信したつながり申請
                    </h2>
                    <p className="text-text-secondary">
                      他のクリエイターからのつながり申請を確認し、承認または拒否してください
                    </p>
                  </div>
                  
                  {receivedRequests.length === 0 ? (
                    <EmptyState type="received" />
                  ) : (
                    <div className="space-y-4">
                      {receivedRequests.map((connection) => (
                        <ConnectionCard
                          key={connection.id}
                          connection={connection}
                          showActions="received"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sent' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                      送信したつながり申請
                    </h2>
                    <p className="text-text-secondary">
                      あなたが送信したつながり申請の状況を確認できます
                    </p>
                  </div>
                  
                  {sentRequests.length === 0 ? (
                    <EmptyState type="sent" />
                  ) : (
                    <div className="space-y-4">
                      {sentRequests.map((connection) => (
                        <ConnectionCard
                          key={connection.id}
                          connection={connection}
                          showActions="sent"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'connected' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                      つながっているクリエイター
                    </h2>
                    <p className="text-text-secondary">
                      相互につながりが承認されたクリエイターの一覧です
                    </p>
                  </div>
                  
                  {connectedUsers.length === 0 ? (
                    <EmptyState type="connected" />
                  ) : (
                    <div className="space-y-4">
                      {connectedUsers.map((connection) => (
                        <ConnectionCard
                          key={connection.id}
                          connection={connection}
                          showActions="connected"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 