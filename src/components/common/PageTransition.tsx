"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
    children: React.ReactNode;
}

/**
 * PageTransition - ページ遷移時のアニメーションを提供
 * 
 * 機能:
 * - フェードイン/アウトアニメーション
 * - スクロール位置の復元
 * - スムーズなページ遷移体験
 */
export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        // ページ遷移開始時
        setIsTransitioning(true);

        // スクロール位置をトップに戻す
        window.scrollTo({ top: 0, behavior: "auto" });

        // アニメーション完了後にトランジション状態を解除
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <div
            className={`transition-page ${isTransitioning ? "fade-in" : ""}`}
            style={{
                minHeight: "100vh",
            }}
        >
            {children}
        </div>
    );
}
