'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

interface ContentType {
  id: string
  name: string
  emoji: string
  description: string
  color: string
  icon: string
  enabled?: boolean // 有効/無効フラグを追加
}

interface ContentTypeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const contentTypes: ContentType[] = [
  { 
    id: 'article', 
    name: '記事・ライティング', 
    emoji: '', 
    description: 'ブログ記事、コラム、ニュース記事など',
    color: 'bg-blue-600',
    icon: 'pen',
    enabled: true 
  },
  { 
    id: 'design', 
    name: 'デザイン', 
    emoji: '', 
    description: 'グラフィックデザイン、UI/UXデザイン、ロゴなど',
    color: 'bg-blue-500',
    icon: 'palette',
    enabled: true
  },
  { 
    id: 'photo', 
    name: '写真', 
    emoji: '', 
    description: '写真撮影、フォトレタッチなど',
    color: 'bg-blue-500',
    icon: 'camera',
    enabled: false
  },
  { 
    id: 'video', 
    name: '動画', 
    emoji: '', 
    description: '動画制作、映像編集、アニメーションなど',
    color: 'bg-blue-500',
    icon: 'video',
    enabled: false
  },
  { 
    id: 'podcast', 
    name: 'ポッドキャスト', 
    emoji: '', 
    description: '音声コンテンツ、ラジオ番組など',
    color: 'bg-blue-500',
    icon: 'mic',
    enabled: false
  },
  { 
    id: 'event', 
    name: 'イベント', 
    emoji: '', 
    description: 'イベント企画・運営、カンファレンスなど',
    color: 'bg-blue-500',
    icon: 'calendar',
    enabled: false
  }
]

export function ContentTypeSelector({ isOpen, onClose }: ContentTypeSelectorProps) {
  const router = useRouter()
  const [_selectedType, setSelectedType] = useState<string | null>(null)

  const handleSelect = (contentType: string) => {
    setSelectedType(contentType)
    // すべてのコンテンツタイプで統一されたページにリダイレクト
    router.push(`/works/new?type=${contentType}`)
    onClose()
  }

  // portal setup
  const [mounted, setMounted] = useState(false)
  const [headerOffset, setHeaderOffset] = useState(0)
  useEffect(() => setMounted(true), [])

  // Measure header height
  useEffect(() => {
    const headerEl = document.querySelector('header') as HTMLElement | null
    if (headerEl) {
      setHeaderOffset(headerEl.offsetHeight + 24) // header height + 24px margin
    } else {
      setHeaderOffset(96) // fallback
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4" style={{ paddingTop: headerOffset }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* コンテンツエリア */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
            {/* 左カラム：タイトルと説明 */}
            <div className="md:w-1/3 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">作品を追加</h2>
              <p className="text-gray-600 text-sm leading-relaxed">作品の種類を選択してください。選択後、専用フォームと AI 分析機能が利用できます。</p>
              <button
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                閉じる
              </button>
            </div>

            {/* 右カラム：カードグリッド */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => type.enabled && handleSelect(type.id)}
                disabled={!type.enabled}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 text-left text-sm ${
                  type.enabled 
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white cursor-pointer' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div className="p-4">
                  {/* アイコン部分 */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-200 ${
                    type.enabled 
                      ? `${type.color} group-hover:scale-110` 
                      : 'bg-gray-300'
                  }`}>
                    {type.icon === 'pen' && (
                      <svg className={`w-6 h-6 ${type.enabled ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    )}
                    {type.icon === 'palette' && (
                      <svg className={`w-6 h-6 ${type.enabled ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    )}
                    {type.icon === 'camera' && (
                      <svg className={`w-6 h-6 ${type.enabled ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {type.icon === 'video' && (
                      <svg className={`w-6 h-6 ${type.enabled ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    {type.icon === 'mic' && (
                      <svg className={`w-6 h-6 ${type.enabled ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                    {type.icon === 'calendar' && (
                      <svg className={`w-6 h-6 ${type.enabled ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* タイトル */}
                  <h3 className={`text-base font-bold mb-1 transition-colors ${
                    type.enabled 
                      ? 'text-gray-900 group-hover:text-blue-600' 
                      : 'text-gray-400'
                  }`}>
                    {type.name}
                  </h3>
                  
                  {/* 説明 */}
                  <p className={`text-xs leading-relaxed ${
                    type.enabled ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {type.enabled ? type.description : '近日公開予定です。しばらくお待ちください。'}
                  </p>

                  {/* 無効状態の追加表示 */}
                  {!type.enabled && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-xs text-gray-400 font-medium">準備中</span>
                    </div>
                  )}
                </div>

                {/* ホバー時のオーバーレイ（有効な場合のみ） */}
                {type.enabled && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-30 transition-opacity duration-200"></div>
                )}

                {/* 無効状態のオーバーレイ */}
                {!type.enabled && (
                  <div className="absolute inset-0 bg-gray-50 bg-opacity-50"></div>
                )}
              </button>
            ))}
          </div>

          {/* フッター */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-500 text-sm">
              コンテンツタイプを選択すると、専用のフォームとAI分析が利用できます
            </p>
            <p className="text-gray-400 text-xs">
              他のコンテンツタイプは順次対応予定です
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return mounted ? createPortal(modalContent, document.body) : null
} 