"use client"

import dynamic from 'next/dynamic'

export const RolePieChart = dynamic(
  () => import('./RolePieChartInternal'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[260px] w-full">
        <p className="text-sm text-gray-400">読み込み中...</p>
      </div>
    )
  }
) 