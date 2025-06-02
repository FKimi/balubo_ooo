'use client'

import Link from 'next/link'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import type { WorkData } from '@/types/work'

interface WorkCardProps {
  work: WorkData
  onDelete: (id: string) => void
  isDraggable?: boolean
}

export function WorkCard({ work, onDelete, isDraggable = true }: WorkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: work.id,
    disabled: !isDraggable
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // 掲載月をフォーマットする関数
  const formatProductionDate = (dateString: string | undefined) => {
    if (!dateString) return null
    
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      return `${year}年${month}月`
    } catch (error) {
      return null
    }
  }

  const formattedDate = formatProductionDate(work.production_date)

  const cardContent = (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
      {/* 作品画像またはプレースホルダー */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {work.preview_data?.image ? (
          <img
            src={work.preview_data.image}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <p className="text-gray-500 text-sm">画像なし</p>
            </div>
          </div>
        )}
        
        {/* 削除ボタン */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(work.id)
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="削除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 編集アイコン */}
        <div className="absolute top-2 left-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>

      {/* 作品情報 */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {work.title}
        </h3>
        
        {/* 掲載月 */}
        {formattedDate && (
          <div className="flex items-center gap-1 mb-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-blue-600 font-medium">{formattedDate}掲載</span>
          </div>
        )}
        
        {work.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {work.description}
          </p>
        )}

        {/* タグ */}
        {work.tags && work.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {work.tags.slice(0, 3).map((tag, index) => (
              <Badge key={`tag-${index}`} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {work.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{work.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* 役割 */}
        {work.roles && work.roles.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {work.roles.map((role, index) => (
              <Badge key={`role-${index}`} className="text-xs bg-purple-100 text-purple-800">
                {role}
              </Badge>
            ))}
          </div>
        )}

        {/* 外部リンク */}
        {work.external_url && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              外部リンクを開く
            </span>
          </div>
        )}
      </div>
    </div>
  )

  if (!isDraggable) {
    return (
      <Link href={`/works/${work.id}`}>
        {cardContent}
      </Link>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <Link href={`/works/${work.id}`}>
        {cardContent}
      </Link>
    </div>
  )
} 