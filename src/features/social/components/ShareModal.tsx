'use client'

import { useState } from 'react'
import { X, Twitter, Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generateShareModalData, shareToTwitter } from '@/utils/socialShare'
import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'work' | 'input'
  data: WorkData | InputData
  userDisplayName?: string
}

export function ShareModal({ isOpen, onClose, type, data, userDisplayName }: ShareModalProps) {
  const [isCopied, setIsCopied] = useState(false)

  if (!isOpen) return null

  const shareData = generateShareModalData(type, data, userDisplayName)

  // クリップボードにコピー
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('コピーエラー:', error)
    }
  }

  // X（Twitter）で共有
  const handleTwitterShare = () => {
    shareToTwitter(type, data, userDisplayName)
    onClose()
  }

  // 後で共有（モーダルを閉じる）
  const handleLater = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all">
        
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              type === 'work' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <span className="text-2xl">
                {type === 'work' ? '🎨' : '📚'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {type === 'work' ? '作品を共有' : 'インプットを共有'}
              </h2>
              <p className="text-sm text-gray-500">
                あなたの{shareData.preview.type}をみんなに知らせましょう
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          
          {/* 投稿プレビュー */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {userDisplayName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 mb-2">
                  {userDisplayName || 'あなた'}
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {shareData.text}
                </div>
                {shareData.url && (
                  <div className="mt-3 flex items-center gap-2 text-blue-600 text-sm">
                    <ExternalLink className="w-4 h-4" />
                    <span className="truncate">{shareData.url}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 共有ボタン */}
          <div className="space-y-3">
            
            {/* X（Twitter）共有 */}
            <Button
              onClick={handleTwitterShare}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium"
              size="lg"
            >
              <Twitter className="w-5 h-5 mr-3" />
              X（Twitter）で共有する
            </Button>

            {/* テキストコピー */}
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full py-3 text-base"
              size="lg"
            >
              {isCopied ? (
                <>
                  <Check className="w-5 h-5 mr-3 text-green-600" />
                  <span className="text-green-600">コピーしました！</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-3" />
                  テキストをコピー
                </>
              )}
            </Button>
          </div>

          {/* 後で共有 */}
          <div className="text-center">
            <Button
              onClick={handleLater}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              後で共有する
            </Button>
          </div>
        </div>

        {/* フッター（ヒント） */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-yellow-500 text-lg">💡</div>
              <div className="text-sm text-gray-600">
                <strong>共有のメリット：</strong><br />
                作品やインプットをシェアすることで、同じ興味を持つ人とのつながりが生まれ、
                新しい機会や協力関係につながる可能性があります。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 成功トースト風のコンパクト共有ポップアップ
interface ShareSuccessToastProps {
  isOpen: boolean
  onClose: () => void
  type: 'work' | 'input'
  onShare: () => void
}

export function ShareSuccessToast({ isOpen, onClose, type, onShare }: ShareSuccessToastProps) {
  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 transform transition-all duration-300">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            type === 'work' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <span className="text-xl">
              {type === 'work' ? '🎨' : '📚'}
            </span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 text-sm">
              {type === 'work' ? '作品を追加しました！' : 'インプットを追加しました！'}
            </div>
            <div className="text-xs text-gray-500">
              みんなに共有しませんか？
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={onShare}
            size="sm"
            className="flex-1 bg-black hover:bg-gray-800 text-white text-xs"
          >
            <Twitter className="w-3 h-3 mr-1" />
            X共有
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            後で
          </Button>
        </div>
      </div>
    </div>
  )
} 