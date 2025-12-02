"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Home, Settings, LogOut, Clipboard, User, Briefcase, BarChart2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useLayout } from "@/contexts/LayoutContext";
import { Button } from "@/components/ui/button";

export function GlobalSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams?.get("tab") ?? "profile";
    const { user, signOut } = useAuth();
    const { profile } = useProfile();
    const { showToast } = useToast();
    const { openContentTypeSelector } = useLayout();

    const navItems = [
        { href: "/feed", label: "フィード", icon: Home, key: "feed" },
        { href: "/profile?tab=profile", label: "プロフィール", icon: User, key: "profile" },
        { href: "/profile?tab=works", label: "作品", icon: Briefcase, key: "works" },
        { href: "/profile?tab=details", label: "分析", icon: BarChart2, key: "details" },
    ];

    const handleCopyLink = async () => {
        const profileUrl = profile?.slug && profile.slug.length > 0
            ? `${window.location.origin}/${profile.slug}`
            : `${window.location.origin}/profile/${user?.id}`;
        try {
            await navigator.clipboard.writeText(profileUrl);
            showToast("プロフィールリンクをコピーしました", "success");
        } catch (err) {
            console.error("Copy failed", err);
            showToast("コピーに失敗しました", "error");
        }
    };

    const handleLogout = async () => {
        await signOut();
        window.location.href = "/";
    };

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="flex-shrink-0 px-6 py-5">
                <Link href="/profile" className="group">
                    <h1 className="text-2xl font-bold text-blue-600 tracking-tight">balubo</h1>
                </Link>
                <Button
                    onClick={openContentTypeSelector}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 rounded-xl"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    作品を追加
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.key === "feed"
                        ? pathname === "/feed"
                        : activeTab === item.key && pathname !== "/feed";
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer actions */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-2">
                <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
                >
                    <Clipboard className="w-4 h-4" />
                    <span>プロフィールを共有</span>
                </button>
                <Link
                    href="/settings"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded text-gray-700 hover:bg-gray-50"
                >
                    <Settings className="w-4 h-4" />
                    <span>設定とサポート</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded text-gray-700 hover:bg-gray-50"
                >
                    <LogOut className="w-4 h-4" />
                    <span>ログアウト</span>
                </button>
            </div>
        </aside>
    );
}
