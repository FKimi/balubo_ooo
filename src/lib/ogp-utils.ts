// OGP関連の共通設定とユーティリティ

export const OGP_CONFIG = {
  baseUrl: 'https://www.balubo.jp',
  defaultImageUrl: '/og-image.svg',
  defaultWidth: 1200,
  defaultHeight: 630,
  defaultTitle: 'balubo - クリエイターのためのポートフォリオプラットフォーム',
  defaultDescription: '作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。',
} as const

// 動的OGP画像URLを生成
export function generateDynamicOGPUrl(params: {
  title?: string
  description?: string
  type?: string
}): string {
  const searchParams = new URLSearchParams()
  
  if (params.title) {
    searchParams.set('title', params.title)
  }
  if (params.description) {
    searchParams.set('description', params.description)
  }
  if (params.type) {
    searchParams.set('type', params.type)
  }
  
  return `${OGP_CONFIG.baseUrl}/api/og?${searchParams.toString()}`
}

// 基本的なOGPメタデータを生成
export function generateBasicOGPMetadata(params: {
  title?: string
  description?: string
  url?: string
  imageUrl?: string
  type?: 'website' | 'article' | 'profile'
}) {
  const title = params.title || OGP_CONFIG.defaultTitle
  const description = params.description || OGP_CONFIG.defaultDescription
  const url = params.url || OGP_CONFIG.baseUrl
  const imageUrl = params.imageUrl || OGP_CONFIG.defaultImageUrl
  const type = params.type || 'website'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type,
      url,
      images: [
        {
          url: imageUrl,
          width: OGP_CONFIG.defaultWidth,
          height: OGP_CONFIG.defaultHeight,
          alt: title,
        }
      ],
      siteName: 'balubo',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

// 作品用のOGPメタデータを生成
export function generateWorkOGPMetadata(params: {
  title: string
  description?: string
  workId: string
  imageUrl?: string
}) {
  const title = params.title || '無題の作品'
  const description = params.description || `${title}の作品詳細ページです。`
  const url = `${OGP_CONFIG.baseUrl}/works/${params.workId}`
  const imageUrl = params.imageUrl || generateDynamicOGPUrl({
    title,
    description,
    type: 'work'
  })

  return {
    title: `${title} - 作品詳細 | balubo`,
    description,
    openGraph: {
      title,
      description,
      type: 'article' as const,
      url,
      images: [
        {
          url: imageUrl,
          width: OGP_CONFIG.defaultWidth,
          height: OGP_CONFIG.defaultHeight,
          alt: title,
        }
      ],
      siteName: 'balubo',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

// プロフィール用のOGPメタデータを生成
export function generateProfileOGPMetadata(params: {
  displayName: string
  bio?: string
  userId: string
  avatarUrl?: string
}) {
  const title = `${params.displayName}のポートフォリオ`
  const description = params.bio || `${params.displayName}のクリエイターポートフォリオをご覧ください。`
  const url = `${OGP_CONFIG.baseUrl}/share/profile/${params.userId}`
  const imageUrl = params.avatarUrl || generateDynamicOGPUrl({
    title,
    description,
    type: 'profile'
  })

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile' as const,
      url,
      images: [
        {
          url: imageUrl,
          width: OGP_CONFIG.defaultWidth,
          height: OGP_CONFIG.defaultHeight,
          alt: title,
        }
      ],
      siteName: 'balubo',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

// 入力値の検証とサニタイズ
export function sanitizeOGPInput(input: string | null, maxLength: number, defaultValue: string): string {
  if (!input) return defaultValue
  const sanitized = input.trim().slice(0, maxLength)
  return sanitized || defaultValue
}

// 画像URLの優先順位付き取得
export function getImageUrlWithPriority(work: any): string | null {
  return work.banner_image_url || 
         work.preview_data?.image || 
         work.previewData?.image || 
         null
} 