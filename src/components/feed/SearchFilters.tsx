'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (_query: string) => void
  filterType: 'all' | 'work'
  onFilterTypeChange: (_type: 'all' | 'work') => void
  filterTag: string
  onFilterTagChange: (_tag: string) => void
  popularTags: string[]
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function SearchFilters({
  searchQuery: _searchQuery,
  onSearchChange,
  filterType: _filterType,
  onFilterTypeChange,
  filterTag: _filterTag,
  onFilterTagChange,
  popularTags,
  onApplyFilters,
  onClearFilters,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApplyFilters()
  }

  const hasActiveFilters = _searchQuery || _filterType !== 'all' || _filterTag

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[73px] z-20">
      {/* 検索バー */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="作品を検索..."
              value={_searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <Button
            type="button"
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-full px-4 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            フィルター
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-2 h-2"></span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="rounded-full px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>

      {/* フィルターパネル */}
      {showFilters && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="space-y-4">
            {/* タイプフィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイプ
              </label>
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'すべて' },
                  { key: 'work', label: '作品' },
                ].map((type) => (
                  <Button
                    key={type.key}
                    type="button"
                    variant={filterType === type.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterTypeChange(type.key as any)}
                    className="rounded-full text-xs px-3 py-1"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* タグフィルター */}
            {popularTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  人気タグ
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularTags.slice(0, 10).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant={filterTag === tag ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => onFilterTagChange(filterTag === tag ? '' : tag)}
                      className="rounded-full text-xs px-3 py-1"
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* カスタムタグ入力 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カスタムタグ
              </label>
              <input
                type="text"
                placeholder="タグを入力..."
                value={filterTag}
                onChange={(e) => onFilterTagChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* アクションボタン */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                onClick={onApplyFilters}
                className="flex-1 rounded-full"
                size="sm"
              >
                検索
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClearFilters()
                  setShowFilters(false)
                }}
                className="rounded-full"
                size="sm"
              >
                クリア
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
