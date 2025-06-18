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
  // 強化された情報（非破壊的追加）
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
    // BookWalker
    else if (normalizedUrl.includes('bookwalker.jp')) {
      previewData = extractBookWalkerData(document, previewData)
    }

    // 外部APIで情報を強化（非同期、失敗してもメイン処理継続）
    try {
      const enhancedData = await enhanceWithExternalAPIs(previewData)
      if (enhancedData) {
        previewData = mergeEnhancedData(previewData, enhancedData)
      }
    } catch (apiError) {
      console.warn('外部API強化でエラーが発生しましたが、メイン処理は継続します:', apiError)
    }

    console.log('プレビューデータ取得成功:', {
      title: previewData.title,
      author: previewData.author,
      type: previewData.type,
      category: previewData.category,
      hasEnhancedData: !!previewData.enhancedData,
      externalSources: previewData.enhancedData?.externalSources || []
    })

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

// BookWalker用データ抽出
function extractBookWalkerData(document: Document, data: InputPreviewData): InputPreviewData {
  console.log('🔍 BookWalker処理開始:', { originalTitle: data.title })
  
  // BookWalkerの場合、タイトルから作者情報を抽出
  const title = data.title || ''
  let author = ''
  
  // HTMLから作者情報を抽出を試行
  const authorSelectors = [
    '.author-name',
    '.book-author',
    '.creator-name',
    '[data-testid="author"]',
    '.product-author'
  ]
  
  for (const selector of authorSelectors) {
    const authorElement = document.querySelector(selector)
    if (authorElement?.textContent?.trim()) {
      author = authorElement.textContent.trim()
      console.log(`📖 HTMLから作者抽出成功 (${selector}):`, author)
      break
    }
  }
  
  // HTMLから抽出できない場合、タイトルから作者名を抽出
  if (!author) {
    const authorMatch = title.match(/著[：:]?\s*([^（）\s]+)/) || 
                       title.match(/作[：:]?\s*([^（）\s]+)/) ||
                       title.match(/([^（）]+)\s*著/) ||
                       title.match(/([^（）]+)\s*作/)
    
    if (authorMatch && authorMatch[1]) {
      author = authorMatch[1].trim()
      console.log('📝 タイトルから作者抽出:', author)
    }
  }
  
  // 特定の作品の場合、作者を推測（データベース的アプローチ）
  const knownWorks: Record<string, string> = {
    '国宝': '吉田修一',
    'パーク・ライフ': '吉田修一',
    '悪人': '吉田修一',
    '横道世之介': '吉田修一',
    'アヒルと鴨のコインロッカー': '伊坂幸太郎',
    'ゴールデンスランバー': '伊坂幸太郎',
    '重力ピエロ': '伊坂幸太郎'
  }
  
  if (!author) {
    for (const [workTitle, workAuthor] of Object.entries(knownWorks)) {
      if (title.includes(workTitle)) {
        author = workAuthor
        console.log(`🎯 既知作品から作者推測: ${workTitle} → ${workAuthor}`)
        break
      }
    }
  }
  
  // 最終的に作者が見つからない場合のフォールバック
  if (!author) {
    console.log('⚠️ 作者情報を抽出できませんでした')
    author = '' // 空文字列のまま
  }
  
  const result = {
    ...data,
    title: title,
    author: author,
    type: 'book',
    category: title.includes('文庫') ? '文庫本' : title.includes('マンガ') || title.includes('漫画') ? '漫画' : '書籍',
    tags: ['BookWalker', '電子書籍', ...(title.includes('文庫') ? ['文庫本'] : []), ...(title.includes('マンガ') || title.includes('漫画') ? ['漫画'] : [])]
  }
  
  console.log('📚 BookWalker処理完了:', {
    type: result.type,
    category: result.category,
    title: result.title,
    author: result.author,
    hasAuthor: !!result.author
  })
  
  return result
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
  console.log('📚 書籍データ確認:', { 
    type: baseData.type, 
    category: baseData.category, 
    title: baseData.title, 
    author: baseData.author 
  })
  
  // 環境変数確認
  const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY
  console.log('🔑 API Route環境変数確認:', {
    hasApiKey: !!googleBooksApiKey,
    apiKeyLength: googleBooksApiKey?.length,
    apiKeyStart: googleBooksApiKey?.substring(0, 10)
  })
  
  if (baseData.type === 'book' || baseData.category.includes('書籍') || baseData.category.includes('漫画')) {
    console.log('🔍 Google Books API呼び出し開始:', { title: baseData.title, author: baseData.author })
    try {
      const bookDetails = await InputAnalysisEnhancer.fetchBookDetails(baseData.title, baseData.author)
      console.log('📖 Google Books API結果:', !!bookDetails)
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