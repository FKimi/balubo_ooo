import { Card, CardContent } from '@/components/ui/card'
import { TagSummarySection } from './TagSummarySection'

interface CreatorIntroCardProps {
  tags?: [string, number][]
}

/**
 * クリエイター詳細タブの最上部に表示する自己紹介カード
 */
export function CreatorIntroCard({ tags = [] }: CreatorIntroCardProps) {

  return (
    <Card className="border border-gray-200 shadow-sm rounded-2xl w-full">
      <CardContent className="p-6 md:p-8 lg:p-10 w-full">
        {/* タグ要約 (AI生成) */}
        {tags.length > 0 && (
          <div className="w-full">
            <TagSummarySection tags={tags} />
          </div>
        )}
      </CardContent>
    </Card>
  )
} 