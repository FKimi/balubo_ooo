// インプット分析精度向上ライブラリ
import { InputData } from '@/types/input'

interface ExternalAPIData {
  isbn?: string
  tmdbId?: string
  spotifyId?: string
  steamId?: string
}

interface EnhancedAnalysisResult {
  accuracy: number
  confidence: number
  externalDataSources: string[]
  enhancedTags: string[]
  similarWorks: Array<{
    title: string
    similarity: number
    reason: string
  }>
  genreConfidence: Record<string, number>
  audienceAnalysis: {
    primaryAge: string
    interests: string[]
    personality: string[]
  }
}

export class InputAnalysisEnhancer {
  
  /**
   * 外部APIからの詳細データ取得
   */
  static async fetchBookDetails(title: string, author?: string): Promise<any> {
    try {
      // Google Books API（環境変数から取得）
      const apiKey = process.env.GOOGLE_BOOKS_API_KEY
      if (!apiKey) {
        console.log('Google Books API キーが設定されていません')
        return null
      }
      
      console.log('Google Books API キー確認:', !!apiKey)
      console.log('Google Books API キー（最初の10文字）:', apiKey.substring(0, 10))
      
      const query = author ? `${title} inauthor:${author}` : title
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&key=${apiKey}`
      
      console.log('Google Books API 呼び出し:', { title, author, query })
      console.log('Google Books API URL:', apiKey ? url.replace(apiKey, 'API_KEY_HIDDEN') : url)
      
      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        if (data.items && data.items.length > 0) {
          const book = data.items[0].volumeInfo
          return {
            title: book.title,
            authors: book.authors || [],
            categories: book.categories || [],
            description: book.description || '',
            pageCount: book.pageCount,
            publishedDate: book.publishedDate,
            averageRating: book.averageRating,
            ratingsCount: book.ratingsCount,
            isbn: book.industryIdentifiers?.find((id: any) => 
              id.type === 'ISBN_13' || id.type === 'ISBN_10'
            )?.identifier,
            language: book.language,
            previewLink: book.previewLink
          }
        }
      }
    } catch (error) {
      console.error('Google Books API エラー:', error)
    }
    return null
  }

  /**
   * 映画・TV番組の詳細データ取得
   */
  static async fetchMovieDetails(title: string, year?: string): Promise<any> {
    try {
      // TMDb API (要APIキー設定)
      const apiKey = process.env.TMDB_API_KEY
      if (!apiKey) return null

      const query = year ? `${title} ${year}` : title
      const searchResponse = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
      )
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        if (searchData.results && searchData.results.length > 0) {
          const movie = searchData.results[0]
          
          // 詳細情報を取得
          const detailResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=keywords,similar,credits`
          )
          
          if (detailResponse.ok) {
            const details = await detailResponse.json()
            return {
              title: details.title,
              overview: details.overview,
              genres: details.genres.map((g: any) => g.name),
              releaseDate: details.release_date,
              runtime: details.runtime,
              voteAverage: details.vote_average,
              voteCount: details.vote_count,
              keywords: details.keywords?.keywords?.map((k: any) => k.name) || [],
              similar: details.similar?.results?.slice(0, 5).map((s: any) => s.title) || [],
              director: details.credits?.crew?.find((c: any) => c.job === 'Director')?.name,
              cast: details.credits?.cast?.slice(0, 5).map((c: any) => c.name) || []
            }
          }
        }
      }
    } catch (error) {
      console.error('TMDb API エラー:', error)
    }
    return null
  }

  /**
   * AI分析と外部データを統合した高精度分析
   */
  static async enhanceInputAnalysis(
    input: InputData, 
    aiAnalysis: any, 
    externalData?: any
  ): Promise<EnhancedAnalysisResult> {
    
    let accuracy = 0.7 // 基本精度
    let confidence = 0.6
    const externalDataSources: string[] = []
    let enhancedTags: string[] = [...(input.tags || [])]
    
    // 外部データがある場合の精度向上
    if (externalData) {
      accuracy += 0.2
      confidence += 0.3
      
      // 書籍データの活用
      if (externalData.categories) {
        enhancedTags.push(...externalData.categories)
        externalDataSources.push('Google Books')
      }
      
      // 映画データの活用
      if (externalData.genres) {
        enhancedTags.push(...externalData.genres)
        externalDataSources.push('TMDb')
      }
      
      if (externalData.keywords) {
        enhancedTags.push(...externalData.keywords.slice(0, 10))
      }
    }

    // AI分析データの統合
    if (aiAnalysis) {
      if (aiAnalysis.suggestedTags) {
        enhancedTags.push(...aiAnalysis.suggestedTags)
        accuracy += 0.1
      }
    }

    // 重複除去と優先度付け
    enhancedTags = [...new Set(enhancedTags)]
      .filter(tag => tag && tag.length > 1 && tag.length < 20)
      .slice(0, 20)

    // ジャンル信頼度計算
    const genreConfidence: Record<string, number> = {}
    if (input.genres) {
      input.genres.forEach(genre => {
        genreConfidence[genre] = 0.8 // 基本信頼度
        
        // 外部データで確認された場合は信頼度向上
        if (externalData?.genres?.includes(genre) || 
            externalData?.categories?.includes(genre)) {
          genreConfidence[genre] = 0.95
        }
      })
    }

    // 類似作品の推薦
    const similarWorks = externalData?.similar?.map((title: string) => ({
      title,
      similarity: 0.8,
      reason: '同じジャンル・テーマ'
    })) || []

    // オーディエンス分析
    const audienceAnalysis = {
      primaryAge: this.inferAgeGroup(input, externalData),
      interests: this.inferInterests(input, aiAnalysis, externalData),
      personality: aiAnalysis?.personalityTraits || []
    }

    return {
      accuracy: Math.min(accuracy, 1.0),
      confidence: Math.min(confidence, 1.0),
      externalDataSources,
      enhancedTags,
      similarWorks,
      genreConfidence,
      audienceAnalysis
    }
  }

  /**
   * 年齢層の推定
   */
  private static inferAgeGroup(input: InputData, externalData?: any): string {
    const title = input.title.toLowerCase()
    const genres = input.genres?.join(' ').toLowerCase() || ''
    
    // 子供向けコンテンツの判定
    if (genres.includes('児童') || genres.includes('子ども') || 
        title.includes('アンパンマン') || title.includes('ドラえもん')) {
      return '3-8歳'
    }
    
    // 青少年向けの判定
    if (input.type === 'manga' && (genres.includes('少年') || genres.includes('少女'))) {
      return '10-18歳'
    }
    
    // 外部データからの推定
    if (externalData?.categories) {
      const categories = externalData.categories.join(' ').toLowerCase()
      if (categories.includes('young adult')) return '15-25歳'
      if (categories.includes('children')) return '5-12歳'
    }
    
    return '18-40歳' // デフォルト
  }

  /**
   * 興味分野の推定
   */
  private static inferInterests(input: InputData, aiAnalysis?: any, externalData?: any): string[] {
    const interests = new Set<string>()
    
    // タグから興味を推定
    input.tags?.forEach(tag => {
      if (tag.includes('SF') || tag.includes('科学')) interests.add('科学技術')
      if (tag.includes('恋愛') || tag.includes('ロマンス')) interests.add('恋愛')
      if (tag.includes('歴史') || tag.includes('時代')) interests.add('歴史')
      if (tag.includes('料理') || tag.includes('グルメ')) interests.add('料理・グルメ')
      if (tag.includes('スポーツ') || tag.includes('運動')) interests.add('スポーツ')
    })
    
    // AI分析からの興味推定
    if (aiAnalysis?.interestCategories && Array.isArray(aiAnalysis.interestCategories)) {
      aiAnalysis.interestCategories.forEach((category: string) => interests.add(category))
    }
    
    return Array.from(interests).slice(0, 8)
  }

  /**
   * 関連コンテンツの推薦アルゴリズム
   */
  static async generateRecommendations(
    userInputs: InputData[], 
    currentInput: InputData
  ): Promise<Array<{ title: string; score: number; reason: string }>> {
    // ユーザーの好みパターン分析
    const userPreferences = this.analyzeUserPreferences(userInputs)
    
    // 現在のインプットとの類似度計算
    const recommendations: Array<{ title: string; score: number; reason: string }> = []
    
    // 同じジャンルの高評価作品
    const similarGenreInputs = userInputs.filter(input => 
      input.genres?.some(genre => currentInput.genres?.includes(genre)) &&
      input.rating && input.rating >= 4
    )
    
    similarGenreInputs.forEach(input => {
      recommendations.push({
        title: input.title,
        score: 0.8,
        reason: '同じジャンルの高評価作品'
      })
    })
    
    return recommendations.slice(0, 10)
  }

  /**
   * ユーザーの好みパターン分析
   */
  private static analyzeUserPreferences(inputs: InputData[]) {
    const preferences = {
      favoriteGenres: this.getMostFrequent(inputs.flatMap(i => i.genres || [])),
      averageRating: inputs.filter(i => i.rating).reduce((sum, i) => sum + (i.rating || 0), 0) / inputs.filter(i => i.rating).length,
      preferredTypes: this.getMostFrequent(inputs.map(i => i.type)),
      commonTags: this.getMostFrequent(inputs.flatMap(i => i.tags || []))
    }
    
    return preferences
  }

  /**
   * 最頻出要素の取得
   */
  private static getMostFrequent<T>(array: T[]): Array<{ item: T; count: number }> {
    const frequency: Record<string, number> = {}
    array.forEach(item => {
      const key = String(item)
      frequency[key] = (frequency[key] || 0) + 1
    })
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([item, count]) => ({ item: item as T, count }))
  }
}

/**
 * 使用例とインターフェース
 */
export interface AnalysisConfig {
  useExternalAPIs: boolean
  includeRecommendations: boolean
  confidenceThreshold: number
  maxTags: number
}

export const defaultAnalysisConfig: AnalysisConfig = {
  useExternalAPIs: true,
  includeRecommendations: true,
  confidenceThreshold: 0.7,
  maxTags: 15
} 