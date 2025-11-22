import { Metadata } from "next";

export const dynamic = 'force-dynamic';

// メタデータの設定
const FEED_METADATA = {
  title: "フィード - balubo",
  description:
    "クリエイターたちの作品とインプットを発見しよう。新しいアイデアやインスピレーションを見つけられます。",
  url: "https://www.balubo.jp/feed",
  imageUrl:
    "https://www.balubo.jp/api/og?title=フィード&description=クリエイターたちの作品とインプットを発見しよう&type=default",
} as const;

export const metadata: Metadata = {
  title: FEED_METADATA.title,
  description: FEED_METADATA.description,
  openGraph: {
    title: FEED_METADATA.title,
    description: FEED_METADATA.description,
    type: "website",
    url: FEED_METADATA.url,
    images: [
      {
        url: FEED_METADATA.imageUrl,
        width: 1200,
        height: 630,
        alt: "balubo フィード",
      },
    ],
    siteName: "balubo",
  },
  twitter: {
    card: "summary_large_image",
    title: FEED_METADATA.title,
    description: FEED_METADATA.description,
    images: [FEED_METADATA.imageUrl],
  },
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
