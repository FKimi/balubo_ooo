import { NextResponse } from 'next/server'
import { 
  callGeminiAPI, 
  parseAnalysisResult, 
  handleAnalysisError, 
  processFileInfo,
  processImageFiles,
  processToolsInfo,
  AnalysisRequest, 
  AnalysisResult 
} from '../utils/ai-analyzer'

// デザイン特化のスコアリング関数
async function getDesignEvaluationScores(analysisResult: AnalysisResult) {
  const scoringPrompt = `
あなたは、与えられたデザイン作品の分析レポートを評価し、スコアを算出するデザイン専門アナリストです。
以下のJSON形式の分析レポートを読み解き、5つの評価項目について、それぞれ100点満点で採点してください。

## 分析レポート
${JSON.stringify(analysisResult)}

## 評価基準（100点満点の定義）

### 100点の基準例：Apple、Google、Airbnbレベルのデザイン
- 革新的なビジュアルデザイン
- 完璧なユーザーエクスペリエンス
- 強力なブランドアイデンティティ
- 技術的完成度の高さ
- 市場での高い評価と影響力

## 評価項目と詳細基準

### 1. **技術力 (Technology)** (100点満点)
- **90-100点**: プロフェッショナルレベルのデザインツール習熟度、完璧な技術的完成度
- **80-89点**: 高い技術レベル、優れた制作スキル
- **70-79点**: 標準的な技術力、適切なツール活用
- **60-69点**: 基本的な技術力は満たしている
- **50-59点**: 改善の余地がある

### 2. **専門性 (Expertise)** (100点満点)
- **90-100点**: 極めて高いデザイン理論の理解、業界トップレベルの専門知識
- **80-89点**: 高い専門性、適切なデザイン原則の適用
- **70-79点**: 専門的な知識、デザイン理論の理解
- **60-69点**: 基本的な専門性
- **50-59点**: 改善が必要

### 3. **創造性 (Creativity)** (100点満点)
- **90-100点**: 極めて独創的なデザイン、革新的なアプローチ
- **80-89点**: 高い創造性、独自の視点
- **70-79点**: 創造的な要素、工夫されたデザイン
- **60-69点**: 基本的な創造性
- **50-59点**: 改善が必要

### 4. **影響力 (Impact)** (100点満点)
- **90-100点**: 強いブランド価値向上、高い市場インパクト
- **80-89点**: 良いブランド効果、明確な価値提供
- **70-79点**: 一定の影響力、適切な価値創造
- **60-69点**: 基本的な影響力
- **50-59点**: 改善が必要

### 5. **総合評価 (Overall)** (100点満点)
上記4項目を総合し、デザイン全体の完成度と市場価値を評価

## 重要な出力指針
- 評価理由では、特定のブランドや企業名との比較表現は使用しない
- デザインの技術的側面、創造性、市場価値を客観的に評価する
- 各デザインの特性を活かした建設的で適切な評価理由を提供する
- できるだけ肯定的な評価をしてください。

## 出力形式
以下のJSON形式で、スコアと評価の根拠を明確に示してください。
JSON以外のテキストは絶対に含めないでください。

{
  "scores": {
    "technology": { "score": 95, "reason": "分析レポート内の具体的な記述を根拠とした評価理由。デザインツールの習熟度、技術的完成度などの技術的側面を評価。" },
    "expertise": { "score": 90, "reason": "分析レポート内の具体的な記述を根拠とした評価理由。デザイン理論の理解、専門知識の活用を評価。" },
    "creativity": { "score": 88, "reason": "分析レポート内の具体的な記述を根拠とした評価理由。独創性、革新的なアプローチ、美的センスを評価。" },
    "impact": { "score": 85, "reason": "分析レポート内の具体的な記述を根拠とした評価理由。ブランド価値、市場インパクト、ユーザー体験への影響を評価。" },
    "overall": { "score": 90, "reason": "4項目を総合した評価理由。デザイン全体の完成度と市場価値を建設的に評価。" }
  }
}
`

  try {
    const generatedText = await callGeminiAPI(scoringPrompt, 0.3, 1024)
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

export async function POST(body: any) {
  try {
    const { 
      description, 
      title, 
      url, 
      fullContent,
      productionNotes,
      uploadedFiles,
      fileCount,
      designTools,
      imageFiles
    }: AnalysisRequest = body

    // デザイン作品の場合、ファイルがアップロードされていれば分析可能
    const hasContent = description || title || url || fullContent || (uploadedFiles && uploadedFiles.length > 0) || (imageFiles && imageFiles.length > 0)
    
    if (!hasContent) {
      return NextResponse.json(
        { error: '分析するデザイン作品が必要です。説明文、タイトル、URL、またはファイルのいずれかを入力してください。' },
        { status: 400 }
      )
    }

    // ファイル情報の処理
    const fileInfoText = processFileInfo(uploadedFiles, fileCount)
    const toolsInfoText = processToolsInfo(designTools)
    const imageContentText = processImageFiles(imageFiles)

    // デザイン専用の高精度分析プロンプト（トークン数削減版）
    const designAnalysisPrompt = `
あなたは経験豊富なデザイナー・デザイン専門家です。以下のデザイン作品を分析し、具体的なタグを10個以上生成してください。

作品タイトル: ${title || '未設定'}
作品URL: ${url || '未設定'}
作品説明: ${description || '未設定'}
${productionNotes ? `制作メモ: ${productionNotes.substring(0, 500)}${productionNotes.length > 500 ? '...(省略)' : ''}` : ''}
${fullContent ? `詳細説明: ${fullContent.substring(0, 1000)}${fullContent.length > 1000 ? '...(省略)' : ''}` : ''}
${fileInfoText}
${toolsInfoText}
${imageContentText}

## 分析観点

### 1. デザイン分類
- ジャンル（UI/UX、グラフィック、ロゴ、ウェブ、モバイルなど）
- 業界・分野（テック、ファッション、食品、金融など）
- 用途（ブランディング、マーケティング、プロダクトなど）

### 2. 視覚的要素
- 色彩分析、構図分析、技法分析、スタイル分析

### 3. 技術的完成度
- 制作技術、表現力、品質

### 4. デザイン的価値
- ブランド価値、ユーザビリティ、市場適合性

### 5. 創造性と独創性
- 独創性、創造性、芸術性

## タグ生成指針

以下の6つのカテゴリから合計10-15個のタグを生成してください：

### A. ジャンル・専門分野系（3-4個）
### B. 技術・手法系（2-3個）
### C. スタイル・表現系（2-3個）
### D. 対象・用途系（2-3個）
### E. 品質・レベル系（1-2個）
### F. 個別特徴系（1-2個）

以下の形式でJSONレスポンスを返してください：

{
  "tags": [
    "具体的ジャンル1", "具体的ジャンル2", "具体的ジャンル3", "具体的ジャンル4",
    "技術手法1", "技術手法2", "技術手法3",
    "スタイル特徴1", "スタイル特徴2",
    "対象用途1", "対象用途2",
    "品質レベル1", "個別特徴1"
  ],
  "keywords": ["専門用語1", "技術要素1", "業界用語1", "手法名1", "ツール名1"],
  "category": "推奨カテゴリ",
  "summary": "作品の核心と特徴を端的に表現（50文字以内）",
  "detailedAnalysis": {
    "genreClassification": "作品の具体的ジャンルと専門分野",
    "technicalAnalysis": "技術的手法と制作方法の分析",
    "styleCharacteristics": "スタイルと表現の特徴分析",
    "targetAndPurpose": "対象層と目的・用途の分析",
    "uniqueValueProposition": "この作品独自の価値と差別化要素",
    "professionalAssessment": "専門家視点での品質評価"
  },
  "tagClassification": {
    "genre": ["ジャンル系タグ1", "ジャンル系タグ2", "ジャンル系タグ3"],
    "technique": ["技術系タグ1", "技術系タグ2"],
    "style": ["スタイル系タグ1", "スタイル系タグ2"],
    "purpose": ["用途系タグ1", "用途系タグ2"],
    "quality": ["品質系タグ1"],
    "unique": ["個別特徴タグ1"]
  },
  "contentTypeAnalysis": "デザイン作品としての特徴的な要素や評価ポイントの詳細分析",
  "strengths": {
    "creativity": [
      "斬新なビジュアル表現、独創的なコンセプト、美的センス、色彩の独創性、レイアウトの革新性など",
      "革新的なアプローチの詳細",
      "芸術的・創造的価値の分析"
    ],
    "expertise": [
      "デザインツールの習熟、ブランドガイドライン準拠、技術的完成度、色彩理論の理解、タイポグラフィの知識、UI/UXデザイン原則の適用など",
      "業界知識・スキルの活用状況",
      "制作プロセスの高度さ",
      "品質管理・完成度の高さ"
    ],
    "impact": [
      "ブランド価値向上、ユーザーエクスペリエンス改善、ビジネス成果、視覚的インパクト、メッセージ伝達力など",
      "業界・市場への貢献度",
      "社会的価値・意義",
      "ビジネス・ブランド価値向上"
    ]
  },
  "improvementSuggestions": [
    "より具体的で実践的な改善提案1",
    "技術的・表現的向上のための提案2",
    "市場価値・競争力強化のための提案3"
  ],
  "professionalInsights": {
    "marketPositioning": "市場でのポジショニングと競合優位性",
    "scalabilityPotential": "このスタイル・手法の展開可能性",
    "industryTrends": "業界トレンドとの関連性"
  },
  "oneLinerSummary": "デザイナーの魅力を1〜2文で表現するキャッチコピー",
  "tagCloud": ["#美的センス", "#色彩感覚", "#レイアウト力", "#ブランディング", "#ユーザビリティ", "#創造性"],
  "detailedMetrics": {
    "technology": {
      "score": 95,
      "headline": "プロフェッショナルレベルのデザインツール習熟度",
      "goodHighlight": "高度なデザインツールの活用により、技術的完成度が高い作品に仕上がっています。",
      "nextTip": "さらに新しいツールや技法を取り入れることで、表現の幅が広がります。"
    },
    "expertise": {
      "score": 92,
      "headline": "デザイン理論の深い理解と実践",
      "goodHighlight": "色彩理論やタイポグラフィの知識が効果的に活用されています。",
      "nextTip": "業界トレンドの研究を継続することで、さらに専門性が向上します。"
    },
    "creativity": {
      "score": 88,
      "headline": "独創的なビジュアル表現と革新的アプローチ",
      "goodHighlight": "独自の視点と創造性が作品に反映されており、印象的なデザインになっています。",
      "nextTip": "さらに実験的なアプローチを試すことで、独創性がさらに際立ちます。"
    },
    "impact": {
      "score": 85,
      "headline": "ブランド価値向上とユーザー体験改善",
      "goodHighlight": "ターゲットユーザーに適したデザインで、効果的な価値提供ができています。",
      "nextTip": "ユーザーテストを実施することで、さらに高いインパクトを実現できます。"
    },
    "overall": {
      "score": 90,
      "headline": "技術力と創造性が融合した高完成度デザイン"
    }
  },
  "learningPoints": ["デザインツールの習熟度向上", "色彩理論の実践的活用"],
  "clientAppeal": ["ブランド価値向上の実績", "ユーザーエンゲージメント改善"]
}

## 注意事項：

1. 具体的で詳細なタグを10-15個生成
2. 各カテゴリから適切にタグを配分
3. タグの60〜70%は汎用的なキーワード、30〜40%は作品固有の詳細タグ
4. ポジティブな表現を使用
5. 画像ファイルがある場合は視覚的要素を分析
6. デザイン専門知識を活用した分析
7. カテゴリは「ウェブデザイン」「モバイルアプリ」「グラフィックデザイン」「記事・ライティング」「写真・映像」「その他」から選択
8. 強みはcreativity、expertise、impactの3観点から分析
9. 日本語で回答、JSONフォーマットのみ
`

    // AI分析を実行
    console.log('=== デザイン分析開始 ===')
    console.log('プロンプト長:', designAnalysisPrompt.length)
    console.log('プロンプト（最初の500文字）:', designAnalysisPrompt.substring(0, 500))
    console.log('========================')
    
    const generatedText = await callGeminiAPI(designAnalysisPrompt, 0.3, 4096)
    console.log('=== デザイン分析完了 ===')
    console.log('生成されたテキスト長:', generatedText.length)
    console.log('生成されたテキスト（最初の500文字）:', generatedText.substring(0, 500))
    console.log('========================')
    
    const analysisResult = parseAnalysisResult(generatedText)

    // 評価スコアを取得
    let evaluationScores = null
    try {
      evaluationScores = await getDesignEvaluationScores(analysisResult)
    } catch(scoringError) {
      console.error('Scoring Error:', scoringError)
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      evaluation: evaluationScores,
      contentType: 'デザイン',
      analysisType: 'design_specialized_analysis',
      rawResponse: generatedText
    })

  } catch (error) {
    console.error('=== デザイン分析APIエラー ===')
    console.error('エラー:', error)
    console.error('エラー型:', typeof error)
    console.error('エラーメッセージ:', error instanceof Error ? error.message : 'Unknown error')
    console.error('エラースタック:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('==========================')
    
    return handleAnalysisError(error)
  }
} 