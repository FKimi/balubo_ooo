'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import type { WorkData } from '@/types/work'
import { EmptyState } from '@/components/common'

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <Link href={`/works/${work.id}`} key={work.id}>
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
                <CardContent className="p-0 flex-grow flex flex-col">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={work.preview_data?.image || '/images/placeholder.png'}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-md mb-2 flex-grow">{work.title}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{work.description}</p>
                    <div className="text-right text-xs text-gray-400">
                      {new Date(work.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
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