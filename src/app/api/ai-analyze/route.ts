import { NextRequest, NextResponse } from 'next/server'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// スコアリング用の関数（コンテンツタイプ別）
async function getEvaluationScores(analysisResult: any, contentType: string) {
  // コンテンツタイプ別の評価軸定義
  const evaluationCriteria = {
    article: {
      technology: "構成の巧みさ、文章の読みやすさ、情報の提示方法、編集・校正の品質",
      expertise: "記事のテーマに対する深い知識、正確な情報、取材力、業界への理解度",
      creativity: "独自の切り口、ユニークな視点、読者を引きつける構成や表現の工夫",
      impact: "読者の課題解決への貢献度、共感や納得感、行動を促す力"
    },
    design: {
      technology: "デザインツールの習熟度、技術的完成度、制作プロセスの効率性",
      expertise: "デザイン理論の理解、ブランドガイドライン準拠、業界知識の活用",
      creativity: "斬新なビジュアル表現、独創的なコンセプト、美的センス",
      impact: "ブランド価値向上、ユーザーエクスペリエンス改善、ビジネス成果"
    },
    photo: {
      technology: "撮影技術の高さ、機材活用スキル、レタッチ技術",
      expertise: "撮影ジャンルの専門知識、光と構図の理解、被写体への深い理解",
      creativity: "独創的な視点、芸術的表現、感情を動かす構図",
      impact: "視覚的インパクト、メッセージ伝達力、感情への働きかけ"
    },
    video: {
      technology: "撮影・編集技術、音響技術、ソフトウェア活用スキル",
      expertise: "映像制作の専門知識、ストーリーテリング技術、ジャンル理解",
      creativity: "独創的な演出、革新的な表現手法、感動的なストーリー",
      impact: "視聴者エンゲージメント、メッセージ伝達効果、ブランド価値向上"
    },
    podcast: {
      technology: "音響品質、編集技術、配信プラットフォームの活用",
      expertise: "コンテンツ企画力、インタビュー技術、業界知識",
      creativity: "独自の切り口、魅力的な話術、革新的な番組構成",
      impact: "リスナーコミュニティ形成、知識・情報の価値提供、影響力の拡大"
    },
    event: {
      technology: "運営スキル、空間デザイン、テクノロジー活用",
      expertise: "イベント企画の専門知識、プロジェクトマネジメント、リスク管理",
      creativity: "独創的な企画、革新的な演出、参加者体験の工夫",
      impact: "参加者満足度、ネットワーキング効果、知識・価値の共有"
    }
  }

  const criteria = evaluationCriteria[contentType as keyof typeof evaluationCriteria] || evaluationCriteria.article

  const scoringPrompt = `
あなたは、与えられた${contentType}作品の分析レポートを評価し、スコアを算出する専門アナリストです。
以下のJSON形式の分析レポートを読み解き、5つの評価項目について、それぞれ100点満点で採点してください。
採点は、レポート内の具体的な記述を根拠とし、客観的に行ってください。

## 分析レポート
${JSON.stringify(analysisResult)}

## 評価項目（${contentType}作品向け）
1. **技術力 (Technology)**: ${criteria.technology}
2. **専門性 (Expertise)**: ${criteria.expertise}
3. **創造性 (Creativity)**: ${criteria.creativity}
4. **影響力 (Impact)**: ${criteria.impact}
5. **総合評価 (Overall)**: 上記4項目を総合的に判断した、作品全体の完成度と価値

## 出力形式
以下のJSON形式で、スコアと評価の根拠（レポート内のどの記述を参考にしたか）を簡潔に示してください。
JSON以外のテキストは絶対に含めないでください。

{
  "scores": {
    "technology": { "score": 85, "reason": "評価の根拠を簡潔に記述" },
    "expertise": { "score": 78, "reason": "評価の根拠を簡潔に記述" },
    "creativity": { "score": 92, "reason": "評価の根拠を簡潔に記述" },
    "impact": { "score": 80, "reason": "評価の根拠を簡潔に記述" },
    "overall": { "score": 84, "reason": "評価の根拠を簡潔に記述" }
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

// コンテンツタイプ別のプロンプト設定
// コンテンツタイプの型定義
const prompts = {
    article: {
      focus: '記事・ライティング',
      specificAnalysis: `
- 文章の専門性と読みやすさ
- 取材力や情報収集能力
- 記事の独自性と価値
- 読者エンゲージメント
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
あなたは${contentConfig.focus}の専門家・分析者です。以下の作品を詳細に分析し、個別性の高い具体的なタグを10個以上生成してください。

作品タイトル: ${title || '未設定'}
作品URL: ${url || '未設定'}
作品説明: ${description || '未設定'}
コンテンツタイプ: ${contentConfig.focus}

## 詳細分析観点

### 1. ${contentConfig.focus}作品としての特化分析
${contentConfig.specificAnalysis}

### 2. 具体的な分類と特徴抽出
- 作品の具体的なサブジャンルやカテゴリ
- 技術的手法や使用ツールの特定
- スタイルや表現方法の詳細な分析
- ターゲット層や用途の細分化

### 3. 個別性・差別化要素の特定
- この作品独自の特徴や価値
- 競合との差別化ポイント
- 制作者の個性や専門性の表れ
- 市場でのポジショニング

## タグ生成指針

以下の6つのカテゴリから合計10-15個の具体的タグを生成してください：

### A. ジャンル・専門分野系（3-4個）
${contentConfig.focus}の中でも、より具体的なサブジャンルや専門領域

### B. 技術・手法系（2-3個）
使用している具体的な技術、ツール、手法、制作方法

### C. スタイル・表現系（2-3個）
視覚的スタイル、表現手法、アプローチの特徴

### D. 対象・用途系（2-3個）
ターゲット層、利用シーン、目的、価値提供

### E. 品質・レベル系（1-2個）
技術レベル、完成度、革新性、影響力

### F. 個別特徴系（1-2個）
この作品にしかない独自の特徴や価値

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
  "contentTypeAnalysis": "${contentConfig.focus}作品としての特徴的な要素や評価ポイントの詳細分析",
  "strengths": {
    "creativity": [
      "独創性の具体的な表れと評価",
      "革新的なアプローチの詳細",
      "芸術的・創造的価値の分析"
    ],
    "expertise": [
      "技術的専門性の具体的証拠",
      "業界知識・スキルの活用状況",
      "制作プロセスの高度さ",
      "品質管理・完成度の高さ"
    ],
    "impact": [
      "ユーザー・視聴者への具体的影響",
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
  "oneLinerSummary": "クリエイターの魅力を1〜2文で表現するキャッチコピー",
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
2. **個別性の確保**: その作品にしかない特徴的な要素を反映
3. **専門性の発揮**: ${contentConfig.focus}分野の専門知識を活用した深い分析
4. **実用性の提供**: 制作者が成長できる具体的な洞察
5. **タグ数の確保**: 必ず10個以上、最大15個程度のタグを生成
6. **バランスの維持**: 各カテゴリから適切にタグを配分
7. **汎用性の確保**: タグ全体の60〜70%は「ビジネス」「テクノロジー」「IoT」「ビジネスモデル解説」など発注者が直感的に理解できる短く汎用的なキーワードとし、残り30〜40%を作品固有の詳細タグとしてください
8. **ポジティブ・コーチング表現**: 欠点や悪い点という語を避け、「GOOD」「NEXT」の2段構成で伸びしろを提案するポジティブな言語を用いる。

注意事項：
- タグは${contentConfig.tags}を基に、より具体的で細分化されたものを10-15個生成
- キーワードは${contentConfig.focus}分野の技術的な要素や業界専門用語を含める
- カテゴリは「ウェブデザイン」「モバイルアプリ」「グラフィックデザイン」「記事・ライティング」「写真・映像」「その他」から選んでください
- 強みは以下の3つの観点から${contentConfig.focus}作品として分析してください：${contentConfig.strengths}
- 各観点で2-4個の強みを挙げ、具体的で実証的な内容にしてください
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
          maxOutputTokens: 2048,
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

    // 取得した分析結果を基に、評価スコアを取得
    let evaluationScores = null
    try {
      if (analysisResult) { // 分析が成功した場合のみスコアリング
        evaluationScores = await getEvaluationScores(analysisResult, contentType || 'other')
      }
    } catch(scoringError) {
      console.error('Scoring Error:', scoringError)
      // スコアリングに失敗しても、分析結果は返す
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      evaluation: evaluationScores, // 評価スコアをレスポンスに追加
      contentType: contentConfig.focus,
      analysisType: 'comprehensive_analysis_with_score',
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