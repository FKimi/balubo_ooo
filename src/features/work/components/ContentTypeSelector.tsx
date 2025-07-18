'use client'

import { useState } from 'react'
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
    enabled: true // 記事のみ有効
  },
  { 
    id: 'design', 
    name: 'デザイン', 
    emoji: '', 
    description: 'グラフィックデザイン、UI/UXデザイン、ロゴなど',
    color: 'bg-blue-500',
    icon: 'palette',
    enabled: false
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
    // 選択したコンテンツタイプを含めて作品追加画面にリダイレクト
    router.push(`/works/new?type=${contentType}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">作品を追加</h2>
              <p className="text-gray-600 mt-1">作品の種類を選択してください</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* コンテンツタイプ選択 */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => type.enabled && handleSelect(type.id)}
                disabled={!type.enabled}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 text-left ${
                  type.enabled 
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white cursor-pointer' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div className="p-6">
                  {/* アイコン部分 */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 ${
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
                  <h3 className={`text-lg font-bold mb-2 transition-colors ${
                    type.enabled 
                      ? 'text-gray-900 group-hover:text-blue-600' 
                      : 'text-gray-400'
                  }`}>
                    {type.name}
                  </h3>
                  
                  {/* 説明 */}
                  <p className={`text-sm leading-relaxed ${
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700 text-sm font-medium">
                現在は記事・ライティング作品の追加が可能です
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              他のコンテンツタイプは順次対応予定です
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 