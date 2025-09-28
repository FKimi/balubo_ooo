"use client";

import type { KeywordData } from "./types";

interface KeywordCloudProps {
  keywords: KeywordData[];
}

export function KeywordCloud({ keywords }: KeywordCloudProps) {
  // キーワードを重み順でソート
  const sortedKeywords = [...keywords].sort((a, b) => b.weight - a.weight);

  // 重みに基づくサイズと色のマッピング
  const getSize = (weight: number) => {
    const sizes = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl"];
    return sizes[Math.min(weight - 1, sizes.length - 1)];
  };

  const getColor = (weight: number) => {
    // よりプロフェッショナルなトーン: モノクロ基調に青のアクセントを限定
    const colors = [
      "text-gray-600 bg-gray-50",
      "text-gray-700 bg-gray-100",
      "text-gray-800 bg-gray-100",
      "text-blue-700 bg-blue-50",
      "text-blue-800 bg-blue-100",
    ];
    return colors[Math.min(weight - 1, colors.length - 1)];
  };

  return (
    <div className="space-y-4">
      {sortedKeywords.length === 0 && (
        <div className="text-center p-6 bg-white border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-600">
            キーワードデータがまだ十分ではありません
          </p>
        </div>
      )}
      {/* キーワードクラウド */}
      <div className="flex flex-wrap gap-2 justify-center items-center min-h-[120px] p-4 bg-white border border-gray-100 rounded-xl">
        {sortedKeywords.map((keyword, index) => (
          <span
            key={index}
            className={`inline-block px-2.5 py-1 rounded-full font-medium transition-colors duration-150 hover:bg-blue-50 ${getSize(keyword.weight)} ${getColor(keyword.weight)}`}
            title={`出現回数: ${keyword.frequency}回`}
          >
            {keyword.keyword}
          </span>
        ))}
      </div>

      {/* ノイズ削減のため統計情報は非表示 */}
    </div>
  );
}
