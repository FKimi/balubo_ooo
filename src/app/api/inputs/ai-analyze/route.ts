import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface InputAIAnalysis {
  // 基本分析（作家名を含む）
  summary: string                   // 簡易要約を追加
  suggestedTags: string[]        // 作家名を含むタグ
  suggestedGenres: string[]
  targetAudience: string[]
  appealPoints: string[]
  
  // パーソナリティ分析
  personalityTraits: string[]
  interestCategories: string[]
  mood: string
  themes: string[]
  
  // 詳細分析
  difficulty: string
  timeCommitment: string
  socialElements: string[]
  creativeInfluence: string[]
  
  // 拡張機能（オプショナル - 後方互換性のため）
  creativeInsights?: {
    inspirationSources: string[]
    skillDevelopment: string[]
    creativeDirection: string[]
    collaborationOpportunities: string[]
  }
  
  interestProfile?: {
    primaryInterests: string[]
    secondaryInterests: string[]
    emergingInterests: string[]
    creativeStyle: string
    preferredMediums: string[]
  }
  
  tagClassification?: {
    creator: string[]
    genre: string[]
    mood: string[]
    theme: string[]
    technique: string[]
    audience: string[]
    medium: string[]
  }
  
  creatorAnalysis?: {
    primaryCreator: string[]
    similarCreators: string[]
    influentialCreators: string[]
    collaborationSuggestions: string[]
  }
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

    // 強化されたAI分析を実行（強化機能は一時的に無効化）
    console.log('⚠️ 強化AI分析は一時的に無効化されています - 基本分析を実行します')
    // TODO: 無限ループ問題解決後に有効化
    /*
    try {
      const enhancedAnalysis = await AIAnalysisEnhancer.performIntegratedAnalysis(
        inputData, 
        inputData.enhancedData
      )
      
      return NextResponse.json({
        success: true,
        analysis: enhancedAnalysis,
        enhancedData: {
          confidenceScore: enhancedAnalysis.confidenceScore,
          analysisSource: enhancedAnalysis.analysisSource,
          accuracy: 'enhanced'
        }
      })

    } catch (enhancedError) {
      console.warn('⚠️ 強化AI分析失敗、基本分析に切り替え:', enhancedError)
    }
    */

    // 超高精度クリエイター向けAI分析プロンプト（作家名重視版）
    const analysisPrompt = `
あなたは、クリエイター向けポートフォリオサービス「balubo」専属の超高性能なAIコンテンツアナリストです。

【分析対象】
タイトル: ${inputData.title}
タイプ: ${inputData.type || '不明'}
説明: ${inputData.description || ''}

【🎯 最重要指示：コンテンツ分析に集中すること】
- タイトルと説明から推測される関連要素を重視してください
- 類似作品・類似ジャンルを推測してタグに含めてください
- コンテンツの性質を表すタグを最初の方に配置してください

【分析要求】
以下のJSON形式で回答してください。余計な説明文は一切含めないでください。

1. **summary**: 作品の簡易要約（2-3行の文章で内容と魅力を要約）

2. **suggestedTags**: コンテンツ特性を表すタグ（8-12個）
   - コンテンツの性質を表すタグを最初の数個に含める
   - 類似作品・ジャンルも含める
   - テーマや特徴を表すタグも含める

3. **suggestedGenres**: 詳細なジャンル分類（3-6個）

4. **targetAudience**: ターゲット層（3-5個）

5. **appealPoints**: 魅力ポイント（3-6個）

6. **personalityTraits**: 性格特徴（3-6個）

7. **interestCategories**: 興味カテゴリ（3-6個）

8. **mood**: 作品の雰囲気（1つの文章）

9. **themes**: 主要テーマ（3-6個）

10. **difficulty**: 難易度（1つの文章）

11. **timeCommitment**: 時間投資（1つの文章）

12. **socialElements**: 社交性（1-3個）

13. **creativeInfluence**: 創作への影響（1-3個）

【回答例】
{
  "summary": "伝統芸能である歌舞伎の世界を舞台に、青年の成長と複雑な人間関係を丁寧に描いた現代小説。師弟関係や友情、葛藤を通じて人間の内面を深く掘り下げた作品",
  "suggestedTags": ["芸道小説", "青春", "歌舞伎", "伝統芸能", "人間ドラマ", "師弟関係", "成長物語", "葛藤", "友情", "現代文学", "日本文学", "青春小説"],
  "suggestedGenres": ["現代小説", "青春小説", "人間ドラマ", "芸道小説"],
  "targetAudience": ["20～40代", "小説愛好家", "現代文学ファン", "人間ドラマ好き"],
  "appealPoints": ["複雑な人間関係の描写", "伝統芸能の世界観", "登場人物の成長過程", "社会問題への洞察"],
  "personalityTraits": ["繊細", "共感力が高い", "洞察力がある", "思慮深い"],
  "interestCategories": ["現代文学", "社会問題", "人間関係", "伝統文化"],
  "mood": "切なくも希望に満ちた青春の輝きと、複雑な人間関係の緊張感",
  "themes": ["成長", "葛藤", "師弟関係", "芸術への献身"],
  "difficulty": "中級者向け - 深い人間描写を理解できる読解力が必要",
  "timeCommitment": "中程度 - じっくりと味わって読むのに適している",
  "socialElements": ["読書会での議論", "文学サークル"],
  "creativeInfluence": ["人間描写技法", "対比構造の活用", "心理描写の深化"]
}

必ずこの形式のJSONで回答してください。コンテンツの特徴を表すタグを最初に含めてください。
`;

    console.log('Gemini APIを呼び出し中...')

    try {
      // Gemini Pro モデルを使用
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      const result = await model.generateContent(analysisPrompt)
      const response = await result.response
      const aiResponse = response.text()

      if (!aiResponse) {
        throw new Error('AI分析の結果が空です')
      }

      console.log('AI分析レスポンス:', aiResponse.substring(0, 500) + '...')

      // JSON形式の回答を抽出
      let analysis: InputAIAnalysis
      try {
        // ```json ``` で囲まれている場合の処理
        const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                         aiResponse.match(/```\s*([\s\S]*?)\s*```/) ||
                         aiResponse.match(/\{[\s\S]*\}/)
        
        const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiResponse
        analysis = JSON.parse(jsonContent.trim())
        
        console.log('AI分析完了 - タグ数:', analysis.suggestedTags?.length || 0)
        
      } catch (parseError) {
        console.error('JSON解析エラー:', parseError)
        console.log('生のレスポンス（最初の1000文字）:', aiResponse.substring(0, 1000))
        
        // JSONパースに失敗した場合の強化されたフォールバック
        analysis = {
          summary: `${inputData.title || 'このコンテンツ'}は興味深い内容を持つ作品です。${inputData.type || 'エンターテインメント'}として、多くの読者に愛される魅力的な内容となっています。`,
          suggestedTags: ['コンテンツ', 'AI分析', 'エンターテインメント', 'メディア', inputData.type || 'その他'],
          suggestedGenres: ['その他', 'エンターテインメント'],
          targetAudience: ['一般', 'コンテンツ愛好者'],
          appealPoints: ['ユニークなコンテンツ', '興味深い題材'],
          personalityTraits: ['好奇心旺盛', 'オープンマインド'],
          interestCategories: ['エンターテインメント', 'メディア'],
          mood: '興味深い',
          themes: ['エンターテインメント', '文化'],
          difficulty: '初心者向け',
          timeCommitment: '中程度',
          socialElements: ['個人で楽しむ'],
          creativeInfluence: ['インスピレーション'],
          creativeInsights: {
            inspirationSources: ['多様な表現', '新しい視点'],
            skillDevelopment: ['観察力', '分析力'],
            creativeDirection: ['多様性のある表現'],
            collaborationOpportunities: ['他分野のクリエイター']
          },
          interestProfile: {
            primaryInterests: ['エンターテインメント'],
            secondaryInterests: ['文化'],
            emergingInterests: ['新しいメディア'],
            creativeStyle: '多様性重視',
            preferredMediums: ['デジタル']
          },
          tagClassification: {
            creator: ['コンテンツクリエイター'],
            genre: [inputData.type || 'エンターテインメント'],
            mood: ['興味深い'],
            theme: ['文化'],
            technique: ['観察'],
            audience: ['一般'],
            medium: ['デジタル']
          },
          creatorAnalysis: {
            primaryCreator: ['コンテンツクリエイター'],
            similarCreators: ['類似クリエイター'],
            influentialCreators: ['影響を受けたクリエイター'],
            collaborationSuggestions: ['他分野のクリエイター']
          }
        }
      }

      return NextResponse.json({
        success: true,
        analysis,
        // デバッグ情報は本番では削除推奨
        debug: {
          hasRawResponse: !!aiResponse,
          responseLength: aiResponse?.length || 0,
          tagsGenerated: analysis.suggestedTags?.length || 0
        }
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