"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";

interface ProfileStatsCardsProps {
  worksCount: number;
  skillsCount: number;
  careerCount: number;
}

export function ProfileStatsCards({
  worksCount,
  skillsCount,
  careerCount,
}: ProfileStatsCardsProps) {
  const stats = useMemo(
    () => [
      {
        label: "作品数",
        value: worksCount,
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        ),
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "スキル",
        value: skillsCount,
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ),
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        label: "キャリア",
        value: careerCount,
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6v2a2 2 0 002 2h4a2 2 0 002-2V6m0 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2z"
            />
          </svg>
        ),
        color: "text-gray-700",
        bgColor: "bg-gray-50",
      },
    ],
    [worksCount, skillsCount, careerCount],
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white rounded-2xl"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


