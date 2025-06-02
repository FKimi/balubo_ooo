'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()

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
      const { data, error } = await signInWithGoogle()

      // ガード節：エラー時は早期return
      if (error) {
        setErrors({ general: `Googleログインに失敗しました: ${getErrorMessage(error)}` })
        return
      }

      // 成功時はコールバックページで処理される
    } catch (error) {
      console.error('Google login error:', error)
      setErrors({ general: 'Googleログインに失敗しました' })
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

        {/* ログインフォーム */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ログイン</CardTitle>
            <CardDescription>
              アカウントにログインしてbaluboを始めましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 全般的なエラー */}
              {errors.general && (
                <div className="p-3 rounded-lg bg-error-red/10 border border-error-red/20">
                  <p className="text-sm text-error-red">{errors.general}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-error-red' : ''}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-error-red">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="パスワードを入力"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'border-error-red' : ''}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-error-red">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="rounded border-border-color"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-text-secondary">
                    ログイン状態を保持
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-accent-dark-blue hover:underline">
                  パスワードを忘れた方
                </Link>
              </div>

              <Button 
                type="submit"
                className="w-full bg-accent-dark-blue hover:bg-primary-blue"
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>

              {/* 区切り線 */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">または</span>
                </div>
              </div>

              {/* Googleログインボタン */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? '処理中...' : 'Googleアカウントでログイン'}
              </Button>
            </form>

            {/* 新規登録リンク */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                まだアカウントをお持ちでない方は{' '}
                <Link href="/register" className="text-accent-dark-blue hover:underline font-medium">
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