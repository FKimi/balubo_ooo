"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShareProfileButton } from "./ShareProfileButton";
import { FollowStats } from "@/features/follow/components/FollowStats";

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
  followerCount?: number | undefined;
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
  followerCount,
  activeTab,
  onTabChange,
}: ProfileSidebarProps) {
  const resolvedAvatarUrl =
    avatarImageUrl && avatarImageUrl.trim()
      ? avatarImageUrl.startsWith("/storage")
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${avatarImageUrl}`
        : avatarImageUrl
      : "";

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
    <aside className="hidden lg:flex w-80 flex-shrink-0 pr-6">
      <div className="sticky top-6 space-y-6 w-full">
        {/* プロフィール情報カード */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          {/* アバター */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-4">
              {resolvedAvatarUrl ? (
                <Image
                  src={resolvedAvatarUrl}
                  alt="プロフィール画像"
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                  sizes="96px"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-400">
                  {displayName ? displayName.charAt(0) : "U"}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 text-center mb-1">
              {displayName || "ユーザー"}
            </h1>
            {title && (
              <p className="text-sm text-gray-600 text-center mb-3">{title}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              {location && (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
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
            </div>
            <div className="flex gap-2 w-full">
              {portfolioVisibility === "public" && userId && (
                <ShareProfileButton
                  userId={userId}
                  slug={slug}
                  displayName={displayName}
                />
              )}
              <Link href="/profile/edit" className="flex-1">
                <Button className="w-full px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors border border-blue-600">
                  編集
                </Button>
              </Link>
            </div>
          </div>

          {/* 自己紹介 */}
          {bio && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
                {bio}
              </p>
            </div>
          )}

          {/* フォロー統計 */}
          {userId && (
            <div className="pt-4 border-t border-gray-200 mt-4">
              <FollowStats userId={userId} />
            </div>
          )}
        </div>

        {/* 統計カード */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            統計
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {worksCount}
              </div>
              <div className="text-xs text-gray-600">作品</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {skillsCount}
              </div>
              <div className="text-xs text-gray-600">スキル</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {careerCount}
              </div>
              <div className="text-xs text-gray-600">キャリア</div>
            </div>
            {followerCount !== undefined && (
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {followerCount}
                </div>
                <div className="text-xs text-gray-600">フォロワー</div>
              </div>
            )}
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            ナビゲーション
          </h3>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}

