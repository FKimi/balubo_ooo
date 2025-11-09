"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useLayout } from "@/contexts/LayoutContext";
import { User, Plus, HelpCircle, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  
  // フックは常に呼び出す必要がある（Reactのルール）
  const { profile } = useProfile();
  const { openContentTypeSelector } = useLayout();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  // クリックアウトサイド検出
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/80 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* ロゴ - 常に左端に固定 */}
          <div className="flex-shrink-0">
            <Link href={user ? "/feed" : "/"} className="group">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                balubo
              </h1>
            </Link>
          </div>

          {/* フィードリンク - ロゴの右側 */}
          {user && (
            <div className="ml-6 flex items-center gap-1">
              <Link
                href="/feed"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  pathname === "/feed"
                    ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>フィード</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  pathname.startsWith("/profile")
                    ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <User className="w-4 h-4" />
                <span>プロフィール</span>
              </Link>
            </div>
          )}

          {/* 右側のアクション - 常に右側に固定 */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
            {user ? (
              <>
                {/* 通知ベル */}
                <div className="hidden sm:block">
                  <NotificationBell />
                </div>

                {/* 作品追加ボタン：モーダルでタイプ選択 */}
                <Button
                  onClick={() => {
                    // 画面を上部にスクロール
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    // すぐにモーダルを開く（ページ遷移なし）
                    if (openContentTypeSelector) {
                      openContentTypeSelector();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  size="sm"
                >
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">作品追加</span>
                </Button>

                {/* プロフィールメニュー */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-full transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="プロフィールメニュー"
                    aria-expanded={showProfileMenu}
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
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50"
                      role="menu"
                      aria-orientation="vertical"
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
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-gray-50"
                        onClick={() => setShowProfileMenu(false)}
                        role="menuitem"
                      >
                        <User className="w-4 h-4" />
                        <span>プロフィール</span>
                      </Link>
                      <Link
                        href="/help"
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-gray-50"
                        onClick={() => setShowProfileMenu(false)}
                        role="menuitem"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>ヘルプ・使い方</span>
                      </Link>
                      <div className="h-px bg-gray-100 my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:bg-red-50"
                        role="menuitem"
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
          className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-blue-600 transition-all duration-200 group active:scale-95"
        >
          <Home className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-xs font-medium">フィード</span>
        </Link>
        <Link
          href="/profile"
          className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-blue-600 transition-all duration-200 group active:scale-95"
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
          className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-blue-600 transition-all duration-200 group active:scale-95"
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
