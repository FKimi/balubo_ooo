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
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {type === 'work' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                )}
              </svg>
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
                {/* 作品の外部リンクがある場合は追加で表示 */}
                {type === 'work' && (data as any).external_url && (
                  <div className="mt-2 flex items-center gap-2 text-gray-500 text-xs">
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate">実際の作品: {(data as any).external_url}</span>
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
              <div className="w-5 h-5 text-blue-600 mt-0.5">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
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
  console.log('ShareSuccessToast render - isOpen:', isOpen, 'type:', type)
  
  if (!isOpen) {
    console.log('ShareSuccessToast: returning null because isOpen is false')
    return null
  }

  console.log('ShareSuccessToast: rendering toast')
  
  return (
    <div 
      className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-[99999] animate-slide-up" 
      style={{ 
        position: 'fixed', 
        bottom: '130px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 99999,
        width: '360px'
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 backdrop-blur-sm"
        style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            🎉 作品を追加しました！
          </div>
          <div className="text-sm text-gray-600 mb-6">
            みんなに共有しませんか？
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onShare}
              size="sm"
              className="bg-black hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2 rounded-full"
            >
              <Twitter className="w-4 h-4 mr-2" />
              X共有
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="text-sm text-gray-600 border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-full"
            >
              後で
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 