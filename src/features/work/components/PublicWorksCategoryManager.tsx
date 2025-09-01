'use client'

import { useState, useMemo } from 'react'
import type { WorkData } from '@/features/work/types'
import { EmptyState } from '@/components/common'
import { WorkCard } from '@/features/work/components/WorkCard'

interface Category {
  id: string
  name: string
  works: WorkData[]
}

interface PublicWorksCategoryManagerProps {
  works: WorkData[]
  categories: Category[]
}

export function PublicWorksCategoryManager({ works, categories }: PublicWorksCategoryManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const allCategoriesWithAll = useMemo(() => {
    const categoryList = [
      { id: 'all', name: 'ALL', works: works },
      ...categories.filter(cat => cat.id !== 'uncategorized'),
    ]
    // "未分類" タブは非表示
    return categoryList
  }, [categories, works])

  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'all') {
      return works
    }
    const category = categories.find(cat => cat.id === selectedCategory)
    return category?.works || []
  }, [selectedCategory, categories, works])

  return (
    <div>
      {/* カテゴリタブ */}
      <div className="flex flex-wrap gap-3 mb-6">
        {allCategoriesWithAll.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
            <span className="ml-1.5 text-xs opacity-80">
              ({category.works.length})
            </span>
          </button>
        ))}
      </div>

      {/* 作品一覧 */}
      {filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredWorks.map((work) => (
            <WorkCard key={work.id} work={work as WorkData} onDelete={() => {}} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={selectedCategory === 'all' ? 'まだ作品がありません' : 'このカテゴリには作品がありません'}
          message={selectedCategory === 'all' ? '作品が投稿されるとここに表示されます' : '別のカテゴリを選択してください'}
        />
      )}
    </div>
  )
} 