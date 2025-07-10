'use client'

import { useEffect, useState } from 'react'

interface NewsItem {
  id: string
  text: string
  date: string
  category: 'リリース' | 'アップデート' | 'お知らせ'
  link?: string
}

const newsItems: NewsItem[] = [
  {
    id: '1',
    text: 'balubo ベータ版をリリースしました',
    date: new Date().toISOString().split('T')[0],
    category: 'リリース',
    link: '#'
  }
]

export function NewsTicker() {
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // 自動的にニュースを切り替え
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % newsItems.length)
      }, 4000) // 4秒ごとに切り替え

      return () => clearInterval(interval)
    }
  }, [isPaused])

  const currentNews = newsItems[currentIndex]

  return (
    <div className="relative">
      {/* 上部の区切り線 */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      {/* メインのニュースティッカー */}
      <div className="relative bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-blue-50/80 border-y border-blue-100/50 py-3 overflow-hidden shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            {/* アイコン付きNews バッジ */}
            <div className="flex items-center mr-4 flex-shrink-0">
              <div className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-lg">
                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                NEWS
              </div>
            </div>

            {/* ニュースコンテンツ */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  {/* 現在のニュース */}
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <div className="absolute -inset-1 bg-blue-500 rounded-full animate-ping opacity-30" />
                    </div>
                    <span className="text-slate-900 font-semibold text-sm">
                      {currentNews.text}
                    </span>
                  </div>
                  
                  {/* 日付とカテゴリ */}
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      {currentNews.category}
                    </span>
                    <span className="text-slate-600 text-xs font-medium">
                      {new Date(currentNews.date).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側の装飾要素 */}
            <div className="flex items-center ml-4 space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-70 animate-bounce" style={{animationDelay: '0s'}} />
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.1s'}} />
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
            </div>
          </div>
        </div>

        {/* 背景装飾 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            {/* 左からの光の線 */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-40 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40 animate-shine" />
            {/* 右からの光の線 */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-40 h-px bg-gradient-to-l from-transparent via-indigo-400 to-transparent opacity-40 animate-shine-reverse" />
            {/* 微細なパーティクル */}
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-float" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-400 rounded-full opacity-20 animate-float-delayed" />
          </div>
        </div>

        <style jsx>{`
          @keyframes shine {
            0% { transform: translateX(-100%) translateY(-50%); opacity: 0; }
            50% { opacity: 0.4; }
            100% { transform: translateX(100%) translateY(-50%); opacity: 0; }
          }
          
          @keyframes shine-reverse {
            0% { transform: translateX(100%) translateY(-50%); opacity: 0; }
            50% { opacity: 0.4; }
            100% { transform: translateX(-100%) translateY(-50%); opacity: 0; }
          }
          
          @keyframes float {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 0.6; }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.3); opacity: 0.5; }
          }
          
          .animate-shine {
            animation: shine 4s ease-in-out infinite;
          }
          
          .animate-shine-reverse {
            animation: shine-reverse 4s ease-in-out infinite;
            animation-delay: 2s;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 3s ease-in-out infinite;
            animation-delay: 1.5s;
          }
        `}</style>
      </div>
      
      {/* 下部の区切り線 */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      {/* 追加の余白 */}
      <div className="h-6 bg-white" />
    </div>
  )
}