"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShareProfileButton } from "./ShareProfileButton";
import { FollowStats } from "@/features/follow/components/FollowStats";
import React from "react";

interface ProfileHeaderProps {
  displayName: string;
  title?: string;
  bio: string;
  location: string;
  websiteUrl: string;
  backgroundImageUrl: string;
  avatarImageUrl: string;
  isProfileEmpty: boolean;
  hasCustomBackground: boolean;
  hasCustomAvatar: boolean;
  userId?: string | undefined;
  slug?: string;
  portfolioVisibility?: string;
  rightSlot?: React.ReactNode;
}

export function ProfileHeader({
  displayName,
  title,
  bio,
  location,
  websiteUrl,
  backgroundImageUrl,
  avatarImageUrl,
  isProfileEmpty: _isProfileEmpty,
  hasCustomBackground: _hasCustomBackground,
  hasCustomAvatar: _hasCustomAvatar,
  userId,
  slug,
  portfolioVisibility,
  rightSlot: _rightSlot,
}: ProfileHeaderProps) {
  // Supabaseストレージの相対パスの場合はフルURLを付与、既にフルURLの場合はそのまま使用
  const resolvedBgUrl =
    backgroundImageUrl && backgroundImageUrl.trim()
      ? backgroundImageUrl.startsWith("/storage")
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${backgroundImageUrl}`
        : backgroundImageUrl
      : "";

  // --- DEBUGGING ---
  console.log(
    "[ProfileHeader] Raw backgroundImageUrl prop:",
    backgroundImageUrl,
  );
  console.log(
    "[ProfileHeader] Resolved background URL for style:",
    resolvedBgUrl,
  );
  // --- END DEBUGGING ---

  const resolvedAvatarUrl =
    avatarImageUrl && avatarImageUrl.trim()
      ? avatarImageUrl.startsWith("/storage")
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${avatarImageUrl}`
        : avatarImageUrl
      : "";

  return (
    <div className="mb-8">
      {/* nDash風プロフィールヘッダー */}
      <div className="relative w-full">
        {/* 背景画像 - nDash風のカバー画像 */}
        <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 w-full overflow-hidden">
          {resolvedBgUrl ? (
            <Image
              src={resolvedBgUrl}
              alt="プロフィール背景"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
              {/* 星の軌跡風のパターン */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-3000"></div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* プロフィール情報コンテナ - nDash風レイアウト */}
        <div className="relative bg-white">
          {/* アバター - 背景画像に重なって配置 */}
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between pt-6 pb-6">
              <div className="relative -mt-20 sm:-mt-24">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex-shrink-0">
                  {resolvedAvatarUrl ? (
                    <Image
                      src={resolvedAvatarUrl}
                      alt="プロフィール画像"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-400">
                      {displayName ? displayName.charAt(0) : "N"}
                    </span>
                  )}
                </div>
              </div>

              {/* プロフィール編集ボタン - nDash風の位置 */}
              <div className="flex items-center gap-3">
                {portfolioVisibility === "public" && userId && (
                  <ShareProfileButton
                    userId={userId}
                    slug={slug}
                    displayName={displayName}
                  />
                )}
                <Link href="/profile/edit">
                  <Button className="px-6 py-2 text-sm font-medium rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-lg">
                    プロフィール編集
                  </Button>
                </Link>
              </div>
            </div>

            {/* プロフィール情報 - nDash風のレイアウト */}
            <div className="pb-6">
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {displayName || "ユーザー"}
                </h1>
                {title && (
                  <div className="flex items-center gap-3 mb-3">
                    <p className="text-lg text-gray-700">{title}</p>
                    {location && (
                      <div className="flex items-center gap-1 text-gray-500">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm">{location}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {bio && (
                <p className="text-base text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                  {bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                {websiteUrl && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      {websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>

              {/* フォロー統計 - nDash風 */}
              {userId && (
                <div className="mb-4">
                  <FollowStats userId={userId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
