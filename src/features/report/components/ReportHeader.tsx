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
  metrics?: {
    totalWorks?: number;
    clientsServed?: number;
    experienceYears?: number;
  };
}

export function ReportHeader({
  profile,
  roleLabelOverride,
  metrics,
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
  const showName = hasName;

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
            ) : showName ? (
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl">
                {displayName.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7 text-white/90"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>

          {/* プロフィール情報 */}
          <div className="flex-1 min-w-0">
            <div className="space-y-1">
              {showName && (
                <div className="text-xs font-medium text-gray-500 tracking-wide">
                  {roleLabel}
                </div>
              )}
              {showName && (
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  {displayName}
                </h1>
              )}
              {showName && showHeadline && (
                <p className="text-sm text-gray-600">{headline}</p>
              )}
              {!showName && (
                <p className="text-sm text-gray-700">
                  {roleLabel}
                  {headline && headline !== roleLabel ? `・${headline}` : ""}
                  {typeof metrics?.totalWorks === "number" ? `（${metrics.totalWorks}作品）` : ""}
                </p>
              )}
            </div>

            {/* ハイライトメトリクス（ピル表示、存在するもののみ） */}
            {metrics && showName && (
              <div className="mt-4 flex flex-wrap gap-2">
                {typeof metrics.totalWorks === "number" && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5 text-blue-600"
                    >
                      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                    <span className="font-semibold text-gray-900">{metrics.totalWorks}</span>
                    <span className="text-gray-600">作品</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
