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
        <p className="text-[15px] text-gray-900 leading-relaxed">
          {aiCatchphrase}
        </p>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-800">上位の強み</h3>
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
