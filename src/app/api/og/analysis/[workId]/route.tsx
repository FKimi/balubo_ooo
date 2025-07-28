import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { 
  OGP_CONFIG, 
  BACKGROUND_COLORS, 
  FEATURE_ICONS, 
  sanitizeOGPInput,
  type WorkData,
  type AuthorData 
} from '@/lib/ogp-utils'

export const runtime = 'edge'

// 背景色を取得
function getBackgroundColor(type: string): string {
  return BACKGROUND_COLORS[type as keyof typeof BACKGROUND_COLORS] || BACKGROUND_COLORS.default
}

// 作品データを取得
async function getWorkData(workId: string): Promise<{ work: WorkData | null; author: AuthorData | null }> {
  try {
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
        updated_at,
        user_id
      `)
      .eq('id', workId)
      .single()

    if (workError || !work) {
      console.error('作品データ取得エラー:', workError)
      return { work: null, author: null }
    }

    // 作者情報を取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_image_url')
      .eq('user_id', work.user_id)
      .single()

    return { 
      work, 
      author: profile || { display_name: 'クリエイター' }
    }
  } catch (error) {
    console.error('データ取得エラー:', error)
    return { work: null, author: null }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workId: string }> }
) {
  try {
    const { workId } = await params
    
    // 作品データを取得
    const { work, author } = await getWorkData(workId)

    if (!work) {
      return generateErrorImage('作品が見つかりません')
    }

    // データのサニタイズ
    const title = sanitizeOGPInput(work.title, 100, OGP_CONFIG.defaultTitle)
    const description = sanitizeOGPInput(work.description, 200, OGP_CONFIG.defaultDescription)
    const authorName = sanitizeOGPInput(author?.display_name, 50, 'クリエイター')
    const tags = work.tags?.slice(0, 3) || []
    const roles = work.roles?.slice(0, 2) || []

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
              by {authorName}
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
              {FEATURE_ICONS.slice(0, 3).map((icon, index) => (
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
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${icon.color}, ${icon.color}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    }}
                  >
                    {icon.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
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
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'Content-Type': 'image/png',
        },
      }
    )
  } catch (error) {
    console.error('作品OGP画像生成エラー:', error)
    return generateErrorImage('エラーが発生しました')
  }
}

// エラー画像を生成
function generateErrorImage(message: string) {
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
        balubo - {message}
      </div>
    ),
    {
      width: OGP_CONFIG.width,
      height: OGP_CONFIG.height,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Content-Type': 'image/png',
      },
    }
  )
} 