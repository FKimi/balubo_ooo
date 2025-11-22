import React from "react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "white";
    className?: string;
}

/**
 * LoadingSpinner - 統一されたローディングスピナー
 * 
 * サイズ:
 * - sm: 16px (インラインローディング)
 * - md: 32px (ボタン内ローディング)
 * - lg: 48px (ページローディング)
 */
export function LoadingSpinner({
    size = "md",
    variant = "primary",
    className = "",
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    const variantClasses = {
        primary: "border-blue-100 border-t-blue-600",
        secondary: "border-gray-200 border-t-gray-600",
        white: "border-white/30 border-t-white",
    };

    return (
        <div
            className={`loading-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            role="status"
            aria-label="読み込み中"
        >
            <span className="sr-only">読み込み中...</span>
        </div>
    );
}

interface LoadingSkeletonProps {
    className?: string;
    variant?: "text" | "card" | "avatar" | "image";
}

/**
 * LoadingSkeleton - スケルトンローディング
 * 
 * バリエーション:
 * - text: テキスト行
 * - card: カード全体
 * - avatar: アバター画像
 * - image: 画像プレースホルダー
 */
export function LoadingSkeleton({
    className = "",
    variant = "text",
}: LoadingSkeletonProps) {
    const variantClasses = {
        text: "h-4 w-full rounded",
        card: "h-48 w-full rounded-2xl",
        avatar: "h-12 w-12 rounded-full",
        image: "aspect-[4/3] w-full rounded-xl",
    };

    return (
        <div
            className={`loading-shimmer ${variantClasses[variant]} ${className}`}
            role="status"
            aria-label="読み込み中"
        >
            <span className="sr-only">読み込み中...</span>
        </div>
    );
}

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    children: React.ReactNode;
}

/**
 * LoadingOverlay - ローディングオーバーレイ
 * 
 * 機能:
 * - コンテンツ上にローディング表示
 * - カスタムメッセージ対応
 * - 背景のぼかし効果
 */
export function LoadingOverlay({
    isLoading,
    message = "読み込み中...",
    children,
}: LoadingOverlayProps) {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl fade-in">
                    <div className="flex flex-col items-center gap-3">
                        <LoadingSpinner size="lg" />
                        {message && (
                            <p className="text-sm font-medium text-gray-600">{message}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

interface LoadingPageProps {
    message?: string;
}

/**
 * LoadingPage - フルページローディング
 * 
 * 用途:
 * - ページ全体のローディング状態
 * - データ取得中の表示
 */
export function LoadingPage({ message = "読み込み中..." }: LoadingPageProps) {
    return (
        <div className="min-h-screen bg-[#F4F7FF] flex items-center justify-center fade-in">
            <div className="text-center">
                <div className="relative inline-block mb-6">
                    <LoadingSpinner size="lg" />
                    <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-blue-200 opacity-20"></div>
                </div>
                <p className="text-gray-600 font-medium">{message}</p>
            </div>
        </div>
    );
}

interface LoadingDotsProps {
    className?: string;
}

/**
 * LoadingDots - ドットアニメーション
 * 
 * 用途:
 * - インラインローディング
 * - テキストと組み合わせて使用
 */
export function LoadingDots({ className = "" }: LoadingDotsProps) {
    return (
        <span className={`inline-flex gap-1 ${className}`} role="status" aria-label="読み込み中">
            <span className="loading-pulse w-1.5 h-1.5 bg-current rounded-full" style={{ animationDelay: "0ms" }}></span>
            <span className="loading-pulse w-1.5 h-1.5 bg-current rounded-full" style={{ animationDelay: "150ms" }}></span>
            <span className="loading-pulse w-1.5 h-1.5 bg-current rounded-full" style={{ animationDelay: "300ms" }}></span>
        </span>
    );
}
