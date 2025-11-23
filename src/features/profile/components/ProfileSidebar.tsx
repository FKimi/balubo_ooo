"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShareProfileButton } from "./ShareProfileButton";

interface ProfileSidebarProps {
  displayName: string;
  title?: string;
  bio: string;
  location: string;
  avatarImageUrl: string;
  userId?: string | undefined;
  slug?: string;
  portfolioVisibility?: string;
  worksCount: number;
  skillsCount: number;
  careerCount: number;
  activeTab: "profile" | "works" | "details";
  onTabChange: (_tab: "profile" | "works" | "details") => void;
}

export function ProfileSidebar({
  displayName,
  title,
  bio,
  location,
  avatarImageUrl,
  userId,
  slug,
  portfolioVisibility,
  worksCount,
  skillsCount,
  careerCount,
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  const [avatarError, setAvatarError] = useState(false);

  const resolvedAvatarUrl =
    avatarImageUrl && avatarImageUrl.trim()
      ? avatarImageUrl.startsWith("/storage")
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${avatarImageUrl}`
        : avatarImageUrl
      : "";

  // avatarImageUrlが変更されたときにエラー状態をリセット
  useEffect(() => {
    setAvatarError(false);
  }, [avatarImageUrl]);

  const tabs = [
    {
      key: "profile" as const,
      label: "プロフィール",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      key: "works" as const,
      label: "作品",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      key: "details" as const,
      label: "クリエイター詳細",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="flex w-full h-full bg-white border-r border-gray-200">
      <div className="sticky top-0 h-screen w-full flex flex-col">
        {/* ヘッダーセクション */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-5 h-[64px] flex items-center">
          <h2 className="text-base font-bold text-gray-900">
            ダッシュボード
          </h2>
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-6">
            {/* ナビゲーションセクション */}
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* プロフィール情報セクション */}
            <div className="pt-6 border-t border-gray-200 space-y-4">
              {/* アバターと基本情報 */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 mb-3 bg-gray-50">
                  {resolvedAvatarUrl && !avatarError ? (
                    <Image
                      src={resolvedAvatarUrl}
                      alt="プロフィール画像"
                      fill
                      sizes="80px"
                      className="object-cover"
                      onError={() => setAvatarError(true)}
                      onLoadingComplete={() => setAvatarError(false)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <span className="text-2xl font-semibold text-gray-500">
                        {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-base font-semibold text-gray-900 text-center mb-0.5">
                  {displayName || "ユーザー"}
                </h1>
                {title && (
                  <p className="text-xs text-gray-600 text-center mb-3">{title}</p>
                )}
                {location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{location}</span>
                  </div>
                )}
                <div className="flex gap-2 w-full">
                  {portfolioVisibility === "public" && userId && (
                    <ShareProfileButton
                      userId={userId}
                      slug={slug}
                      displayName={displayName}
                    />
                  )}
                  <Link href="/profile/edit" className="flex-1">
                    <Button className="w-full px-3 py-1.5 text-xs font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-full">
                      編集
                    </Button>
                  </Link>
                </div>
              </div>

              {/* 自己紹介 */}
              {bio && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-3">
                    {bio}
                  </p>
                </div>
              )}
            </div>

            {/* 統計セクション */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                統計
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center py-2.5 px-2 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-lg font-semibold text-gray-900 mb-0.5">
                    {worksCount}
                  </div>
                  <div className="text-xs text-gray-500">作品</div>
                </div>
                <div className="text-center py-2.5 px-2 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-lg font-semibold text-gray-900 mb-0.5">
                    {skillsCount}
                  </div>
                  <div className="text-xs text-gray-500">スキル</div>
                </div>
                <div className="text-center py-2.5 px-2 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-lg font-semibold text-gray-900 mb-0.5">
                    {careerCount}
                  </div>
                  <div className="text-xs text-gray-500">キャリア</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 固定アクションボタンセクション */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-5 py-4 space-y-2">
          {/* Copy Profile Link Button */}
          <button
            onClick={async () => {
              const profileUrl = `${window.location.origin}/profile/${userId}`;
              try {
                await navigator.clipboard.writeText(profileUrl);
                alert('プロフィールリンクをコピーしました！');
              } catch (err) {
                console.error('Failed to copy:', err);
              }
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-xl text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="whitespace-nowrap">プロフィール共有</span>
          </button>

          {/* Settings & Support Link */}
          <Link
            href="/settings"
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>設定とサポート</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={async () => {
              const { supabase } = await import("@/lib/supabase");
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>ログアウト</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
