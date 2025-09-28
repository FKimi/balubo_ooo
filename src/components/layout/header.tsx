"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useLayout } from "@/contexts/LayoutContext";
import { Home, User, BarChart2, Plus, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { openContentTypeSelector } = useLayout();
  const _router = useRouter();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { href: "/feed", label: "フィード", icon: Home },
    { href: "/profile", label: "ポートフォリオ", icon: User },
    { href: "/report/detail", label: "詳細レポート", icon: BarChart2 },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/80 shadow-elegant">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* ロゴ */}
          <Link href={user ? "/feed" : "/"} className="group">
            <h1 className="text-2xl font-bold text-[#5570F3] hover:text-[#4461E8] transition-colors">
              balubo
            </h1>
          </Link>

          {/* ナビゲーション */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#5570F3]/10 text-[#5570F3] border border-[#5570F3]/20 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* 右側のアクション */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* 通知ベル */}
                <NotificationBell />

                {/* 作品追加ボタン：モーダルでタイプ選択 */}
                <Button
                  onClick={() => {
                    // 画面を上部にスクロール
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    // すぐにモーダルを開く（ページ遷移なし）
                    openContentTypeSelector();
                  }}
                  className="bg-[#5570F3] hover:bg-[#4461E8] text-white shadow-elegant hover:shadow-elegant-lg transition-all duration-200 rounded-xl hover-lift"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  作品追加
                </Button>

                {/* プロフィールメニュー */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-full transition-colors hover:bg-gray-50"
                  >
                    <ProfileAvatar
                      avatarUrl={profile?.avatar_image_url || null}
                      displayName={
                        profile?.display_name ||
                        user?.user_metadata?.display_name ||
                        ""
                      }
                      size="md"
                    />
                  </button>

                  {/* プロフィールドロップダウンメニュー */}
                  {showProfileMenu && (
                    <div
                      className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-elegant-xl border border-gray-200/80 p-3 z-50 animate-scale-in"
                      onMouseLeave={() => setShowProfileMenu(false)}
                    >
                      <div className="p-3 border-b border-gray-100 mb-2">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar
                            avatarUrl={profile?.avatar_image_url || null}
                            displayName={
                              profile?.display_name ||
                              user?.user_metadata?.display_name ||
                              ""
                            }
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {profile?.display_name ||
                                user?.user_metadata?.display_name ||
                                "ユーザー"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              @
                              {profile?.display_name ||
                                user?.user_metadata?.display_name ||
                                user?.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>プロフィール</span>
                      </Link>
                      <Link
                        href="/help"
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>ヘルプ・使い方</span>
                      </Link>
                      <div className="h-px bg-gray-100 my-3" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-xl text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200"
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
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>ログアウト</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">ログイン</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// モバイル用の下部ナビゲーション
export function MobileBottomNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/80 z-50 shadow-elegant-lg">
      <div className="flex justify-around py-2">
        <Link
          href="/feed"
          className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-[#5570F3] transition-all duration-200 group active:scale-95"
        >
          <Home className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-xs font-medium">フィード</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-[#5570F3] transition-all duration-200 group active:scale-95"
        >
          <svg
            className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200"
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
          <span className="text-xs font-medium">プロフィール</span>
        </Link>
        <Link
          href="/works"
          className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-[#5570F3] transition-all duration-200 group active:scale-95"
        >
          <svg
            className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200"
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
          <span className="text-xs font-medium">作品</span>
        </Link>
      </div>
    </nav>
  );
}
