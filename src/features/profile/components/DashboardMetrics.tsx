"use client";

import { useMemo } from "react";
import type { WorkData } from "@/features/work/types";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardMetricsProps {
  works: WorkData[];
}

interface MetricCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  description?: string;
}

export function DashboardMetrics({ works }: DashboardMetricsProps) {
  const metrics = useMemo(() => {
    // 公開記事数（content_typeがarticleのもの）
    const publishedArticles = works.filter(
      (work) => work.content_type === "article",
    ).length;

    // 累計ビュー
    const totalViews = works.reduce(
      (sum, work) => sum + (work.view_count || 0),
      0,
    );

    // 累計いいね数
    const totalLikes = works.reduce(
      (sum, work) => sum + (work.likes_count || work.likes?.[0]?.count || 0),
      0,
    );

    // 累計コメント数
    const totalComments = works.reduce(
      (sum, work) =>
        sum + (work.comments_count || work.comments?.[0]?.count || 0),
      0,
    );

    const metricsData: MetricCard[] = [
      {
        title: "公開記事数",
        value: publishedArticles,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
      },
      {
        title: "累計ビュー",
        value:
          totalViews >= 1000
            ? `${(totalViews / 1000).toFixed(1)}K`
            : totalViews,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ),
      },
      {
        title: "累計いいね",
        value: totalLikes,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        ),
      },
      {
        title: "累計コメント",
        value: totalComments,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        ),
      },
    ];

    return metricsData;
  }, [works]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                {metric.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {metric.title}
            </div>
            {metric.description && (
              <div className="text-xs text-gray-500 mt-1">
                {metric.description}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

