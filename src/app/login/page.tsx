'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  [key: string]: string
}

// バリデーション関数
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return '予期しないエラーが発生しました'
}

function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // ガード節パターンでバリデーション
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ガード節：バリデーション失敗時は早期return
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      const { data, error } = await signIn(formData.email, formData.password)

      // ガード節：エラー時は早期return
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'メールアドレスまたはパスワードが正しくありません' })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'メールアドレスの確認が完了していません。メールをご確認ください。' })
        } else {
          setErrors({ general: getErrorMessage(error) })
        }
        return
      }

      // ガード節：データまたはユーザーデータなし時は早期return
      if (!data || !data.user) {
        setErrors({ general: 'ログインに失敗しました' })
        return
      }

      // 成功パス：最後にまとめる
      router.push('/profile')
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    try {
      console.log('[Login] Googleログイン開始')
      const { data, error } = await signInWithGoogle()

      // ガード節：エラー時は早期return
      if (error) {
        console.error('[Login] Googleログインエラー:', error)
        setErrors({ general: `Googleログインに失敗しました: ${getErrorMessage(error)}` })
        setIsLoading(false)
        return
      }

      console.log('[Login] Googleログイン成功 - リダイレクト待機中')
      // 成功時はコールバックページで処理される
      // ローディング状態は維持（リダイレクトが発生するため）
    } catch (error) {
      console.error('[Login] Google login error:', error)
      setErrors({ general: 'Googleログインに失敗しました' })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/15 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/15 to-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-300/25 to-blue-400/30 rounded-full blur-2xl"></div>
      </div>
      
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8 relative z-10">
          <Link href="/">
            <div className="inline-block">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                balubo
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 rounded-full mt-1"></div>
            </div>
          </Link>
          <p className="text-gray-600 mt-3 font-medium">クリエイターのためのキャリアSNS</p>
        </div>

        {/* ログインフォーム */}
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0 relative z-10 rounded-3xl">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">ログイン</CardTitle>
            <CardDescription className="text-gray-600">
              アカウントにログインしてbaluboを始めましょう
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 新規登録成功メッセージ */}
              {searchParams.get('message') === 'registration_success' && (
                <div className="p-5 rounded-2xl bg-green-50/80 border border-green-200/50 relative">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-green-800 font-medium leading-relaxed">
                      アカウント登録が完了しました！メールに送信された確認リンクをクリックしてから、ログインしてください。
                    </p>
                  </div>
                </div>
              )}

              {/* パスワードリセット成功メッセージ */}
              {searchParams.get('message') === 'password_reset_success' && (
                <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200/50 relative">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-blue-800 font-medium leading-relaxed">
                      パスワードが正常に更新されました。新しいパスワードでログインしてください。
                    </p>
                  </div>
                </div>
              )}

              {/* 全般的なエラー */}
              {errors.general && (
                <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200/50 relative">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{errors.general}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`transition-all duration-300 border-2 rounded-2xl px-5 py-4 bg-white/60 backdrop-blur-sm focus:bg-white hover:bg-white/80 focus:shadow-lg focus:shadow-blue-200/20 ${errors.email ? 'border-red-300 focus:border-red-400' : 'border-blue-200/50 focus:border-blue-400 hover:border-blue-300/70'}`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="パスワードを入力"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`transition-all duration-300 border-2 rounded-2xl px-5 py-4 bg-white/60 backdrop-blur-sm focus:bg-white hover:bg-white/80 focus:shadow-lg focus:shadow-blue-200/20 ${errors.password ? 'border-red-300 focus:border-red-400' : 'border-blue-200/50 focus:border-blue-400 hover:border-blue-300/70'}`}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded-lg border-2 border-blue-300 text-blue-500 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                    ログイン状態を保持
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200">
                  パスワードを忘れた方
                </Link>
              </div>

              <Button 
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-300/30"
                disabled={isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading && (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isLoading ? 'ログイン中...' : 'ログイン'}
                </div>
              </Button>

              {/* 区切り線 */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-blue-200/40" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-6 text-gray-500 font-medium">または</span>
                </div>
              </div>

              {/* Googleログインボタン */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-14 border-2 border-blue-200/40 hover:border-blue-300/60 bg-white hover:bg-blue-50/30 text-gray-700 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-200/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? '処理中...' : 'Googleアカウントでログイン'}
                </div>
              </Button>
            </form>

            {/* 新規登録リンク */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                まだアカウントをお持ちでない方は{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200">
                  新規登録
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* 背景の装飾要素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="w-full max-w-md">
          <div className="text-center mb-8 relative z-10">
            <Link href="/">
              <div className="inline-block">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  balubo
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full mt-1"></div>
              </div>
            </Link>
            <p className="text-gray-600 mt-3 font-medium">クリエイターのためのキャリアSNS</p>
          </div>
          <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 relative z-10">
            <CardContent className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
} 