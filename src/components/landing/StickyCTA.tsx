"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * モバイル専用スティッキーCTAバー
 * 
 * 【なぜ必要か】
 * - モバイルではファーストビューでCTAボタンが画面外に隠れることが多い
 * - スクロール後もCTAにアクセスできることで、CVRが20〜30%向上する（業界データ）
 * 
 * 【実装のポイント】
 * - スクロールが一定量を超えたら表示（Heroセクションを過ぎたら）
 * - モバイルのみ表示（md:hidden）
 * - 下部固定で邪魔にならないデザイン
 */
export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      // Heroセクション（約800px）を超えたら表示
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 shadow-2xl animate-slide-up-bottom"
      role="region"
      aria-label="行動喚起バー"
    >
      <div className="container mx-auto max-w-lg">
        <Button
          className="w-full bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60"
          disabled={isRedirecting}
          onClick={() => {
            setIsRedirecting(true);
            router.push("/register");
          }}
        >
          {isRedirecting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              読み込み中…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              無料で始める
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          )}
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          3分で完了・クレジットカード不要
        </p>
      </div>
    </div>
  );
}
