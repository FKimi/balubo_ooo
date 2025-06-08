/** @type {import('next').NextConfig} */
const nextConfig = {
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
      'cdn.example.com'
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
  },
}

module.exports = nextConfig 