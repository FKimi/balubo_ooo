'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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

  const cardContent = (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden cursor-pointer">
      {/* 作品画像またはプレースホルダー */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {work.preview_data?.image ? (
          <Image
            src={work.preview_data.image}
            alt={work.title}
            fill
            sizes="100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-blue-600 text-sm">画像なし</p>
            </div>
          </div>
        )}
        
        {/* 削除ボタン（編集モードのみ） */}
        {isDraggable && (
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
        )}
      </div>

      {/* タイトルのみ */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors text-sm">
          {work.title}
        </h3>
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