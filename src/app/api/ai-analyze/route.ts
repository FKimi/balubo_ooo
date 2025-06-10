import { NextRequest, NextResponse } from 'next/server'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// コンテンツタイプ別のプロンプト設定
// コンテンツタイプの型定義
const prompts = {
    article: {
      focus: '記事・ライティング',
      specificAnalysis: `
- 文章の専門性と読みやすさ
- 取材力や情報収集能力
- 記事の独自性と価値
- SEOや読者エンゲージメント
- ライティングスキルと表現力`,
      tags: '記事ジャンル、ライティングスタイル、対象読者層などのタグ',
      strengths: `
  * creativity: 独創的な視点、魅力的な文章表現、読者を引きつける構成など
  * expertise: 深い取材力、専門知識の活用、正確な情報提供、SEO対策など
  * impact: 読者への価値提供、社会的影響、エンゲージメント創出など`
    },
    design: {
      focus: 'デザイン',
      specificAnalysis: `
- デザインの美的センスと独創性
- ブランディングへの貢献
- ユーザビリティとアクセシビリティ
- トレンドの取り入れと独自性のバランス
- 技術的なデザインスキル`,
      tags: 'デザインスタイル、使用ツール、色彩、レイアウト手法などのタグ',
      strengths: `
  * creativity: 斬新なビジュアル表現、独創的なコンセプト、美的センスなど
  * expertise: デザインツールの習熟、ブランドガイドライン準拠、技術的完成度など
  * impact: ブランド価値向上、ユーザーエクスペリエンス改善、ビジネス成果など`
    },
    photo: {
      focus: '写真',
      specificAnalysis: `
- 撮影技術と構図センス
- 光の使い方と色彩表現
- 被写体への理解と表現力
- レタッチスキルと後処理技術
- ストーリーテリング能力`,
      tags: '撮影ジャンル、撮影技法、機材、レタッチ手法などのタグ',
      strengths: `
  * creativity: 独創的な視点、芸術的表現、感情を動かす構図など
  * expertise: 撮影技術の高さ、機材活用スキル、レタッチ技術など
  * impact: 視覚的インパクト、メッセージ伝達力、感情への働きかけなど`
    },
    video: {
      focus: '動画・映像',
      specificAnalysis: `
- 撮影・編集技術の高さ
- ストーリーテリングと構成力
- 音響・BGMの効果的な使用
- 視覚エフェクトと演出力
- ターゲット視聴者への訴求力`,
      tags: '動画ジャンル、撮影・編集手法、使用ソフト、演出技法などのタグ',
      strengths: `
  * creativity: 独創的な演出、感動的なストーリー、革新的な表現手法など
  * expertise: 撮影・編集技術、音響技術、ソフトウェア活用スキルなど
  * impact: 視聴者エンゲージメント、メッセージ伝達効果、ブランド価値向上など`
    },
    podcast: {
      focus: 'ポッドキャスト・音声コンテンツ',
      specificAnalysis: `
- 話術と声の魅力
- コンテンツ企画力と構成力
- 音響品質と編集技術
- リスナーとのエンゲージメント
- テーマ設定と継続性`,
      tags: '番組ジャンル、配信スタイル、収録環境、編集手法などのタグ',
      strengths: `
  * creativity: 独自の切り口、魅力的な話術、革新的な番組構成など
  * expertise: 音響技術、編集スキル、インタビュー技術、継続的な配信力など
  * impact: リスナーコミュニティ形成、知識・情報の価値提供、影響力の拡大など`
    },
         event: {
       focus: 'イベント',
       specificAnalysis: `
- イベント企画・コンセプトの独創性
- 運営・進行のスムーズさ
- 参加者エンゲージメントの創出
- 空間演出・会場デザイン
- 参加者満足度と成果`,
       tags: 'イベント種別、規模、テーマ、対象者などのタグ',
       strengths: `
  * creativity: 独創的な企画、革新的な演出、参加者体験の工夫など
  * expertise: 運営スキル、危機管理能力、チームマネジメント、予算管理など
  * impact: 参加者満足度、ネットワーキング効果、知識・価値の共有など`
     }
  }

// promptsのキーから型を生成
type ContentType = keyof typeof prompts

const getContentTypePrompt = (contentType: string) => {
  // contentTypeがpromptsのキーかどうかをチェック
  if (contentType in prompts) {
    return prompts[contentType as ContentType]
  }
  return prompts.event
}

export async function POST(request: NextRequest) {
  try {
    const { description, title, url, contentType } = await request.json()

    if (!description && !title && !url) {
      return NextResponse.json(
        { error: '分析するコンテンツが必要です' },
        { status: 400 }
      )
    }

    // コンテンツタイプ別のプロンプト設定を取得
    const contentConfig = getContentTypePrompt(contentType || 'other')

    // 分析用のプロンプトを作成
    const analysisPrompt = `
以下の${contentConfig.focus}作品を詳細に分析して、適切なタグとキーワードを抽出してください。

作品タイトル: ${title || '未設定'}
作品URL: ${url || '未設定'}
作品説明: ${description || '未設定'}
コンテンツタイプ: ${contentConfig.focus}

${contentConfig.focus}作品として特に以下の観点から分析してください：
${contentConfig.specificAnalysis}

以下の形式でJSONレスポンスを返してください：
{
  "tags": ["タグ1", "タグ2", "タグ3"],
  "keywords": ["キーワード1", "キーワード2", "キーワード3"],
  "category": "推奨カテゴリ",
  "summary": "作品の要約（50文字以内）",
  "contentTypeAnalysis": "${contentConfig.focus}作品としての特徴的な要素や評価ポイント",
  "strengths": {
    "creativity": ["創造性の観点での強み1", "創造性の観点での強み2"],
    "expertise": ["専門性の観点での強み1", "専門性の観点での強み2"],
    "impact": ["影響力の観点での強み1", "影響力の観点での強み2"]
  }
}

注意事項：
- タグは${contentConfig.tags}を中心に3-5個程度で選んでください
- キーワードは${contentConfig.focus}分野の技術的な要素や業界用語を含めてください
- カテゴリは「ウェブデザイン」「モバイルアプリ」「グラフィックデザイン」「記事・ライティング」「写真・映像」「その他」から選んでください
- contentTypeAnalysisでは${contentConfig.focus}作品としての特徴や評価ポイントを具体的に記述してください
- 強みは以下の3つの観点から${contentConfig.focus}作品として分析してください：${contentConfig.strengths}
- 各観点で1-3個の強みを挙げてください
- 日本語で回答してください
- JSONフォーマット以外の文字は含めないでください
`

    // Gemini APIを呼び出し
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: analysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API Error:', response.status, errorData)
      
      return NextResponse.json(
        { 
          error: 'AI分析に失敗しました',
          details: errorData.error || response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Geminiのレスポンスからテキストを抽出
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error('AI分析結果が取得できませんでした')
    }

    // JSONパースを試行
    let analysisResult
    try {
      // JSONの前後の不要な文字を除去
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim()
      analysisResult = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Generated Text:', generatedText)
      
      // パースに失敗した場合のフォールバック
      analysisResult = {
        tags: ['AI分析'],
        keywords: ['自動生成'],
        category: 'その他',
        summary: 'AI分析結果の解析に失敗しました',
        contentTypeAnalysis: `${contentConfig.focus}作品としての分析に失敗しました`,
        strengths: {
          creativity: ['ユニークな作品'],
          expertise: ['ユニークな作品'],
          impact: ['ユニークな作品']
        }
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      contentType: contentConfig.focus,
      rawResponse: generatedText // デバッグ用
    })

  } catch (error) {
    console.error('AI Analysis Error:', error)
    return NextResponse.json(
      { error: 'AI分析中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 