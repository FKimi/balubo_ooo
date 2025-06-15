'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface MessageButtonProps {
  targetUserId: string
}

export default function MessageButton({ targetUserId }: MessageButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const handleStartConversation = async () => {
    try {
      setLoading(true)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      // 自分自身にはメッセージを送れない
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id === targetUserId) {
        return
      }

      // 新しい会話を作成または既存の会話を取得
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          otherUserId: targetUserId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 403) {
          alert('このユーザーはダイレクトメッセージを受け取らない設定になっています')
          return
        }
        throw new Error(errorData.error || 'メッセージの開始に失敗しました')
      }

      const data = await response.json()
      
      // 会話画面に遷移
      router.push(`/messages/${data.conversationId}`)

    } catch (error) {
      console.error('メッセージ開始エラー:', error)
      alert(error instanceof Error ? error.message : 'メッセージの開始に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleStartConversation}
      disabled={loading}
      className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border border-gray-200 shadow-lg px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MessageCircle className="w-4 h-4" />
      {loading ? '...' : 'メッセージ'}
    </button>
  )
} 