import { NextRequest, NextResponse } from 'next/server'

const LINKPREVIEW_API_KEY = process.env.LINKPREVIEW_API_KEY

if (!LINKPREVIEW_API_KEY) {
  throw new Error('LINKPREVIEW_API_KEY is not set in environment variables')
}

const LINKPREVIEW_API_URL = 'https://api.linkpreview.net'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URLが指定されていません' },
        { status: 400 }
      )
    }

    // URLの形式を検証
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: '無効なURL形式です' },
        { status: 400 }
      )
    }

    const response = await fetch(`${LINKPREVIEW_API_URL}/?q=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'X-Linkpreview-Api-Key': LINKPREVIEW_API_KEY as string,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('LinkPreview API エラー:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'プレビューの取得に失敗しました' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Link preview error:', error)
    return NextResponse.json(
      { error: 'プレビューの取得中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 