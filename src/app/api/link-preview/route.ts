import { NextRequest, NextResponse } from 'next/server'

const LINKPREVIEW_API_KEY = '23c2c2d4e248bc250a0adf683ac26621'
const LINKPREVIEW_API_URL = 'https://api.linkpreview.net'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URLが必要です' },
        { status: 400 }
      )
    }

    // URLの形式をチェック
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: '有効なURLを入力してください' },
        { status: 400 }
      )
    }

    // LinkPreview APIを呼び出し
    const response = await fetch(LINKPREVIEW_API_URL, {
      method: 'POST',
      headers: {
        'X-Linkpreview-Api-Key': LINKPREVIEW_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: url,
        fields: 'image_x,image_y,image_size,image_type,icon,icon_x,icon_y,icon_size,icon_type,site_name,locale'
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('LinkPreview API Error:', response.status, errorData)
      
      return NextResponse.json(
        { 
          error: 'プレビューの取得に失敗しました',
          details: errorData.error || response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // レスポンスデータを整形
    const previewData = {
      title: data.title || '',
      description: data.description || '',
      image: data.image || '',
      url: data.url || url,
      imageWidth: data.image_x || 0,
      imageHeight: data.image_y || 0,
      imageSize: data.image_size || 0,
      imageType: data.image_type || '',
      icon: data.icon || '',
      iconWidth: data.icon_x || 0,
      iconHeight: data.icon_y || 0,
      iconSize: data.icon_size || 0,
      iconType: data.icon_type || '',
      siteName: data.site_name || '',
      locale: data.locale || ''
    }

    return NextResponse.json(previewData)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
} 