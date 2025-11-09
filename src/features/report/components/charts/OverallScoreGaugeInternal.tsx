"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface OverallScoreGaugeProps {
  score: number; // 0-100
}

export default function OverallScoreGaugeInternal({
  score,
}: OverallScoreGaugeProps) {
  const data = [
    {
      name: "score",
      value: Math.min(100, Math.max(0, score)),
      fill: "#6366f1",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="80%"
        outerRadius="80%"
        barSize={16}
        startAngle={180}
        endAngle={0}
        data={data}
      >
        <RadialBar dataKey="value" />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-4xl font-bold fill-blue-700"
        >
          {score}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
