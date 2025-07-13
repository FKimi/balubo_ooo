'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const router = useRouter()
  const _searchParams = useSearchParams()

  useEffect(() => {
    // URLからアクセストークンを確認
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')
    
    if (!accessToken || type !== 'recovery') {
      setError('無効なパスワードリセットリンクです')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      setError('すべての項目を入力してください')
      return
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError('パスワードの更新に失敗しました: ' + error.message)
      } else {
        setMessage('パスワードが正常に更新されました。ログインページに移動しています...')
        setTimeout(() => {
          router.push('/login?message=password_reset_success')
        }, 2000)
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
          <p className="text-text-secondary mt-2">クリエイターのためのキャリアSNS</p>
        </div>

        {/* パスワードリセットフォーム */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">新しいパスワードを設定</CardTitle>
            <CardDescription>
              新しいパスワードを入力してアカウントのセキュリティを保護してください
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
                <Label htmlFor="password">新しいパスワード</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="新しいパスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード確認</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="パスワードを再入力"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-accent-dark-blue hover:bg-primary-blue"
                disabled={isLoading}
              >
                {isLoading ? '更新中...' : 'パスワードを更新'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-light-gray flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark-blue mx-auto"></div>
          <p className="mt-2 text-text-secondary">読み込み中...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
} 