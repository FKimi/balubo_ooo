'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { ProfileAvatar } from '@/components/common/ProfileAvatar'

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="border-b border-border-color bg-base-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/feed" className="group">
          <h1 className="text-2xl font-bold text-accent-dark-blue group-hover:text-primary-blue transition-colors duration-200">
            balubo
          </h1>
        </Link>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            href="/feed" 
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-text-secondary hover:text-accent-dark-blue hover:bg-ui-background-gray/50 transition-all duration-200 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
            </svg>
            <span className="font-medium">フィード</span>
          </Link>
          <Link 
            href="/profile" 
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-text-secondary hover:text-accent-dark-blue hover:bg-ui-background-gray/50 transition-all duration-200 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">ポートフォリオ</span>
          </Link>

          <Link 
            href="/report" 
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-text-secondary hover:text-accent-dark-blue hover:bg-ui-background-gray/50 transition-all duration-200 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium">詳細レポート</span>
          </Link>
        </nav>

        {/* 右側のアクション */}
        <div className="flex items-center space-x-4">
          {/* 作品追加ボタン */}
          <Link href="/works/new">
            <Button className="bg-gradient-to-r from-accent-dark-blue to-primary-blue hover:from-primary-blue hover:to-accent-dark-blue shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">作品追加</span>
            </Button>
          </Link>

          {/* プロフィールメニュー */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-ui-background-gray/50 transition-all duration-200 group"
            >
              <ProfileAvatar
                avatarUrl={profile?.avatar_image_url || null}
                displayName={profile?.display_name || user?.user_metadata?.display_name || ''}
                size="md"
              />
              <svg className={`w-4 h-4 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* プロフィールドロップダウンメニュー */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-base-white/95 backdrop-blur-md rounded-xl shadow-xl border border-border-color/50 py-2 z-50 animate-in slide-in-from-top-1 duration-200">
                <div className="px-4 py-3 border-b border-border-color/50">
                  <div className="flex items-center space-x-3">
                    <ProfileAvatar
                      avatarUrl={profile?.avatar_image_url || null}
                      displayName={profile?.display_name || user?.user_metadata?.display_name || ''}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {profile?.display_name || user?.user_metadata?.display_name || 'ユーザー'}
                      </p>
                      <p className="text-xs text-text-tertiary">アカウント</p>
                    </div>
                  </div>
                </div>
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-text-secondary hover:bg-ui-background-gray/70 hover:text-text-primary transition-colors duration-150 group"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">プロフィール</span>
                </Link>
                <Link 
                  href="/messages" 
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-text-secondary hover:bg-ui-background-gray/70 hover:text-text-primary transition-colors duration-150 group"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z" />
                  </svg>
                  <span className="font-medium">メッセージ</span>
                </Link>
                <hr className="my-1 border-border-color/50" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-text-secondary hover:bg-red-50 hover:text-red-600 transition-colors duration-150 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">ログアウト</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
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