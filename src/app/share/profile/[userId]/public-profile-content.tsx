"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PublicProfileTabs } from "@/features/profile/components/PublicProfileTabs";
import { Button } from "@/components/ui/button";

import { analyzeStrengthsFromWorks } from "@/features/profile/lib/profileUtils";
import { PublicProfileHeaderCentered } from "@/features/profile/components/PublicProfileHeaderCentered";

interface PublicProfileData {
  profile: any;
  works: any[];
  inputs: any[];
  inputAnalysis?: any;
}

interface PublicProfileContentProps {
  data: PublicProfileData;
  userId: string;
}

export function PublicProfileContent({
  data,
  userId,
}: PublicProfileContentProps) {
  const { profile, works, inputs: _inputs } = data;
  const [activeTab, setActiveTab] = useState<"profile" | "works" | "details">(
    "profile",
  );

  // 強みカード生成 (詳細分析)
  const strengthsAnalysis = useMemo(() => {
    return analyzeStrengthsFromWorks(works);
  }, [works]);

  // プロフィール情報の整理
  const displayName = profile?.display_name || "ユーザー";
  const bio = profile?.bio || "";
  const location = profile?.location || "";
  const websiteUrl = profile?.website_url || "";
  const backgroundImageUrl = profile?.background_image_url || "";
  const avatarImageUrl = profile?.avatar_image_url || "";
  const skills = profile?.skills || [];
  const career = profile?.career || [];
  const _professions = profile?.professions || [];
  const slug = profile?.slug || "";
  const shareSlug = slug.trim() ? slug : undefined;
  const _worksCount = works?.length || 0;
  const _skillsCount = skills.length;
  const _careerCount = career.length;
  const profileUserId = profile?.user_id || userId;
  const title = profile?.title || "";

  // 画像の存在チェック
  const _hasCustomBackground =
    backgroundImageUrl && backgroundImageUrl.trim() !== "";
  const _hasCustomAvatar = avatarImageUrl && avatarImageUrl.trim() !== "";

  // プロフィールが空かどうかの判定
  const isProfileEmpty = !bio && skills.length === 0 && career.length === 0;

  return (
    <div className="min-h-screen bg-[#F4F7FF] w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 戻るリンク */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-100 transition-colors text-gray-600"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              ホームに戻る
            </Button>
          </Link>
        </div>

        {/* ヘッダー (中央揃え) */}
        <PublicProfileHeaderCentered
          displayName={displayName}
          title={title}
          bio={bio}
          location={location}
          websiteUrl={websiteUrl}
          backgroundImageUrl={backgroundImageUrl}
          avatarImageUrl={avatarImageUrl}
          userId={profileUserId}
          slug={shareSlug}
        />

        {/* AI分析による強み (共有ビュー) - 削除 */}

        {/* 公開プロフィールタブ */}
        <PublicProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          works={works || []}
          skills={skills}
          career={career}
          isProfileEmpty={isProfileEmpty}
          jobMatchingHints={strengthsAnalysis.jobMatchingHints}
          inputs={_inputs}
        />
      </div>
    </div>
  );
}


