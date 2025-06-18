import { GoogleGenerativeAI } from '@google/generative-ai'

interface InputData {
  title: string
  type: string
  category: string
  authorCreator: string
  description: string
  tags?: string[]
  genres?: string[]
  externalUrl?: string
  coverImageUrl?: string
  rating?: number
  enhancedData?: any
}

interface EnhancedAnalysisResult {
  suggestedTags: string[]
  detailedGenres: string[]
  targetAudience: string[]
  themes: string[]
  mood: string[]
  keyElements: string[]
  recommendations: string[]
  confidenceScore: number
  analysisSource: 'basic' | 'enhanced' | 'web-scraped'
}

export class AIAnalysisEnhancer {
  
  /**
   * 基本情報からの詳細推測分析
   */
  static async enhanceBasicAnalysis(inputData: InputData): Promise<EnhancedAnalysisResult> {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      // タイトルから詳細情報を推測するプロンプト
      const enhancedPrompt = `
以下の限られた情報から、詳細な分析を行ってください：

**基本情報:**
- タイトル: "${inputData.title}"
- ジャンル: "${inputData.type}"
- カテゴリ: "${inputData.category}"
- 作者: "${inputData.authorCreator}"
- 概要: "${inputData.description}"
- 既存タグ: ${inputData.tags?.join(', ') || 'なし'}

**分析要求:**
1. タイトルから推測される内容・テーマ（具体的に分析）
2. ジャンル特性に基づく典型的要素（詳細に展開）
3. 作者の過去作品傾向（知っている場合は具体的に）
4. 概要から読み取れる詳細要素（深く掘り下げ）
5. ライトノベル・マンガ・書籍の文化的背景
6. 読者コミュニティや評価傾向の推測

**回答形式（JSON）:**
{
  "suggestedTags": ["推測タグ1", "推測タグ2", ...], // 10個程度
  "detailedGenres": ["詳細ジャンル1", "詳細ジャンル2", ...], // 5個程度
  "targetAudience": ["対象読者層1", "対象読者層2", ...], // 3個程度
  "themes": ["テーマ1", "テーマ2", ...], // 5個程度
  "mood": ["雰囲気1", "雰囲気2", ...], // 3個程度
  "keyElements": ["重要要素1", "重要要素2", ...], // 5個程度
  "recommendations": ["類似作品1", "類似作品2", ...], // 3個程度
  "confidenceScore": 0.85 // 0-1の信頼度
}

**重要:** 
- 推測に基づく分析でも、合理的な根拠を持って提案してください
- タイトルの言語や文化的背景も考慮してください
- ジャンルの典型的特徴を活用してください
`

      const result = await model.generateContent(enhancedPrompt)
      const responseText = result.response.text()
      
      // JSONレスポンスをパース
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0])
        return {
          ...analysisResult,
          analysisSource: 'enhanced'
        }
      }
      
      // フォールバック: 基本分析
      return this.generateBasicAnalysis(inputData)
      
    } catch (error) {
      console.error('AI分析強化エラー:', error)
      return this.generateBasicAnalysis(inputData)
    }
  }

  /**
   * Web情報を活用した追加分析
   */
  static async analyzeWithWebContext(inputData: InputData): Promise<Partial<EnhancedAnalysisResult>> {
    try {
      // タイトルと作者でWeb検索風の情報収集
      const searchQueries = [
        `"${inputData.title}" ${inputData.authorCreator} レビュー`,
        `"${inputData.title}" 感想`,
        `${inputData.authorCreator} 作品 特徴`,
        `${inputData.category} ${inputData.type} おすすめ`
      ]

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const contextPrompt = `
以下の検索クエリが存在すると仮定して、一般的な知識から分析してください：

**検索クエリ例:**
${searchQueries.map(q => `- ${q}`).join('\n')}

**作品情報:**
- タイトル: "${inputData.title}"
- 作者: "${inputData.authorCreator}"
- カテゴリ: "${inputData.category}"

**分析観点:**
1. この作品が属するジャンルの典型的特徴
2. 作者の一般的な作風（知っている場合）
3. タイトルから推測される内容
4. 読者層の特徴

**JSON回答:**
{
  "webContextTags": ["コンテキストタグ1", "コンテキストタグ2", ...],
  "genreInsights": ["ジャンル洞察1", "ジャンル洞察2", ...],
  "authorStyle": ["作風特徴1", "作風特徴2", ...],
  "audienceProfile": ["読者特徴1", "読者特徴2", ...]
}
`

      const result = await model.generateContent(contextPrompt)
      const responseText = result.response.text()
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const webContext = JSON.parse(jsonMatch[0])
        return {
          suggestedTags: webContext.webContextTags || [],
          keyElements: webContext.genreInsights || [],
          targetAudience: webContext.audienceProfile || []
        }
      }
      
    } catch (error) {
      console.error('Web コンテキスト分析エラー:', error)
    }
    
    return {}
  }

  /**
   * 基本分析（フォールバック）
   */
  private static generateBasicAnalysis(inputData: InputData): EnhancedAnalysisResult {
    const basicTags: string[] = []
    const basicGenres: string[] = []
    
    // タイトルから推測
    const title = inputData.title.toLowerCase()
    if (title.includes('恋') || title.includes('愛')) {
      basicTags.push('恋愛', 'ロマンス')
      basicGenres.push('恋愛小説')
    }
    if (title.includes('青春')) {
      basicTags.push('青春', '成長')
      basicGenres.push('青春小説')
    }
    if (title.includes('学校') || title.includes('学園')) {
      basicTags.push('学園もの', '学生生活')
    }
    
    // カテゴリから推測
    switch (inputData.category) {
      case '書籍':
        basicGenres.push('文学', '小説')
        break
      case '漫画':
        basicGenres.push('コミック', 'マンガ')
        break
      case '映画':
        basicGenres.push('映画', 'シネマ')
        break
    }

    return {
      suggestedTags: [...new Set([...basicTags, ...inputData.tags || []])],
      detailedGenres: [...new Set([...basicGenres, ...inputData.genres || []])],
      targetAudience: ['一般読者'],
      themes: ['人間関係'],
      mood: ['感動的'],
      keyElements: ['ストーリー'],
      recommendations: [],
      confidenceScore: 0.6,
      analysisSource: 'basic'
    }
  }

  /**
   * 外部データと組み合わせた統合分析
   */
  static async performIntegratedAnalysis(
    inputData: InputData, 
    externalData?: any
  ): Promise<EnhancedAnalysisResult> {
    
    // 1. 基本強化分析
    const enhancedAnalysis = await this.enhanceBasicAnalysis(inputData)
    
    // 2. Web コンテキスト分析
    const webContext = await this.analyzeWithWebContext(inputData)
    
    // 3. 外部データがある場合は統合
    if (externalData) {
      // Google Books データの統合
      if (externalData.categories) {
        enhancedAnalysis.detailedGenres.push(...externalData.categories)
      }
      if (externalData.keywords) {
        enhancedAnalysis.suggestedTags.push(...externalData.keywords)
      }
      
      // 信頼度向上
      enhancedAnalysis.confidenceScore = Math.min(
        enhancedAnalysis.confidenceScore + 0.2, 
        1.0
      )
    }
    
    // 4. Web コンテキストの統合
    if (webContext.suggestedTags) {
      enhancedAnalysis.suggestedTags.push(...webContext.suggestedTags)
    }
    if (webContext.targetAudience) {
      enhancedAnalysis.targetAudience.push(...webContext.targetAudience)
    }
    if (webContext.keyElements) {
      enhancedAnalysis.keyElements.push(...webContext.keyElements)
    }
    
    // 5. 重複除去と最適化
    enhancedAnalysis.suggestedTags = [...new Set(enhancedAnalysis.suggestedTags)]
      .filter(tag => tag && tag.length > 1)
      .slice(0, 15)
    
    enhancedAnalysis.detailedGenres = [...new Set(enhancedAnalysis.detailedGenres)]
      .slice(0, 8)
    
    enhancedAnalysis.targetAudience = [...new Set(enhancedAnalysis.targetAudience)]
      .slice(0, 5)
      
    enhancedAnalysis.themes = [...new Set(enhancedAnalysis.themes)]
      .slice(0, 6)
      
    enhancedAnalysis.keyElements = [...new Set(enhancedAnalysis.keyElements)]
      .slice(0, 8)

    return enhancedAnalysis
  }
}

export default AIAnalysisEnhancer 