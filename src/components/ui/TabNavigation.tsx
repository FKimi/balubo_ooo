'use client'

import React from 'react'

export interface TabConfig {
  key: string
  label: string
  count?: number
  icon?: React.ReactNode
}

interface TabNavigationProps {
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (_tab: string) => void
  className?: string
}

export function TabNavigation({ tabs, activeTab, onTabChange, className = '' }: TabNavigationProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex relative">
        {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`relative flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all duration-200 ease-out ${
            activeTab === tab.key
              ? 'text-[#1976D2] bg-white/80'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
          }`}
        >
          {/* アイコン */}
          {tab.icon && (
            <div className={`w-4 h-4 transition-colors duration-200 ${
              activeTab === tab.key ? 'text-[#1976D2]' : 'text-slate-400'
            }`}>
              {tab.icon}
            </div>
          )}
          
          {/* ラベル */}
          <span className="whitespace-nowrap tracking-wide">{tab.label}</span>
          
          {/* カウント */}
          {tab.count !== undefined && (
            <span className={`ml-2 px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
              activeTab === tab.key
                ? 'bg-slate-100 text-slate-700'
                : 'bg-slate-50 text-slate-500'
            }`}>
              {tab.count}
            </span>
          )}
          
          {/* アクティブ時の下線 - より洗練されたデザイン */}
          {activeTab === tab.key && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1976D2]"></div>
          )}
        </button>
        ))}
      </div>
    </div>
  )
} 