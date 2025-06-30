"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface TagBarChartProps {
  tags: Array<{ name: string; count: number }>
}

export default function TagBarChartInternal({ tags }: TagBarChartProps) {
  const data = tags.map(t => ({ name: t.name || t.tag, count: t.count }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <XAxis type="number" hide domain={[0, 'dataMax + 1']} />
        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value:number)=>`${value} 回`} />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  )
} 