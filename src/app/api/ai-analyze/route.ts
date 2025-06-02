import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export async function POST(request: NextRequest) {
  try {
    const { description, title, url } = await request.json()

    if (!description && !title && !url) {
      return NextResponse.json(
        { error: '分析するコンテンツが必要です' },
        { status: 400 }
      )
    }

    // 分析用のプロンプトを作成
    const analysisPrompt = `
以下の作品情報を分析して、適切なタグとキーワードを抽出してください。

作品タイトル: ${title || '未設定'}
作品URL: ${url || '未設定'}
作品説明: ${description || '未設定'}

以下の形式でJSONレスポンスを返してください：
{
  "tags": ["タグ1", "タグ2", "タグ3"],
  "keywords": ["キーワード1", "キーワード2", "キーワード3"],
  "category": "推奨カテゴリ",
  "summary": "作品の要約（50文字以内）",
  "strengths": {
    "creativity": ["創造性の観点での強み1", "創造性の観点での強み2"],
    "expertise": ["専門性の観点での強み1", "専門性の観点での強み2"],
    "impact": ["影響力の観点での強み1", "影響力の観点での強み2"]
  }
}

注意事項：
- タグは3-5個程度で、作品の特徴を表すものを選んでください
- キーワードは技術的な要素や業界用語を含めてください
- カテゴリは「ウェブデザイン」「モバイルアプリ」「グラフィックデザイン」「記事・ライティング」「写真・映像」「その他」から選んでください
- 強みは以下の3つの観点から分析してください：
  * creativity（創造性）: 独創的なアイデア、革新的なアプローチ、クリエイティブな表現など
  * expertise（専門性）: 技術的な高度さ、専門知識の活用、業界標準への準拠など
  * impact（影響力）: ユーザーへの価値提供、社会的意義、ビジネスインパクトなど
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