"use client";

import type { PerformanceMetricsData } from "./types";
import { formatNumber } from "@/utils/stringUtils";

interface PerformanceMetricsProps {
  metrics: PerformanceMetricsData;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {

  const metricsData = [
    {
      label: "総作品数",
      value: metrics.totalWorks || 0,
      icon: "🗂️",
      color: "bg-blue-100 text-blue-700",
      description: "制作した作品の総数",
    },
    {
      label: "取引社数",
      value: metrics.uniqueClients || 0,
      icon: "🏢",
      color: "bg-purple-100 text-purple-700",
      description: "協業したクライアント数",
    },
    {
      label: "活動歴",
      value:
        metrics.experienceYears !== undefined
          ? `${metrics.experienceYears}年`
          : "-",
      icon: "⏳",
      color: "bg-amber-100 text-amber-700",
      description: "プロとしての経験年数",
    },
    {
      label: "総閲覧数",
      value: formatNumber(metrics.totalViews),
      icon: "👀",
      color: "bg-green-100 text-green-700",
      description: "全作品の総閲覧数",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          実績メトリクス
        </h3>
        <p className="text-sm text-gray-600">定量的な実績で信頼性を証明</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${metric.color} text-xl mb-3`}
            >
              {metric.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              {metric.label}
            </div>
            <div className="text-xs text-gray-500">{metric.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
