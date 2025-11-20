"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShareProfileButton } from "./ShareProfileButton";
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
    <div className="mb-8 md:mb-10">
      <div className="bg-white border border-white/60 rounded-[32px] shadow-[0_20px_50px_rgba(37,99,235,0.08)] p-1">
        <div className="bg-white/50 backdrop-blur-sm rounded-[28px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* ヘッダーレイアウト */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* アバター + 基本情報 */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  {resolvedAvatarUrl ? (
                    <Image
                      src={resolvedAvatarUrl}
                      alt="プロフィール画像"
                      fill
                      className="object-cover"
                      priority
                      quality={90}
                      sizes="(max-width: 640px) 96px, 112px"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl font-bold text-blue-300/50">
                      {displayName ? displayName.charAt(0) : "U"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  {displayName || "ユーザー"}
                </h1>
                {title && (
                  <p className="text-base sm:text-lg font-medium text-slate-600 mb-4">
                    {title}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                  {location && (
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                      <svg
                        className="w-4 h-4 text-slate-400"
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
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                      <svg
                        className="w-4 h-4 text-slate-400"
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
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:flex-col xl:flex-row lg:items-end">
              {portfolioVisibility === "public" && userId && (
                <ShareProfileButton
                  userId={userId}
                  slug={slug}
                  displayName={displayName}
                />
              )}
              <Link href="/profile/edit" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-full px-6 h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_-4px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all duration-200">
                  プロフィールを編集
                </Button>
              </Link>
            </div>
          </div>

          {/* 自己紹介 */}
          {bio && (
            <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
              <p className="text-base text-slate-600 leading-loose whitespace-pre-wrap max-w-4xl">
                {bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
