"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  Camera,
  Clapperboard,
  Mic2,
  Palette,
  PenSquare,
} from "lucide-react";

interface ContentType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  enabled: boolean;
  tone?: string;
}

interface ContentTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTENT_TYPES: ContentType[] = [
  {
    id: "article",
    name: "記事・ライティング",
    description: "インタビュー記事、noteなど",
    icon: PenSquare,
    iconBg: "bg-blue-600",
    enabled: true,
    tone: "from-blue-500/15 via-blue-50 to-white",
  },
  {
    id: "design",
    name: "デザイン",
    description: "近日公開予定です。しばらくお待ちください。",
    icon: Palette,
    iconBg: "bg-indigo-500",
    enabled: false,
    tone: "from-indigo-500/15 via-indigo-50 to-white",
  },
  {
    id: "photo",
    name: "写真",
    description: "近日公開予定です。しばらくお待ちください。",
    icon: Camera,
    iconBg: "bg-emerald-500",
    enabled: false,
    tone: "from-emerald-500/15 via-emerald-50 to-white",
  },
  {
    id: "video",
    name: "動画",
    description: "動画制作、映像編集、アニメーションなど",
    icon: Clapperboard,
    iconBg: "bg-gray-400",
    enabled: false,
  },
  {
    id: "podcast",
    name: "ポッドキャスト",
    description: "音声コンテンツ、ラジオ番組など",
    icon: Mic2,
    iconBg: "bg-gray-400",
    enabled: false,
  },
  {
    id: "event",
    name: "イベント",
    description: "イベント企画・運営、カンファレンスなど",
    icon: CalendarClock,
    iconBg: "bg-gray-400",
    enabled: false,
  },
];

export function ContentTypeSelector({
  isOpen,
  onClose,
}: ContentTypeSelectorProps) {
  const router = useRouter();
  const [_selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelect = (contentType: string, disabled: boolean) => {
    if (disabled) return;
    setSelectedType(contentType);
    router.push(`/works/new?type=${contentType}`);
    onClose();
  };

  // portal setup
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // モーダル展開時のスクロール制御
  useEffect(() => {
    let scrollPosition = 0;

    if (isOpen) {
      // 現在のスクロール位置を保存
      scrollPosition = window.scrollY;

      // 背景スクロールを無効化（位置を固定）
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    } else {
      // モーダルが閉じられたときにスクロール位置を復元
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    // クリーンアップ
    return () => {
      if (isOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPosition);
      }
    };
  }, [isOpen]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-12 pb-4 px-4 overflow-y-auto"
      onClick={(e) => {
        // 背景クリック時にモーダルを閉じる
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
        style={{
          marginTop: "3rem",
          transform: "none",
          position: "relative",
          zIndex: 2147483647, // コンテンツも最前面に
        }}
      >
        {/* コンテンツエリア */}
        <div className="p-6 md:p-8 space-y-10">
          {/* タイトルブロック */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.3em] text-blue-500 uppercase">
                作品を追加
              </p>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  作品の種類を選択してください
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  選択後、専用フォームと AI 分析機能が利用できます
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              閉じる
            </button>
          </div>

          {/* カードグリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr gap-5">
            {CONTENT_TYPES.map((type) => {
              const Icon = type.icon;
              const isDisabled = !type.enabled;
              const toneClass = type.tone
                ? `bg-gradient-to-br ${type.tone}`
                : "bg-white";

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleSelect(type.id, isDisabled)}
                  disabled={isDisabled}
                  className={`group relative w-full h-full rounded-2xl border-2 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isDisabled
                      ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                      : `border-transparent ${toneClass} text-gray-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] hover:-translate-y-1`
                    }`}
                >
                  {!isDisabled && (
                    <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}

                  <div
                    className={`relative h-full rounded-[16px] ${isDisabled ? "p-5" : "p-5 bg-white/85 backdrop-blur"
                      }`}
                  >
                    <div className="flex h-full flex-col space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 ${isDisabled
                              ? "bg-gray-200 text-gray-500"
                              : `${type.iconBg} text-white group-hover:scale-110`
                            }`}
                        >
                          <Icon className="w-6 h-6" aria-hidden="true" />
                        </div>
                        {/* 徽章はシンプル化のため削除 */}
                      </div>

                      <div className="space-y-2">
                        <h3
                          className={`text-lg font-semibold tracking-tight ${isDisabled
                              ? "text-gray-400"
                              : "text-gray-900 group-hover:text-blue-700"
                            }`}
                        >
                          {type.name}
                        </h3>
                        <p
                          className={`text-sm leading-relaxed ${isDisabled ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                          {isDisabled
                            ? "近日公開予定です。しばらくお待ちください。"
                            : type.description}
                        </p>
                      </div>

                      {isDisabled && (
                        <div className="mt-auto flex items-center gap-2 text-xs font-medium text-gray-400">
                          <span className="w-2 h-2 rounded-full bg-gray-300" />
                          開発中
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* フッター */}
          <div className="mt-8 text-center space-y-3 border-t border-gray-100 pt-6">
            <p className="text-gray-500 text-sm">
              コンテンツタイプを選択すると、専用のフォームとAI分析が利用できます
            </p>
            <p className="text-gray-400 text-xs">
              他のコンテンツタイプは順次対応予定です
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // すでにGlobalModalManagerでcreatePortalが使用されているため、直接コンテンツを返す
  return modalContent;
}
