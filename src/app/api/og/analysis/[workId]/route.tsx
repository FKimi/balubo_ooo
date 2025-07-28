import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

// OGP画像の設定
const OGP_CONFIG = {
  width: 1200,
  height: 630,
  defaultTitle: 'balubo - 作品詳細',
  defaultDescription: 'クリエイターの作品をチェックしよう',
} as const

// 背景色の設定
const BACKGROUND_COLORS = {
  work: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  input: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #ff9a9e 100%)',
  default: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
} as const

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

export async function GET(
  request: NextRequest,
  { params }: { params: { workId: string } }
) {
  try {
    const workId = params.workId
    
    // Supabaseクライアントを作成
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // 作品情報を取得
    let workData = null
    let authorData = null
    
    try {
      const { data: work, error: workError } = await supabase
        .from('works')
        .select(`
          id,
          title,
          description,
          tags,
          roles,
          banner_image_url,
          created_at,
          user_id
        `)
        .eq('id', workId)
        .single()

      if (work && !workError) {
        workData = work
        
        // 作者情報を取得
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_image_url')
          .eq('user_id', work.user_id)
          .single()
        
        authorData = profile
      }
    } catch (error) {
      console.error('作品データ取得エラー:', error)
    }

    // デフォルト値の設定
    const title = workData?.title || OGP_CONFIG.defaultTitle
    const description = workData?.description || OGP_CONFIG.defaultDescription
    const author = authorData?.display_name || 'クリエイター'
    const tags = workData?.tags?.slice(0, 3) || []
    const roles = workData?.roles?.slice(0, 2) || []

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
            background: getBackgroundColor('work'),
            position: 'relative',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            overflow: 'hidden',
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
                background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                borderRadius: '24px 24px 0 0',
              }}
            />

            {/* ロゴエリア */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #1e293b, #475569)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  marginBottom: '8px',
                }}
              >
                balubo
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#64748b',
                  fontWeight: '500',
                }}
              >
                作品詳細
              </div>
            </div>

            {/* タイトル */}
            <div
              style={{
                fontSize: '42px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '16px',
                lineHeight: '1.2',
                maxWidth: '800px',
              }}
            >
              {title}
            </div>

            {/* 作者情報 */}
            <div
              style={{
                fontSize: '20px',
                color: '#475569',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              by {author}
            </div>

            {/* 説明文 */}
            <div
              style={{
                fontSize: '20px',
                color: '#64748b',
                fontWeight: '500',
                marginBottom: '30px',
                lineHeight: '1.4',
                maxWidth: '800px',
              }}
            >
              {description}
            </div>

            {/* タグとロール */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '30px',
              }}
            >
              {tags.map((tag: string, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    color: '#3b82f6',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  #{tag}
                </div>
              ))}
              {roles.map((role: string, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(139,92,246,0.1)',
                    color: '#8b5cf6',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {role}
                </div>
              ))}
            </div>

            {/* 特徴アイコン */}
            <div
              style={{
                display: 'flex',
                gap: '30px',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #3b82f6dd)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  📝
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1e293b',
                  }}
                >
                  ポートフォリオ
                </div>
              </div>
              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #8b5cf6dd)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  🤖
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1e293b',
                  }}
                >
                  AI分析
                </div>
              </div>
              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #06b6d4, #06b6d4dd)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  🌐
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1e293b',
                  }}
                >
                  ネットワーク
                </div>
              </div>
            </div>
          </div>

          {/* 装飾要素 */}
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: '50px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            🎨
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(240,147,251,0.2), rgba(245,87,108,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
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
    console.error('作品OGP画像生成エラー:', error)
    
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
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            color: 'white',
            fontSize: '32px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          balubo - 作品詳細
        </div>
      ),
      {
        width: OGP_CONFIG.width,
        height: OGP_CONFIG.height,
      }
    )
  }
} 