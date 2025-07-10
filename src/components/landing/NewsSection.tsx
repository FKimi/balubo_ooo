'use client'

import { useScrollAnimation } from '@/hooks'
import { getFeaturedNews, categoryStyles } from '@/data/news'

export function NewsSection() {
  const { ref: elementRef, isVisible } = useScrollAnimation()
  const newsItems = getFeaturedNews()

  return (
    <section 
      ref={elementRef}
      className="relative py-20 bg-white overflow-hidden"
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* セクションヘッダー */}
        <div 
          className={`text-center mb-16 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 mb-4">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            最新情報
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            News & Updates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            サービスの最新機能やアップデート情報をお届けします
          </p>
        </div>

        {/* ニュース一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 transform ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* カテゴリバッジ */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryStyles[item.category].badge}`}>
                    <span className="mr-1">{categoryStyles[item.category].icon}</span>
                    {item.category}
                  </span>
                  <time className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString('ja-JP', { 
                      month: '2-digit', 
                      day: '2-digit' 
                    })}
                  </time>
                </div>

                {/* タイトル */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                {/* 説明 */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* リンク */}
                {item.link && (
                  <a
                    href={item.link}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    詳細を見る
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>

              {/* ホバーエフェクト */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          ))}
        </div>

        {/* 全てのニュースを見るボタン */}
        <div 
          className={`text-center mt-12 transform transition-all duration-700 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <a
            href="#"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            全てのニュースを見る
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}