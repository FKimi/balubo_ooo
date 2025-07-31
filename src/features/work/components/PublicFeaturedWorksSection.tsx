import { WorkCard } from '@/features/work/components/WorkCard'
import type { WorkData } from '@/features/work/types'

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
          <div key={work.id} className="relative">
            {/* ランキングバッジ */}
            <div className="absolute top-3 left-3 z-10">
              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${index===0?'bg-gradient-to-r from-yellow-400 to-orange-500':index===1?'bg-gradient-to-r from-gray-300 to-gray-500':index===2?'bg-gradient-to-r from-amber-400 to-orange-600':'bg-blue-500'}`}>#{index+1} 代表作</div>
            </div>
            <WorkCard work={work as WorkData} onDelete={()=>{}} isFeatured />
          </div>
        ))}
      </div>
    </div>
  )
} 