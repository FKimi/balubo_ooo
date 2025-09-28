/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['recharts'],
  
  // 実験的機能を一時的に無効化
  experimental: {
    optimizePackageImports: [
      '@heroicons/react', 
      'lucide-react', 
      '@radix-ui/react-dialog', 
      '@radix-ui/react-tabs',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-slot',
      'framer-motion',
      'react-hook-form',
      'react-markdown',
      'recharts'
    ],
  },
  
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
        hostname: '**.nflxso.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ssl-images-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
        port: '',
        pathname: '/**',
      }
    ],
    unoptimized: true
  },
  
  // ヘッダー設定（シンプル化）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 