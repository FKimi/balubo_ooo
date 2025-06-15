'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, User, Search } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface User {
  id: string
  display_name: string
  avatar_image_url?: string
  professions: string[]
}

export default function NewMessagePage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  useEffect(() => {
    fetchFollowingUsers()
  }, [])

  useEffect(() => {
    // 検索フィルタリング
    const filtered = users.filter(user =>
      user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.professions.some(profession => 
        profession.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    setFilteredUsers(filtered)
  }, [users, searchQuery])

  const fetchFollowingUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/messages/new', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API エラー:', errorData)
        throw new Error(errorData.details || 'ユーザー取得に失敗しました')
      }

      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error('ユーザー取得エラー:', error)
      setError(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleStartConversation = async () => {
    if (!selectedUser || sending) return

    try {
      setSending(true)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/messages/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          participantId: selectedUser.id,
          initialMessage: message.trim() || undefined
        })
      })

      if (!response.ok) {
        throw new Error('会話の作成に失敗しました')
      }

      const data = await response.json()
      
      // 作成された会話ページに移動
      router.push(`/messages/${data.conversationId}`)
      
    } catch (error) {
      console.error('会話作成エラー:', error)
      setError(error instanceof Error ? error.message : '会話の作成に失敗しました')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* ページヘッダー */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.push('/messages')}
                className="p-2 hover:bg-gray-100/80 rounded-full transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">新しいメッセージ</h1>
                <p className="text-gray-600">メッセージを送信する相手を選択してください</p>
              </div>
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
              {/* 検索バー */}
              <div className="p-6 border-b border-gray-200/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ユーザーを検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/90"
                  />
                </div>
              </div>

              {/* ユーザー一覧 */}
              <div className="max-h-96 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? 'bg-blue-50 border-l-4 border-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {/* アバター */}
                          <div className="flex-shrink-0">
                            {user.avatar_image_url ? (
                              <img
                                src={user.avatar_image_url}
                                alt={user.display_name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-white shadow-sm">
                                <User className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>

                          {/* ユーザー情報 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {user.display_name}
                            </h3>
                            {user.professions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.professions.slice(0, 3).map((profession) => (
                                  <span
                                    key={profession}
                                    className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                  >
                                    {profession}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 選択インジケーター */}
                          {selectedUser?.id === user.id && (
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    {searchQuery ? (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          検索結果が見つかりません
                        </h3>
                        <p className="text-gray-500">
                          「{searchQuery}」に一致するユーザーはいません
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          メッセージを送信できるユーザーがいません
                        </h3>
                        <p className="text-gray-500">
                          他のクリエイターをフォローするか、プロフィールページからメッセージを送信してください
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* メッセージ入力エリア */}
            {selectedUser && (
              <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedUser.display_name} にメッセージを送信
                  </h3>
                  <p className="text-gray-600 text-sm">
                    最初のメッセージを入力してください（オプション）
                  </p>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="メッセージを入力..."
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-lg resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/90"
                    rows={3}
                    disabled={sending}
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={sending}
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleStartConversation}
                      disabled={sending}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 ${
                        sending
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg shadow-blue-500/25'
                      }`}
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {sending ? '作成中...' : '会話を開始'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 