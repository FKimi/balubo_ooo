import Link from 'next/link'
import Image from 'next/image'
import type { WorkData } from '@/features/work/types'
import { Card, CardContent } from '@/components/ui/card'

interface WorkCardProps {
  work: WorkData
  onDelete: (_workId: string) => void
  isDraggable?: boolean
  isFeatured?: boolean // isFeaturedプロップを追加
}

export function WorkCard({ work, isFeatured = false }: WorkCardProps) {
  return (
    <div 
      className={`group relative h-full ${
        isFeatured ? 'transform group-hover:scale-105 transition-transform duration-300' : ''
      }`}>
      <Link href={`/works/${work.id}`} className="block h-full">
        <Card 
          className={`h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl cursor-pointer ${
            isFeatured ? 'shadow-lg group-hover:shadow-2xl' : ''
          }`}>
          <CardContent className="p-0 flex flex-col h-full">
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
              <div className="p-4 flex-grow">
                <h3 
                  className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors ${
                    isFeatured ? 'text-base' : 'text-sm'
                  }`}>
                  {work.title}
                </h3>
                
                {/* デザイン用の追加情報 */}
                {work.content_type === 'design' && (
                  <div className="mt-2 space-y-1">
                    {/* デザインツール */}
                    {work.design_tools && work.design_tools.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {work.design_tools.slice(0, 2).map((tool) => (
                          <span key={tool} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                            {tool}
                          </span>
                        ))}
                        {work.design_tools.length > 2 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                            +{work.design_tools.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* カラーパレット */}
                    {work.color_palette && work.color_palette.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">カラー:</span>
                        <div className="flex gap-1">
                          {work.color_palette.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-gray-200"
                              style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
                              title={color}
                            />
                          ))}
                          {work.color_palette.length > 3 && (
                            <span className="text-xs text-gray-500">+{work.color_palette.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
} 