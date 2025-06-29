import Image from 'next/image'
import { WorkData } from '@/types/work'
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
          <span className="text-2xl">⭐</span>
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
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                  <div className="text-center">
                    <div className="text-4xl text-amber-600 mb-2">🎨</div>
                    <p className="text-xs text-amber-700">代表作画像</p>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                {work.title}
              </h3>
              
              {work.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {work.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {work.roles && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    {Array.isArray(work.roles) ? work.roles.join(', ') : work.roles}
                  </span>
                )}
                {work.content_type && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {work.content_type}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {work.production_date ? 
                    new Date(work.production_date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' }) :
                    new Date(work.created_at).toLocaleDateString('ja-JP')
                  }
                </span>
                <div className="flex items-center gap-1 text-amber-600">
                  <span>⭐</span>
                  <span className="font-medium">代表作</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 