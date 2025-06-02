'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

interface FormData {
  displayName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
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

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  
  const { signUp, signInWithGoogle } = useAuth()
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
    if (!formData.displayName.trim()) {
      newErrors.displayName = '表示名を入力してください'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください'
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '利用規約とプライバシーポリシーに同意してください'
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
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.displayName
      )

      // ガード節：エラー時は早期return
      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ email: 'このメールアドレスは既に登録されています' })
        } else if (error.message.includes('Password should be at least')) {
          setErrors({ password: 'パスワードは6文字以上で入力してください' })
        } else {
          setErrors({ general: getErrorMessage(error) })
        }
        return
      }

      // ガード節：ユーザーデータなし時は早期return
      if (!data?.user) {
        setErrors({ general: 'ユーザー作成に失敗しました' })
        return
      }

      // 成功パス：最後にまとめる
      router.push('/profile')
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    
    try {
      const { data, error } = await signInWithGoogle()

      // ガード節：エラー時は早期return
      if (error) {
        setErrors({ general: `Googleアカウントでの登録に失敗しました: ${getErrorMessage(error)}` })
        return
      }

      // 成功時はコールバックページで処理される
    } catch (error) {
      console.error('Google signup error:', error)
      setErrors({ general: 'Googleアカウントでの登録に失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-light-gray flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-accent-dark-blue">balubo</h1>
          </Link>
          <p className="text-text-secondary mt-2">クリエイターのためのキャリアSNS</p>
        </div>

        {/* 新規登録フォーム */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">新規登録</CardTitle>
            <CardDescription>
              クリエイターとしてbaluboに参加しましょう
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
                <Label htmlFor="displayName">表示名</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="あなたの名前またはニックネーム"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={errors.displayName ? 'border-error-red' : ''}
                  required
                />
                {errors.displayName && (
                  <p className="text-sm text-error-red">{errors.displayName}</p>
                )}
              </div>

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
                  placeholder="8文字以上のパスワード"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'border-error-red' : ''}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-error-red">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード（確認）</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="パスワードを再入力"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'border-error-red' : ''}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-error-red">{errors.confirmPassword}</p>
                )}
              </div>
              
              {/* 利用規約同意 */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="rounded border-border-color mt-1"
                    required
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-text-secondary leading-relaxed">
                    <Link href="/terms" className="text-accent-dark-blue hover:underline">
                      利用規約
                    </Link>
                    および
                    <Link href="/privacy" className="text-accent-dark-blue hover:underline">
                      プライバシーポリシー
                    </Link>
                    に同意します
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-error-red">{errors.agreeToTerms}</p>
                )}
              </div>

              <Button 
                type="submit"
                className="w-full bg-accent-dark-blue hover:bg-primary-blue"
                disabled={isLoading}
              >
                {isLoading ? '登録中...' : 'アカウントを作成'}
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
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? '処理中...' : 'Googleアカウントで登録'}
              </Button>
            </form>

            {/* ログインリンク */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                すでにアカウントをお持ちですか？{' '}
                <Link href="/login" className="text-accent-dark-blue hover:underline font-medium">
                  ログイン
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 