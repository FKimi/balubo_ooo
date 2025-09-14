'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ShareProfileButtonProps {
  userId: string
  displayName: string
  slug?: string | undefined
}

export function ShareProfileButton({ userId, displayName, slug }: ShareProfileButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ?
    slug && slug.length > 0
      ? `${window.location.origin}/${slug}`
      : `${window.location.origin}/share/profile/${userId}`
    : ''

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error('URLのコピーに失敗しました:', error)
      
      // フォールバック: テキストエリアを使用
      try {
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      } catch (fallbackError) {
        console.error('フォールバックコピーも失敗しました:', fallbackError)
      }
    }
  }

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${displayName}のポートフォリオ`,
          text: `${displayName}のクリエイターポートフォリオをチェックしてみてください！`,
          url: shareUrl,
        })
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('ネイティブ共有に失敗しました:', error)
    }
  }

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`${displayName}のクリエイターポートフォリオをチェックしてみてください！`)
    const url = encodeURIComponent(shareUrl)
    
    let shareUrlForPlatform = ''
    
    switch (platform) {
      case 'twitter':
        shareUrlForPlatform = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case 'facebook':
        shareUrlForPlatform = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'line':
        shareUrlForPlatform = `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`
        break
    }
    
    if (shareUrlForPlatform) {
      window.open(shareUrlForPlatform, '_blank', 'width=600,height=400')
      setIsModalOpen(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border border-gray-200 shadow-lg text-xs sm:text-sm transition-all duration-200"
      >
        <svg className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        共有
      </Button>

      {/* 共有ダイアログ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            {/* 閉じるボタン */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ヘッダー */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ポートフォリオを共有</h3>
              <p className="text-gray-600 text-sm">
                {displayName}のクリエイターポートフォリオを他の人と共有しましょう
              </p>
            </div>

            {/* URL表示 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">共有URL</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                <Button
                  onClick={handleCopyUrl}
                  className={`px-3 py-1.5 text-xs transition-all duration-200 ${
                    isCopied 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                  }`}
                  variant="outline"
                >
                  {isCopied ? (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      コピー完了
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      コピー
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* 共有オプション */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-700 mb-3">共有方法を選択</div>
              
              {/* ネイティブ共有 */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <Button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-lg transition-all"
                  variant="outline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  その他のアプリで共有
                </Button>
              )}

              {/* SNS共有 */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleSocialShare('twitter')}
                  className="flex flex-col items-center gap-2 p-4 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition-all"
                  variant="outline"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span className="text-xs font-medium">Twitter</span>
                </Button>

                <Button
                  onClick={() => handleSocialShare('line')}
                  className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition-all"
                  variant="outline"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.631.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                  <span className="text-xs font-medium">LINE</span>
                </Button>

                <Button
                  onClick={() => handleSocialShare('facebook')}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-all"
                  variant="outline"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-xs font-medium">Facebook</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 