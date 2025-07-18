'use client'

import React from 'react'

export interface TabConfig {
  key: string
  label: string
  count?: number
}

interface TabNavigationProps {
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

export function TabNavigation({ tabs, activeTab, onTabChange, className = '' }: TabNavigationProps) {
  return (
    <div className={`flex space-x-2 bg-gray-100 p-2 rounded-xl ${className}`}>
      {tabs.map((_tab) => (
        <button
          key={_tab.key}
          onClick={() => onTabChange(_tab.key)}
          className={`flex-1 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-200 ${
            activeTab === _tab.key
              ? 'bg-white text-gray-900 shadow-md border border-gray-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {_tab.label}
          {_tab.count !== undefined && (
            <span className="ml-1 text-sm opacity-75">
              ({_tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  )
} 