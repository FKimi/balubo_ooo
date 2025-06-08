'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface InputData {
  id: string
  title: string
  type: string
  category: string
  author_creator: string
  release_date: string
  consumption_date: string
  status: string
  rating: number | null
  review: string
  tags: string[]
  genres: string[]
  external_url: string
  cover_image_url: string
  notes: string
  favorite: boolean
}

export default function EditInputPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState<InputData>({
    id: '',
    title: '',
    type: 'book',
    category: '',
    author_creator: '',
    release_date: '',
    consumption_date: '',
    status: 'completed',
    rating: null,
    review: '',
    tags: [],
    genres: [],
    external_url: '',
    cover_image_url: '',
    notes: '',
    favorite: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')
  const [newGenre, setNewGenre] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    fetchInputData()
  }, [user, params.id])

  const fetchInputData = async () => {
    try {
      setLoading(true)
      
      // Supabaseからアクセストークンを取得
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        throw new Error('認証トークンの取得に失敗しました')
      }
      
      const response = await fetch(`/api/inputs/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('インプットの取得に失敗しました')
      }
      
      const data = await response.json()
      const input = data.input
      
      setFormData({
        id: input.id,
        title: input.title || '',
        type: input.type || 'book',
        category: input.category || '',
        author_creator: input.author_creator || '',
        release_date: input.release_date ? input.release_date.split('T')[0] : '',
        consumption_date: input.consumption_date ? input.consumption_date.split('T')[0] : '',
        status: input.status || 'completed',
        rating: input.rating,
        review: input.review || '',
        tags: input.tags || [],
        genres: input.genres || [],
        external_url: input.external_url || '',
        cover_image_url: input.cover_image_url || '',
        notes: input.notes || '',
        favorite: input.favorite || false
      })
    } catch (error) {
      console.error('インプット取得エラー:', error)
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('タイトルを入力してください')
      return
    }
    
    try {
      setSaving(true)
      
      // Supabaseからアクセストークンを取得
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        throw new Error('認証トークンの取得に失敗しました')
      }
      
      const response = await fetch(`/api/inputs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          category: formData.category,
          authorCreator: formData.author_creator,
          releaseDate: formData.release_date || null,
          consumptionDate: formData.consumption_date || null,
          status: formData.status,
          rating: formData.rating,
          review: formData.review,
          tags: formData.tags,
          genres: formData.genres,
          externalUrl: formData.external_url,
          coverImageUrl: formData.cover_image_url,
          notes: formData.notes,
          favorite: formData.favorite
        })
      })
      
      if (!response.ok) {
        throw new Error('更新に失敗しました')
      }
      
      router.push(`/profile/inputs/${params.id}`)
    } catch (error) {
      console.error('更新エラー:', error)
      alert('更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }))
    } else if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : null }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }))
  }

  const addGenre = () => {
    if (newGenre.trim() && !formData.genres.includes(newGenre.trim())) {
      setFormData(prev => ({ ...prev, genres: [...prev.genres, newGenre.trim()] }))
      setNewGenre('')
    }
  }

  const removeGenre = (index: number) => {
    setFormData(prev => ({ ...prev, genres: prev.genres.filter((_, i) => i !== index) }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/profile?tab=inputs" className="text-blue-600 hover:underline">
            インプット一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href={`/profile/inputs/${params.id}`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                詳細に戻る
              </Link>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">インプットを編集</h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">基本情報</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  タイプ
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="book">📚 本・書籍</option>
                  <option value="manga">📖 漫画</option>
                  <option value="movie">🎬 映画</option>
                  <option value="anime">🎌 アニメ</option>
                  <option value="tv">📺 TV番組</option>
                  <option value="game">🎮 ゲーム</option>
                  <option value="podcast">🎧 ポッドキャスト</option>
                  <option value="other">📄 その他</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  ステータス
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="completed">完了</option>
                  <option value="reading">読書中/視聴中</option>
                  <option value="planning">予定</option>
                  <option value="dropped">中断</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="author_creator" className="block text-sm font-medium text-gray-700 mb-2">
                  作者・制作者
                </label>
                <input
                  type="text"
                  id="author_creator"
                  name="author_creator"
                  value={formData.author_creator}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリ
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="release_date" className="block text-sm font-medium text-gray-700 mb-2">
                  発売日
                </label>
                <input
                  type="date"
                  id="release_date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="consumption_date" className="block text-sm font-medium text-gray-700 mb-2">
                  視聴/読了日
                </label>
                <input
                  type="date"
                  id="consumption_date"
                  name="consumption_date"
                  value={formData.consumption_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  評価 (1-5)
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">未評価</option>
                  <option value="1">⭐ 1</option>
                  <option value="2">⭐⭐ 2</option>
                  <option value="3">⭐⭐⭐ 3</option>
                  <option value="4">⭐⭐⭐⭐ 4</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="external_url" className="block text-sm font-medium text-gray-700 mb-2">
                  外部URL
                </label>
                <input
                  type="url"
                  id="external_url"
                  name="external_url"
                  value={formData.external_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="cover_image_url" className="block text-sm font-medium text-gray-700 mb-2">
                  カバー画像URL
                </label>
                <input
                  type="url"
                  id="cover_image_url"
                  name="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="favorite"
                    checked={formData.favorite}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">お気に入りに追加</span>
                </label>
              </div>
            </div>
          </div>

          {/* タグとジャンル */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">タグ・ジャンル</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* タグ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">タグ</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="新しいタグを入力"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded border border-blue-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* ジャンル */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ジャンル</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="新しいジャンルを入力"
                  />
                  <button
                    type="button"
                    onClick={addGenre}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded border border-green-200"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => removeGenre(index)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* レビュー・メモ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">レビュー・メモ</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                  レビュー
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="感想やレビューを記入..."
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  メモ
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="個人的なメモを記入..."
                />
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end space-x-3">
            <Link
              href={`/profile/inputs/${params.id}`}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 