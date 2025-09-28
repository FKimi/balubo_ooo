"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CareerNarrativeData } from "./types";

interface CareerNarrativeSectionProps {
  narrative?: CareerNarrativeData;
}

export function CareerNarrativeSection({ narrative }: CareerNarrativeSectionProps) {
  if (!narrative) return null;

  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          キャリアの物語（AI分析）
        </CardTitle>
        <p className="text-sm text-gray-600">軌跡と主人公タイプの解釈</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-xs">
          <span className="text-gray-600">主人公タイプ</span>
          <span className="font-semibold text-gray-900">{narrative.archetype}</span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">{narrative.storyline}</p>

        {Array.isArray(narrative.turningPoints) && narrative.turningPoints.length > 0 && (
          <div className="space-y-3">
            {narrative.turningPoints.map((tp, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-3">
                <div className="text-xs text-gray-500">{tp.date}</div>
                <div className="text-sm font-semibold text-gray-900">{tp.title}</div>
                <div className="text-sm text-gray-700">{tp.description}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


