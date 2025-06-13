'use client'

import { useState, useEffect } from 'react'
import { Send, MessageCircle, User } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface Comment {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    display_name: string
    avatar_image_url?: string
  }
}

interface CommentsSectionProps {
  workId: string
}

export default function CommentsSection({ workId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase環境変数が設定されていません')
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  useEffect(() => {
    const checkAuthAndFetchComments = async () => {
      setIsLoading(true)
      try {
        // 認証状態を確認
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session?.access_token)

        // コメント一覧を取得
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }
        
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        const response = await fetch(`/api/comments?workId=${workId}`, {
          headers
        })
        
        if (response.ok) {
          const data = await response.json()
          setComments(data.comments || [])
          setCommentCount(data.count || 0)
        } else {
          console.error('コメント取得エラー:', response.status)
          setComments([])
          setCommentCount(0)
        }
      } catch (error) {
        console.error('コメント取得エラー:', error)
        setComments([])
        setCommentCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    if (workId) {
      checkAuthAndFetchComments()
    }
  }, [workId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('コメントするにはログインが必要です')
      return
    }

    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const authToken = session?.access_token

      if (!authToken) {
        alert('認証エラーが発生しました')
        return
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          workId,
          content: newComment.trim(),
          targetType: 'work'
        })
      })

      if (response.ok) {
        const data = await response.json()
        // 新しいコメントを先頭に追加
        setComments(prev => [data.comment, ...prev])
        setCommentCount(prev => prev + 1)
        setNewComment('')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'コメントの投稿に失敗しました')
      }
    } catch (error) {
      console.error('コメント投稿エラー:', error)
      alert('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return '今'
    if (diffInHours < 24) return `${diffInHours}時間前`
    if (diffInDays < 7) return `${diffInDays}日前`
    return date.toLocaleDateString('ja-JP')
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          コメント {commentCount > 0 && `(${commentCount})`}
        </h3>
      </div>

      {/* コメント投稿フォーム */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="作品について感想やアドバイスを残してみませんか..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                newComment.trim() && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? '投稿中...' : '投稿'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-center">
            コメントするには
            <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              ログイン
            </button>
            が必要です
          </p>
        </div>
      )}

      {/* コメント一覧 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">コメントを読み込み中...</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {/* アバター */}
                <div className="flex-shrink-0">
                  {comment.user.avatar_image_url ? (
                    <img
                      src={comment.user.avatar_image_url}
                      alt={comment.user.display_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* コメント内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.user.display_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">まだコメントがありません</p>
          <p className="text-sm text-gray-400">最初のコメントを投稿してみませんか？</p>
        </div>
      )}
    </div>
  )
} 