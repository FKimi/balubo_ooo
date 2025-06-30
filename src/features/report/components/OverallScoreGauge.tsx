"use client"

import dynamic from 'next/dynamic'

export const OverallScoreGauge = dynamic(() => import('./charts/OverallScoreGaugeInternal'), { ssr: false }) 