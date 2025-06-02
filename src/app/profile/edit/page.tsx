'use client'

import { useState, useEffect } from 'react'
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
import { ProfileData, CareerItem, defaultProfileData } from '@/types/profile'

export default function ProfileEditPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // データベースからプロフィールデータを取得する関数
  const fetchProfileData = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      if (!token) {
        return null
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        return result.profile
      } else {
        return null
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error)
      return null
    }
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
            bio: dbProfile.bio || '',
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
          
          // MCP接続状態の確認
          const { mcpSupabase } = await import('@/lib/mcp-supabase')
          const connectionStatus = mcpSupabase.getConnectionStatus()
          console.log('MCP接続状態:', connectionStatus)
        } else {
          // データベースにデータがない場合はローカルストレージから読み込み
          const savedProfile = localStorage.getItem('profileData')
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
          const savedProfile = localStorage.getItem('profileData')
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
      // 認証トークンを取得
      const { supabase } = await import('@/lib/supabase')
      console.log('認証セッション取得中...')
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('セッション:', session)
      console.log('セッションエラー:', sessionError)
      
      const token = session?.access_token

      if (!session || !token) {
        console.log('認証セッションが見つかりません')
        alert('ログインが必要です。ログインページに移動します。')
        window.location.href = '/auth/login'
        setIsLoading(false)
        return
      }

      console.log('保存するデータ:', formData)

      // データベースに保存
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      console.log('APIレスポンス status:', response.status)
      console.log('APIレスポンス statusText:', response.statusText)
      
      // レスポンスのContent-Typeを確認
      const contentType = response.headers.get('content-type')
      console.log('Content-Type:', contentType)
      
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        console.error('JSONでないレスポンス:', text)
        alert(`サーバーエラーが発生しました。レスポンス: ${text.substring(0, 200)}...`)
        setIsLoading(false)
        return
      }

      const result = await response.json()
      console.log('APIレスポンス結果:', result)

      if (response.ok) {
        // ローカルストレージにも保存（バックアップ用）
        localStorage.setItem('profileData', JSON.stringify(formData))
        
        // 更新フラグを付けてプロフィール画面に遷移
        router.push('/profile?updated=true')
      } else {
        console.error('保存エラー詳細:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          details: result.details,
          debugInfo: result.debugInfo,
          result: result
        })
        
        // RLSエラーの場合はより詳細な説明を表示
        if (response.status === 403 && result.debugInfo?.errorCode === '42501') {
          alert(`データベース権限エラーが発生しました。

詳細: ${result.details || 'プロフィールテーブルの権限設定に問題があります'}

解決方法:
1. Supabaseダッシュボードにアクセス
2. profilesテーブルのRLSポリシーを確認
3. 認証されたユーザーの権限設定を確認

開発者向け情報:
- エラーコード: ${result.debugInfo?.errorCode}
- テーブル: ${result.debugInfo?.table}
- ユーザーID: ${result.debugInfo?.userId}

この問題が続く場合は開発者にお知らせください。`)
        } else {
          alert(`保存に失敗しました: ${result.error || '不明なエラー'}

ステータス: ${response.status} ${response.statusText}
${result.details ? `詳細: ${result.details}` : ''}

問題が続く場合は、ページを再読み込みしてもう一度お試しください。`)
        }
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
                            <img 
                              src={formData.backgroundImageUrl} 
                              alt="背景画像プレビュー" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                            {/* プロフィール画像プレビュー */}
                            <div className="absolute -bottom-8 left-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                                {formData.avatarImageUrl ? (
                                  <img 
                                    src={formData.avatarImageUrl} 
                                    alt="プロフィール画像プレビュー" 
                                    className="w-full h-full object-cover rounded-full"
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
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, backgroundImageUrl: '' }))}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
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
                        {formData.backgroundImageUrl && (
                          <Button
                            variant="outline"
                            type="button"
                            size="sm"
                            onClick={() => setFormData(prev => ({ ...prev, backgroundImageUrl: '' }))}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            削除
                          </Button>
                        )}
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
                        <img 
                          src={formData.avatarImageUrl} 
                          alt="プロフィール画像" 
                          className="w-full h-full object-cover rounded-full"
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

              {/* 公開設定 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    公開設定
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    プロフィールの公開範囲を設定してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        id="public"
                        name="portfolioVisibility"
                        value="public"
                        checked={formData.portfolioVisibility === 'public'}
                        onChange={handleInputChange}
                        className="mt-1 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="public" className="cursor-pointer">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            全体公開
                          </div>
                          <p className="text-sm text-gray-500 mt-1">すべてのユーザーが閲覧可能</p>
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        id="connections_only"
                        name="portfolioVisibility"
                        value="connections_only"
                        checked={formData.portfolioVisibility === 'connections_only'}
                        onChange={handleInputChange}
                        className="mt-1 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="connections_only" className="cursor-pointer">
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            つながりのみ
                          </div>
                          <p className="text-sm text-gray-500 mt-1">つながっているクリエイターのみ</p>
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* スキル・専門分野 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    スキル・専門分野
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    あなたのスキルと専門分野を設定してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* 専門分野 */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">専門分野</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-gray-50">
                        {formData.professions.map((profession, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {profession}
                            <button
                              type="button"
                              onClick={() => {
                                const newProfessions = formData.professions.filter((_, i) => i !== index)
                                setFormData(prev => ({ ...prev, professions: newProfessions }))
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                        {formData.professions.length === 0 && (
                          <span className="text-gray-500 text-sm">専門分野を追加してください</span>
                        )}
                      </div>
                      <Input
                        placeholder="例: Webデザイン, UI/UXデザイン, フロントエンド開発"
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const value = (e.target as HTMLInputElement).value.trim()
                            if (value && !formData.professions.includes(value)) {
                              if (formData.professions.length >= 10) {
                                alert('専門分野は最大10個まで追加できます')
                                return
                              }
                              setFormData(prev => ({
                                ...prev,
                                professions: [...prev.professions, value]
                              }))
                              ;(e.target as HTMLInputElement).value = ''
                            } else if (formData.professions.includes(value)) {
                              alert('この専門分野は既に追加されています')
                            }
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500">Enterキーで追加 • 最大10個まで</p>
                    </div>
                  </div>

                  {/* スキル */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">スキル・ツール</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-200 rounded-lg bg-gray-50">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => {
                                const newSkills = formData.skills.filter((_, i) => i !== index)
                                setFormData(prev => ({ ...prev, skills: newSkills }))
                              }}
                              className="text-green-600 hover:text-green-800"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                        {formData.skills.length === 0 && (
                          <span className="text-gray-500 text-sm">スキル・ツールを追加してください</span>
                        )}
                      </div>
                      <Input
                        placeholder="例: Figma, Adobe XD, React, TypeScript, Python"
                        className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const value = (e.target as HTMLInputElement).value.trim()
                            if (value && !formData.skills.includes(value)) {
                              if (formData.skills.length >= 15) {
                                alert('スキルは最大15個まで追加できます')
                                return
                              }
                              setFormData(prev => ({
                                ...prev,
                                skills: [...prev.skills, value]
                              }))
                              ;(e.target as HTMLInputElement).value = ''
                            } else if (formData.skills.includes(value)) {
                              alert('このスキルは既に追加されています')
                            }
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500">Enterキーで追加 • 最大15個まで</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* キャリア・経歴 */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    キャリア・経歴
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    職歴や実績を追加・編集できます
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  {/* 既存キャリア一覧 */}
                  <div className="space-y-3">
                    {formData.career.map((item, index) => (
                      <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.company}</h4>
                            <p className="text-sm text-gray-600">{item.position}</p>
                            <p className="text-xs text-gray-500">
                              {item.startDate} 〜 {item.isCurrent ? '現在' : item.endDate}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newCareer = formData.career.filter((_, i) => i !== index)
                              setFormData(prev => ({ ...prev, career: newCareer }))
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                        )}
                      </div>
                    ))}
                    
                    {formData.career.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                        <p>キャリア情報がありません</p>
                        <p className="text-sm mt-1">下のボタンから追加してください</p>
                      </div>
                    )}
                  </div>

                  {/* キャリア追加ボタン */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-purple-300 text-purple-600 hover:bg-purple-50"
                    onClick={() => {
                      // 簡単なプロンプトでキャリア追加
                      const company = prompt('会社名を入力してください:')
                      if (!company) return
                      
                      const position = prompt('役職・ポジションを入力してください:')
                      if (!position) return
                      
                      const startDate = prompt('開始年月を入力してください (例: 2020年4月):')
                      if (!startDate) return
                      
                      const isCurrent = confirm('現在も在籍中ですか？')
                      let endDate = ''
                      if (!isCurrent) {
                        endDate = prompt('終了年月を入力してください (例: 2023年3月):') || ''
                      }
                      
                      const description = prompt('業務内容・実績を入力してください（任意）:') || ''
                      
                      const newCareerItem = {
                        id: Date.now().toString(),
                        company,
                        position,
                        startDate,
                        endDate,
                        isCurrent,
                        department: '',
                        description
                      }
                      
                      setFormData(prev => ({
                        ...prev,
                        career: [...prev.career, newCareerItem]
                      }))
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    キャリアを追加
                  </Button>
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