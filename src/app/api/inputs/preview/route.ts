import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

interface InputPreviewData {
  title: string
  description: string
  image: string
  author: string
  type: string
  category: string
  releaseDate: string
  genre: string[]
  tags: string[]
  rating?: number
  url: string
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 })
    }

    console.log('インプットプレビュー取得開始:', url)

    // URLを正規化
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    const response = await fetch(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // 基本的なメタデータを取得
    const title = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                  document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || 
                  document.querySelector('title')?.textContent || ''

    const description = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                       document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || 
                       document.querySelector('meta[name="description"]')?.getAttribute('content') || ''

    const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || 
                  document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || ''

    // サイト固有の情報抽出
    let previewData: InputPreviewData = {
      title: title.trim(),
      description: description.trim(),
      image: image,
      author: '',
      type: 'other',
      category: '',
      releaseDate: '',
      genre: [],
      tags: [],
      url: normalizedUrl
    }

    // Amazon
    if (normalizedUrl.includes('amazon.co.jp') || normalizedUrl.includes('amazon.com')) {
      previewData = extractAmazonData(document, previewData)
    }
    // Netflix
    else if (normalizedUrl.includes('netflix.com')) {
      previewData = extractNetflixData(document, previewData)
    }
    // YouTube
    else if (normalizedUrl.includes('youtube.com') || normalizedUrl.includes('youtu.be')) {
      previewData = extractYouTubeData(document, previewData)
    }
    // ニコニコ動画
    else if (normalizedUrl.includes('nicovideo.jp')) {
      previewData = extractNicoVideoData(document, previewData)
    }
    // Steam
    else if (normalizedUrl.includes('store.steampowered.com')) {
      previewData = extractSteamData(document, previewData)
    }
    // 楽天ブックス
    else if (normalizedUrl.includes('books.rakuten.co.jp')) {
      previewData = extractRakutenBooksData(document, previewData)
    }
    // honto
    else if (normalizedUrl.includes('honto.jp')) {
      previewData = extractHontoData(document, previewData)
    }
    // dアニメストア
    else if (normalizedUrl.includes('animestore.docomo.ne.jp')) {
      previewData = extractDAnimeData(document, previewData)
    }

    console.log('プレビューデータ取得成功:', previewData)

    return NextResponse.json({ 
      success: true, 
      previewData 
    })

  } catch (error) {
    console.error('プレビュー取得エラー:', error)
    return NextResponse.json({ 
      error: 'プレビューデータの取得に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Amazon用データ抽出
function extractAmazonData(document: Document, data: InputPreviewData): InputPreviewData {
  const title = document.querySelector('#productTitle')?.textContent?.trim() || data.title
  const author = document.querySelector('.author .a-link-normal')?.textContent?.trim() || 
                document.querySelector('.author a')?.textContent?.trim() || ''
  
  // カテゴリ判定
  let type = 'book'
  let category = '書籍'
  
  const breadcrumb = document.querySelector('#wayfinding-breadcrumbs_feature_div')?.textContent?.toLowerCase() || ''
  if (breadcrumb.includes('dvd') || breadcrumb.includes('blu-ray')) {
    type = 'movie'
    category = '映画・ドラマ'
  } else if (breadcrumb.includes('ゲーム')) {
    type = 'game'
    category = 'ゲーム'
  } else if (breadcrumb.includes('本') || breadcrumb.includes('kindle')) {
    type = 'book'
    category = title.includes('マンガ') || title.includes('漫画') ? '漫画' : '書籍'
  }

  return {
    ...data,
    title,
    author,
    type: type as any,
    category
  }
}

// Netflix用データ抽出
function extractNetflixData(document: Document, data: InputPreviewData): InputPreviewData {
  return {
    ...data,
    type: 'movie',
    category: 'ストリーミング動画',
    tags: ['Netflix', 'ストリーミング']
  }
}

// YouTube用データ抽出
function extractYouTubeData(document: Document, data: InputPreviewData): InputPreviewData {
  const channelName = document.querySelector('meta[name="twitter:data1"]')?.getAttribute('content') || ''
  
  return {
    ...data,
    author: channelName,
    type: 'other',
    category: 'YouTube動画',
    tags: ['YouTube', '動画']
  }
}

// ニコニコ動画用データ抽出
function extractNicoVideoData(document: Document, data: InputPreviewData): InputPreviewData {
  return {
    ...data,
    type: 'other',
    category: 'ニコニコ動画',
    tags: ['ニコニコ動画', '動画']
  }
}

// Steam用データ抽出
function extractSteamData(document: Document, data: InputPreviewData): InputPreviewData {
  const developer = document.querySelector('.dev_row .summary.column a')?.textContent?.trim() || ''
  const genreElements = document.querySelectorAll('.details_block a')
  const genre = Array.from(genreElements).map(el => el.textContent?.trim() || '').filter(Boolean)
  const releaseDate = document.querySelector('.release_date .date')?.textContent?.trim() || ''

  return {
    ...data,
    author: developer,
    type: 'game',
    category: 'PCゲーム',
    genre: genre.slice(0, 3),
    tags: ['Steam', 'PCゲーム', ...genre.slice(0, 2)],
    releaseDate
  }
}

// 楽天ブックス用データ抽出
function extractRakutenBooksData(document: Document, data: InputPreviewData): InputPreviewData {
  const author = document.querySelector('.author a')?.textContent?.trim() || ''
  
  return {
    ...data,
    author,
    type: 'book',
    category: '書籍',
    tags: ['楽天ブックス']
  }
}

// honto用データ抽出
function extractHontoData(document: Document, data: InputPreviewData): InputPreviewData {
  const author = document.querySelector('.storeProductAuthor a')?.textContent?.trim() || ''
  
  return {
    ...data,
    author,
    type: 'book',
    category: '書籍',
    tags: ['honto']
  }
}

// dアニメストア用データ抽出
function extractDAnimeData(document: Document, data: InputPreviewData): InputPreviewData {
  return {
    ...data,
    type: 'anime',
    category: 'アニメ',
    tags: ['dアニメストア', 'アニメ']
  }
} 