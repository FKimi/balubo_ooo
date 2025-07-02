'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { WorkData } from '@/types/work'
import { Card, CardContent } from '@/components/ui/card'

interface WorkCardProps {
  work: WorkData
  deleteWork: (workId: string) => void
}

export function WorkCard({ work, deleteWork }: WorkCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`「${work.title}」を削除してもよろしいですか？この操作は元に戻せません。`)) {
      try {
        await deleteWork(work.id)
      } catch (error) {
        console.error('作品の削除に失敗しました', error)
        alert('作品の削除に失敗しました。')
      }
    }
  }

  return (
    <div className="group relative">
      <Link href={`/works/${work.id}`} className="block">
        <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl cursor-pointer">
          <CardContent className="p-0">
            <div className="relative w-full">
              {/* 作品画像またはプレースホルダー */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {work.preview_data?.image ? (
                  <Image
                    src={work.preview_data.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              </div>

              {/* タイトル */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors text-sm">
                  {work.title}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      
      {/* 削除ボタン */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button
          onClick={handleDelete}
          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
          title="削除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
} 