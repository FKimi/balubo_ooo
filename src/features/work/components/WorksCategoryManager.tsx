'use client'

import { useState } from 'react'
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
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
  addCategory: () => string // 新しく作成されたカテゴリのIDを返す
  updateCategory: (categoryId: string, newName: string, newColor: string) => void
  deleteCategory: (categoryId: string) => void
  deleteWork: (workId: string) => void
  updateWorkCategory: (workId: string, categoryId: string) => void
}

function DraggableWorkCard({ work, onDelete }: { work: WorkData, onDelete: (workId: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: work.id,
    data: { work },
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` ,
    zIndex: 1000,
  } : undefined

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative touch-none transition-all duration-200 ${isDragging ? 'opacity-70 rotate-1 shadow-2xl scale-105' : ''}`}
      {...attributes}
      {...listeners}
    >
      <WorkCard work={work} onDelete={onDelete} />

      {/* ドラッグ中の補助表示 */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100/50 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-lg">
            ドロップして移動
          </div>
        </div>
      )}
    </div>
  )
}

function DroppableCategoryTab({ 
  category, 
  selectedCategory, 
  onSelect,
  children,
  isDragActive = false
}: { 
  category: { id: string }, 
  selectedCategory: string, 
  onSelect: (id: string) => void,
  children: React.ReactNode,
  isDragActive?: boolean
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: category.id,
  });

  const isSelected = selectedCategory === category.id

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelect(category.id)}
      className={`
        relative px-6 py-4 rounded-xl border-3 transition-all duration-300 cursor-pointer min-w-[120px] text-center
        ${isSelected 
          ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
        }
        ${isOver 
          ? 'border-blue-500 bg-blue-100 shadow-2xl scale-110 ring-4 ring-blue-300 ring-opacity-50 transform' 
          : isDragActive 
            ? 'border-dashed border-blue-400 bg-blue-50 scale-105' 
            : ''
        }
      `}
    >
      {/* 強化されたドロップゾーンの視覚的表現 */}
      {isDragActive && (
        <div className="absolute inset-2 border-3 border-dashed border-blue-400 rounded-lg opacity-80 animate-pulse"></div>
      )}

      {/* より目立つドロップアニメーション */}
      {isOver && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/30 to-blue-500/30 animate-pulse">
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold animate-bounce shadow-lg">
              📂 ここにドロップ
            </div>
          </div>
        </div>
      )}

      {/* カテゴリ名 */}
      <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'} ${isDragActive ? 'opacity-70' : ''}`}>
        {children}
      </div>

      {/* より目立つドラッグアクティブ時のインジケーター */}
      {isDragActive && !isOver && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-ping border-2 border-white"></div>
      )}

      {/* ドロップ可能エリアの説明 */}
      {isDragActive && !isOver && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          ドロップ可能
        </div>
      )}
    </div>
  );
}

export function WorksCategoryManager({
  savedWorks,
  categories,
  addCategory,
  updateCategory,
  deleteCategory,
  deleteWork,
  updateWorkCategory
}: WorksCategoryManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [isEditingCategory, setIsEditingCategory] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150, // 150ms長押しでドラッグ開始
        tolerance: 4, // スクロール誤検知防止
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragActive(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragActive(false)
    const { over, active } = event
    if (over && active.id && over.id !== active.data.current?.work.category_id) {
      const workId = active.id as string
      const categoryId = over.id as string
      const work = savedWorks.find(w => w.id === workId)
      const targetCategory = allCategoriesWithAll.find(cat => cat.id === categoryId)
      
      // 楽観的UI更新の前に成功メッセージを準備
      const workTitle = work?.title || '作品'
      const categoryName = targetCategory?.name || 'カテゴリ'
      
      try {
        updateWorkCategory(workId, categoryId)
        // 成功フィードバック
        setSuccessMessage(`「${workTitle}」を「${categoryName}」に移動しました`)
        setTimeout(() => setSuccessMessage(null), 3000)
      } catch (error) {
        console.error('カテゴリ移動エラー:', error)
        setErrorMessage(`作品の移動に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
        setTimeout(() => setErrorMessage(null), 5000)
      }
    }
  }

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
    { id: 'all', name: 'ALL', color: '#6B7280', works: savedWorks },
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
        await deleteCategory(categoryId)
        
        if (selectedCategory === categoryId) {
          setSelectedCategory('all')
        }

        if (workCount > 0) {
          setSuccessMessage(`「${category.name}」カテゴリを削除しました。${workCount}件の作品を未分類に移動しました。`)
        } else {
          setSuccessMessage(`「${category.name}」カテゴリを削除しました。`)
        }
        setTimeout(() => setSuccessMessage(null), 3000)

      } catch (error) {
        console.error('カテゴリ削除エラー:', error)
        setErrorMessage(`カテゴリの削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
        setTimeout(() => setErrorMessage(null), 5000)
      }
    }
  }

  // カテゴリ編集
  const handleEditCategory = (categoryId: string, currentName: string) => {
    setIsEditingCategory(categoryId)
    setEditCategoryName(currentName)
  }

  const handleSaveCategory = async (categoryId:string) => {
    if (editCategoryName.trim()) {
      try {
        const category = categories.find(cat => cat.id === categoryId)
        if (category) {
          await updateCategory(categoryId, editCategoryName.trim(), category.color)
        }
      } catch (error) {
        console.error('カテゴリ名変更エラー:', error)
        setErrorMessage(`カテゴリ名の変更に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
        setTimeout(() => setErrorMessage(null), 5000)
      }
    }
    setIsEditingCategory(null)
    setEditCategoryName('')
  }

  // カテゴリ追加のハンドラー
  const handleAddCategory = () => {
    const newCategoryId = addCategory()
    // 新しく作成されたカテゴリを編集モードにする
    setTimeout(() => {
      setIsEditingCategory(newCategoryId)
      setEditCategoryName('')
    }, 100)
  }
  
  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
      <div>
        {/* 成功メッセージ */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          </div>
        )}
        {/* 強化されたドラッグ中のヘルプテキスト */}
        {isDragActive && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 text-blue-900">
              <div className="bg-blue-600 p-2 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold">📂 カテゴリ移動中</div>
                <div className="text-sm">移動したいカテゴリの上にドロップしてください</div>
              </div>
            </div>
          </div>
        )}

        {/* ドラッグ操作のガイド */}
        {!isDragActive && savedWorks.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                作品カードを<strong className="px-1">長押し</strong>してドラッグし、移動先のカテゴリにドロップしてください
              </span>
            </div>
          </div>
        )}

        {/* 空のカテゴリがある場合のヒント */}
        {!isDragActive && categories.some(cat => cat.works.length === 0) && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium">空のカテゴリは作品をドラッグ&ドロップで移動すると保存されます</span>
            </div>
          </div>
        )}

        {/* カテゴリタブ */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">カテゴリ</h3>
            <span className="text-sm text-gray-500">作品をカテゴリにドラッグ＆ドロップして整理</span>
          </div>
          
          {/* カテゴリボックス（横一列） */}
          <div className="flex flex-wrap gap-3 mb-6">
            {allCategoriesWithAll.map((category) => (
              <div key={category.id} className="relative group">
                {isEditingCategory === category.id ? (
                  <div className="px-4 py-3 bg-white border-2 border-blue-500 rounded-lg shadow-lg flex flex-col items-center justify-center min-w-[100px] relative">
                    {/* 新しく作成されたカテゴリの場合のヒント */}
                    {category.works.length === 0 && editCategoryName === '' && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap z-10">
                        カテゴリ名を入力してください
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                      </div>
                    )}
                    
                    <div className="w-full">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="w-full text-sm bg-transparent outline-none text-center font-medium"
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveCategory(category.id)}
                        onBlur={() => handleSaveCategory(category.id)}
                        autoFocus
                        placeholder="カテゴリ名"
                      />
                      <div className="flex justify-center gap-1 mt-1">
                        <button onClick={() => handleSaveCategory(category.id)} className="text-green-600 hover:text-green-800" title="保存">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </button>
                        <button onClick={() => setIsEditingCategory(null)} className="text-red-600 hover:text-red-800" title="キャンセル">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DroppableCategoryTab
                    category={category}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                    isDragActive={isDragActive}
                  >
                    {category.name}
                    <span className="text-xs opacity-75 ml-1">({category.works.length})</span>
                  </DroppableCategoryTab>
                )}

                {/* カテゴリ管理ボタン */}
                {category.id !== 'all' && isEditingCategory !== category.id && (
                  <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditCategory(category.id, category.name) }}
                        className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md"
                        title="編集"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {category.id !== 'uncategorized' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id) }}
                          className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md"
                          title="削除"
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* カテゴリ追加ボタン */}
            <button
              onClick={handleAddCategory}
              className="px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 min-w-[100px] flex items-center justify-center gap-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              追加
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
                <DraggableWorkCard key={work.id} work={work} onDelete={deleteWork} />
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
    </DndContext>
  )
} 