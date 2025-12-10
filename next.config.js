/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 画像最適化設定
  images: {
    domains: [
      'localhost',
      // Netflix CDN
      'occ-0-988-993.1.nflxso.net',
      'image.tmdb.org',
      // Amazon
      'images-na.ssl-images-amazon.com',
      'm.media-amazon.com',
      // Google Books
      'books.google.com',
      // YouTube thumbnails
      'img.youtube.com',
      'i.ytimg.com',
      // 一般的な画像ホスト
      'via.placeholder.com',
      'picsum.photos',
      // ユーザーがアップロードする可能性のあるホスト
      'storage.googleapis.com',
      'cdn.example.com',
      'kdrnxnorxquxvxutkwnq.supabase.co',
      'avatars.githubusercontent.com',
      'visitor-badge.laobi.icu',
      'images.unsplash.com',
      'assets.aceternity.com',
      'source.unsplash.com',
      'images.pexels.com',
      'lh3.googleusercontent.com'
    ],
    // より安全で柔軟な設定（Next.js 12.3+）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true
  },

  // ヘッダー設定（シンプル化）
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';

    const securityHeaders = {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    };

    if (isProd) {
      return [
        securityHeaders,
        // _next 配下の Content-Type はプラットフォーム既定に任せる
        // ここでは長期キャッシュのみを広く指定
        {
          source: '/_next/static/(.*)',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
      ]
    }

    // 開発時はJS/CSSをキャッシュさせない（stale防止）
    return [
      securityHeaders,
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
}

module.exports = nextConfig 