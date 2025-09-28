import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

interface EmptyStateProps {
  title: string;
  message?: string;
  /** href 優先、なければ onClick */
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  children?: React.ReactNode; // 追加で要素を差し込みたい場合
}

/**
 * 画面共通で使えるエンプティステート表示
 * - flex center レイアウト
 * - max-width を絞りつつ中央寄せ
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  ctaLabel,
  ctaHref,
  onCtaClick,
  children,
}) => {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-md flex flex-col items-center text-center py-12">
        <h4 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
          {title}
        </h4>
        {message && (
          <p className="text-gray-500 mb-4 whitespace-pre-line">{message}</p>
        )}
        {ctaLabel &&
          (ctaHref ? (
            <Link href={ctaHref} className="inline-block">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-400/30 transition-all duration-300 mx-auto">
                {ctaLabel}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onCtaClick}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-400/30 transition-all duration-300 mx-auto"
            >
              {ctaLabel}
            </Button>
          ))}
        {children}
      </div>
    </div>
  );
};
