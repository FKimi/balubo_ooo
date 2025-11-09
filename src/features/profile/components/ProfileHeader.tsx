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
  const _resolvedBgUrl =
    backgroundImageUrl && backgroundImageUrl.trim()
      ? backgroundImageUrl.startsWith("/storage")
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${backgroundImageUrl}`
        : backgroundImageUrl
      : "";


  const resolvedAvatarUrl =
    avatarImageUrl && avatarImageUrl.trim()
      ? avatarImageUrl.startsWith("/storage")
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${avatarImageUrl}`
        : avatarImageUrl
      : "";

  return (
    <div className="mb-6">
      {/* フラットなダッシュボード式ヘッダー */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* アバターと基本情報を横並び */}
          <div className="flex items-start gap-6">
            {/* アバター */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {resolvedAvatarUrl ? (
                    <Image
                      src={resolvedAvatarUrl}
                      alt="プロフィール画像"
                      fill
                      className="object-cover"
                    priority
                    quality={90}
                    sizes="(max-width: 640px) 80px, 96px"
                    />
                  ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold text-gray-400">
                    {displayName ? displayName.charAt(0) : "U"}
                    </span>
                  )}
              </div>
            </div>

            {/* 基本情報 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {displayName || "ユーザー"}
                </h1>
                {title && (
                    <p className="text-base sm:text-lg text-gray-700 mb-2">
                      {title}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {location && (
                      <div className="flex items-center gap-1">
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
                        <span>{location}</span>
                      </div>
                    )}
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
                          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      {websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
                </div>

                {/* アクションボタン */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {portfolioVisibility === "public" && userId && (
                    <ShareProfileButton
                      userId={userId}
                      slug={slug}
                      displayName={displayName}
                    />
                  )}
                  <Link href="/profile/edit">
                    <Button className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors border border-blue-600">
                      編集
                    </Button>
                  </Link>
                </div>
              </div>

              {/* 自己紹介 */}
              {bio && (
                <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                  {bio}
                </p>
              )}

              {/* フォロー統計 */}
              {userId && (
                <div>
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
