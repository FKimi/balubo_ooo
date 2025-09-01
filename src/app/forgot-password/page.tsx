'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('メールアドレスを入力してください')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError('パスワードリセットに失敗しました: ' + error.message)
      } else {
        setMessage('パスワードリセット用のメールを送信しました。メールをご確認ください。')
      }
    } catch (error) {
      setError('予期しないエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-light-gray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-accent-dark-blue">balubo</h1>
          </Link>
          <p className="text-text-secondary mt-2">クリエイターのためのAI分析型ポートフォリオ</p>
        </div>

        {/* パスワードリセットフォーム */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">パスワードを忘れた方</CardTitle>
            <CardDescription>
              メールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 成功メッセージ */}
              {message && (
                <div className="p-3 rounded-lg bg-primary-blue/10 border border-primary-blue/20">
                  <p className="text-sm text-primary-blue">{message}</p>
                </div>
              )}

              {/* エラーメッセージ */}
              {error && (
                <div className="p-3 rounded-lg bg-error-red/10 border border-error-red/20">
                  <p className="text-sm text-error-red">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-accent-dark-blue hover:bg-primary-blue"
                disabled={isLoading}
              >
                {isLoading ? '送信中...' : 'パスワードリセット用メールを送信'}
              </Button>
            </form>

            {/* ログインに戻るリンク */}
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-accent-dark-blue hover:underline">
                ← ログインページに戻る
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 