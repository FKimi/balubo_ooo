"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ReportHeaderProps {
  profile?: {
    avatar_url?: string;
    display_name?: string;
    headline?: string;
    bio?: string;
    full_name?: string;
    created_at?: string;
    website_url?: string;
    x_url?: string;
    linkedin_url?: string;
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

  // 活動歴の計算
  const calculateExperienceYears = () => {
    if (profile?.created_at) {
      const ms = Date.now() - new Date(profile.created_at).getTime();
      const years = Math.max(0, Math.floor(ms / (365 * 24 * 60 * 60 * 1000)));
      return years;
    }
    return metrics?.experienceYears;
  };

  const experienceYearsCalculated = calculateExperienceYears();

  // ソーシャルリンクの配列
  const socialLinks = [
    { url: profile?.website_url, icon: "globe", label: "Website" },
    { url: profile?.x_url, icon: "twitter", label: "X (Twitter)" },
    { url: profile?.linkedin_url, icon: "linkedin", label: "LinkedIn" },
  ].filter(link => link.url);

  return (
    <Card className="bg-white border border-gray-100 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* アバター */}
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-gray-200"
              />
            ) : showName ? (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl md:text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-800 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 md:w-10 md:h-10 text-white/90"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
            )}
          </div>

          {/* プロフィール情報 */}
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              {showName && (
                <div className="text-xs font-medium text-gray-500 tracking-wide">
                  {roleLabel}
                </div>
              )}
              {showName && (
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
                  {displayName}
                </h1>
              )}
              {showName && showHeadline && (
                <p className="text-sm md:text-base text-gray-600">{headline}</p>
              )}
              {!showName && (
                <p className="text-sm md:text-base text-gray-700">
                  {roleLabel}
                  {headline && headline !== roleLabel ? `・${headline}` : ""}
                  {typeof metrics?.totalWorks === "number" ? `（${metrics.totalWorks}作品）` : ""}
                </p>
              )}
              
              {/* 自己紹介文 */}
              {profile?.bio && (
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* ハイライトメトリクス */}
            <div className="mt-4 flex flex-wrap gap-3">
              {typeof metrics?.totalWorks === "number" && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-blue-600"
                  >
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                  </svg>
                  <div className="text-xs">
                    <div className="font-semibold text-gray-900">{metrics.totalWorks}</div>
                    <div className="text-gray-600">作品</div>
                  </div>
                </div>
              )}
              
              {typeof experienceYearsCalculated === "number" && experienceYearsCalculated > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-purple-600"
                  >
                    <path d="M3 4h18M3 8h18M5 12h14M7 16h10M9 20h6" />
                  </svg>
                  <div className="text-xs">
                    <div className="font-semibold text-gray-900">{experienceYearsCalculated}年</div>
                    <div className="text-gray-600">活動歴</div>
                  </div>
                </div>
              )}
            </div>

            {/* ソーシャルリンク */}
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title={link.label}
                  >
                    {link.icon === "globe" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    )}
                    {link.icon === "twitter" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                    {link.icon === "linkedin" && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
