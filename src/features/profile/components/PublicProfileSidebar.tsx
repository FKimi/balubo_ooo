"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ShareProfileButton } from "./ShareProfileButton";

interface PublicProfileSidebarProps {
    displayName: string;
    title?: string;
    bio: string;
    location: string;
    avatarImageUrl: string;
    userId: string;
    slug?: string;
    worksCount: number;
    skillsCount: number;
    careerCount: number;
    activeTab: "profile" | "works" | "details";
    onTabChange: (_tab: "profile" | "works" | "details") => void;
    mobile?: boolean;
}

export function PublicProfileSidebar({
    displayName,
    title,
    bio,
    location,
    avatarImageUrl,
    userId,
    slug,
    worksCount,
    skillsCount,
    careerCount,
    activeTab,
    onTabChange,
    mobile = false,
}: PublicProfileSidebarProps) {
    const [avatarError, setAvatarError] = useState(false);

    const resolvedAvatarUrl =
        avatarImageUrl && avatarImageUrl.trim()
            ? avatarImageUrl.startsWith("/storage")
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${avatarImageUrl}`
                : avatarImageUrl
            : "";

    // avatarImageUrlが変更されたときにエラー状態をリセット
    useEffect(() => {
        setAvatarError(false);
    }, [avatarImageUrl]);

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

    const Container = mobile ? "div" : "aside";
    const containerClasses = mobile
        ? "w-full bg-white"
        : "flex w-full h-full bg-white border-r border-gray-200";

    const innerClasses = mobile
        ? "w-full flex flex-col"
        : "sticky top-0 h-screen w-full flex flex-col";

    const contentClasses = mobile
        ? "px-0 py-4"
        : "flex-1 overflow-y-auto px-5 py-6";

    return (
        <Container className={containerClasses}>
            <div className={innerClasses}>
                {/* スクロール可能なコンテンツエリア */}
                <div className={contentClasses}>
                    <div className="space-y-6">
                        {/* プロフィール情報セクション */}
                        <div className="space-y-4">
                            {/* アバターと基本情報 */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 mb-3 bg-gray-50">
                                    {resolvedAvatarUrl && !avatarError ? (
                                        <Image
                                            src={resolvedAvatarUrl}
                                            alt="プロフィール画像"
                                            fill
                                            sizes="96px"
                                            className="object-cover"
                                            onError={() => setAvatarError(true)}
                                            onLoadingComplete={() => setAvatarError(false)}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                            <span className="text-3xl font-semibold text-gray-500">
                                                {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-lg font-bold text-gray-900 text-center mb-1">
                                    {displayName || "ユーザー"}
                                </h1>
                                {title && (
                                    <p className="text-sm text-gray-600 text-center mb-3">{title}</p>
                                )}
                                {location && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                                        <svg
                                            className="w-3.5 h-3.5"
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

                                <div className="w-full">
                                    <ShareProfileButton
                                        userId={userId}
                                        slug={slug}
                                        displayName={displayName}
                                    />
                                </div>
                            </div>

                            {/* 自己紹介 */}
                            {bio && (
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {bio}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ナビゲーションセクション */}
                        <nav className="space-y-1 pt-4 border-t border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => onTabChange(tab.key)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.key
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* 統計セクション */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                統計
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center py-2.5 px-1 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="text-lg font-semibold text-gray-900 mb-0.5">
                                        {worksCount}
                                    </div>
                                    <div className="text-[10px] text-gray-500">作品</div>
                                </div>
                                <div className="text-center py-2.5 px-1 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="text-lg font-semibold text-gray-900 mb-0.5">
                                        {skillsCount}
                                    </div>
                                    <div className="text-[10px] text-gray-500">スキル</div>
                                </div>
                                <div className="text-center py-2.5 px-1 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="text-lg font-semibold text-gray-900 mb-0.5">
                                        {careerCount}
                                    </div>
                                    <div className="text-[10px] text-gray-500">キャリア</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* フッター（baluboロゴなど） - モバイルでは表示しない、または調整 */}
                {!mobile && (
                    <div className="flex-shrink-0 border-t border-gray-200 bg-white px-5 py-4">
                        <div className="flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-400">balubo</span>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}

