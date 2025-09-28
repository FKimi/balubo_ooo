"use client";

import { useEffect, useRef } from "react";
import type { SpecialtyAnalysisData } from "./types";

interface SpecialtyRadarChartProps {
  data: SpecialtyAnalysisData;
}

export function SpecialtyRadarChart({ data }: SpecialtyRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // キャンバスサイズを設定
    const size = Math.min(300, canvas.parentElement?.clientWidth || 300);
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;

    // データを正規化（0-100を0-1に変換）
    const normalizedData = {
      investigativeDepth: data.investigativeDepth / 100,
      logicalStructure: data.logicalStructure / 100,
      seoExpertise: data.seoExpertise / 100,
      industrySpecificity: data.industrySpecificity / 100,
      readerEngagement: data.readerEngagement / 100,
    };

    // 軸の定義（5軸）
    const axes = [
      { name: "取材・調査力", key: "investigativeDepth", angle: 0 },
      { name: "論理構成力", key: "logicalStructure", angle: 72 },
      { name: "SEO専門性", key: "seoExpertise", angle: 144 },
      { name: "業界専門性", key: "industrySpecificity", angle: 216 },
      { name: "読者エンゲージメント", key: "readerEngagement", angle: 288 },
    ];

    // グリッドを描画
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let level = 1; level <= 5; level++) {
      const levelRadius = (radius * level) / 5;
      ctx.beginPath();
      for (let i = 0; i < axes.length; i++) {
        const axis = axes[i]!;
        const angle = (axis.angle * Math.PI) / 180;
        const x = centerX + levelRadius * Math.cos(angle - Math.PI / 2);
        const y = centerY + levelRadius * Math.sin(angle - Math.PI / 2);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 軸線を描画
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    axes.forEach((axis) => {
      const angle = (axis.angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angle - Math.PI / 2);
      const y = centerY + radius * Math.sin(angle - Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // データポイントを描画
    ctx.beginPath();
    axes.forEach((axis, index) => {
      const value = (normalizedData[axis.key as keyof typeof normalizedData] ?? 0) as number;
      const angle = (axis.angle * Math.PI) / 180;
      const x = centerX + radius * value * Math.cos(angle - Math.PI / 2);
      const y = centerY + radius * value * Math.sin(angle - Math.PI / 2);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();

    // エリアを塗りつぶし
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    ctx.fill();

    // ボーダーを描画
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // データポイントを描画
    ctx.fillStyle = "#3b82f6";
    axes.forEach((axis) => {
      const value = (normalizedData[axis.key as keyof typeof normalizedData] ?? 0) as number;
      const angle = (axis.angle * Math.PI) / 180;
      const x = centerX + radius * value * Math.cos(angle - Math.PI / 2);
      const y = centerY + radius * value * Math.sin(angle - Math.PI / 2);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // ラベルを描画
    ctx.fillStyle = "#374151";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    axes.forEach((axis) => {
      const value = (normalizedData[axis.key as keyof typeof normalizedData] ?? 0) as number;
      const angle = (axis.angle * Math.PI) / 180;
      const labelRadius = radius + 20;
      const x = centerX + labelRadius * Math.cos(angle - Math.PI / 2);
      const y = centerY + labelRadius * Math.sin(angle - Math.PI / 2);

      ctx.fillText(axis.name, x, y + 4);
      ctx.fillText(
        `${Math.round(data[axis.key as keyof typeof data])}`,
        x,
        y + 18,
      );
    });
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>

      {/* 凡例 */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span className="text-gray-600">専門性レベル</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">現在のスコア</span>
        </div>
      </div>
    </div>
  );
}
