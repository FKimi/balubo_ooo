import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// スコアリング用の関数
async function getEvaluationScores(analysisResult: any) {
  const scoringPrompt = `
あなたは、与えられた記事分析レポートを評価し、スコアを算出するチーフアナリストです。
以下のJSON形式の分析レポートを読み解き、5つの評価項目について、それぞれ100点満点で採点してください。

## 分析レポート
${JSON.stringify(analysisResult)}

## 評価基準（100点満点の定義）

### 100点の基準例：NewsPicksの「【リクルート出木場】100倍の結果を出す、成長戦略3つのポイント」レベル
- 企業トップへの独占インタビュー
- 他では得られない一次情報と具体的事例
- 読者の記憶に残るユニークなフレーズ（「データ分析3原則」「n=3マーケティング」など）
- 明日から使える実践的な示唆
- 完璧な編集・構成品質

## 評価項目と詳細基準

### 1. **技術力 (Technology)** (100点満点)
- **90-100点**: プロフェッショナルレベルの編集品質、完璧な構成、誤字脱字なし、非常に読みやすい
- **80-89点**: 高い編集品質、良い構成、ほぼ完璧な校正
- **70-79点**: 標準的な品質、構成に工夫あり
- **60-69点**: 基本的な品質は満たしている
- **50-59点**: 改善の余地がある

### 2. **専門性 (Expertise)** (100点満点)
- **90-100点**: 極めて希少な一次情報、深い取材力、具体的事例豊富、業界トップレベルの情報源
- **80-89点**: 価値ある情報、しっかりした取材、専門知識活用
- **70-79点**: 専門的内容、適切な情報収集
- **60-69点**: 基本的な専門性
- **50-59点**: 改善が必要

### 3. **創造性 (Creativity)** (100点満点)
- **90-100点**: 極めてユニークな切り口、記憶に残るフレーズ、革新的な構成
- **80-89点**: 独自の視点、工夫された構成
- **70-79点**: 面白い切り口、読者を引きつける要素
- **60-69点**: 基本的な工夫
- **50-59点**: 改善が必要

### 4. **影響力 (Impact)** (100点満点)
- **90-100点**: 読者の思考・行動を大きく変える力、強い感情的インパクト、明確な課題解決
- **80-89点**: 読者に良い影響、具体的示唆
- **70-79点**: 参考になる内容、一定の影響
- **60-69点**: 基本的な価値提供
- **50-59点**: 改善が必要

### 5. **総合評価 (Overall)** (100点満点)
上記4項目を総合し、記事全体の完成度と市場価値を評価

## 重要な出力指針
- 評価理由では、特定のメディアやブランド名との比較表現は使用しない
- 「○○レベルの〜がないため」のような表現は避ける
- 「独占的な情報」「記憶に残るフレーズ」「実践的な示唆」など、一般的な品質要素で評価する
- 各記事の特性を活かした建設的で適切な評価理由を提供する

## 出力形式
以下のJSON形式で、スコアと評価の根拠を明確に示してください。
JSON以外のテキストは絶対に含めないでください。

{
  "scores": {
    "technology": { "score": 95, "reason": "分析レポート内の具体的な記述を根拠とした評価理由。構成、編集品質、読みやすさなどの技術的側面を評価。" },
    "expertise": { "score": 90, "reason": "分析レポート内の具体的な記述を根拠とした評価理由。情報の希少性、取材の深さ、専門知識の活用を評価。" },
    "creativity": { "score": 88, "reason": "分析レポート内の具体的な記述を根拠とした評価理由。独自の視点、革新的な表現、工夫された構成を評価。" },
    "impact": { "score": 85, "reason": "分析レポート内の具体的な記述を根拠とした評価理由。読者への影響力、実践的価値、課題解決力を評価。" },
    "overall": { "score": 90, "reason": "4項目を総合した評価理由。記事全体の完成度と市場価値を建設的に評価。" }
  }
}
`

  try {
    // Gemini APIを再度呼び出し（スコアリング用）
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: scoringPrompt }] }],
        generationConfig: {
          temperature: 0.3, // スコアリングなので安定性を重視
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      throw new Error('スコアリングAPIの呼び出しに失敗しました')
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!generatedText) {
      throw new Error('スコアリング結果が取得できませんでした')
    }

    const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error('スコアリングエラー:', error)
    // フォールバック: デフォルトスコア
    return {
      scores: {
        technology: { score: 70, reason: 'スコアリング処理でエラーが発生したため、デフォルト値を使用' },
        expertise: { score: 70, reason: 'スコアリング処理でエラーが発生したため、デフォルト値を使用' },
        creativity: { score: 70, reason: 'スコアリング処理でエラーが発生したため、デフォルト値を使用' },
        impact: { score: 70, reason: 'スコアリング処理でエラーが発生したため、デフォルト値を使用' },
        overall: { score: 70, reason: 'スコアリング処理でエラーが発生したため、デフォルト値を使用' }
      }
    }
  }
}

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

以下の2つのカテゴリから合計5-8個の具体的タグを生成してください：

### A. 専門分野・ジャンル系（3-5個）
記事の具体的な専門分野とコンテンツ形式を特定
例：「ビジネス記事」「技術解説」「インタビュー」「マーケティング」「デザイン」「データ分析」

### B. スキル・特徴系（2-3個）
ライターの技術的特徴や強みを表現
例：「取材力」「専門性」「構成力」「データ活用」「親しみやすい文体」

以下の形式でJSONレスポンスを返してください：

{
     "tags": [
     "専門分野1", "専門分野2", "コンテンツ形式1", "ジャンル1",
     "スキル特徴1", "スキル特徴2"
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
     "domain": ["専門分野系タグ1", "専門分野系タグ2", "ジャンル系タグ1"],
     "skill": ["スキル系タグ1", "スキル系タグ2"]
   },
  "strengths": {
    "technology": [
      "構成の巧みさ、情報の提示方法など、文章の技術的な長所の具体例",
      "編集・校正レベルの高さが伺える箇所の指摘"
    ],
    "expertise": [
      "深い取材力や正確な情報収集能力を示す具体例",
      "専門知識が効果的に活かされている箇所の指摘"
    ],
    "creativity": [
      "独創的な視点やユニークな切り口の具体例",
      "読者を引きつける構成や表現の工夫"
    ],
    "impact": [
      "読者の課題解決や感情に訴えかける説得力の具体例",
      "新たな気づきや行動変容を促すメッセージの効果"
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
 5. **タグ数**: 必ず5個以上、最大8個程度のタグを生成（シンプル化重視）
 6. **バランス**: 専門分野系3-5個、スキル系2-3個の配分を保つ

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
          technology: ['基本的な文章技術'],
          expertise: ['専門的な編集技術'],
          creativity: ['独創的な記事作成'],
          impact: ['読者への価値提供']
        },
        improvementSuggestions: ['分析結果の取得に失敗したため、再度お試しください'],
        targetAudience: '分析失敗',
        uniqueValue: '分析失敗'
      }
    }

    // 取得した分析結果を基に、評価スコアを取得
    let evaluationScores = null
    try {
      if (analysisResult) { // 分析が成功した場合のみスコアリング
        evaluationScores = await getEvaluationScores(analysisResult)
      }
    } catch(scoringError) {
      console.error('Scoring Error:', scoringError)
      // スコアリングに失敗しても、分析結果は返す
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      evaluation: evaluationScores, // 評価スコアをレスポンスに追加
      contentType: 'article',
      analysisType: 'specialized_article_analysis_with_score',
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