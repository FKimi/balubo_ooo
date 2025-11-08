"use client";

import { useEffect, useRef } from "react";
import type { IndustryData } from "./types";

interface ClientIndustryBreakdownProps {
  industryData: IndustryData[];
  showHeader?: boolean;
}

export function ClientIndustryBreakdown({
  industryData,
  showHeader = true,
}: ClientIndustryBreakdownProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // キャンバスサイズを設定
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;

    if (industryData.length === 0) return;

    // パイチャートを描画
    let currentAngle = -Math.PI / 2; // 12時から開始

    const colorMap: Record<string, string> = {
      SaaS: "#3b82f6",
      製造業: "#10b981",
      金融: "#f59e0b",
      医療: "#ef4444",
      小売: "#8b5cf6",
      その他: "#6b7280",
    };

    industryData.forEach((industry, _index) => {
      const sliceAngle = (industry.percentage / 100) * 2 * Math.PI;

      // スライスを描画
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle,
      );
      ctx.closePath();

      // 色を設定（安定パレット）
      ctx.fillStyle = colorMap[industry.industry] || industry.color;
      ctx.fill();

      // ボーダーを描画
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });
  }, [industryData]);

  return (
    <div className="space-y-4">
      {showHeader && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            クライアント業界比率
          </h3>
          <p className="text-sm text-gray-600">業界解像度を示す経験の分布</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* 円グラフ */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 border border-gray-100 rounded-xl flex items-center justify-center bg-white">
            {industryData.length === 0 ? (
              <span className="text-sm text-gray-500">データ不足</span>
            ) : (
              <canvas ref={canvasRef} className="w-48 h-48" />
            )}
          </div>
        </div>

        {/* 凡例（シンプル表記: 業界名 - パーセンテージ） */}
        <div className="flex-1 space-y-2">
          {industryData.map((industry, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: industry.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {industry.industry}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {`${industry.percentage.toFixed(1)}%`}
                </div>
              </div>
            </div>
          ))}
          {industryData.length === 0 && (
            <div className="text-center p-4 border border-gray-200 rounded-xl bg-white">
              <p className="text-sm text-gray-600">
                業界データがまだ十分ではありません
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 説明ボックス（ミニマル） */}
      <div className="rounded-xl p-4 border border-gray-200 bg-white">
        <p className="text-sm text-gray-600">
          多様な業界での実績は、複雑なビジネス課題を理解し適切な解を導く力の証左です。
        </p>
      </div>
    </div>
  );
}
