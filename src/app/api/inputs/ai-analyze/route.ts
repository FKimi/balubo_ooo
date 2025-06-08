import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface InputAIAnalysis {
  // 基本分析
  suggestedTags: string[]
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
  
  // 新機能: クリエイター向け洞察
  creativeInsights: {
    inspirationSources: string[]
    skillDevelopment: string[]
    creativeDirection: string[]
    collaborationOpportunities: string[]
  }
  
  // 新機能: 総合的な興味分析
  interestProfile: {
    primaryInterests: string[]
    secondaryInterests: string[]
    emergingInterests: string[]
    creativeStyle: string
    preferredMediums: string[]
  }
  
  // 新機能: タグの詳細分類
  tagClassification: {
    genre: string[]
    mood: string[]
    theme: string[]
    technique: string[]
    audience: string[]
    medium: string[]
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

    // 強化されたAI分析プロンプト
    const analysisPrompt = `
あなたはクリエイター向けのコンテンツ分析専門家です。以下のコンテンツを詳細に分析し、クリエイティブな洞察を提供してください。

【分析対象】
タイトル: ${inputData.title}
タイプ: ${inputData.type || '不明'}
作者/制作者: ${inputData.authorCreator || '不明'}
カテゴリ: ${inputData.category || '不明'}
説明: ${inputData.description || ''}
既存タグ: ${inputData.tags?.join(', ') || 'なし'}
既存ジャンル: ${inputData.genres?.join(', ') || 'なし'}

【分析要求】
ライター・クリエイター向けのポートフォリオサイトのユーザーが、自分の興味・関心・創作の傾向を理解できるよう、以下の詳細分析を行ってください：

1. **基本分析**
   - suggestedTags: 追加すべき具体的なタグ（8-12個、創作に役立つもの）
   - suggestedGenres: 詳細なジャンル分類（3-6個）
   - targetAudience: ターゲット層の詳細（年代、職業、趣味、ライフスタイル）
   - appealPoints: このコンテンツの魅力（創作者視点で3-6個）

2. **パーソナリティ分析**
   - personalityTraits: このコンテンツを好む人の性格特徴（3-6個）
   - interestCategories: 関連する興味カテゴリ（3-6個）
   - mood: 作品の雰囲気（具体的で感情的な表現）
   - themes: 主要テーマ（創作に活かせる抽象的概念3-6個）

3. **詳細分析**
   - difficulty: 理解・習得難易度
   - timeCommitment: 所要時間
   - socialElements: 社交性
   - creativeInfluence: 創作への影響

4. **クリエイター向け洞察**
   - creativeInsights.inspirationSources: インスピレーション源（3-5個）
   - creativeInsights.skillDevelopment: 向上できるスキル（3-5個）
   - creativeInsights.creativeDirection: 創作方向性のヒント（3-5個）
   - creativeInsights.collaborationOpportunities: コラボの可能性（3-5個）

5. **総合的な興味分析**
   - interestProfile.primaryInterests: 主要興味（3-4個）
   - interestProfile.secondaryInterests: 副次的興味（3-4個）
   - interestProfile.emergingInterests: 新興分野（2-3個）
   - interestProfile.creativeStyle: 創作スタイル（1つの具体的表現）
   - interestProfile.preferredMediums: 好みの媒体（3-5個）

6. **タグの詳細分類**
   - tagClassification.genre: ジャンル系タグ（2-4個）
   - tagClassification.mood: 雰囲気系タグ（2-4個）
   - tagClassification.theme: テーマ系タグ（2-4個）
   - tagClassification.technique: 技法系タグ（2-4個）
   - tagClassification.audience: 対象者系タグ（2-3個）
   - tagClassification.medium: 媒体系タグ（2-3個）

【重要】必ずJSON形式で回答し、クリエイターの成長と創作活動に実用的な洞察を提供してください。

回答例：
{
  "suggestedTags": ["心理サスペンス", "親子関係", "社会派", "現代ドラマ", "人間ドラマ", "Netflix", "ストリーミング", "韓国文化"],
  "suggestedGenres": ["サスペンス", "ヒューマンドラマ", "社会派ドラマ"],
  "targetAudience": ["20-40代", "親世代", "社会問題に関心ある人", "心理ドラマ好き"],
  "appealPoints": ["リアルな人間描写", "社会問題への鋭い視点", "緊迫感のある演出"],
  "personalityTraits": ["共感性が高い", "社会問題に敏感", "心理的洞察力"],
  "interestCategories": ["社会問題", "心理学", "ファミリードラマ", "ドキュメンタリー"],
  "mood": "緊張感のある現実的",
  "themes": ["家族の絆", "社会の偏見", "真実の追求", "母性愛"],
  "difficulty": "中級者向け",
  "timeCommitment": "中程度",
  "socialElements": ["家族と"],
  "creativeInfluence": ["社会派ストーリーテリング"],
  "creativeInsights": {
    "inspirationSources": ["実際の社会問題", "家族関係の複雑さ", "メディアの影響力"],
    "skillDevelopment": ["心理描写", "社会問題の取材", "緊張感のある展開"],
    "creativeDirection": ["リアリティのある人間ドラマ", "社会派作品", "心理サスペンス"],
    "collaborationOpportunities": ["ジャーナリスト", "社会活動家", "心理カウンセラー"]
  },
  "interestProfile": {
    "primaryInterests": ["人間ドラマ", "社会問題", "心理分析"],
    "secondaryInterests": ["ドキュメンタリー", "ニュース", "ファミリーコンテンツ"],
    "emergingInterests": ["調査報道", "社会派創作"],
    "creativeStyle": "リアリティ重視の社会派",
    "preferredMediums": ["映像", "ドラマ", "記事", "ドキュメンタリー"]
  },
  "tagClassification": {
    "genre": ["サスペンス", "ヒューマンドラマ"],
    "mood": ["緊張感", "現実的"],
    "theme": ["家族", "社会問題", "真実"],
    "technique": ["心理描写", "社会派演出"],
    "audience": ["大人向け", "親世代"],
    "medium": ["ストリーミング", "映像"]
  }
}
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
          suggestedTags: ['AI分析', 'エンターテインメント', 'コンテンツ', 'メディア'],
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
            genre: ['エンターテインメント'],
            mood: ['興味深い'],
            theme: ['文化'],
            technique: ['観察'],
            audience: ['一般'],
            medium: ['デジタル']
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