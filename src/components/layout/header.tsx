'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="border-b border-border-color bg-base-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/profile">
          <h1 className="text-2xl font-bold text-accent-dark-blue">balubo</h1>
        </Link>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-text-secondary hover:text-accent-dark-blue transition-colors">
            ホーム
          </Link>
          <Link href="/profile" className="text-text-secondary hover:text-accent-dark-blue transition-colors">
            ポートフォリオ
          </Link>
          <Link href="/report" className="text-text-secondary hover:text-accent-dark-blue transition-colors">
            詳細レポート
          </Link>
          <Link href="/search" className="text-text-secondary hover:text-accent-dark-blue transition-colors">
            検索
          </Link>
        </nav>

        {/* 右側のアクション */}
        <div className="flex items-center space-x-4">
          {/* 通知アイコン */}
          <Link href="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 17H6l5 5v-5z" />
              </svg>
              {/* 未読バッジ（サンプル） */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-red rounded-full"></span>
            </Button>
          </Link>

          {/* 作品追加ボタン */}
          <Link href="/works/new">
            <Button className="bg-accent-dark-blue hover:bg-primary-blue">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              作品追加
            </Button>
          </Link>

          {/* プロフィールメニュー */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-text-secondary hover:text-text-primary"
            >
              <div className="w-8 h-8 bg-primary-light-blue rounded-full flex items-center justify-center">
                <span className="text-accent-dark-blue font-bold text-sm">
                  {user?.user_metadata?.display_name?.charAt(0) || 'U'}
                </span>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* プロフィールドロップダウンメニュー */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-base-white rounded-lg shadow-lg border border-border-color py-2 z-50">
                <div className="px-4 py-2 border-b border-border-color">
                  <p className="text-sm font-medium text-text-primary">
                    {user?.user_metadata?.display_name || 'ユーザー'}
                  </p>
                  <p className="text-xs text-text-tertiary">{user?.email}</p>
                </div>
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-text-secondary hover:bg-ui-background-gray hover:text-text-primary"
                  onClick={() => setShowProfileMenu(false)}
                >
                  プロフィール
                </Link>
                <Link 
                  href="/settings" 
                  className="block px-4 py-2 text-sm text-text-secondary hover:bg-ui-background-gray hover:text-text-primary"
                  onClick={() => setShowProfileMenu(false)}
                >
                  設定
                </Link>
                <hr className="my-2 border-border-color" />
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-ui-background-gray hover:text-text-primary"
                >
                  ログアウト
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-white border-t border-border-color z-50">
      <div className="flex justify-around py-2">
        <Link href="/profile" className="flex flex-col items-center py-2 px-3 text-text-secondary hover:text-accent-dark-blue">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">プロフィール</span>
        </Link>
        <Link href="/works" className="flex flex-col items-center py-2 px-3 text-text-secondary hover:text-accent-dark-blue">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs">作品</span>
        </Link>
        <Link href="/connections" className="flex flex-col items-center py-2 px-3 text-text-secondary hover:text-accent-dark-blue">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs">つながり</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center py-2 px-3 text-text-secondary hover:text-accent-dark-blue">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs">検索</span>
        </Link>
      </div>
    </nav>
  )
} 