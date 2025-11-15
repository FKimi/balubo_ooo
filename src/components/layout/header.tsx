"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useLayout } from "@/contexts/LayoutContext";
import { User, Plus, HelpCircle, Home, Layers, BarChart2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { openContentTypeSelector } = useLayout();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

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
    <header className="sticky top-0 z-50 bg-white/85 supports-[backdrop-filter]:backdrop-blur-xl border-b border-white/40 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.55)]">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <Link href={user ? "/feed" : "/"} className="group">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  balubo
                </h1>
              </Link>
            </div>

            {user && (
              <nav
                className="flex items-center gap-1 bg-slate-50/90 border border-slate-100 rounded-full px-1 py-1 shadow-inner shadow-white/60 overflow-x-auto scrollbar-hide flex-1 min-w-0"
                role="navigation"
                aria-label="サイト内メニュー"
              >
                <Link
                  href="/feed"
                  aria-current={pathname === "/feed" ? "page" : undefined}
                  aria-label="Feed"
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
                    pathname === "/feed"
                      ? "bg-white text-slate-900 shadow-sm shadow-blue-100"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Feed</span>
                </Link>
                <Link
                  href="/profile"
                  aria-current={pathname.startsWith("/profile") ? "page" : undefined}
                  aria-label="Profile"
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
                    pathname.startsWith("/profile")
                      ? "bg-white text-slate-900 shadow-sm shadow-blue-100"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {user ? (
              <>
                <div className="hidden sm:block">
                  <NotificationBell />
                </div>

                <Button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    if (openContentTypeSelector) {
                      openContentTypeSelector();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 rounded-xl"
                  size="sm"
                >
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Work</span>
                </Button>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-full transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {profile?.display_name ||
                                user?.user_metadata?.display_name ||
                                "ユーザー"}
                            </p>
                            <p className="text-xs text-slate-500">
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
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setShowProfileMenu(false)}
                        role="menuitem"
                      >
                        <User className="w-4 h-4" />
                        <span>プロフィール</span>
                      </Link>
                      <Link
                        href="/help"
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setShowProfileMenu(false)}
                        role="menuitem"
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>ヘルプ・使い方</span>
                      </Link>
                      <div className="h-px bg-gray-100 my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
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

export function MobileBottomNavigation() {
  const searchParams = useSearchParams();
  const activeProfileTab = searchParams.get("tab") || "works";

  const navItems = [
    {
      key: "profile",
      href: "/profile?tab=profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      key: "works",
      href: "/profile?tab=works",
      label: "Works",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      key: "details",
      href: "/profile?tab=details",
      label: "Analytics",
      icon: <BarChart2 className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/80 z-50 shadow-[0_-8px_30px_-20px_rgba(15,23,42,0.45)]"
      role="navigation"
      aria-label="モバイル下部ナビゲーション"
    >
      <div className="flex justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = activeProfileTab === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 w-full max-w-[96px] ${
                isActive
                  ? "text-blue-600 bg-blue-50 border border-blue-100 shadow-sm"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <span
                className={`transition-transform duration-200 ${
                  isActive ? "scale-105" : ""
                }`}
              >
                {item.icon}
              </span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

