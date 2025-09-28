import { Metadata } from "next";

// OGP画像の設定
export const OGP_CONFIG = {
  width: 1200,
  height: 630,
  defaultTitle: "balubo",
  defaultDescription: "クリエイターのためのポートフォリオプラットフォーム",
} as const;

// 背景色の設定
export const BACKGROUND_COLORS = {
  work: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  profile: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)",
  article: "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)",
  input: "linear-gradient(135deg, #fa709a 0%, #fee140 50%, #ff9a9e 100%)",
  default: "#3b82f6", // 青い背景（添付画像の色に合わせて）
} as const;

// 特徴アイコンの設定
export const FEATURE_ICONS = [
  { emoji: "📝", label: "ポートフォリオ", color: "#3b82f6" },
  { emoji: "🤖", label: "AI分析", color: "#8b5cf6" },
  { emoji: "🌐", label: "ネットワーク", color: "#06b6d4" },
  { emoji: "🚀", label: "成長支援", color: "#10b981" },
] as const;

// 型定義
export type OGImageType = keyof typeof BACKGROUND_COLORS;
export type FeatureIcon = (typeof FEATURE_ICONS)[number];

export interface OGImageParams {
  title?: string;
  description?: string;
  type?: OGImageType;
  author?: string;
  tags?: string[];
  roles?: string[];
}

export interface WorkData {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  roles?: string[];
  banner_image_url?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export interface AuthorData {
  display_name: string;
  avatar_image_url?: string;
}

// 入力値の検証とサニタイズ
export function sanitizeOGPInput(
  input: string | null | undefined,
  maxLength: number,
  defaultValue: string,
): string {
  if (!input) return defaultValue;
  const sanitized = input.trim().slice(0, maxLength);
  return sanitized || defaultValue;
}

// 背景色を取得
export function getBackgroundColor(type: OGImageType): string {
  return BACKGROUND_COLORS[type] || BACKGROUND_COLORS.default;
}

// 作品用のOGPメタデータを生成
export function generateWorkOGPMetadata(params: {
  title: string;
  description: string;
  workId: string;
  author?: string;
  tags?: string[];
  roles?: string[];
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const {
    title,
    description,
    workId,
    author,
    tags = [],
    roles = [],
    publishedTime,
    modifiedTime,
  } = params;

  const ogImageUrl = `/api/og/analysis/${workId}`;
  const keywords = [
    ...tags,
    ...roles,
    "ポートフォリオ",
    "クリエイター",
    "作品",
  ];

  return {
    title: `${title} | balubo`,
    description,
    keywords,
    openGraph: {
      title: `${title} | balubo`,
      description,
      url: `https://www.balubo.jp/works/${workId}`,
      siteName: "balubo",
      images: [
        {
          url: ogImageUrl,
          width: OGP_CONFIG.width,
          height: OGP_CONFIG.height,
          alt: `${title} - ${description}`,
        },
      ],
      locale: "ja_JP",
      type: "article",
      authors: author ? [author] : undefined,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | balubo`,
      description,
      images: [ogImageUrl],
      creator: "@AiBalubo56518",
      site: "@AiBalubo56518",
    },
    alternates: {
      canonical: `/works/${workId}`,
    },
  };
}

// デフォルトのOGPメタデータを生成
export function generateDefaultOGPMetadata(params: {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}): Metadata {
  const { title, description, url, imageUrl } = params;

  return {
    title: title || OGP_CONFIG.defaultTitle,
    description: description || OGP_CONFIG.defaultDescription,
    openGraph: {
      title: title || OGP_CONFIG.defaultTitle,
      description: description || OGP_CONFIG.defaultDescription,
      url: url || "https://www.balubo.jp",
      siteName: "balubo",
      images: [
        {
          url: imageUrl || "/og-image.svg",
          width: OGP_CONFIG.width,
          height: OGP_CONFIG.height,
          alt: title || OGP_CONFIG.defaultTitle,
        },
      ],
      locale: "ja_JP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || OGP_CONFIG.defaultTitle,
      description: description || OGP_CONFIG.defaultDescription,
      images: [imageUrl || "/og-image.svg"],
      creator: "@AiBalubo56518",
      site: "@AiBalubo56518",
    },
  };
}

// エラー用のOGPメタデータを生成
export function generateErrorOGPMetadata(params: {
  title?: string;
  description?: string;
}): Metadata {
  const { title = "エラー", description = "ページが見つかりませんでした" } =
    params;

  return generateDefaultOGPMetadata({
    title: `${title} | balubo`,
    description,
  });
}
