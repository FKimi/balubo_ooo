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
      <div className="flex items-center gap-1 p-1 bg-gray-50/30 rounded-2xl">
        {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 ease-out ${
            activeTab === tab.key
              ? 'text-[#1e3a8a]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {/* アイコン */}
          {tab.icon && (
            <div className={`w-4 h-4 transition-colors duration-300 ${
              activeTab === tab.key ? 'text-[#1e3a8a]' : 'text-gray-400'
            }`}>
              {tab.icon}
            </div>
          )}
          
          {/* ラベル */}
          <span className="whitespace-nowrap">{tab.label}</span>
          
          {/* カウント */}
          {tab.count !== undefined && (
            <span className={`text-xs font-normal ${
              activeTab === tab.key
                ? 'text-[#1e3a8a]/70'
                : 'text-gray-400'
            }`}>
              {tab.count}
            </span>
          )}
          
          {/* アクティブ時の背景 */}
          {activeTab === tab.key && (
            <div className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100 -z-10"></div>
          )}
        </button>
        ))}
      </div>
    </div>
  )
} 