"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PublicProfileHeader } from "@/features/profile/components/PublicProfileHeader";
import { PublicProfileTabs } from "@/features/profile/components/PublicProfileTabs";
import { Button } from "@/components/ui/button";
import { AIAnalysisStrengths } from "@/features/profile/components/AIAnalysisStrengths";
import { analyzeStrengthsFromWorks } from "@/features/profile/lib/profileUtils";

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
  const professions = profile?.professions || [];

  // 画像の存在チェック
  const hasCustomBackground =
    backgroundImageUrl && backgroundImageUrl.trim() !== "";
  const hasCustomAvatar = avatarImageUrl && avatarImageUrl.trim() !== "";

  // プロフィールが空かどうかの判定
  const isProfileEmpty = !bio && skills.length === 0 && career.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="w-full space-y-8">
          {/* 戻るリンク */}
          <div>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
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

          {/* 公開プロフィールヘッダー */}
          <PublicProfileHeader
            userId={userId}
            displayName={displayName}
            bio={bio}
            location={location}
            websiteUrl={websiteUrl}
            backgroundImageUrl={backgroundImageUrl}
            avatarImageUrl={avatarImageUrl}
            isProfileEmpty={isProfileEmpty}
            hasCustomBackground={hasCustomBackground}
            hasCustomAvatar={hasCustomAvatar}
            professions={professions}
          />

          {/* AI分析による強み (共有ビュー) */}
          {strengthsAnalysis.strengths.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <AIAnalysisStrengths
                strengths={strengthsAnalysis.strengths}
                showDetails={false}
                works={works}
                compact={false}
              />
            </div>
          )}

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
          />
        </div>
      </main>
    </div>
  );
}
