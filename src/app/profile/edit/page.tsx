'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { ProfileData } from '@/features/profile/types'
import { apiEndpoints, safeApiCall } from '@/utils/fetcher'

export default function ProfileEditPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // データベースからプロフィールデータを取得する関数
  const fetchProfileData = async () => {
    const { data, error } = await safeApiCall(() => apiEndpoints.profile.get())
    if (error) {
      console.error('プロフィール取得エラー:', error)
      return null
    }
    return data?.profile
  }

  // useEffectでデータベースからプロフィールデータを読み込み
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const dbProfile = await fetchProfileData()
        
        if (dbProfile) {
          // データベースから取得したデータをフォームに設定
          const convertedProfile: ProfileData = {
            displayName: dbProfile.display_name || user?.user_metadata?.display_name || '',
            title: dbProfile.title || '',
            bio: dbProfile.bio || dbProfile.introduction || '',
            professions: dbProfile.professions || [],
            skills: dbProfile.skills || [],
            location: dbProfile.location || '',
            websiteUrl: dbProfile.website_url || '',
            portfolioVisibility: dbProfile.portfolio_visibility || 'public',
            backgroundImageUrl: dbProfile.background_image_url || '',
            avatarImageUrl: dbProfile.avatar_image_url || '',
            desiredRate: dbProfile.desired_rate || '',
            jobChangeIntention: dbProfile.job_change_intention || 'not_considering',
            sideJobIntention: dbProfile.side_job_intention || 'not_considering',
            projectRecruitmentStatus: dbProfile.project_recruitment_status || 'not_recruiting',
            ...(dbProfile.experience_years && { experienceYears: dbProfile.experience_years }),
            workingHours: dbProfile.working_hours || '',
            career: dbProfile.career || []
          }
          
          setFormData(convertedProfile)
          

        } else {
          // データベースにデータがない場合はローカルストレージから読み込み
          const savedProfile = localStorage.getItem(`profileData_${user?.id || 'anon'}`)
          if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile)
            setFormData({
              ...parsedProfile,
              displayName: parsedProfile.displayName || user?.user_metadata?.display_name || ''
            })
          }
        }
      } catch (error) {
        console.error('プロフィールデータの読み込みエラー:', error)
        // エラー時はローカルストレージから読み込み
        try {
          const savedProfile = localStorage.getItem(`profileData_${user?.id || 'anon'}`)
          if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile)
            setFormData({
              ...parsedProfile,
              displayName: parsedProfile.displayName || user?.user_metadata?.display_name || ''
            })
          }
        } catch (localError) {
          console.error('ローカルデータの読み込みにも失敗:', localError)
        }
      }
    }

    loadProfileData()
  }, [user])

  const [formData, setFormData] = useState<ProfileData>(() => {
    const baseData = {
      displayName: user?.user_metadata?.display_name || '',
      title: '',
      bio: '',
      professions: [],
      skills: [],
      location: '',
      websiteUrl: '',
      portfolioVisibility: 'public' as const,
      backgroundImageUrl: '',
      avatarImageUrl: '',
      desiredRate: '',
      jobChangeIntention: 'not_considering' as const,
      sideJobIntention: 'not_considering' as const,
      projectRecruitmentStatus: 'not_recruiting' as const,
      workingHours: '',
      career: []
    }
    
    // experienceYearsは条件付きで追加
    return baseData
  })

  // ドラッグ&ドロップ状態の管理
  const [isDraggingBackground, setIsDraggingBackground] = useState(false)
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'avatar') => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file, type)
    }
  }

  // ファイル処理の共通関数
  const processFile = (file: File, type: 'background' | 'avatar') => {
    // ファイル形式の検証
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。')
      return
    }

    // ファイルサイズの検証（背景画像: 5MB、プロフィール画像: 2MB）
    const maxSize = type === 'background' ? 5 * 1024 * 1024 : 2 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = type === 'background' ? '5MB' : '2MB'
      alert(`ファイルサイズが${maxSizeMB}を超えています。`)
      return
    }

    // TODO: 実際のファイルアップロード処理（Supabase Storage）
    // 現在はプレビュー用にFileReaderを使用
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (type === 'background') {
        setFormData(prev => ({ ...prev, backgroundImageUrl: result }))
      } else if (type === 'avatar') {
        setFormData(prev => ({ ...prev, avatarImageUrl: result }))
      }
    }
    reader.readAsDataURL(file)
  }

  // ドラッグ&ドロップイベントハンドラー
  const handleDragOver = (e: React.DragEvent, type: 'background' | 'avatar') => {
    e.preventDefault()
    e.stopPropagation()
    if (type === 'background') {
      setIsDraggingBackground(true)
    } else {
      setIsDraggingAvatar(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent, type: 'background' | 'avatar') => {
    e.preventDefault()
    e.stopPropagation()
    // relatedTargetが子要素でない場合のみドラッグ状態を解除
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (type === 'background') {
        setIsDraggingBackground(false)
      } else {
        setIsDraggingAvatar(false)
      }
    }
  }

  const handleDrop = (e: React.DragEvent, type: 'background' | 'avatar') => {
    e.preventDefault()
    e.stopPropagation()
    
    // ドラッグ状態をリセット
    if (type === 'background') {
      setIsDraggingBackground(false)
    } else {
      setIsDraggingAvatar(false)
    }

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file) {
        processFile(file, type)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      console.log('保存するデータ:', formData)

      // データベースに保存
      const { data, error } = await safeApiCall(() => apiEndpoints.profile.save(formData))
      
      if (error) {
        console.error('保存エラー:', error)
        alert(`保存に失敗しました: ${error}

問題が続く場合は、ページを再読み込みしてもう一度お試しください。`)
        return
      }

      if (data) {
        // ローカルストレージにも保存（バックアップ用）
        const userId = user?.id || 'anon'
        localStorage.setItem(`profileData_${userId}`, JSON.stringify(formData))

        // Supabase Auth 側の user_metadata も更新して表示名を同期
        try {
          const { supabase } = await import('@/lib/supabase')
          await supabase.auth.updateUser({ data: { display_name: formData.displayName } })
        } catch (metaErr) {
          console.warn('user_metadata 更新失敗:', metaErr)
        }
        
        // 更新フラグを付けてプロフィール画面に遷移
        router.push('/profile?updated=true')
      }
    } catch (error) {
      console.error('保存エラー（例外）:', error)
      console.error('エラースタック:', error instanceof Error ? error.stack : 'スタックなし')
      
      let errorMessage = `保存に失敗しました。

エラー詳細: ${error instanceof Error ? error.message : '不明なエラー'}`

      // ネットワークエラーの判定
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage += `

ネットワーク接続を確認してください:
- インターネット接続が有効か確認
- ファイアウォールやセキュリティソフトが通信をブロックしていないか確認
- 開発サーバーが起動しているか確認 (localhost:3000)`
      }

      // JSONパースエラーの判定
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        errorMessage += `

サーバーから不正なレスポンスが返されました。
開発者にお知らせください。`
      }

      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* ページヘッダー */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="hover:bg-white/50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">基本情報の編集</h1>
                  <p className="text-gray-600 mt-1">
                    プロフィールの基本情報を編集できます
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本情報 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    基本情報
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    あなたの基本的なプロフィール情報を設定してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* 背景画像設定 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">背景画像</Label>
                    <div className="space-y-3">
                      {/* 背景画像プレビュー */}
                      <div 
                        className={`relative w-full h-48 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl overflow-hidden border-2 transition-colors mb-8 cursor-pointer ${
                          isDraggingBackground 
                            ? 'border-indigo-500 border-dashed bg-indigo-50' 
                            : 'border-dashed border-gray-300 hover:border-indigo-400'
                        }`}
                        onDragOver={(e) => handleDragOver(e, 'background')}
                        onDragLeave={(e) => handleDragLeave(e, 'background')}
                        onDrop={(e) => handleDrop(e, 'background')}
                        onClick={() => document.getElementById('backgroundImage')?.click()}
                      >
                        {formData.backgroundImageUrl ? (
                          <>
                            <Image
                              src={formData.backgroundImageUrl}
                              alt="背景画像プレビュー"
                              fill
                              sizes="100vw"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            {/* プロフィール画像プレビュー */}
                            <div className="absolute -bottom-8 left-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                                {formData.avatarImageUrl ? (
                                  <Image
                                    src={formData.avatarImageUrl}
                                    alt="プロフィール画像プレビュー"
                                    width={64}
                                    height={64}
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white font-bold text-xl">
                                    {formData.displayName.charAt(0) || 'U'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                                isDraggingBackground ? 'bg-indigo-200' : 'bg-white/50'
                              }`}>
                                <svg className={`w-6 h-6 transition-colors ${
                                  isDraggingBackground ? 'text-indigo-600' : 'text-gray-400'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <p className={`text-sm font-medium transition-colors ${
                                isDraggingBackground ? 'text-indigo-700' : 'text-gray-600'
                              }`}>
                                {isDraggingBackground ? 'ファイルをドロップしてください' : '背景画像をアップロード'}
                              </p>
                              <p className={`text-xs mt-1 transition-colors ${
                                isDraggingBackground ? 'text-indigo-600' : 'text-gray-500'
                              }`}>
                                {isDraggingBackground ? 'JPG, PNG形式' : 'クリックまたはドラッグ&ドロップ'}
                              </p>
                            </div>
                          </div>
                        )}
                        {formData.backgroundImageUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="背景画像削除"
                            onClick={() => setFormData(prev => ({ ...prev, backgroundImageUrl: '' }))}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Button>
                        )}
                      </div>
                      
                      {/* ファイル選択ボタン */}
                      <div className="flex gap-3">
                        <input
                          type="file"
                          id="backgroundImage"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'background')}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" asChild className="bg-white hover:bg-gray-50">
                          <label htmlFor="backgroundImage" className="cursor-pointer">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            画像を選択
                          </label>
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">JPG, PNG形式（最大5MB）推奨サイズ: 1200×300px</p>
                    </div>
                  </div>

                  {/* プロフィール画像 */}
                  <div 
                    className={`flex items-center space-x-6 p-4 rounded-xl transition-colors ${
                      isDraggingAvatar 
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-dashed border-orange-400' 
                        : 'bg-gradient-to-r from-gray-50 to-gray-100'
                    }`}
                    onDragOver={(e) => handleDragOver(e, 'avatar')}
                    onDragLeave={(e) => handleDragLeave(e, 'avatar')}
                    onDrop={(e) => handleDrop(e, 'avatar')}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      {formData.avatarImageUrl ? (
                        <Image
                          src={formData.avatarImageUrl}
                          alt="プロフィール画像"
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">
                          {formData.displayName.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-3 mb-2">
                        <input
                          type="file"
                          id="avatarImage"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'avatar')}
                          className="hidden"
                        />
                        <Button variant="outline" type="button" size="sm" asChild className="bg-white hover:bg-gray-50">
                          <label htmlFor="avatarImage" className="cursor-pointer">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            画像を変更
                          </label>
                        </Button>
                        {formData.avatarImageUrl && (
                          <Button
                            variant="outline"
                            type="button"
                            size="sm"
                            aria-label="プロフィール画像削除"
                            onClick={() => setFormData(prev => ({ ...prev, avatarImageUrl: '' }))}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            削除
                          </Button>
                        )}
                      </div>
                      <p className={`text-xs transition-colors ${
                        isDraggingAvatar ? 'text-orange-600' : 'text-gray-500'
                      }`}>
                        {isDraggingAvatar 
                          ? 'JPG, PNG形式（最大2MB）をドロップしてください' 
                          : 'JPG, PNG形式（最大2MB）推奨サイズ: 400×400px'
                        }
                      </p>
                    </div>
                  </div>

                  {/* 表示名 */}
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-sm font-medium text-gray-700">表示名 *</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="あなたの名前またはニックネーム"
                      required
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  {/* 肩書き */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">肩書き・役職</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="例: フロントエンドエンジニア、デザイナー、ライター"
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-gray-500">あなたの現在の肩書きや役職を入力してください</p>
                  </div>

                  {/* 自己紹介 */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-gray-700">自己紹介</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="あなたの経歴、得意分野、価値観などを簡潔に記述してください"
                      className="min-h-[120px] border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                      maxLength={300}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">{formData.bio.length}/300文字</p>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${formData.bio.length < 100 ? 'bg-red-400' : formData.bio.length < 200 ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                        <span className="text-xs text-gray-500">
                          {formData.bio.length < 100 ? '短い' : formData.bio.length < 200 ? '適切' : '詳細'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 居住地 */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">居住地</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="例: 東京都"
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  {/* ウェブサイト */}
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">ウェブサイト・ポートフォリオURL</Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="https://your-portfolio.com"
                      className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 保存ボタン */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      保存中...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      基本情報を保存
                    </div>
                  )}
                </Button>
                <Link href="/profile">
                  <Button variant="outline" className="px-8 bg-white hover:bg-gray-50">
                    キャンセル
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 