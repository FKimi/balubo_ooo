import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SimpleProgress } from './SimpleProgress'
import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'
import { calculateMonthlyProgress, generateTimeline } from '@/utils/activityStats'

interface ActivitySectionProps {
  works: WorkData[]
  inputs: InputData[]
}

export function ActivitySection({ works, inputs }: ActivitySectionProps) {
  const monthlyProgress = calculateMonthlyProgress(works, inputs)
  const timeline = generateTimeline(works, inputs)

  const maxCount = Math.max(
    ...monthlyProgress.map((m) => m.works + m.inputs),
    1
  )

  return (
    <div className="space-y-6">
      {/* 月別アクティビティ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">月別アクティビティ（直近12ヶ月）</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyProgress.length > 0 ? (
            <div className="space-y-3">
              {monthlyProgress.map((m) => {
                const percent = ((m.works + m.inputs) / maxCount) * 100
                return (
                  <div key={m.month} className="flex items-center gap-3 text-sm">
                    <span className="w-16 text-gray-600">{m.month}</span>
                    <SimpleProgress value={percent} className="flex-1 h-2" />
                    <span className="whitespace-nowrap text-gray-500">
                      {m.works}件 / {m.inputs}件
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">アクティビティデータがありません</div>
          )}
        </CardContent>
      </Card>

      {/* 最近のタイムライン */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">最近のタイムライン</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length > 0 ? (
            <ol className="space-y-3">
              {timeline.map((ev, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  <span className="text-gray-500 mr-2">{ev.date}</span>
                  {ev.event}
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-gray-500 text-sm">タイムラインデータがありません</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 