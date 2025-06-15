'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, User, Search, Plus } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface Conversation {
  id: string
  otherParticipant: {
    id: string
    display_name: string
    avatar_image_url?: string
    professions: string[]
  }
  lastMessage: {
    content: string
    senderId: string
    timestamp: string
    isFromMe: boolean
  }
  createdAt: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('会話一覧の取得に失敗しました')
      }

      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error('会話一覧取得エラー:', error)
      setError(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'たった今'
    if (diffInMinutes < 60) return `${diffInMinutes}分前`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}日前`
    
    return messageTime.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConversationClick = (conversationId: string) => {
    router.push(`/messages/${conversationId}`)
  }

  const handleNewMessage = () => {
    // フォロー中のユーザー一覧から選択するモーダルを表示
    router.push('/messages/new')
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
                <span className="ml-3 text-gray-600">読み込み中...</span>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* ページヘッダー */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">メッセージ</h1>
                  <p className="text-gray-600">クリエイター同士でコミュニケーションを取りましょう</p>
                </div>
              </div>
              <button
                onClick={handleNewMessage}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                新しいメッセージ
              </button>
            </div>

            {/* 検索バー */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="会話を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchConversations}
                  className="mt-2 text-red-700 hover:text-red-800 font-medium"
                >
                  再試行
                </button>
              </div>
            )}

            {/* 会話一覧 */}
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
              {filteredConversations.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationClick(conversation.id)}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* アバター */}
                        <div className="flex-shrink-0">
                          {conversation.otherParticipant.avatar_image_url ? (
                            <img
                              src={conversation.otherParticipant.avatar_image_url}
                              alt={conversation.otherParticipant.display_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>

                        {/* 会話情報 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {conversation.otherParticipant.display_name}
                            </h3>
                            <span className="text-sm text-gray-500 flex-shrink-0">
                              {formatTimeAgo(conversation.lastMessage.timestamp)}
                            </span>
                          </div>

                          {/* 職種タグ */}
                          {conversation.otherParticipant.professions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {conversation.otherParticipant.professions.slice(0, 2).map((profession) => (
                                <span
                                  key={profession}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                >
                                  {profession}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* 最新メッセージ */}
                          <div className="flex items-center gap-2">
                            {conversation.lastMessage.isFromMe && (
                              <span className="text-xs text-gray-500">あなた:</span>
                            )}
                            <p className="text-gray-600 truncate text-sm">
                              {conversation.lastMessage.content || 'メッセージがありません'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  {searchQuery ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        検索結果が見つかりません
                      </h3>
                      <p className="text-gray-500">
                        「{searchQuery}」に一致する会話はありません
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        まだメッセージがありません
                      </h3>
                      <p className="text-gray-500 mb-4">
                        他のクリエイターとメッセージを始めてみましょう
                      </p>
                      <button
                        onClick={handleNewMessage}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        新しいメッセージを開始
                      </button>
                    </>
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