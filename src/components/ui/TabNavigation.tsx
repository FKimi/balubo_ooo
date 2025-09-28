"use client";

import React from "react";

export interface TabConfig {
  key: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (_tab: string) => void;
  className?: string;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabNavigationProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="inline-flex items-center gap-1 p-1 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl border border-gray-200 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`panel-${tab.key}`}
            className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a8a]/40 rounded-xl ${
              activeTab === tab.key
                ? "text-[#1e3a8a]"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {/* アイコン */}
            {tab.icon && (
              <span
                className={`w-4 h-4 ${activeTab === tab.key ? "text-[#1e3a8a]" : "text-gray-400"}`}
              >
                {tab.icon}
              </span>
            )}

            {/* ラベル */}
            <span className="whitespace-nowrap">{tab.label}</span>

            {/* カウント */}
            {tab.count !== undefined && (
              <span
                className={`text-xs ${
                  activeTab === tab.key ? "text-[#1e3a8a]/70" : "text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            )}

            {/* アクティブ時の背景 */}
            {activeTab === tab.key && (
              <span className="absolute inset-0 -z-10 rounded-xl bg-white shadow-sm border border-gray-200" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
