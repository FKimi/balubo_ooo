import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message?: string;
  /** href 優先、なければ onClick */
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  icon?: LucideIcon;
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
  icon: Icon,
  children,
}) => {
  return (
    <div className="w-full flex justify-center py-12 md:py-16">
      <div className="max-w-md w-full flex flex-col items-center text-center px-4">
        {Icon && (
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <Icon className="w-10 h-10 text-blue-500" />
          </div>
        )}
        <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
          {title}
        </h4>
        {message && (
          <p className="text-gray-500 mb-8 whitespace-pre-line leading-relaxed">
            {message}
          </p>
        )}
        {ctaLabel &&
          (ctaHref ? (
            <Link href={ctaHref} className="inline-block w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                {ctaLabel}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={onCtaClick}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              {ctaLabel}
            </Button>
          ))}
        {children}
      </div>
    </div>
  );
};
