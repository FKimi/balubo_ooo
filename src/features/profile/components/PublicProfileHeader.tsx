"use client";

import Image from "next/image";

interface PublicProfileHeaderProps {
  displayName: string;
  bio: string;
  location: string;
  websiteUrl: string;
  backgroundImageUrl: string;
  avatarImageUrl: string;
  isProfileEmpty: boolean;
  hasCustomBackground: boolean;
  hasCustomAvatar: boolean;
  professions: string[];
  rightSlot?: React.ReactNode;
}

export function PublicProfileHeader(props: PublicProfileHeaderProps) {
  const {
    displayName,
    bio,
    location,
    websiteUrl,
    backgroundImageUrl,
    avatarImageUrl,
    professions,
    rightSlot,
  } = props;

  // Resolve storage paths to full URLs (same logic as ProfileHeader)
  const resolvedBgUrl =
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
    <div className="w-full mb-8">
      {/* Cover Image Section */}
      <div className="h-48 sm:h-64 w-full relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl overflow-hidden shadow-sm">
        {resolvedBgUrl ? (
          <Image
            src={resolvedBgUrl}
            alt="プロフィール背景"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 opacity-90" />
        )}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Profile Content */}
      <div className="px-6 relative">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4 flex justify-center">
          <div className="relative w-32 h-32 rounded-full border-[6px] border-white shadow-md overflow-hidden bg-white">
            {resolvedAvatarUrl ? (
              <Image
                src={resolvedAvatarUrl}
                alt="プロフィール画像"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-300">
                {displayName ? displayName.charAt(0) : "U"}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            {displayName || "ユーザー"}
          </h1>

          {professions && professions.length > 0 && (
            <p className="text-lg text-slate-600 font-medium mb-4">
              {professions[0]}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 mb-6">
            {location && (
              <div className="flex items-center gap-1.5">
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
              <div className="flex items-center gap-1.5">
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
                  className="text-blue-600 hover:underline hover:text-blue-700 transition-colors"
                >
                  {websiteUrl.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-wrap">
              {bio}
            </p>
          )}

          {/* Actions (Right Slot) */}
          {rightSlot && (
            <div className="flex items-center justify-center gap-3">
              {rightSlot}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
