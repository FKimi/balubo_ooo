'use client'

import { useState } from 'react'
import { WorkCard } from '@/features/work/components/WorkCard'
import type { WorkData } from '@/types/work'

interface Category {
  id: string
  name: string
  color: string
  works: WorkData[]
}

interface WorksCategoryManagerProps {
  savedWorks: WorkData[]
  categories: Category[]
  addCategory: () => void
  updateCategory: (categoryId: string, newName: string, newColor: string) => void
  deleteCategory: (categoryId: string) => void
  deleteWork: (workId: string) => void
  updateWorkCategory: (workId: string, categoryName: string) => void
}

export function WorksCategoryManager({
  savedWorks,
  categories,
  addCategory,
  updateCategory,
  deleteCategory,
  deleteWork,
  updateWorkCategory: _updateWorkCategory
}: WorksCategoryManagerProps) {
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
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
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
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300'
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
            className="px-5 py-2.5 border-2 border-dashed border-blue-200 rounded-full text-sm font-medium text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            カテゴリ追加
          </button>
        </div>

        {/* 月別フィルタ */}
        {availableMonths.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">掲載月で絞り込み</span>
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                >
                  <option value="all">すべての月</option>
                  {availableMonths.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">{filteredWorks.length}件の作品が表示されています</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 作品グリッド */}
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m0 5v6h4l2 2-2 2h-4v-6z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                {selectedCategory === 'all' ? 'まだ作品がありません' : 'このカテゴリには作品がありません'}
              </h4>
              <p className="text-gray-500 max-w-md mx-auto">
                {selectedCategory === 'all' 
                  ? '最初の作品を追加しましょう' 
                  : '他のカテゴリから作品を移動するか、新しい作品を追加してください'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 