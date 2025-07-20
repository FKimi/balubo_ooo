import Image from 'next/image'
import { WorkData } from '@/features/work/types'
import { Card, CardContent } from '@/components/ui/card'

interface PublicFeaturedWorksSectionProps {
  works: WorkData[]
}

export function PublicFeaturedWorksSection({ works }: PublicFeaturedWorksSectionProps) {
  // 代表作を取得（featured_orderでソート）
  const featuredWorks = works
    .filter(work => work.is_featured)
    .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))

  if (featuredWorks.length === 0) {
    return null // 代表作がない場合は何も表示しない
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          代表作
          <span className="text-sm font-normal text-gray-500">
            ({featuredWorks.length}/3)
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredWorks.map((work, index) => (
          <Card key={work.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            {/* 代表作ランキングバッジ */}
            <div className="absolute top-3 left-3 z-10">
              <div className={`
                px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg
                ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : ''}
                ${index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' : ''}
                ${index === 2 ? 'bg-gradient-to-r from-amber-400 to-orange-600' : ''}
              `}>
                #{index + 1} 代表作
              </div>
            </div>

            {/* 作品画像 */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              {work.banner_image_url ? (
                <Image 
                  src={work.banner_image_url}
                  alt={work.title}
                  fill
                  sizes="100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-blue-700">代表作画像</p>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-700 transition-colors text-sm">
                {work.title}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 