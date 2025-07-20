import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// OGP画像の設定
const OGP_CONFIG = {
  width: 1200,
  height: 630,
  defaultTitle: 'balubo',
  defaultDescription: 'クリエイターのためのポートフォリオプラットフォーム',
} as const

// 背景色の設定
const BACKGROUND_COLORS = {
  work: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  profile: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  article: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  default: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)',
} as const

// 特徴アイコンの設定
const FEATURE_ICONS = [
  { emoji: '📝', label: 'ポートフォリオ', color: '#3b82f6' },
  { emoji: '🤖', label: 'AI分析', color: '#8b5cf6' },
  { emoji: '🌐', label: 'ネットワーク', color: '#10b981' },
] as const

// 入力値の検証とサニタイズ
function sanitizeInput(input: string | null, maxLength: number, defaultValue: string): string {
  if (!input) return defaultValue
  const sanitized = input.trim().slice(0, maxLength)
  return sanitized || defaultValue
}

// 背景色を取得
function getBackgroundColor(type: string): string {
  return BACKGROUND_COLORS[type as keyof typeof BACKGROUND_COLORS] || BACKGROUND_COLORS.default
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // パラメータの取得とサニタイズ
    const title = sanitizeInput(searchParams.get('title'), 100, OGP_CONFIG.defaultTitle)
    const description = sanitizeInput(searchParams.get('description'), 200, OGP_CONFIG.defaultDescription)
    const type = sanitizeInput(searchParams.get('type'), 20, 'default')

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: getBackgroundColor(type),
            position: 'relative',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {/* 背景装飾 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            }}
          />

          {/* メインコンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              maxWidth: '900px',
              textAlign: 'center',
            }}
          >
            {/* ロゴ */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                balubo
              </div>
              <div
                style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                BETA
              </div>
            </div>

            {/* タイトル */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
                lineHeight: '1.2',
                maxWidth: '800px',
              }}
            >
              {title}
            </div>

            {/* 説明 */}
            <div
              style={{
                fontSize: '24px',
                color: '#6b7280',
                lineHeight: '1.5',
                maxWidth: '700px',
              }}
            >
              {description}
            </div>

            {/* 特徴アイコン */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginTop: '40px',
              }}
            >
              {FEATURE_ICONS.map((icon, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: icon.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      margin: '0 auto 10px',
                    }}
                  >
                    {icon.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    {icon.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      {
        width: OGP_CONFIG.width,
        height: OGP_CONFIG.height,
        fonts: [],
      }
    )
  } catch (error) {
    console.error('OGP画像生成エラー:', error)
    
    // エラー時はシンプルなフォールバック画像を返す
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          balubo
        </div>
      ),
      {
        width: OGP_CONFIG.width,
        height: OGP_CONFIG.height,
      }
    )
  }
} 