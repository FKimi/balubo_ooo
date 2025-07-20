'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Send, User, MoreVertical, Edit3, Trash2, Check, X } from 'lucide-react'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui'

// アニメーション用のスタイル
const fadeInStyle = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`

interface Message {
  id: string
  content: string
  messageType: string
  isRead: boolean
  readAt?: string
  createdAt: string
  isEdited?: boolean
  editedAt?: string
  originalContent?: string
  sender: {
    id: string
    display_name: string
    avatar_image_url?: string
  }
  isFromMe: boolean
}

interface OtherParticipant {
  id: string
  display_name: string
  avatar_image_url?: string
  professions: string[]
}

// 共有インスタンスをモジュールスコープで確保
const supabase = getSupabaseBrowserClient()

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [otherParticipant, setOtherParticipant] = useState<OtherParticipant | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<any>(null)
  const router = useRouter()
  const params = useParams()
  const conversationId = params.conversationId as string

  // スクロール維持
  // (messages 変更時に最下部へ)
  

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('会話が見つかりません')
        } else if (response.status === 403) {
          setError('この会話にアクセスする権限がありません')
        } else {
          throw new Error('メッセージの取得に失敗しました')
        }
        return
      }

      const data = await response.json()
      setMessages(data.messages)

      // 相手の情報を取得（最初のメッセージから）
      if (data.messages.length > 0) {
        const firstOtherMessage = data.messages.find((msg: Message) => !msg.isFromMe)
        if (firstOtherMessage) {
          setOtherParticipant({
            id: firstOtherMessage.sender.id,
            display_name: firstOtherMessage.sender.display_name,
            avatar_image_url: firstOtherMessage.sender.avatar_image_url,
            professions: [] // APIから取得する場合は別途実装
          })
        }
      }
    } catch (error) {
      console.error('メッセージ取得エラー:', error)
      setError(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [conversationId, router]);

  const setupRealtimeSubscription = useCallback(() => {
    if (!conversationId) return () => {}
    
    // 既存のチャンネルをクリーンアップ
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current)
      } catch (error) {
        console.warn('既存のチャンネルクリーンアップエラー:', error)
      }
    }
    
    // 新しいチャンネルを作成
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = payload.new as any
          // 新しいメッセージを追加（自分が送信したメッセージでない場合のみ）
          if (newMessage.sender_id !== supabase.auth.getUser().then(u => u.data.user?.id)) {
            // fetchMessagesを直接呼び出すのではなく、メッセージを直接追加
            setMessages(prev => [...prev, newMessage])
          }
        }
      )
      .subscribe((status, err) => {
        console.log('メッセージリアルタイム購読ステータス:', status, err)
        
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.warn('メッセージリアルタイム接続でエラーが発生しました:', err)
          // エラー時はチャンネルをクリーンアップ（再帰呼び出しを避ける）
          channelRef.current = null
        }
      })

    channelRef.current = channel

    // クリーンアップ関数を返す
    return () => {
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current)
        } catch (error) {
          console.warn('チャンネルクリーンアップエラー:', error)
        }
        channelRef.current = null
      }
    }
  }, [conversationId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // データ取得とリアルタイム購読
  useEffect(() => {
    if (conversationId) {
      fetchMessages()
      const cleanup = setupRealtimeSubscription()
      
      return () => {
        cleanup()
      }
    }
    return undefined
  }, [conversationId, fetchMessages, setupRealtimeSubscription])

  // メッセージ更新時に自動スクロール
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          content: newMessage.trim()
        })
      })

      if (!response.ok) {
        throw new Error('メッセージの送信に失敗しました')
      }

      const data = await response.json()
      
      // 送信したメッセージを即座に表示
      setMessages(prev => [...prev, data.message])
      setNewMessage('')
      
    } catch (error) {
      console.error('メッセージ送信エラー:', error)
      setError(error instanceof Error ? error.message : 'メッセージの送信に失敗しました')
    } finally {
      setSending(false)
    }
  }

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          messageId,
          content: newContent.trim()
        })
      })

      if (!response.ok) {
        throw new Error('メッセージの編集に失敗しました')
      }

      const data = await response.json()
      
      // メッセージリストを更新
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? data.message : msg
      ))
      
      setEditingMessageId(null)
      setEditingContent('')
      
    } catch (error) {
      console.error('メッセージ編集エラー:', error)
      setError(error instanceof Error ? error.message : 'メッセージの編集に失敗しました')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('このメッセージを削除しますか？')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/messages/${conversationId}?messageId=${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('メッセージの削除に失敗しました')
      }
      
      // メッセージリストから削除
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
      
    } catch (error) {
      console.error('メッセージ削除エラー:', error)
      setError(error instanceof Error ? error.message : 'メッセージの削除に失敗しました')
    }
  }

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id)
    setEditingContent(message.content)
  }

  const cancelEditing = () => {
    setEditingMessageId(null)
    setEditingContent('')
  }

  const formatMessageTime = (timestamp: string) => {
    const messageTime = new Date(timestamp)
    return messageTime.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatMessageDate = (timestamp: string) => {
    const messageTime = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageTime.toDateString() === today.toDateString()) {
      return '今日'
    } else if (messageTime.toDateString() === yesterday.toDateString()) {
      return '昨日'
    } else {
      return messageTime.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs
    }))
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* チャットヘッダー */}
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>

              {/* メッセージバブルのスケルトン */}
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className="max-w-xs lg:max-w-md">
                    <Skeleton className="h-10 w-full rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">エラーが発生しました</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <Button
                  onClick={() => router.push('/messages')}
                  className="font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  メッセージ一覧に戻る
                </Button>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <style jsx>{fadeInStyle}</style>
        <Header />
        
        {/* チャットヘッダー */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label="メッセージ一覧に戻る"
                onClick={() => router.push('/messages')}
                className="hover:bg-gray-100/80 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              {otherParticipant && (
                <>
                  <div className="relative">
                    {otherParticipant.avatar_image_url ? (
                      <Image
                         src={otherParticipant.avatar_image_url}
                         alt={otherParticipant.display_name}
                         width={48}
                         height={48}
                         className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                       />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-white shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                    {/* オンライン状態インジケーター */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">{otherParticipant.display_name}</h2>
                    <p className="text-sm text-green-500 font-medium">オンライン</p>
                  </div>
                </>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              aria-label="メニュー"
              className="hover:bg-gray-100/80 hover:scale-105"
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messageGroups.length > 0 ? (
              <div className="space-y-8">
                {messageGroups.map(({ date, messages: dayMessages }) => (
                  <div key={date}>
                    {/* 日付セパレーター */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-white/70 backdrop-blur-sm text-gray-600 text-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50">
                        {dayMessages[0] && formatMessageDate(dayMessages[0].createdAt)}
                      </div>
                    </div>
                    
                    {/* その日のメッセージ */}
                    <div className="space-y-3">
                      {dayMessages.map((message, index) => {
                        const isConsecutive = index > 0 && dayMessages[index - 1]?.isFromMe === message.isFromMe
                        return (
                          <div
                            key={message.id}
                            className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
                          >
                            <div className={`flex items-end gap-3 max-w-xs lg:max-w-md ${message.isFromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              {/* アバター（相手のメッセージのみ、連続でない場合のみ） */}
                              {!message.isFromMe && (
                                <div className="flex-shrink-0">
                                  {!isConsecutive ? (
                                    message.sender.avatar_image_url ? (
                                      <Image
                                         src={message.sender.avatar_image_url}
                                         alt={message.sender.display_name}
                                         width={32}
                                         height={32}
                                         className="w-8 h-8 rounded-full object-cover shadow-sm"
                                       />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm">
                                        <User className="h-4 w-4 text-white" />
                                      </div>
                                    )
                                  ) : (
                                    <div className="w-8 h-8"></div>
                                  )}
                                </div>
                              )}
                              
                              {/* メッセージバブル */}
                              <div className={`group relative px-4 py-3 rounded-2xl transition-all duration-200 hover:scale-[1.02] ${
                                message.isFromMe 
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                                  : 'bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-900 shadow-sm hover:shadow-md'
                              } ${isConsecutive ? (message.isFromMe ? 'rounded-tr-md' : 'rounded-tl-md') : ''}`}>
                                
                                {/* 編集・削除ボタン（一時的に無効化） */}
                                {false && message.isFromMe && editingMessageId !== message.id && (
                                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => startEditing(message)}
                                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                        title="編集"
                                      >
                                        <Edit3 className="h-3 w-3 text-gray-600" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMessage(message.id)}
                                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                        title="削除"
                                      >
                                        <Trash2 className="h-3 w-3 text-red-600" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* メッセージ内容 */}
                                {editingMessageId === message.id ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={editingContent}
                                      onChange={(e) => setEditingContent(e.target.value)}
                                      className="w-full p-2 text-sm bg-white/90 border border-gray-300 rounded-lg resize-none text-gray-900"
                                      rows={2}
                                      autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="キャンセル"
                                        onClick={cancelEditing}
                                        className="bg-gray-200 hover:bg-gray-300"
                                      >
                                        <X className="h-3 w-3 text-gray-600" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="保存"
                                        onClick={() => handleEditMessage(message.id, editingContent)}
                                        disabled={!editingContent.trim()}
                                        className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                                      >
                                        <Check className="h-3 w-3 text-white" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                    {false && message.isEdited && (
                                      <p className={`text-xs mt-1 italic ${
                                        message.isFromMe ? 'text-blue-200' : 'text-gray-400'
                                      }`}>
                                        編集済み
                                      </p>
                                    )}
                                  </>
                                )}

                                {/* タイムスタンプと既読表示 */}
                                {editingMessageId !== message.id && (
                                  <div className={`flex items-center justify-between mt-2 ${
                                    message.isFromMe ? 'text-blue-100' : 'text-gray-500'
                                  }`}>
                                    <span className="text-xs">
                                      {formatMessageTime(message.createdAt)}
                                    </span>
                                    {message.isFromMe && (
                                      <div className="flex items-center gap-1">
                                        {message.isRead ? (
                                          <div className="flex">
                                            <div className="w-3 h-3 rounded-full bg-blue-200 opacity-60"></div>
                                            <div className="w-3 h-3 rounded-full bg-blue-200 -ml-1"></div>
                                          </div>
                                        ) : (
                                          <div className="w-3 h-3 rounded-full bg-blue-200 opacity-40"></div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">会話を始めましょう</h3>
                <p className="text-gray-600 max-w-md mx-auto">最初のメッセージを送信して、素敵な会話をスタートしてください</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* メッセージ入力エリア */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-4 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    // 自動リサイズ
                    const textarea = e.target as HTMLTextAreaElement
                    textarea.style.height = 'auto'
                    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
                  }}
                  placeholder="メッセージを入力..."
                  className="w-full px-5 py-4 pr-12 border border-gray-300/50 rounded-3xl resize-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md"
                  rows={1}
                  disabled={sending}
                  style={{ minHeight: '52px', maxHeight: '120px' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                {/* 文字数カウンター（オプション） */}
                {newMessage.length > 100 && (
                  <div className="absolute bottom-2 right-4 text-xs text-gray-400">
                    {newMessage.length}/1000
                  </div>
                )}
              </div>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                aria-label="送信"
                disabled={!newMessage.trim() || sending}
                className={`p-4 rounded-full shadow-lg ${
                  newMessage.trim() && !sending
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-blue-500/25'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            
            {/* タイピングインジケーター（将来的に実装） */}
            {/* <div className="mt-2 text-sm text-gray-500">
              <span className="animate-pulse">相手が入力中...</span>
            </div> */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 