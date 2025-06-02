import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    console.log('Image proxy request for URL:', imageUrl)

    if (!imageUrl) {
      console.error('No image URL provided')
      return NextResponse.json(
        { error: '画像URLが指定されていません' },
        { status: 400 }
      )
    }

    // URLの妥当性をチェック
    try {
      new URL(imageUrl)
    } catch (error) {
      console.error('Invalid URL format:', imageUrl)
      return NextResponse.json(
        { error: '無効なURL形式です' },
        { status: 400 }
      )
    }

    console.log('Fetching image from:', imageUrl)

    // 外部画像を取得
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // タイムアウトを設定
      signal: AbortSignal.timeout(10000) // 10秒
    })

    console.log('Response status:', response.status, 'Content-Type:', response.headers.get('content-type'))

    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      throw new Error(`画像の取得に失敗しました: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
      console.error('Response is not an image:', contentType)
      throw new Error('レスポンスが画像ではありません')
    }

    const imageBuffer = await response.arrayBuffer()
    console.log('Image fetched successfully, size:', imageBuffer.byteLength, 'bytes')

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800', // 24時間キャッシュ、1週間stale
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('画像プロキシエラー:', error)
    
    // エラーの詳細をログに出力
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    return NextResponse.json(
      { 
        error: '画像の取得に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 