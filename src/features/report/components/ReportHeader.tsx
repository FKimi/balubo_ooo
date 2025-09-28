"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ReportHeaderProps {
  profile?: {
    avatar_url?: string;
    display_name?: string;
    headline?: string;
    bio?: string;
    full_name?: string;
    // 任意で動的情報が入ってくる可能性がある
    professions?: string[];
    title?: string;
    experience_years?: number;
  };
  roleLabelOverride?: string;
}

export function ReportHeader({
  profile,
  roleLabelOverride,
}: ReportHeaderProps) {
  const displayName =
    profile?.display_name || profile?.full_name || "クリエイター";
  const headline =
    profile?.headline ||
    (profile as any)?.title ||
    "プロフェッショナルクリエイター";
  const hasName = Boolean(profile?.display_name || profile?.full_name);

  // 個別性のある小ラベルを生成
  const professions = Array.isArray((profile as any)?.professions)
    ? ((profile as any).professions as string[])
    : [];
  const primaryProfession =
    professions.length > 0 ? String(professions[0]) : undefined;
  const experienceYears =
    typeof (profile as any)?.experience_years === "number"
      ? ((profile as any).experience_years as number)
      : undefined;
  const compactHeadline =
    profile?.headline && profile.headline.length <= 20
      ? profile.headline
      : undefined;
  const fallbackRole =
    primaryProfession ||
    compactHeadline ||
    (profile as any)?.title ||
    (typeof experienceYears === "number"
      ? `経験${experienceYears}年`
      : undefined) ||
    "クリエイター";
  const roleLabel = roleLabelOverride || fallbackRole;

  const showHeadline = Boolean(headline && headline !== roleLabel);

  return (
    <Card className="bg-white border border-gray-100 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          {/* アバター */}
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* プロフィール情報 */}
          <div className="flex-1 min-w-0">
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 tracking-wide">
                {roleLabel}
              </div>
              {hasName && (
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  {displayName}
                </h1>
              )}
              {showHeadline && (
                <p className="text-sm text-gray-600">{headline}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
