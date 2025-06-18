import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'
import { InputAnalysisEnhancer } from '@/lib/inputAnalysisEnhancer'

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
  // 強化された情報
  enhancedData?: {
    accuracy: number
    confidence: number
    externalSources: string[]
    isbn?: string
    pageCount?: number
    publishedDate?: string
    averageRating?: number
    ratingsCount?: number
    keywords?: string[]
    similarWorks?: string[]
    detailedGenres?: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URLが必要です' }, { status: 400 })
    }

    console.log('強化プレビュー取得開始:', url)

    // URLを正規化
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    // ステップ1: 基本的なOGP/スクレイピングデータを取得
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

    // サイト固有の情報抽出（既存のロジック）
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

    // 既存のサイト固有抽出ロジック
    if (normalizedUrl.includes('amazon.co.jp') || normalizedUrl.includes('amazon.com')) {
      previewData = extractAmazonData(document, previewData)
    } else if (normalizedUrl.includes('books.rakuten.co.jp')) {
      previewData = extractRakutenBooksData(document, previewData)
    } else if (normalizedUrl.includes('honto.jp')) {
      previewData = extractHontoData(document, previewData)
    } else if (normalizedUrl.includes('netflix.com')) {
      previewData = extractNetflixData(document, previewData)
    } else if (normalizedUrl.includes('store.steampowered.com')) {
      previewData = extractSteamData(document, previewData)
    }

    // ステップ2: 外部APIで情報を補完・強化（非同期で実行、失敗してもメイン処理は継続）
    let enhancedData = null
    try {
      enhancedData = await enhanceWithExternalAPIs(previewData)
    } catch (apiError) {
      console.warn('外部API強化でエラーが発生しましたが、メイン処理は継続します:', apiError)
    }

    // 強化されたデータをマージ
    if (enhancedData) {
      previewData = mergeEnhancedData(previewData, enhancedData)
    }

    console.log('強化プレビューデータ取得成功:', {
      title: previewData.title,
      hasEnhancedData: !!enhancedData,
      externalSources: previewData.enhancedData?.externalSources || [],
      accuracy: previewData.enhancedData?.accuracy || 0.7
    })

    return NextResponse.json({ 
      success: true, 
      previewData 
    })

  } catch (error) {
    console.error('強化プレビュー取得エラー:', error)
    return NextResponse.json({ 
      error: 'プレビューデータの取得に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * 外部APIで情報を補完・強化
 */
async function enhanceWithExternalAPIs(baseData: InputPreviewData) {
  const enhancements: any = {
    accuracy: 0.7,
    confidence: 0.6,
    externalSources: [],
    detailedGenres: [...baseData.genre],
    keywords: [...baseData.tags]
  }

  // 書籍の場合：Google Books APIで強化
  if (baseData.type === 'book' || baseData.category.includes('書籍') || baseData.category.includes('漫画')) {
    try {
      const bookDetails = await InputAnalysisEnhancer.fetchBookDetails(baseData.title, baseData.author)
      if (bookDetails) {
        enhancements.externalSources.push('Google Books')
        enhancements.accuracy += 0.2
        enhancements.confidence += 0.3
        
        // 詳細情報をマージ
        enhancements.isbn = bookDetails.isbn
        enhancements.pageCount = bookDetails.pageCount
        enhancements.publishedDate = bookDetails.publishedDate
        enhancements.averageRating = bookDetails.averageRating
        enhancements.ratingsCount = bookDetails.ratingsCount
        
        // ジャンル情報を強化
        if (bookDetails.categories && bookDetails.categories.length > 0) {
          enhancements.detailedGenres = [...new Set([...enhancements.detailedGenres, ...bookDetails.categories])]
        }
      }
    } catch (error) {
      console.warn('Google Books API エラー:', error)
    }
  }

  // 映画・TV番組の場合：TMDb APIで強化（APIキーがある場合のみ）
  if ((baseData.type === 'movie' || baseData.type === 'anime') && process.env.TMDB_API_KEY) {
    try {
      // リリース年を抽出
      const yearMatch = baseData.releaseDate?.match(/(\d{4})/)
      const year = yearMatch ? yearMatch[1] : undefined
      
      const movieDetails = await InputAnalysisEnhancer.fetchMovieDetails(baseData.title, year)
      if (movieDetails) {
        enhancements.externalSources.push('TMDb')
        enhancements.accuracy += 0.2
        enhancements.confidence += 0.25
        
        // 詳細情報をマージ
        enhancements.averageRating = movieDetails.voteAverage
        enhancements.ratingsCount = movieDetails.voteCount
        enhancements.keywords = [...enhancements.keywords, ...movieDetails.keywords.slice(0, 8)]
        enhancements.similarWorks = movieDetails.similar
        
        // ジャンル情報を強化
        if (movieDetails.genres && movieDetails.genres.length > 0) {
          enhancements.detailedGenres = [...new Set([...enhancements.detailedGenres, ...movieDetails.genres])]
        }
      }
    } catch (error) {
      console.warn('TMDb API エラー:', error)
    }
  }

  return enhancements
}

/**
 * 基本データと強化データをマージ
 */
function mergeEnhancedData(baseData: InputPreviewData, enhanced: any): InputPreviewData {
  return {
    ...baseData,
    // より詳細なジャンル情報で上書き
    genre: enhanced.detailedGenres.slice(0, 6),
    // 強化されたタグ情報で上書き
    tags: [...new Set([...baseData.tags, ...enhanced.keywords])].slice(0, 12),
    // 強化データを追加
    enhancedData: {
      accuracy: enhanced.accuracy,
      confidence: enhanced.confidence,
      externalSources: enhanced.externalSources,
      isbn: enhanced.isbn,
      pageCount: enhanced.pageCount,
      publishedDate: enhanced.publishedDate,
      averageRating: enhanced.averageRating,
      ratingsCount: enhanced.ratingsCount,
      keywords: enhanced.keywords,
      similarWorks: enhanced.similarWorks,
      detailedGenres: enhanced.detailedGenres
    }
  }
}

// 既存のデータ抽出関数（従来のまま）
function extractAmazonData(document: Document, data: InputPreviewData): InputPreviewData {
  const title = document.querySelector('#productTitle')?.textContent?.trim() || data.title
  const author = document.querySelector('.author .a-link-normal')?.textContent?.trim() || 
                document.querySelector('.author a')?.textContent?.trim() || ''
  
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

function extractNetflixData(document: Document, data: InputPreviewData): InputPreviewData {
  return {
    ...data,
    type: 'movie',
    category: 'ストリーミング動画',
    tags: ['Netflix', 'ストリーミング']
  }
}

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