import { NextResponse } from 'next/server'
import { 
  callGeminiAPI, 
  parseAnalysisResult, 
  handleAnalysisError, 
  AnalysisRequest, 
  AnalysisResult 
} from '../utils/ai-analyzer'

// 文章特化のサマリー生成関数（5軸を1~2行で言語化）
async function getArticleEvaluationSummaries(analysisResult: AnalysisResult) {
  const summaryPrompt = `
あなたは、与えられた記事分析レポートをもとに作品の魅力を簡潔にまとめるシニアエディターです。
次のJSON形式の分析レポートを読み、以下の5つの軸について、読者の自己肯定感を高めるようなポジティブでモチベーションを上げる表現で、各1〜2行の日本語テキストで魅力や強みを称賛・可視化してください。ネガティブ表現や課題指摘は避け、褒め言葉中心で書いてください。

1. 総合評価 (overall)
2. 技術力 (technology)
3. 専門性 (expertise)
4. 創造性 (creativity)
5. 影響力 (impact)

## 分析レポート
${JSON.stringify(analysisResult)}

## 出力フォーマット（必ずJSONのみ。その他の文字は出力しないこと）
{
  "summaries": {
    "overall": "作品全体の魅力を1〜2行でまとめたテキスト",
    "technology": "技術力の強みを1〜2行でまとめたテキスト",
    "expertise": "専門性の強みを1〜2行でまとめたテキスト",
    "creativity": "創造性の強みを1〜2行でまとめたテキスト",
    "impact": "影響力の強みを1〜2行でまとめたテキスト"
  }
}
`

  try {
    const generatedText = await callGeminiAPI(summaryPrompt, 0.3, 1024)
    const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error('サマリー生成エラー:', error)
    // フォールバック: デフォルトサマリー
    return {
      summaries: {
        overall: '記事全体の魅力を簡潔に伝えるサマリー (生成失敗時のデフォルト)',
        technology: '技術力の強みを示すサマリー (生成失敗時のデフォルト)',
        expertise: '専門性の強みを示すサマリー (生成失敗時のデフォルト)',
        creativity: '創造性の強みを示すサマリー (生成失敗時のデフォルト)',
        impact: '影響力の強みを示すサマリー (生成失敗時のデフォルト)'
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
      productionNotes
    }: AnalysisRequest = body

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
${productionNotes ? `制作メモ・目的・背景: ${productionNotes}` : ''}
${fullContent ? `記事本文: ${fullContent.substring(0, 3000)}${fullContent.length > 3000 ? '...(本文が長いため一部省略)' : ''}` : ''}

## 詳細分析観点

### 1. コンテンツ分類の細分化
- 記事の具体的なジャンル（ビジネス、技術解説、インタビュー、レビュー、オピニオン、ニュース解説、ハウツー、ケーススタディなど）
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

### A. ジャンル・専門分野系（3-4個）
記事の具体的なジャンルと専門分野

### B. 技術・手法系（2-3個）
ライティング技術、構成手法、表現技法

### C. スタイル・表現系（2-3個）
文体、トーン、表現スタイル

### D. 対象・用途系（2-3個）
ターゲット読者、利用シーン、目的

### E. 品質・レベル系（1-2個）
技術レベル、完成度、専門性

### F. 個別特徴系（1-2個）
この記事にしかない独自の特徴

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
  "summary": "記事の核心と特徴を端的に表現（50文字以内）",
  "detailedAnalysis": {
    "genreClassification": "記事の具体的ジャンルと専門分野",
    "technicalAnalysis": "ライティング技術と構成手法の分析",
    "styleCharacteristics": "文体と表現の特徴分析",
    "targetAndPurpose": "対象読者と目的・用途の分析",
    "uniqueValueProposition": "この記事独自の価値と差別化要素",
    "professionalAssessment": "編集者視点での品質評価"
  },
  "tagClassification": {
    "genre": ["ジャンル系タグ1", "ジャンル系タグ2", "ジャンル系タグ3"],
    "technique": ["技術系タグ1", "技術系タグ2"],
    "style": ["スタイル系タグ1", "スタイル系タグ2"],
    "purpose": ["用途系タグ1", "用途系タグ2"],
    "quality": ["品質系タグ1"],
    "unique": ["個別特徴タグ1"]
  },
  "contentTypeAnalysis": "記事・ライティング作品としての特徴的な要素や評価ポイントの詳細分析",
  "strengths": {
    "creativity": [
      "独創的な視点、魅力的な文章表現、読者を引きつける構成など",
      "革新的なアプローチの詳細",
      "芸術的・創造的価値の分析"
    ],
    "expertise": [
      "深い取材力、専門知識の活用、正確な情報提供、SEO対策など",
      "業界知識・スキルの活用状況",
      "制作プロセスの高度さ",
      "品質管理・完成度の高さ"
    ],
    "impact": [
      "読者への価値提供、社会的影響、エンゲージメント創出など",
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
  "oneLinerSummary": "ライターの魅力を1〜2文で表現するキャッチコピー",
  "tagCloud": ["#深い洞察力", "#ストーリーテリング", "#専門家インタビュー", "#論理的構成力", "#読者への共感", "#課題解決思考"],
  "detailedMetrics": {
    "technology": {
      "score": 95,
      "headline": "難解なテーマも読破させる、磐石の論理構成力",
      "goodHighlight": "記事冒頭の『〜〜』という問いかけが読者を引き込み、…",
      "nextTip": "図解を追加すると理解と拡散力がさらに向上します"
    },
    "expertise": {
      "score": 92,
      "headline": "一次情報の深掘りで信頼性を担保",
      "goodHighlight": "業界トップへのインタビュー引用により、記事の独自性と信頼性を高めています。",
      "nextTip": "データソースへのリンクを追加すると専門性がさらに際立ちます。"
    },
    "creativity": {
      "score": 88,
      "headline": "逆説的アプローチで読者を魅了",
      "goodHighlight": "『常識を疑え』という見出しで興味を喚起し、先入観を打ち崩す構成が秀逸です。",
      "nextTip": "結末に読者への問いかけを追加し、余韻とシェアを促進しましょう。"
    },
    "impact": {
      "score": 85,
      "headline": "読者の行動を変える実践的示唆",
      "goodHighlight": "具体的なアクションプランを箇条書きで提示し、即実践につながる内容になっています。",
      "nextTip": "成功事例を追加し、説得力を補強するとさらに影響力が強まります。"
    },
    "overall": {
      "score": 90,
      "headline": "専門性と物語性が融合した高完成度コンテンツ"
    }
  },
  "learningPoints": ["論理展開のテンプレート化で再現性を確保", "一次情報へのアクセスで記事価値を高める"],
  "clientAppeal": ["読者エンゲージメント平均120%向上の実績", "専門外の読者にも理解される翻訳力"]
}

## 重要な注意事項：

1. **具体性の重視**: 抽象的ではなく、具体的で詳細なタグを生成
2. **個別性の確保**: その記事にしかない特徴的な要素を反映
3. **専門性の発揮**: 記事・ライティング分野の専門知識を活用した深い分析
4. **実用性の提供**: ライターが成長できる具体的な洞察
5. **タグ数の確保**: 必ず10個以上、最大15個程度のタグを生成
6. **バランスの維持**: 各カテゴリから適切にタグを配分
7. **汎用性の確保**: タグ全体の60〜70%は「ビジネス」「テクノロジー」「IoT」「ビジネスモデル解説」など発注者が直感的に理解できる短く汎用的なキーワードとし、残り30〜40%を記事固有の詳細タグとしてください
8. **ポジティブ・コーチング表現**: 欠点や悪い点という語を避け、「GOOD」「NEXT」の2段構成で伸びしろを提案するポジティブな言語を用いる。
9. **ライティング専門分析**: 記事の場合は、構成力、取材力、表現力、読者理解、SEO対策などの専門知識を活用した分析を行ってください。
10. **技術的詳細**: 使用しているライティング技法や構成手法について、具体的な技術名や手法名を特定し、その習熟度や活用方法を評価してください。
11. **市場適合性**: 記事のターゲット読者や市場を明確に特定し、その市場での価値や競合優位性を分析してください。

注意事項：
- タグは記事ジャンル、ライティングスタイル、対象読者層などのタグを基に、より具体的で細分化されたものを10-15個生成
- キーワードは記事・ライティング分野の技術的な要素や業界専門用語を含める
- カテゴリは「ウェブデザイン」「モバイルアプリ」「グラフィックデザイン」「記事・ライティング」「写真・映像」「その他」から選んでください
- 強みは以下の3つの観点から記事・ライティング作品として分析してください：
  * creativity: 独創的な視点、魅力的な文章表現、読者を引きつける構成など
  * expertise: 深い取材力、専門知識の活用、正確な情報提供、SEO対策など
  * impact: 読者への価値提供、社会的影響、エンゲージメント創出など
- 各観点で2-4個の強みを挙げ、具体的で実証的な内容にしてください
- 日本語で回答してください
- JSONフォーマット以外の文字は含めないでください
`

    // AI分析を実行
    const generatedText = await callGeminiAPI(articleAnalysisPrompt, 0.3, 4096)
    const analysisResult = parseAnalysisResult(generatedText)

    // 評価サマリーを取得
    let evaluationSummaries = null
    try {
      evaluationSummaries = await getArticleEvaluationSummaries(analysisResult)
    } catch(scoringError) {
      console.error('Scoring Error:', scoringError)
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      evaluation: evaluationSummaries,
      contentType: '記事・ライティング',
      analysisType: 'article_specialized_analysis',
      rawResponse: generatedText
    })

  } catch (error) {
    return handleAnalysisError(error)
  }
} 