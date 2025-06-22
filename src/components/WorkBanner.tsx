'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface WorkBannerProps {
  url: string
  title: string
  previewData?: LinkPreviewData | null
  bannerImageUrl?: string
  useProxy?: boolean
}

interface LinkPreviewData {
  title: string
  description: string
  image: string
  url: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  imageType: string
  icon: string
  iconWidth: number
  iconHeight: number
  iconSize: number
  iconType: string
  siteName: string
  locale: string
}

export function WorkBanner({ url, title, previewData: initialPreviewData, bannerImageUrl, useProxy = true }: WorkBannerProps) {
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(() => initialPreviewData || null)
  const [isLoading, setIsLoading] = useState(() => !initialPreviewData && !bannerImageUrl)
  const [hasError, setHasError] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoadAttempts, setImageLoadAttempts] = useState(0)

  console.log('WorkBanner rendered with:', { 
    url, 
    title, 
    hasInitialPreviewData: !!initialPreviewData,
    initialImageUrl: initialPreviewData?.image,
    bannerImageUrl,
    useProxy 
  })

  useEffect(() => {
    // 重複実行防止のための参照保持
    let isMounted = true
    
    // 既にプレビューデータがある場合は何もしない
    if (initialPreviewData?.image && isMounted) {
      console.log('Using existing preview data with image:', initialPreviewData.image)
      setPreviewData(initialPreviewData)
      setIsLoading(false)
      return
    }

    // bannerImageUrlがある場合は、それを使用してプレビューデータを作成
    if (bannerImageUrl && !initialPreviewData && isMounted) {
      console.log('Using banner image URL:', bannerImageUrl)
      const syntheticPreviewData: LinkPreviewData = {
        title: title,
        description: '',
        image: bannerImageUrl,
        url: url,
        imageWidth: 0,
        imageHeight: 0,
        imageSize: 0,
        imageType: '',
        icon: '',
        iconWidth: 0,
        iconHeight: 0,
        iconSize: 0,
        iconType: '',
        siteName: '',
        locale: ''
      }
      setPreviewData(syntheticPreviewData)
      setIsLoading(false)
      return
    }

    const fetchPreview = async () => {
      if (!url || !isMounted) {
        console.log('No URL provided for preview or component unmounted')
        if (isMounted) setIsLoading(false)
        return
      }

      try {
        console.log('Fetching preview for URL:', url)
        const response = await fetch('/api/link-preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })

        if (!isMounted) return

        const data = await response.json()
        console.log('Preview API response:', { 
          ok: response.ok, 
          hasImage: !!data.image,
          imageUrl: data.image 
        })

        if (response.ok && data.image && isMounted) {
          console.log('Preview data received with image:', data.image)
          setPreviewData(data)
        } else if (isMounted) {
          console.log('No preview image available from API')
          setHasError(true)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Preview fetch error:', error)
          setHasError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // URLが変更され、既存のデータがない場合のみfetchを実行
    if (!previewData && !bannerImageUrl && url && isMounted) {
      fetchPreview()
    }

    // クリーンアップ関数
    return () => {
      isMounted = false
    }
  }, [url]) // 依存配列をurlのみに限定

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    const currentAttempts = imageLoadAttempts + 1
    setImageLoadAttempts(currentAttempts)
    
    console.error(`Image load error (attempt ${currentAttempts}):`, {
      src: target.src,
      originalImageUrl: previewData?.image,
      useProxy,
      isProxyUrl: target.src.includes('/api/image-proxy')
    })
    
    // プロキシが失敗した場合、直接URLを試す（1回目のエラーのみ）
    if (useProxy && target.src.includes('/api/image-proxy') && previewData?.image && currentAttempts === 1) {
      console.log('Trying direct URL after proxy failure:', previewData.image)
      target.src = previewData.image
      return
    }
    
    // 2回目のエラーまたは直接URLでのエラーの場合、フォールバックを表示
    console.log('Setting image error state after all attempts failed')
    setImageError(true)
    target.style.display = 'none'
    const fallback = target.parentElement?.querySelector('.fallback-bg')
    if (fallback) {
      fallback.classList.remove('hidden')
    }
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    console.log('Image loaded successfully:', {
      src: target.src,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight
    })
    setImageError(false)
    setImageLoadAttempts(0)
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <svg className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div className="text-gray-500 text-xs">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (hasError || !previewData?.image || imageError) {
    console.log('Showing fallback due to:', { hasError, hasImage: !!previewData?.image, imageError })
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-white rounded-lg shadow-lg mx-auto mb-2 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-gray-600 text-xs font-medium">作品</div>
        </div>
      </div>
    )
  }

  const imageUrl = useProxy && previewData.image 
    ? `/api/image-proxy?url=${encodeURIComponent(previewData.image)}` 
    : previewData.image

  console.log('Rendering image with URL:', imageUrl)

  return (
    <div className="w-full h-full relative">
      <Image
        src={imageUrl}
        alt={title || previewData.title || 'バナー画像'}
        fill
        sizes="100vw"
        className="object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      <div className="fallback-bg hidden absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-2 block">🖼️</span>
          <p className="text-sm text-gray-500">画像を読み込めませんでした</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  )
} 