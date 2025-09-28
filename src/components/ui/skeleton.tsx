import React from "react";

interface SkeletonProps {
  className?: string;
}

/**
 * 汎用スケルトンプレースホルダー
 * Usage:
 * <Skeleton className="w-full h-4" />
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    />
  );
};
