import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export async function POST(request: NextRequest) {
  try {
    const { description, title, url, fullContent } = await request.json()

    if (!description && !title && !url && !fullContent) {
      return NextResponse.json(
        { error: '分析する記事コンテンツが必要です' },
        { status: 400 }
      )
    }

    // 記事・ライティング専用の高精度分析プロンプト
    const articleAnalysisPrompt = `
あなたは経験豊富な編集者・ライティング専門家です。以下の記事作品を、編集・ライティングの観点から詳細に分析し、個別性の高い具体的なタグを10個以上生成してください。

記事タイトル: ${title || '未設定'}
記事URL: ${url || '未設定'}
記事説明・概要: ${description || '未設定'}
${fullContent ? `記事本文: ${fullContent.substring(0, 3000)}${fullContent.length > 3000 ? '...(本文が長いため一部省略)' : ''}` : ''}

## 詳細分析観点

### 1. コンテンツ分類の細分化
- 記事の具体的なジャンル（ビジネス記事、技術解説、インタビュー、レビュー、オピニオン、ニュース解説、ハウツー、ケーススタディなど）
- 業界・分野の特定（IT、マーケティング、デザイン、経営、エンタメ、教育、ヘルスケア、金融など）
- 記事の形式（対談、Q&A、調査報告、体験談、比較記事、予測記事、解説記事など）

### 2. 文体・トーンの具体的特定
- 文体の特徴（専門的、親しみやすい、フォーマル、カジュアル、説得的、中立的、感情的など）
- 読み手との距離感（敬語、である調、だ・である調、です・ます調、話し言葉風など）
- 表現技法（ストーリーテリング、データ重視、引用多用、比喩表現、具体例重視など）

### 3. 対象読者の詳細分析
- 読者の専門レベル（初心者向け、中級者向け、上級者向け、専門家向け）
- 年代・属性（20代ビジネスパーソン、経営者、学生、主婦、シニア層など）
- 関心領域（キャリア志向、学習意欲、トレンド志向、実用性重視など）

### 4. 記事の機能・目的の特定
- 情報提供型、課題解決型、エンターテインメント型、啓発型、販促型
- 意識変容、行動変容、知識習得、スキル向上、意思決定支援

### 5. 技術的特徴の分析
- 記事構成（PREP法、起承転結、問題提起型、結論先出し型など）
- 情報の提示方法（データ活用、事例紹介、専門家コメント、図表使用など）
- エンゲージメント技法（疑問投げかけ、読者参加型、感情喚起など）

## タグ生成指針

以下の6つのカテゴリから合計10-15個の具体的タグを生成してください：

### A. ジャンル・分野系（3-4個）
例：「テック系記事」「マーケティング解説」「スタートアップ情報」「UI/UXデザイン」「データ分析」「人事・採用」

### B. 文体・表現系（2-3個）
例：「親しみやすい文体」「データドリブン記事」「ストーリーテリング型」「専門用語解説重視」「図表豊富」

### C. 対象読者系（2-3個）
例：「ビジネスパーソン向け」「エンジニア向け」「マネージャー層向け」「初心者向け解説」「専門家向け」

### D. 記事形式系（2-3個）
例：「インタビュー記事」「ケーススタディ」「ハウツー記事」「調査レポート」「オピニオン記事」「比較記事」

### E. 機能・価値系（2-3個）
例：「課題解決型」「トレンド情報」「スキルアップ支援」「意思決定支援」「実用性重視」「啓発・気づき型」

### F. 技術・手法系（1-2個）
例：「PREP構成」「事例豊富」「専門家取材」「データ裏付け」「実体験ベース」

以下の形式でJSONレスポンスを返してください：

{
  "tags": [
    "具体的ジャンル1", "具体的ジャンル2", "具体的ジャンル3",
    "文体特徴1", "文体特徴2",
    "対象読者1", "対象読者2", "対象読者3",
    "記事形式1", "記事形式2",
    "機能価値1", "機能価値2",
    "技術手法1"
  ],
  "keywords": ["専門用語1", "技術要素1", "業界用語1", "手法名1", "ツール名1"],
  "category": "記事・ライティング",
  "summary": "記事の核心と特徴を端的に表現（50文字以内）",
  "detailedAnalysis": {
    "genreClassification": "記事の具体的ジャンルと業界分野",
    "writingStyleAnalysis": "文体・トーンの詳細な特徴分析",
    "targetReaderProfile": "想定読者の詳細プロフィール",
    "contentStructure": "記事構成と情報提示の手法",
    "uniqueValueProposition": "この記事独自の価値と差別化要素",
    "professionalAssessment": "編集者視点での品質評価"
  },
  "tagClassification": {
    "genre": ["ジャンル系タグ1", "ジャンル系タグ2", "ジャンル系タグ3"],
    "style": ["文体系タグ1", "文体系タグ2"],
    "audience": ["読者系タグ1", "読者系タグ2"],
    "format": ["形式系タグ1", "形式系タグ2"],
    "purpose": ["目的系タグ1", "目的系タグ2"],
    "technique": ["技法系タグ1"]
  },
  "strengths": {
    "creativity": [
      "独創的な視点や切り口の具体例",
      "魅力的な文章表現の特徴",
      "読者を引きつける構成の工夫"
    ],
    "expertise": [
      "深い取材力と情報収集能力の証拠",
      "専門知識の適切な活用方法",
      "正確で信頼性の高い情報提供",
      "高い編集・校正技術の表れ"
    ],
    "impact": [
      "読者の課題解決への具体的貢献",
      "新たな気づきや学びの提供内容",
      "感情に訴える説得力の要素",
      "行動変容を促すメッセージの効果"
    ]
  },
  "improvementSuggestions": [
    "より具体的で実践的な改善提案1",
    "読者エンゲージメント向上のための提案2",
    "専門性と読みやすさのバランス改善案3"
  ],
  "professionalInsights": {
    "editorialQuality": "編集品質の評価と特徴",
    "marketValue": "この記事の市場価値と競合優位性",
    "scalabilityPotential": "このスタイルの展開可能性"
  }
}

## 重要な注意事項：

1. **具体性の重視**: 「テクノロジー」ではなく「AI・機械学習解説」、「インタビュー記事」ではなく「CTO対談記事」など、より具体的なタグを生成
2. **個別性の確保**: その記事にしかない特徴的な要素を反映したタグを含める
3. **分析の深度**: 表面的な分析ではなく、編集者の視点での深い洞察を提供
4. **実用性**: クリエイターが自身の強みや方向性を理解できる具体的な分析
5. **タグ数**: 必ず10個以上、最大15個程度のタグを生成
6. **バランス**: 各カテゴリから適切にタグを配分し、偏りを避ける

日本語で回答し、JSONフォーマット以外の文字は含めないでください。
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
            text: articleAnalysisPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048, // 記事分析は詳細なので上限を増加
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API Error (Article Analysis):', response.status, errorData)
      
      return NextResponse.json(
        { 
          error: '記事AI分析に失敗しました',
          details: errorData.error || response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Geminiのレスポンスからテキストを抽出
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error('記事AI分析結果が取得できませんでした')
    }

    // JSONパースを試行
    let analysisResult
    try {
      // JSONの前後の不要な文字を除去
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim()
      analysisResult = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('JSON Parse Error (Article Analysis):', parseError)
      console.error('Generated Text:', generatedText)
      
      // パースに失敗した場合のフォールバック
      analysisResult = {
        tags: ['記事・ライティング', '編集', '文章作成'],
        keywords: ['ライティング技術', '編集技術', '文章構成'],
        category: '記事・ライティング',
        summary: '記事分析の解析に失敗しました',
        articleSpecificAnalysis: {
          writingStyle: '文章スタイルの分析に失敗しました',
          structureQuality: '構成分析に失敗しました',
          researchDepth: '取材深度の分析に失敗しました',
          readerValue: '読者価値の分析に失敗しました',
          editorialQuality: '編集品質の分析に失敗しました'
        },
        strengths: {
          creativity: ['独創的な記事作成'],
          expertise: ['専門的な編集技術'],
          impact: ['読者への価値提供']
        },
        improvementSuggestions: ['分析結果の取得に失敗したため、再度お試しください'],
        targetAudience: '分析失敗',
        uniqueValue: '分析失敗'
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      contentType: 'article',
      analysisType: 'specialized_article_analysis',
      rawResponse: generatedText // デバッグ用
    })

  } catch (error) {
    console.error('Article AI Analysis Error:', error)
    return NextResponse.json(
      { error: '記事AI分析中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 