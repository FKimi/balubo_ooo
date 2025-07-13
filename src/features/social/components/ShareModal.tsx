'use client'

import { useState } from 'react'
import { X, Twitter, Copy, Check, CheckCircle } from 'lucide-react'
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
        className="absolute inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      {/* 小さなポップアップ */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 transform transition-all">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {type === 'work' ? '作品を公開しました！' : 'インプットを公開しました！'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* コンテンツ */}
        <div className="p-4 space-y-3">
          {/* X（Twitter）共有 */}
          <Button
            onClick={handleTwitterShare}
            className="w-full bg-black hover:bg-gray-800 text-white py-2 text-sm"
            size="sm"
          >
            <Twitter className="w-4 h-4 mr-2" />
            X（Twitter）で共有する
          </Button>

          {/* テキストコピー */}
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full py-2 text-sm"
            size="sm"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-green-600">コピーしました！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                テキストをコピー
              </>
            )}
          </Button>

          {/* 後で共有 */}
          <Button
            onClick={handleLater}
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700 text-sm"
            size="sm"
          >
            後で共有する
          </Button>
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

export function ShareSuccessToast({ isOpen, onClose: _onClose, type, onShare: _onShare }: ShareSuccessToastProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {type === 'profile' ? 'プロフィール' : '作品'}をシェアしました
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              シェアリンクがクリップボードにコピーされました
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 