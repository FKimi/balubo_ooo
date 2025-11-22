"use client";

import Image from "next/image";
import { ShareProfileButton } from "./ShareProfileButton";
import React from "react";
import { MapPin, Link as LinkIcon, Twitter, Github, Instagram, Linkedin } from "lucide-react";

interface PublicProfileHeaderCenteredProps {
    displayName: string;
    title?: string;
    bio: string;
    location: string;
    websiteUrl: string;
    backgroundImageUrl: string;
    avatarImageUrl: string;
    userId: string;
    slug?: string;
}

export function PublicProfileHeaderCentered({
    displayName,
    title,
    bio,
    location,
    websiteUrl,
    backgroundImageUrl,
    avatarImageUrl,
    userId,
    slug,
}: PublicProfileHeaderCenteredProps) {
    // Resolve background image URL
    const resolvedBgUrl =
        backgroundImageUrl && backgroundImageUrl.trim()
            ? backgroundImageUrl.startsWith("/storage")
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${backgroundImageUrl}`
                : backgroundImageUrl
            : "";

    // Resolve avatar image URL
    const resolvedAvatarUrl =
        avatarImageUrl && avatarImageUrl.trim()
            ? avatarImageUrl.startsWith("/storage")
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}${avatarImageUrl}`
                : avatarImageUrl
            : "";

    return (
        <div className="w-full mb-8 group">
            {/* Cover Image Section */}
            <div className="h-48 sm:h-64 w-full relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl overflow-hidden shadow-sm">
                {resolvedBgUrl && (
                    <Image
                        src={resolvedBgUrl}
                        alt="Cover"
                        fill
                        className="object-cover"
                        priority
                    />
                )}
            </div>

            {/* Profile Content */}
            <div className="px-6 relative">
                {/* Avatar */}
                <div className="relative -mt-16 mb-4 flex justify-center">
                    <div className="relative w-32 h-32 rounded-full border-[6px] border-white shadow-md overflow-hidden bg-white">
                        {resolvedAvatarUrl ? (
                            <Image
                                src={resolvedAvatarUrl}
                                alt={displayName}
                                fill
                                className="object-cover"
                                priority
                                quality={90}
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

                    {title && (
                        <p className="text-lg text-slate-600 font-medium mb-4">
                            {title}
                        </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 mb-6">
                        {location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span>{location}</span>
                            </div>
                        )}
                        {websiteUrl && (
                            <div className="flex items-center gap-1.5">
                                {(() => {
                                    const lowerUrl = websiteUrl.toLowerCase();
                                    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return <Twitter className="w-4 h-4 text-slate-400" />;
                                    if (lowerUrl.includes("github.com")) return <Github className="w-4 h-4 text-slate-400" />;
                                    if (lowerUrl.includes("instagram.com")) return <Instagram className="w-4 h-4 text-slate-400" />;
                                    if (lowerUrl.includes("linkedin.com")) return <Linkedin className="w-4 h-4 text-slate-400" />;
                                    return <LinkIcon className="w-4 h-4 text-slate-400" />;
                                })()}
                                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors truncate max-w-[200px]">
                                    {websiteUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    {bio && (
                        <div className="mb-8 text-left bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {bio}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-3">
                        <ShareProfileButton
                            userId={userId}
                            slug={slug}
                            displayName={displayName}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
