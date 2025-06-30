"use client"

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface TagBarChartProps {
  tags: Array<{ name: string; count: number }>
}

export default function TagBarChartInternal({ tags }: TagBarChartProps) {
  const data = tags.map(t => ({ name: t.name || t.tag, count: t.count }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <XAxis type="number" hide domain={[0, 'dataMax + 1']} />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  )
} 