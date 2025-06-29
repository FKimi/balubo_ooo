'use client'


import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { InputData, InputAnalysis } from '@/types/input'
import type { WorkData } from '@/types/work'
import type { ProfileData, CareerItem } from '@/types/profile'
import { useWorkStatistics } from '@/hooks/useWorkStatistics'
import { useWorkCategories } from '@/hooks/useWorkCategories'
import { WorkCard } from '@/features/work/components/WorkCard'
import { ContentTypeSelector } from '@/features/work/components/ContentTypeSelector'
import { FeaturedWorksSection } from '@/features/work/components/FeaturedWorksSection'
import { useState } from 'react'

interface ProfileTabsProps {
  activeTab: string
  setActiveTab: (tab: 'profile' | 'works' | 'inputs') => void
  profileData: ProfileData | null
  savedWorks: WorkData[]
  setSavedWorks: (works: WorkData[]) => void
  inputs: InputData[]
  inputAnalysis: InputAnalysis | null
  isLoadingInputs: boolean
  deleteWork: (workId: string) => void
  // スキル管理
  onAddSkill?: () => void
  onRemoveSkill?: (index: number) => void
  setIsSkillModalOpen: (open: boolean) => void
  // キャリア管理
  onEditCareer: (career: CareerItem) => void
  onDeleteCareerConfirm: (careerId: string) => void
  setIsCareerModalOpen: (open: boolean) => void
  // 自己紹介管理
  onUpdateIntroduction?: (introduction: string) => void
  setIsIntroductionModalOpen: (open: boolean) => void
}

export function ProfileTabs({ 
  activeTab, 
  setActiveTab,
  profileData,
  savedWorks, 
  setSavedWorks,
  inputs, 
  inputAnalysis, 
  isLoadingInputs, 
  deleteWork,
  onAddSkill: _onAddSkill,
  onRemoveSkill: _onRemoveSkill,
  setIsSkillModalOpen,
  onEditCareer,
  onDeleteCareerConfirm,
  setIsCareerModalOpen,
  onUpdateIntroduction: _onUpdateIntroduction,
  setIsIntroductionModalOpen
}: ProfileTabsProps) {
  // カスタムフックからデータを取得
  const workStats = useWorkStatistics(savedWorks)
  const { categories, addCategory, updateCategory, deleteCategory, updateWorkCategory } = useWorkCategories(savedWorks, setSavedWorks)
  
  // コンテンツタイプ選択モーダルの状態
  const [isContentTypeSelectorOpen, setIsContentTypeSelectorOpen] = useState(false)

  // よく使用するタグを計算（作品データから）
  const getTopTags = () => {
    const tagCount: { [key: string]: number } = {}
    
    savedWorks.forEach(work => {
      if (work.tags && Array.isArray(work.tags)) {
        work.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })
    
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
  }

  const topTags = getTopTags()

  // 作品カテゴリタブコンポーネント
  function WorksWithCategoryTabs({
    savedWorks,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    deleteWork,
    // updateWorkCategory
  }: {
    savedWorks: WorkData[]
    categories: any[]
    addCategory: () => void
    updateCategory: (categoryId: string, newName: string, newColor: string) => void
    deleteCategory: (categoryId: string) => void
    deleteWork: (workId: string) => void
    updateWorkCategory: (workId: string, categoryName: string) => void
  }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedMonth, setSelectedMonth] = useState<string>('all')
    const [isEditingCategory, setIsEditingCategory] = useState<string | null>(null)
    const [editCategoryName, setEditCategoryName] = useState('')

    // 掲載月の一覧を取得
    const getAvailableMonths = () => {
      const monthSet = new Set<string>()
      savedWorks.forEach(work => {
        if (work.production_date) {
          const date = new Date(work.production_date)
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          monthSet.add(`${year}-${month.toString().padStart(2, '0')}`)
        }
      })
      return Array.from(monthSet)
        .sort((a, b) => b.localeCompare(a))
        .map(monthKey => {
          const parts = monthKey.split('-')
          const year = parts[0]
          const month = parts[1]
          if (!year || !month) return { value: monthKey, label: monthKey }
          return {
            value: monthKey,
            label: `${year}年${parseInt(month)}月`
          }
        })
    }

    const availableMonths = getAvailableMonths()

    // ALLタブを含む全カテゴリリスト
    const allCategoriesWithAll = [
      { id: 'all', name: 'ALL', color: '#6B7280' },
      ...categories.filter(cat => cat.id !== 'uncategorized'),
      ...categories.filter(cat => cat.id === 'uncategorized' && cat.works.length > 0).map(cat => ({ ...cat, name: '未分類' }))
    ]

    // 選択されたカテゴリと月の作品を取得
    const getFilteredWorks = () => {
      let filteredWorks = savedWorks

      // カテゴリフィルタ
      if (selectedCategory !== 'all') {
        const category = categories.find(cat => cat.id === selectedCategory)
        filteredWorks = category?.works || []
      }

      // 月フィルタ
      if (selectedMonth !== 'all') {
        const [targetYear, targetMonth] = selectedMonth.split('-').map(Number)
        filteredWorks = filteredWorks.filter(work => {
          if (!work.production_date) return false
          const date = new Date(work.production_date)
          return date.getFullYear() === targetYear && (date.getMonth() + 1) === targetMonth
        })
      }

      return filteredWorks
    }

    const filteredWorks = getFilteredWorks()

    // カテゴリ削除
    const handleDeleteCategory = async (categoryId: string) => {
      if (categoryId === 'all') return
      
      const category = categories.find(cat => cat.id === categoryId)
      if (!category) return

      const workCount = category.works.length
      const confirmMessage = workCount > 0 
        ? `「${category.name}」カテゴリを削除しますか？\n\nこのカテゴリに属する${workCount}件の作品は未分類に移動されます。`
        : `「${category.name}」カテゴリを削除しますか？`

      if (confirm(confirmMessage)) {
        try {
          // カテゴリを削除（データベース連携含む）
          await deleteCategory(categoryId)
          
          // 削除したカテゴリが選択されていた場合はALLに切り替え
          if (selectedCategory === categoryId) {
            setSelectedCategory('all')
          }

          // 成功メッセージ
          if (workCount > 0) {
            alert(`「${category.name}」カテゴリを削除しました。${workCount}件の作品を未分類に移動しました。`)
          } else {
            alert(`「${category.name}」カテゴリを削除しました。`)
          }

        } catch (error) {
          console.error('カテゴリ削除エラー:', error)
          alert(`カテゴリの削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
        }
      }
    }

    // カテゴリ編集
    const handleEditCategory = (categoryId: string, currentName: string) => {
      setIsEditingCategory(categoryId)
      setEditCategoryName(currentName)
    }

    const handleSaveCategory = async (categoryId: string) => {
      if (editCategoryName.trim()) {
        try {
          const category = categories.find(cat => cat.id === categoryId)
          if (category) {
            await updateCategory(categoryId, editCategoryName.trim(), category.color)
            
            // 成功メッセージ
            if (category.name !== editCategoryName.trim()) {
              alert(`カテゴリ名を「${category.name}」から「${editCategoryName.trim()}」に変更しました。`)
            }
          }
        } catch (error) {
          console.error('カテゴリ名変更エラー:', error)
          alert(`カテゴリ名の変更に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
        }
      }
      setIsEditingCategory(null)
      setEditCategoryName('')
    }

    return (
      <div>
        {/* カテゴリタブ */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {allCategoriesWithAll.map((category) => (
              <div key={category.id} className="relative group">
                {isEditingCategory === category.id ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-500 rounded-full shadow-lg">
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="text-sm bg-transparent outline-none min-w-[80px] max-w-[120px]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveCategory(category.id)
                        } else if (e.key === 'Escape') {
                          setIsEditingCategory(null)
                          setEditCategoryName('')
                        }
                      }}
                      onBlur={() => {
                        // フォーカスが外れた時は保存
                        handleSaveCategory(category.id)
                      }}
                      autoFocus
                      placeholder="カテゴリ名"
                    />
                    <button
                      onClick={() => handleSaveCategory(category.id)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="保存"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingCategory(null)
                        setEditCategoryName('')
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="キャンセル"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                    {category.id === 'all' ? (
                      <span className="ml-1 text-xs opacity-75">
                        ({savedWorks.length})
                      </span>
                    ) : (
                      <span className="ml-1 text-xs opacity-75">
                        ({category.id === 'uncategorized' 
                          ? categories.find(cat => cat.id === 'uncategorized')?.works.length || 0
                          : categories.find(cat => cat.id === category.id)?.works.length || 0
                        })
                      </span>
                    )}
                  </button>
                )}

                {/* カテゴリ管理ボタン（ALLと未分類以外） */}
                {category.id !== 'all' && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditCategory(category.id, category.name)
                        }}
                        className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                        title={`「${category.name}」を編集`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCategory(category.id)
                        }}
                        className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                        title={`「${category.name}」を削除`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* カテゴリ追加ボタン */}
            <button
              onClick={addCategory}
              className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              ＋ カテゴリ追加
            </button>
          </div>

          {/* 月別フィルタ */}
          {availableMonths.length > 0 && (
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">📅 掲載月で絞り込み:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">すべての月</option>
                  {availableMonths.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {filteredWorks.length}件の作品が表示されています
              </div>
            </div>
          )}
        </div>

        {/* 作品グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredWorks.length > 0 ? (
            filteredWorks.map((work: WorkData) => (
              <WorkCard
                key={work.id}
                work={work}
                onDelete={deleteWork}
                isDraggable={false}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-4xl mb-3">📂</div>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                {selectedCategory === 'all' ? 'まだ作品がありません' : 'このカテゴリには作品がありません'}
              </h4>
              <p className="text-gray-500">
                {selectedCategory === 'all' 
                  ? '最初の作品を追加しましょう' 
                  : '他のカテゴリから作品を移動するか、新しい作品を追加してください'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* タブナビゲーション */}
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-200 ${
            activeTab === 'profile' 
              ? 'bg-white text-gray-900 shadow-md border border-gray-200' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          プロフィール
        </button>
        <button 
          onClick={() => setActiveTab('works')}
          className={`flex-1 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-200 ${
            activeTab === 'works' 
              ? 'bg-white text-gray-900 shadow-md border border-gray-200' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          作品
        </button>
        <button 
          onClick={() => setActiveTab('inputs')}
          className={`flex-1 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-200 ${
            activeTab === 'inputs' 
              ? 'bg-white text-gray-900 shadow-md border border-gray-200' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          インプット
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className="mt-6">
        {/* プロフィールタブ */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* 新規ユーザー向けウェルカムメッセージ */}
            {(!profileData?.bio && (!profileData?.skills || profileData.skills.length === 0) && (!profileData?.career || profileData.career.length === 0)) && (
              <Card className="border-dashed border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">プロフィールを充実させましょう！</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    あなたの経験やスキルを追加して、他のクリエイターとのつながりを深めましょう。<br />
                    プロフィールが充実していると、より多くの機会が生まれます。
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => setIsSkillModalOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      スキルを追加
                    </Button>
                    <Button 
                      onClick={() => setIsCareerModalOpen(true)}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6v2a2 2 0 002 2h4a2 2 0 002-2V6m0 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2z" />
                      </svg>
                      キャリアを追加
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 詳細自己紹介セクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">自己紹介</h3>
                  <Button
                    onClick={() => setIsIntroductionModalOpen(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    編集
                  </Button>
                </div>

                {profileData?.introduction ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profileData.introduction}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">✍️</div>
                    <p className="text-gray-500 mb-4">まだ詳細な自己紹介が登録されていません</p>
                    <Button
                      onClick={() => setIsIntroductionModalOpen(true)}
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      自己紹介を追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* できること（スキル）セクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">できること</h3>
                  <Button
                    onClick={() => setIsSkillModalOpen(true)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    追加
                  </Button>
                </div>

                {profileData?.skills && profileData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <div key={index} className="group relative">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors pr-8"
                        >
                          {skill}
                          <button
                            onClick={() => _onRemoveSkill?.(index)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">💡</div>
                    <p className="text-gray-500 mb-4">まだスキルが登録されていません</p>
                    <Button
                      onClick={() => setIsSkillModalOpen(true)}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      最初のスキルを追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* キャリアセクション */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">キャリア</h3>
                  <Button
                    onClick={() => setIsCareerModalOpen(true)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    追加
                  </Button>
                </div>

                {profileData?.career && profileData.career.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.career.map((careerItem) => (
                      <div key={careerItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{careerItem.position}</h4>
                              {careerItem.isCurrent && (
                                <Badge className="bg-green-100 text-green-800 text-xs">現職</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{careerItem.company}</p>
                            {careerItem.department && (
                              <p className="text-sm text-gray-500 mb-2">{careerItem.department}</p>
                            )}
                            <p className="text-xs text-gray-500 mb-3">
                              {careerItem.startDate} - {careerItem.isCurrent ? '現在' : careerItem.endDate || '不明'}
                            </p>
                            {careerItem.description && (
                              <p className="text-sm text-gray-700">{careerItem.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => onEditCareer(careerItem)}
                              className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full flex items-center justify-center transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => onDeleteCareerConfirm(careerItem.id)}
                              className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">💼</div>
                    <p className="text-gray-500 mb-4">まだキャリア情報が登録されていません</p>
                    <Button
                      onClick={() => setIsCareerModalOpen(true)}
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      最初のキャリアを追加
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* よく使用するタグ */}
            {topTags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">アウトプット作品のタグ分析</h3>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      全{topTags.reduce((sum, [, count]) => sum + count, 0)}回使用
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* トップ3タグ（特別表示） */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span>🏆</span>
                        <span>トップ3タグ</span>
                      </h4>
                      <div className="space-y-3">
                        {topTags.slice(0, 3).map(([tag, count], index) => {
                          const colors = [
                            'from-yellow-400 to-orange-500',
                            'from-gray-300 to-gray-500', 
                            'from-amber-400 to-orange-600'
                          ]
                          const bgColors = [
                            'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
                            'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200',
                            'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                          ]
                          return (
                            <div key={tag} className={`${bgColors[index]} p-4 rounded-xl border`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 bg-gradient-to-r ${colors[index]} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm`}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">{tag}</div>
                                    <div className="text-sm text-gray-600">{count}回使用</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-gray-800">{count}</div>
                                  <div className="text-xs text-gray-500">
                                    {Math.round((count / topTags.reduce((sum, [, c]) => sum + c, 0)) * 100)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* 全タグリスト */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span>📊</span>
                        <span>使用頻度ランキング</span>
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {topTags.map(([tag, count], index) => {
                          const maxCount = Math.max(...topTags.map(([, c]) => c))
                          const percentage = (count / maxCount) * 100
                          return (
                            <div key={tag} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <Badge variant="outline" className="text-sm font-medium">
                                  {tag}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-gray-700 w-6 text-right">{count}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        💡
                      </div>
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-1">タグ分析について</h5>
                        <p className="text-sm text-blue-700">
                          作品に設定したタグの使用頻度を分析しています。よく使用するタグは、あなたの専門分野や得意領域を表しており、ポートフォリオの特色を示す重要な指標です。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 作品統計・役割分布 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">作品統計・役割分布</h3>
                </div>

                {workStats.totalWorks > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 総作品数表示 */}
                    <div className="text-center lg:text-left">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">総作品数</h4>
                        <div className="text-4xl font-bold text-indigo-600">{workStats.totalWorks}</div>
                        <p className="text-gray-600 mt-2">これまでに制作した作品</p>
                        
                        {/* 総文字数（記事作品がある場合のみ表示） */}
                        {workStats.totalWordCount > 0 && (
                          <div className="mt-4 pt-4 border-t border-indigo-200">
                            <h5 className="text-sm font-medium text-gray-600 mb-1">総文字数</h5>
                            <div className="text-2xl font-bold text-blue-600">
                              {workStats.totalWordCount.toLocaleString('ja-JP')}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">記事・ライティング作品の合計</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 役割分布 */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">役割分布</h4>
                      {workStats.roleDistribution.length > 0 ? (
                        <div className="space-y-3">
                          {workStats.roleDistribution.map((role, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">{role.role}</span>
                                <span className="text-sm text-gray-600">{role.count}件 ({role.percentage.toFixed(0)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full transition-all duration-300" 
                                  style={{ 
                                    width: `${role.percentage}%`,
                                    backgroundColor: role.color
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">役割データがありません</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📁</div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">まだ作品がありません</h4>
                    <p className="text-gray-500 mb-4">最初の作品を追加して、統計情報を表示しましょう</p>
                                    <Button 
                  onClick={() => setIsContentTypeSelectorOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  作品を追加
                </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 月別アクティビティ */}
            {workStats.monthlyActivity.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">アクティビティ履歴</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 最近のアクティビティ */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span>🔥</span>
                        <span>最近の活動</span>
                      </h4>
                      {workStats.recentActivity.length > 0 ? (
                        <div className="space-y-3">
                          {workStats.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                  {activity.month}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{activity.displayMonth}</div>
                                  <div className="text-sm text-gray-600">{activity.count}件の作品</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300" 
                                    style={{ 
                                      width: `${Math.min((activity.count / Math.max(...workStats.recentActivity.map(a => a.count))) * 100, 100)}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-blue-600">{activity.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">最近のアクティビティがありません</p>
                      )}
                    </div>

                    {/* 年別統計とハイライト */}
                    <div className="space-y-6">
                      {/* 最も活動的だった月 */}
                      {workStats.mostActiveMonth && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                          <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <span>🏆</span>
                            <span>最も活動的だった月</span>
                          </h4>
                          <div className="text-lg font-bold text-green-700">{workStats.mostActiveMonth.displayMonth}</div>
                          <div className="text-sm text-green-600">{workStats.mostActiveMonth.count}件の作品を制作</div>
                        </div>
                      )}

                      {/* 最も活動的だった年 */}
                      {workStats.mostActiveYear && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                          <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                            <span>🎯</span>
                            <span>最も活動的だった年</span>
                          </h4>
                          <div className="text-lg font-bold text-purple-700">{workStats.mostActiveYear.year}年</div>
                          <div className="text-sm text-purple-600">{workStats.mostActiveYear.count}件の作品を制作</div>
                        </div>
                      )}

                      {/* 年別サマリー */}
                      {workStats.yearlyActivity.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span>📊</span>
                            <span>年別サマリー</span>
                          </h4>
                          <div className="space-y-2">
                            {workStats.yearlyActivity.slice(0, 3).map((year, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700">{year.year}年</span>
                                <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">{year.count}件</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 全月別履歴（展開可能） */}
                  {workStats.monthlyActivity.length > 6 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <details className="group">
                        <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2 mb-4">
                          <span>📋 全アクティビティ履歴を表示</span>
                          <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </summary>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {workStats.monthlyActivity.map((activity, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="font-medium text-gray-900 text-sm">{activity.displayMonth}</div>
                              <div className="text-xs text-gray-600">{activity.count}件</div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                <div 
                                  className="bg-blue-500 h-1 rounded-full transition-all duration-300" 
                                  style={{ 
                                    width: `${Math.min((activity.count / Math.max(...workStats.monthlyActivity.map(a => a.count))) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* インプット記録による興味・関心分析 */}
            {inputs.length > 0 && inputAnalysis && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">興味・関心分析</h3>
                    <div className="text-sm text-gray-500">
                      {inputs.length}件のインプットから分析
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 好きなメディアタイプ */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <span>📱</span>
                        <span>好きなメディア</span>
                      </h4>
                      {inputAnalysis.typeDistribution && Object.keys(inputAnalysis.typeDistribution).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(inputAnalysis.typeDistribution).slice(0, 4).map(([type, count], index) => (
                            <div key={type} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {type === 'book' ? '📚' : 
                                   type === 'manga' ? '📖' :
                                   type === 'movie' ? '🎬' :
                                   type === 'anime' ? '🎭' :
                                   type === 'tv' ? '📺' :
                                   type === 'game' ? '🎮' :
                                   type === 'podcast' ? '🎧' : '📄'}
                                </span>
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {type === 'book' ? '書籍' : 
                                   type === 'manga' ? '漫画' :
                                   type === 'movie' ? '映画' :
                                   type === 'anime' ? 'アニメ' :
                                   type === 'tv' ? 'TV番組' :
                                   type === 'game' ? 'ゲーム' :
                                   type === 'podcast' ? 'ポッドキャスト' : 'その他'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-blue-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300" 
                                    style={{ 
                                      width: `${Math.min((count / Math.max(...Object.values(inputAnalysis.typeDistribution || {}))) * 100, 100)}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-blue-600 w-6 text-right">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-blue-600">データが不足しています</p>
                      )}
                    </div>

                    {/* 興味のあるジャンル */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                      <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                        <span>🎭</span>
                        <span>好きなジャンル</span>
                      </h4>
                      {inputAnalysis.topGenres && inputAnalysis.topGenres.length > 0 ? (
                        <div className="space-y-3">
                          {inputAnalysis.topGenres.slice(0, 5).map((genreItem, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                                  {typeof genreItem === 'string' ? genreItem : genreItem.genre}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-green-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300" 
                                    style={{ 
                                      width: `${Math.min(((typeof genreItem === 'object' && genreItem.count ? genreItem.count : 1) / Math.max(...inputAnalysis.topGenres.map(g => typeof g === 'object' && g.count ? g.count : 1))) * 100, 100)}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-green-600 w-6 text-right">
                                  {typeof genreItem === 'object' && genreItem.count ? genreItem.count : ''}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-600">まだジャンルが登録されていません</p>
                      )}
                    </div>

                    {/* よく使うタグ */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                      <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                        <span>🏷️</span>
                        <span>関心キーワード</span>
                      </h4>
                      {inputAnalysis.topTags && inputAnalysis.topTags.length > 0 ? (
                        <div className="space-y-3">
                          {inputAnalysis.topTags.slice(0, 5).map((tagItem, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                                  {typeof tagItem === 'string' ? tagItem : tagItem.tag}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-purple-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" 
                                    style={{ 
                                      width: `${Math.min(((typeof tagItem === 'object' && tagItem.count ? tagItem.count : 1) / Math.max(...inputAnalysis.topTags.map(t => typeof t === 'object' && t.count ? t.count : 1))) * 100, 100)}%` 
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-purple-600 w-6 text-right">
                                  {typeof tagItem === 'object' && tagItem.count ? tagItem.count : ''}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-purple-600">まだタグが登録されていません</p>
                      )}
                    </div>
                  </div>

                  {/* 分析サマリー */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💡</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 mb-2">あなたの興味・関心プロフィール</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">最も消費するメディア:</span>
                            <span className="ml-2 text-blue-600 font-semibold">
                              {inputAnalysis.typeDistribution ? 
                                Object.entries(inputAnalysis.typeDistribution)
                                  .sort(([, a], [, b]) => b - a)[0]?.[0] === 'book' ? '書籍' : 
                                Object.entries(inputAnalysis.typeDistribution)
                                  .sort(([, a], [, b]) => b - a)[0]?.[0] === 'manga' ? '漫画' :
                                Object.entries(inputAnalysis.typeDistribution)
                                  .sort(([, a], [, b]) => b - a)[0]?.[0] === 'movie' ? '映画' :
                                Object.entries(inputAnalysis.typeDistribution)
                                  .sort(([, a], [, b]) => b - a)[0]?.[0] === 'anime' ? 'アニメ' :
                                Object.entries(inputAnalysis.typeDistribution)
                                  .sort(([, a], [, b]) => b - a)[0]?.[0] === 'tv' ? 'TV番組' :
                                Object.entries(inputAnalysis.typeDistribution)
                                  .sort(([, a], [, b]) => b - a)[0]?.[0] === 'game' ? 'ゲーム' :
                                Object.entries(inputAnalysis.typeDistribution)
                                  .sort(([, a], [, b]) => b - a)[0]?.[0] === 'podcast' ? 'ポッドキャスト' : 'その他'
                                : 'データなし'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">主要な関心分野:</span>
                            <span className="ml-2 text-green-600 font-semibold">
                              {inputAnalysis.topGenres && inputAnalysis.topGenres[0] ?
                                (typeof inputAnalysis.topGenres[0] === 'string' ? inputAnalysis.topGenres[0] : inputAnalysis.topGenres[0].genre)
                                : 'データなし'}
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                          この分析は、あなたが記録したインプットデータを基に自動生成されています。
                          より正確な分析のために、ジャンルやタグの設定を充実させることをお勧めします。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 作品タブ */}
        {activeTab === 'works' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">作品一覧</h3>
                <p className="text-gray-600 text-sm sm:text-base">カテゴリ別に整理された作品をご覧ください</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={addCategory}
                  variant="outline"
                  className="text-sm sm:text-base"
                >
                  📁 カテゴリ追加
                </Button>
                <Button 
                  onClick={() => setIsContentTypeSelectorOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg text-sm sm:text-base w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  新しい作品を追加
                </Button>
              </div>
            </div>

            {savedWorks.length > 0 ? (
              <div>
                {/* 代表作セクション */}
                <FeaturedWorksSection
                  savedWorks={savedWorks}
                  setSavedWorks={setSavedWorks}
                  deleteWork={deleteWork}
                />
                
                {/* 通常の作品一覧 */}
                <WorksWithCategoryTabs
                  savedWorks={savedWorks}
                  categories={categories}
                  addCategory={addCategory}
                  updateCategory={updateCategory}
                  deleteCategory={deleteCategory}
                  deleteWork={deleteWork}
                  updateWorkCategory={updateWorkCategory}
                />
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">まだ作品がありません</h4>
                <p className="text-gray-500 mb-6">最初の作品を追加して、ポートフォリオを始めましょう</p>
                <Button 
                  onClick={() => setIsContentTypeSelectorOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  最初の作品を追加
                </Button>
              </div>
            )}
          </div>
        )}

        {/* インプットタブ */}
        {activeTab === 'inputs' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">📖 インプット記録</h2>
                <p className="text-gray-600 text-sm sm:text-base">読んだ本、視聴した映画・アニメ、プレイしたゲームなどを記録して、興味関心を分析しましょう</p>
              </div>
              <Link href="/inputs/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-base w-full sm:w-auto">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  新しいインプットを追加
                </Button>
              </Link>
            </div>

            {/* インプット分析 */}
            {inputAnalysis && inputs.length > 0 && (
              <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* 統計情報 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-purple-600">📈</span>
                    統計情報
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">総インプット数</span>
                      <span className="text-lg font-bold text-purple-600">{inputAnalysis.totalInputs}件</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">お気に入り</span>
                      <span className="text-lg font-bold text-pink-600">{inputAnalysis.favoriteCount}件</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">平均評価</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {inputAnalysis.averageRating ? `${inputAnalysis.averageRating.toFixed(1)}★` : 'なし'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* タイプ分布 */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-orange-600">📚</span>
                    タイプ分布
                  </h3>
                  {inputAnalysis.typeDistribution && Object.keys(inputAnalysis.typeDistribution).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(inputAnalysis.typeDistribution).slice(0, 4).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                          <span className="text-sm text-orange-600 font-semibold">{count}件</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">タイプ情報がありません</p>
                  )}
                </div>

                {/* 興味関心ワード */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">🏷️</span>
                    興味関心ワード
                  </h3>
                  {inputAnalysis.topTags && inputAnalysis.topTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {inputAnalysis.topTags.slice(0, 6).map((tagItem, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white text-blue-700 rounded-full text-xs border border-blue-200"
                        >
                          {typeof tagItem === 'string' ? tagItem : tagItem.tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">タグを追加すると分析されます</p>
                  )}
                </div>

                {/* ジャンル分析 */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-600">📊</span>
                    ジャンル分析
                  </h3>
                  {inputAnalysis.topGenres && inputAnalysis.topGenres.length > 0 ? (
                    <div className="space-y-2">
                      {inputAnalysis.topGenres.slice(0, 4).map((genreItem, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {typeof genreItem === 'string' ? genreItem : genreItem.genre}
                          </span>
                          <span className="text-sm text-green-600 font-semibold">
                            {typeof genreItem === 'object' && genreItem.count ? `${genreItem.count}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">ジャンル情報を追加すると分析されます</p>
                  )}
                </div>
              </div>
            )}

            {/* インプットグリッド */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingInputs ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">インプットを読み込み中...</p>
                </div>
              ) : inputs.length > 0 ? (
                inputs.map((input) => (
                  <Link key={input.id} href={`/profile/inputs/${input.id}`}>
                    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
                      {/* インプット画像またはプレースホルダー */}
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        {(input.coverImageUrl || (input as any).cover_image_url) ? (
                          <Image
                            src={input.coverImageUrl || (input as any).cover_image_url}
                            alt={input.title}
                            fill
                            sizes="100vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">
                                {input.type === 'book' && '📚'}
                                {input.type === 'manga' && '📖'}
                                {input.type === 'movie' && '🎬'}
                                {input.type === 'anime' && '🎭'}
                                {input.type === 'tv' && '📺'}
                                {input.type === 'youtube' && '🎥'}
                                {input.type === 'game' && '🎮'}
                                {input.type === 'podcast' && '🎧'}
                                {input.type === 'other' && '📄'}
                              </div>
                              <p className="text-gray-500 text-sm">{input.type}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* お気に入りアイコン */}
                        {input.favorite && (
                          <div className="absolute top-2 left-2 w-8 h-8 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-100">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </div>
                        )}

                        {/* 評価アイコン */}
                        {input.rating && input.rating > 0 && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-500/80 text-white rounded-full flex items-center justify-center opacity-100">
                            <span className="text-sm font-bold">{input.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* インプット情報 */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {input.title}
                        </h3>
                        
                        {/* 作者・制作者 */}
                        {input.authorCreator && (
                          <div className="flex items-center gap-1 mb-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm text-gray-600 font-medium">{input.authorCreator}</span>
                          </div>
                        )}
                        
                        {/* レビュー/ノート */}
                        {(input.review || input.notes) && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {input.review || input.notes}
                          </p>
                        )}

                        {/* タグ */}
                        {input.tags && input.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {input.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={`tag-${index}`} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {input.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{input.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* タイプとジャンル */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            {input.type}
                          </Badge>
                          {input.genres && input.genres.length > 0 && input.genres.slice(0, 2).map((genre, index) => (
                            <Badge key={`genre-${index}`} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>

                                                 {/* 外部リンクと日付 */}
                         <div className="flex items-center justify-between text-sm text-gray-500">
                           {(input.externalUrl || (input as any).external_url) && (
                             <span className="flex items-center gap-1">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002 2v-4M14 4h6m0 0v6m0-6L10 14" />
                               </svg>
                               詳細を見る
                             </span>
                           )}
                           <span>
                             {input.createdAt ? new Date(input.createdAt).toLocaleDateString('ja-JP') : ''}
                           </span>
                         </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">まだインプットがありません</h4>
                  <p className="text-gray-500 mb-4">最初のインプットを追加して、興味関心を分析しましょう</p>
                  <Link href="/inputs/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      インプットを追加
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* コンテンツタイプ選択モーダル */}
      <ContentTypeSelector 
        isOpen={isContentTypeSelectorOpen}
        onClose={() => setIsContentTypeSelectorOpen(false)}
      />
    </div>
  )
}
