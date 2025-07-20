'use client'

import { useMemo, useState } from 'react'
import { generateShareModalData, shareToTwitter } from '@/utils/socialShare'
import type { WorkData } from '@/features/work/types'
import type { InputData } from '@/types/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'work' | 'input'
  data: WorkData | InputData
  userDisplayName?: string
}

export function ShareModal({ isOpen, onClose, type, data, userDisplayName }: ShareModalProps) {
  const modalData = useMemo(() => generateShareModalData(type, data, userDisplayName), [type, data, userDisplayName])

  // 作品の場合はシェア用画像 URL を生成 (OGP Route)
  const ogImageUrl = useMemo(() => {
    if (type === 'work' && (data as WorkData).id && typeof window !== 'undefined') {
      return `${window.location.origin}/api/og/analysis/${(data as WorkData).id}`
    }
    return null
  }, [type, data])

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(modalData.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error('コピーに失敗しました', e)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4 animate-fade-in">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            共有メッセージを確認
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 本文 */}
        <div className="p-6 space-y-4">
          {/* プレビュー */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700">以下の内容でX（Twitter）に共有します。</p>
            {ogImageUrl && (
              <Image src={ogImageUrl} alt="シェア画像" width={600} height={315} className="w-full rounded-lg border border-gray-200" />
            )}
            <Textarea value={modalData.text} readOnly className="text-sm bg-gray-50" />
          </div>

          {/* アクション */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button onClick={() => shareToTwitter(type, data, userDisplayName)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9 12.14 12.14 0 01-8.82-4.47 4.28 4.28 0 001.32 5.71 4.28 4.28 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.97 8.58 8.58 0 01-5.31 1.83A8.65 8.65 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.65 8.65 0 0022.46 6z" />
              </svg>
              Xで共有する
            </Button>
            <Button variant="outline" onClick={handleCopy} className="flex-1">
              {copied ? 'コピーしました' : 'メッセージをコピー'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 