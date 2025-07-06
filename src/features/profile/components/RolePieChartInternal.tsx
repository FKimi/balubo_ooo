"use client"

import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/common'

interface RoleData {
  role: string
  count: number
  percentage: number
}

interface RolePieChartInternalProps {
  roles: RoleData[]
}

// カラーセット: グラデーションで視認性を確保
const COLORS = [
  { from: '#3b82f6', to: '#1d4ed8' }, // blue
  { from: '#8b5cf6', to: '#6d28d9' }, // violet
  { from: '#10b981', to: '#059669' }, // emerald
  { from: '#f59e0b', to: '#d97706' }, // amber
  { from: '#ef4444', to: '#dc2626' }, // red
  { from: '#06b6d4', to: '#0891b2' }, // cyan
  { from: '#6366f1', to: '#4f46e5' }, // indigo
  { from: '#d946ef', to: '#a21caf' }, // fuchsia
]

export default function RolePieChartInternal({ roles }: RolePieChartInternalProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // データを降順ソート
  const data = roles
    .map(r => ({ name: r.role, value: Number(r.count) }))
    .filter(item => typeof item.value === 'number' && !isNaN(item.value) && item.value > 0)
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <EmptyState title="役割データがありません">
        <div className="text-5xl mb-4 animate-pulse">📊</div>
      </EmptyState>
    )
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[320px] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  // SVG サイズ
  const svgSize = 240
  const center = svgSize / 2
  const radius = 95
  const innerRadius = 60

  let currentAngle = -90 // 12時位置開始
  const segments = data.map((item, index) => {
    const percentage = (item.value / totalValue) * 100
    const angle = (item.value / totalValue) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    // 円弧パス
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const x1 = center + radius * Math.cos(startRad)
    const y1 = center + radius * Math.sin(startRad)
    const x2 = center + radius * Math.cos(endRad)
    const y2 = center + radius * Math.sin(endRad)
    const x3 = center + innerRadius * Math.cos(endRad)
    const y3 = center + innerRadius * Math.sin(endRad)
    const x4 = center + innerRadius * Math.cos(startRad)
    const y4 = center + innerRadius * Math.sin(startRad)
    const largeArcFlag = angle > 180 ? 1 : 0
    const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`

    currentAngle = endAngle
    return {
      ...item,
      percentage,
      colors: COLORS[index % COLORS.length],
      pathData,
      index
    }
  })

  const hoveredData = hoveredIndex !== null ? segments[hoveredIndex] : null

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
        {/* ドーナツグラフ */}
        <div className="relative" style={{ width: svgSize, height: svgSize }}>
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>            
            <defs>
              {segments.map((seg, i) => (
                <linearGradient key={i} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={seg.colors!.from} />
                  <stop offset="100%" stopColor={seg.colors!.to} />
                </linearGradient>
              ))}
              <filter id="segShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.15)" />
              </filter>
            </defs>

            {segments.map((seg, i) => (
              <g
                key={seg.name}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ transition: 'transform 0.2s ease-out, opacity 0.2s', transformOrigin: `${center}px ${center}px` }}
                transform={hoveredIndex === i ? 'scale(1.05)' : 'scale(1)'}
                className="cursor-pointer"
                filter={hoveredIndex === i ? 'url(#segShadow)' : ''}
                opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.4}
              >
                <path d={seg.pathData} fill={`url(#grad-${i})`} stroke="#fff" strokeWidth={2.5} />
              </g>
            ))}
          </svg>

          {/* 中央テキスト */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {hoveredData ? (
              <>
                <div className="text-2xl font-bold text-gray-800">{hoveredData.percentage.toFixed(0)}<span className="text-lg">%</span></div>
                <div className="text-sm font-medium text-gray-600">{hoveredData.name}</div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-gray-500">合計</div>
                <div className="text-2xl font-bold text-gray-700">{totalValue}</div>
                <div className="text-sm font-semibold text-gray-500">件</div>
              </>
            )}
          </div>
        </div>

        {/* 凡例 */}
        <div className="w-full max-w-xs self-center">
          <ul className="space-y-2">
            {segments.map((seg, i) => (
              <li
                key={seg.name}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex items-center p-2 rounded-lg cursor-pointer transition-colors"
                style={{ backgroundColor: hoveredIndex === i ? '#f3f4f6' : 'transparent', opacity: hoveredIndex === null || hoveredIndex === i ? 1 : 0.6 }}
              >
                <span className="w-4 h-4 mr-3 rounded-full" style={{ background: `linear-gradient(135deg, ${seg.colors!.from}, ${seg.colors!.to})` }} />
                <span className="flex-grow text-sm font-medium text-gray-700 truncate" title={seg.name}>{seg.name}</span>
                <span className="ml-3 text-sm font-semibold text-gray-800">{seg.percentage.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}