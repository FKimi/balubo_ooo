'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface ContentType {
  id: string
  name: string
  emoji: string
  description: string
  color: string
  icon: string
}

interface ContentTypeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const contentTypes: ContentType[] = [
  { 
    id: 'article', 
    name: '記事・ライティング', 
    emoji: '📝', 
    description: 'ブログ記事、コラム、ニュース記事など',
    color: 'bg-blue-500',
    icon: '✍️'
  },
  { 
    id: 'design', 
    name: 'デザイン', 
    emoji: '🎨', 
    description: 'グラフィックデザイン、UI/UXデザイン、ロゴなど',
    color: 'bg-purple-500',
    icon: '🎨'
  },
  { 
    id: 'photo', 
    name: '写真', 
    emoji: '📸', 
    description: '写真撮影、フォトレタッチなど',
    color: 'bg-green-500',
    icon: '📷'
  },
  { 
    id: 'video', 
    name: '動画', 
    emoji: '🎬', 
    description: '動画制作、映像編集、アニメーションなど',
    color: 'bg-red-500',
    icon: '🎥'
  },
  { 
    id: 'podcast', 
    name: 'ポッドキャスト', 
    emoji: '🎙️', 
    description: '音声コンテンツ、ラジオ番組など',
    color: 'bg-orange-500',
    icon: '🔊'
  },
  { 
    id: 'event', 
    name: 'イベント', 
    emoji: '🎪', 
    description: 'イベント企画・運営、カンファレンスなど',
    color: 'bg-pink-500',
    icon: '🎊'
  }
]

export function ContentTypeSelector({ isOpen, onClose }: ContentTypeSelectorProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

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
                onClick={() => handleSelect(type.id)}
                className="group relative overflow-hidden rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg bg-white"
              >
                <div className="p-6 text-left">
                  {/* アイコン部分 */}
                  <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <span className="text-2xl text-white">{type.icon}</span>
                  </div>
                  
                  {/* タイトル */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {type.name}
                  </h3>
                  
                  {/* 説明 */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {type.description}
                  </p>
                </div>

                {/* ホバー時のオーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-30 transition-opacity duration-200"></div>
              </button>
            ))}
          </div>

          {/* フッター */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              💡 コンテンツタイプを選択すると、専用のフォームとAI分析が利用できます
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 