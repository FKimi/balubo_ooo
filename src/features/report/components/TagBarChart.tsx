"use client"

import dynamic from 'next/dynamic'

export const TagBarChart = dynamic(() => import('./charts/TagBarChartInternal'), { ssr: false }) 