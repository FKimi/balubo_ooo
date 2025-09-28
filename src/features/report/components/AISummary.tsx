"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AISummaryProps {
  aiCatchphrase: string;
  coreCompetencies: string[];
}

export function AISummary({ aiCatchphrase, coreCompetencies }: AISummaryProps) {
  return (
    <Card className="bg-white border border-gray-100 rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900 tracking-tight">
          専門性サマリー
        </CardTitle>
        <p className="text-xs text-gray-500">作品データをもとに自動要約</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 主要サマリーをblockquote風に強調 */}
        <blockquote className="relative px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="absolute -left-2 -top-2 text-3xl text-gray-300 select-none">“</span>
          <p className="text-[16px] md:text-[17px] text-gray-900 leading-relaxed">
            {aiCatchphrase}
          </p>
        </blockquote>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">
            思考プロセスと提供価値
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {coreCompetencies.slice(0, 3).map((competency, index) => (
              <li key={index} className="leading-relaxed">
                {competency}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
