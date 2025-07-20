import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest, context: { params: { workId: string } }) {
  const { workId } = context.params

  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'AI Analysis'
  const summary = searchParams.get('summary') ?? 'あなたの強みが可視化されました'
  const tagsParam = searchParams.get('tags') ?? ''
  const tags = tagsParam.split(',').filter(Boolean).slice(0, 3)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg,#dbeafe,#f0f9ff)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, color: '#1d4ed8', marginBottom: 16 }}>
          {title}
        </div>
        <div style={{ fontSize: 28, color: '#1e3a8a', marginBottom: 24, maxWidth: 900, textAlign: 'center' }}>
          {summary}
        </div>
        <div style={{ fontSize: 24, color: '#4338ca' }}>
          {tags.map((tag) => `#${tag} `)}
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="https://balubo-ooo.vercel.app/og-image.svg" width="40" height="40" />
          <span style={{ fontSize: 24, color: '#1e40af' }}>balubo.app</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400',
        'Content-Type': 'image/png',
      },
    }
  )
} 