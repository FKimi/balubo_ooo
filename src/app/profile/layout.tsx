import { Metadata } from 'next'

// メタデータの設定
const PROFILE_METADATA = {
  title: 'プロフィール - balubo',
  description: 'あなたのクリエイタープロフィールを管理し、作品やスキルを共有しましょう。',
  url: 'https://www.balubo.jp/profile',
  imageUrl: 'https://www.balubo.jp/api/og?title=プロフィール&description=あなたのクリエイタープロフィールを管理し、作品やスキルを共有しましょう&type=profile',
} as const

export const metadata: Metadata = {
  title: PROFILE_METADATA.title,
  description: PROFILE_METADATA.description,
  openGraph: {
    title: PROFILE_METADATA.title,
    description: PROFILE_METADATA.description,
    type: 'profile',
    url: PROFILE_METADATA.url,
    images: [
      {
        url: PROFILE_METADATA.imageUrl,
        width: 1200,
        height: 630,
        alt: 'balubo プロフィール',
      }
    ],
    siteName: 'balubo',
  },
  twitter: {
    card: 'summary_large_image',
    title: PROFILE_METADATA.title,
    description: PROFILE_METADATA.description,
    images: [PROFILE_METADATA.imageUrl],
  },
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 