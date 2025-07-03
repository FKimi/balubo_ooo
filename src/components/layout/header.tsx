'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { ProfileAvatar } from '@/components/common/ProfileAvatar'
import { Home, User, BarChart2, Plus, MessageSquare } from 'lucide-react'

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showReportPreview, setShowReportPreview] = useState(false)
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/feed', label: 'フィード', icon: Home },
    { href: '/profile', label: 'ポートフォリオ', icon: User },
    { href: '/report', label: '詳細レポート', icon: BarChart2, comingSoon: true },
  ]

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ロゴ */}
          <Link href={user ? "/feed" : "/"} className="group">
            <h1 className="text-2xl font-bold text-blue-600 transition-colors">
              balubo
            </h1>
          </Link>

          {/* ナビゲーション */}
          {user && (
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                if (link.comingSoon) {
                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => setShowReportPreview(!showReportPreview)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-not-allowed opacity-70 hover:opacity-90`}
                    >
                      <link.icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      <span className="ml-2 text-[10px] uppercase tracking-wide bg-yellow-200 text-yellow-800 rounded px-1">Soon</span>
                    </button>
                  )
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          )}

          {/* 右側のアクション */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* 作品追加ボタン */}
                <Button asChild className="shadow-sm hover:shadow-md transition-shadow">
                  <Link href="/works/new">
                    <Plus className="w-4 h-4 mr-2" />
                    作品追加
                  </Link>
                </Button>

                {/* プロフィールメニュー */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ProfileAvatar
                      avatarUrl={profile?.avatar_image_url || null}
                      displayName={profile?.display_name || user?.user_metadata?.display_name || ''}
                      size="md"
                    />
                  </button>

                  {/* プロフィールドロップダウンメニュー */}
                  {showProfileMenu && (
                    <div 
                      className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in-25"
                      onMouseLeave={() => setShowProfileMenu(false)}
                    >
                      <div className="p-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar
                            avatarUrl={profile?.avatar_image_url || null}
                            displayName={profile?.display_name || user?.user_metadata?.display_name || ''}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {profile?.display_name || user?.user_metadata?.display_name || 'ユーザー'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              @{profile?.display_name || user?.user_metadata?.display_name || user?.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>プロフィール</span>
                      </Link>
                      <Link
                        href="/messages"
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>メッセージ</span>
                      </Link>
                      <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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

      {/* プレビューポップオーバー */}
      {showReportPreview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center mt-24 px-4" onClick={() => setShowReportPreview(false)}>
          <div className="bg-white shadow-2xl rounded-xl border border-slate-200 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">詳細レポート (準備中)</h3>
              <button className="text-slate-500 hover:text-slate-700" onClick={() => setShowReportPreview(false)}>
                ×
              </button>
            </div>
            <div className="p-4">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-200 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                Coming Soon Preview
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                AIが自動生成する&quot;納得感・学び・自己肯定感&quot;レポートをお届けします。まもなく公開！
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// モバイル用の下部ナビゲーション
export function MobileBottomNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-white/95 backdrop-blur-md border-t border-border-color/50 z-50 shadow-lg">
      <div className="flex justify-around py-2">
        <Link href="/feed" className="flex flex-col items-center py-2 px-3 text-text-secondary hover:text-accent-dark-blue transition-all duration-200 group">
          <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
          </svg>
          <span className="text-xs font-medium">フィード</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center py-2 px-3 text-text-secondary hover:text-accent-dark-blue transition-all duration-200 group">
          <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs font-medium">プロフィール</span>
        </Link>
        <Link href="/works" className="flex flex-col items-center py-2 px-3 text-text-secondary hover:text-accent-dark-blue transition-all duration-200 group">
          <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs font-medium">作品</span>
        </Link>

        <Link href="/messages" className="flex flex-col items-center py-2 px-3 text-text-secondary hover:text-accent-dark-blue transition-all duration-200 group">
          <svg className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
          </svg>
          <span className="text-xs font-medium">メッセージ</span>
        </Link>
      </div>
    </nav>
  )
} 