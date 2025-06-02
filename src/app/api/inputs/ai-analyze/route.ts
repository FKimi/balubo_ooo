import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface InputAIAnalysis {
  suggestedTags: string[]
  suggestedGenres: string[]
  targetAudience: string[]
  appealPoints: string[]
  personalityTraits: string[]
  interestCategories: string[]
  mood: string
  themes: string[]
  difficulty: string
  timeCommitment: string
  socialElements: string[]
  creativeInfluence: string[]
}

export async function POST(request: NextRequest) {
  try {
    console.log('インプットAI分析APIが呼び出されました')

    // API キーの確認
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY が設定されていません')
      return NextResponse.json({ 
        error: 'Gemini APIキーが設定されていません',
        details: 'GEMINI_API_KEYを環境変数に設定してください'
      }, { status: 500 })
    }

    const { inputData } = await request.json()

    if (!inputData || !inputData.title) {
      return NextResponse.json({ error: 'インプットデータが必要です' }, { status: 400 })
    }

    console.log('AI分析対象:', inputData.title)

    // AI分析プロンプトの構築
    const analysisPrompt = `
以下のコンテンツを分析して、JSON形式で回答してください：

タイトル: ${inputData.title}
タイプ: ${inputData.type || '不明'}
作者/制作者: ${inputData.authorCreator || '不明'}
カテゴリ: ${inputData.category || '不明'}
説明: ${inputData.description || ''}
既存タグ: ${inputData.tags?.join(', ') || 'なし'}
既存ジャンル: ${inputData.genres?.join(', ') || 'なし'}

以下の項目を分析してください：

1. suggestedTags: このコンテンツに適した追加タグ（5-8個）
2. suggestedGenres: ジャンル分類（3-5個）
3. targetAudience: 主要なターゲット層（年代、性別、趣味など）
4. appealPoints: このコンテンツの魅力ポイント（3-5個）
5. personalityTraits: このコンテンツを好む人の性格特徴（3-5個）
6. interestCategories: このコンテンツを好む人が他に興味を持ちそうなカテゴリ（3-5個）
7. mood: 作品の雰囲気（例：明るい、ダーク、癒し系、緊張感ある）
8. themes: 主要なテーマ（3-5個）
9. difficulty: 理解や習得の難易度（初心者向け、中級者向け、上級者向け）
10. timeCommitment: 所要時間の目安（短時間、中程度、長時間）
11. socialElements: 社交的要素（一人で楽しむ、友達と、家族と、コミュニティ）
12. creativeInfluence: クリエイティブ活動への影響（インスピレーション、スキル向上、表現手法）

必ずJSONフォーマットで回答してください。日本語で実用的で具体的な分析をしてください。

回答例：
{
  "suggestedTags": ["冒険", "友情", "成長"],
  "suggestedGenres": ["ファンタジー", "アドベンチャー"],
  "targetAudience": ["10代", "20代", "ファンタジー好き"],
  "appealPoints": ["壮大な世界観", "魅力的なキャラクター"],
  "personalityTraits": ["想像力豊か", "冒険好き"],
  "interestCategories": ["ゲーム", "アニメ"],
  "mood": "冒険的",
  "themes": ["友情", "成長"],
  "difficulty": "初心者向け",
  "timeCommitment": "中程度",
  "socialElements": ["友達と"],
  "creativeInfluence": ["インスピレーション"]
}
`;

    console.log('Gemini APIを呼び出し中...')

    try {
      // Gemini Pro モデルを使用
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      
      const result = await model.generateContent(analysisPrompt)
      const response = await result.response
      const aiResponse = response.text()

      if (!aiResponse) {
        throw new Error('AI分析の結果が空です')
      }

      console.log('AI分析レスポンス:', aiResponse)

      // JSON形式の回答を抽出
      let analysis: InputAIAnalysis
      try {
        // ```json ``` で囲まれている場合の処理
        const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                         aiResponse.match(/```\s*([\s\S]*?)\s*```/) ||
                         aiResponse.match(/\{[\s\S]*\}/)
        
        const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiResponse
        analysis = JSON.parse(jsonContent.trim())
      } catch (parseError) {
        console.error('JSON解析エラー:', parseError)
        console.log('生のレスポンス:', aiResponse)
        
        // JSONパースに失敗した場合のフォールバック
        analysis = {
          suggestedTags: ['AI分析', 'エンターテインメント'],
          suggestedGenres: ['その他'],
          targetAudience: ['一般'],
          appealPoints: ['ユニークなコンテンツ'],
          personalityTraits: ['好奇心旺盛'],
          interestCategories: ['エンターテインメント'],
          mood: '不明',
          themes: ['不明'],
          difficulty: '不明',
          timeCommitment: '不明',
          socialElements: ['個人'],
          creativeInfluence: ['インスピレーション']
        }
      }

      console.log('AI分析完了:', analysis)

      return NextResponse.json({
        success: true,
        analysis,
        rawResponse: aiResponse
      })

    } catch (geminiError) {
      console.error('Gemini API エラー:', geminiError)
      throw new Error(`Gemini API呼び出しエラー: ${geminiError instanceof Error ? geminiError.message : 'Unknown error'}`)
    }

  } catch (error) {
    console.error('AI分析エラー:', error)
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json({ 
        error: 'Gemini APIキーが設定されていません',
        details: 'GEMINI_API_KEYを環境変数に設定してください'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      error: 'AI分析に失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 