import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { 
  OGP_CONFIG, 
  BACKGROUND_COLORS, 
  FEATURE_ICONS, 
  sanitizeOGPInput, 
  getBackgroundColor,
  type OGImageType 
} from '@/lib/ogp-utils'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // パラメータの取得とサニタイズ
    const title = sanitizeOGPInput(searchParams.get('title'), 100, OGP_CONFIG.defaultTitle)
    const description = sanitizeOGPInput(searchParams.get('description'), 200, OGP_CONFIG.defaultDescription)
    const type = sanitizeOGPInput(searchParams.get('type'), 20, 'default') as OGImageType
    const author = sanitizeOGPInput(searchParams.get('author'), 50, '')

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
            overflow: 'hidden',
          }}
        >
          {/* 背景装飾 - より魅力的なパターン */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            }}
          />
          
          {/* グリッドパターン */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
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
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              maxWidth: '900px',
              textAlign: 'center',
              position: 'relative',
              border: '4px solid transparent',
              backgroundClip: 'padding-box',
            }}
          >
            {/* アクセントライン */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)',
                borderRadius: '24px 24px 0 0',
              }}
            />

            {/* ロゴエリア */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #1e293b, #475569)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  marginBottom: '8px',
                }}
              >
                balubo
              </div>
              {author && (
                <div
                  style={{
                    fontSize: '18px',
                    color: '#64748b',
                    fontWeight: '500',
                    marginTop: '8px',
                  }}
                >
                  by {author}
                </div>
              )}
            </div>

            {/* タイトル */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '20px',
                lineHeight: '1.2',
                maxWidth: '800px',
              }}
            >
              {title}
            </div>

            {/* 説明文 */}
            <div
              style={{
                fontSize: '24px',
                color: '#475569',
                fontWeight: '500',
                marginBottom: '40px',
                lineHeight: '1.4',
                maxWidth: '800px',
              }}
            >
              {description}
            </div>

            {/* 特徴アイコン */}
            <div
              style={{
                display: 'flex',
                gap: '30px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {FEATURE_ICONS.map((icon, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${icon.color}, ${icon.color}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    }}
                  >
                    {icon.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                    }}
                  >
                    {icon.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 装飾要素 */}
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: '50px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
            }}
          >
            🚀
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(16,185,129,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            ✨
          </div>
        </div>
      ),
      {
        width: OGP_CONFIG.width,
        height: OGP_CONFIG.height,
      }
    )
  } catch (error) {
    console.error('OGP画像生成エラー:', error)
    
    // エラー時のフォールバック画像
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: BACKGROUND_COLORS.default,
            color: 'white',
            fontSize: '32px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          balubo - クリエイターのためのポートフォリオプラットフォーム
        </div>
      ),
      {
        width: OGP_CONFIG.width,
        height: OGP_CONFIG.height,
      }
    )
  }
} 