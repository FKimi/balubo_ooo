import { NextResponse } from "next/server";
import {
  callGeminiAPI,
  parseAnalysisResult,
  handleAnalysisError,
  AnalysisRequest,
} from "../utils/ai-analyzer";

// 文章特化のサマリー生成関数 - 削除済み

export async function POST(body: any) {
  try {
    const {
      description,
      title,
      url,
      fullContent,
      productionNotes,
    }: AnalysisRequest = body;

    if (!description && !title && !url && !fullContent) {
      return NextResponse.json(
        { error: "分析する記事コンテンツが必要です" },
        { status: 400 },
      );
    }

    // ビジネス特化の高精度分析プロンプト
    const articleAnalysisPrompt = `
あなたはビジネスマーケティング・コンテンツ戦略の専門家です。以下の記事作品を、ビジネスコンテンツの観点から詳細に分析し、プロクリエイターの専門性を可視化する具体的なタグを10個以上生成してください。

記事タイトル: ${title || "未設定"}
記事URL: ${url || "未設定"}
記事説明・概要: ${description || "未設定"}
${productionNotes ? `制作メモ・目的・背景: ${productionNotes}` : ""}
${fullContent ? `記事本文: ${fullContent.substring(0, 3000)}${fullContent.length > 3000 ? "...(本文が長いため一部省略)" : ""}` : ""}

## ビジネス特化分析観点

### ① 業界・領域の特定
- SaaS、DX、AI、医療、不動産、金融、製造業、小売業、教育、ヘルスケアなどの業界キーワードの出現頻度と文脈を分析
- 業界特有の専門用語や慣習（例：「MR」「SFA」「重要事項説明」「ROI」「KPI」「DX推進」「デジタル変革」）を辞書と照合
- 技術トレンド（AI、IoT、クラウド、API、セキュリティ、データ分析など）の言及度を評価

### ② 課題・目的の分析
- 「リード獲得」「業務効率化」「認知度向上」「採用強化」「売上向上」「コスト削減」「顧客満足度向上」といったビジネス課題に関する単語を抽出
- 「〜という課題に対し」「〜のために」「〜を解決する」「〜を実現する」といった構造を解析
- 課題の深刻度と解決策の具体性を評価

### ③ 実績・成果の抽出
- 「〇〇%向上」「〇〇件獲得」「導入社数〇倍」「売上〇億円」「コスト〇%削減」などの定量的な表現を検知
- 「貢献」「実現」「達成」「改善」「向上」といった成果を示す動詞を評価
- 数値データの信頼性と具体性を分析

### ④ ターゲット読者の推定
- 文章の専門性、トーン（専門的、丁寧、カジュアル、説得的など）を分析
- 「経営者向け」「マーケター向け」「エンジニア向け」「営業向け」「人事向け」といった単語から読者層を推定
- 意思決定者レベル（C-level、部長級、課長級、担当者級）の特定

### ⑤ ビジネス文脈の理解度
- 課題→施策→結果といった論理的な構造で書かれているかを評価
- ビジネス取引特有の表現（例：「決裁者」「導入プロセス」「ROI」「TCO」「PoC」「RFP」「購買行動」「意思決定」）の有無をチェック
- 企業や組織の意思決定プロセスや購買行動への理解度を評価

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
    "SaaS", "DX", "AI", "不動産テック", "リード獲得", "業務効率化", "経営者向け", "マーケター向け", "BtoB", "プロフェッショナル", "専門性", "実績重視", "課題解決", "データ分析", "ROI"
  ],
  "keywords": ["SaaS", "DX", "AI", "IoT", "クラウド", "API", "ROI", "KPI", "TCO", "PoC", "RFP", "リード獲得", "業務効率化", "デジタル変革"],
  "category": "記事・ライティング",
  "summary": "BtoBビジネス課題を解決する専門性の高いコンテンツ",
  "detailedAnalysis": {
    "genreClassification": "BtoBビジネスコンテンツ・専門記事",
    "technicalAnalysis": "論理的構成とデータ重視のライティング技術",
    "styleCharacteristics": "専門的で説得的な文体、意思決定者向けのトーン",
    "targetAndPurpose": "経営層・マーケター向けの課題解決型コンテンツ",
    "uniqueValueProposition": "業界専門知識と実績データに基づく信頼性の高い情報提供",
    "professionalAssessment": "BtoBマーケティングの専門知識を活用した高品質なコンテンツ"
  },
  "tagClassification": {
    "genre": ["SaaS", "DX", "AI", "不動産テック"],
    "technique": ["リード獲得", "業務効率化", "データ分析"],
    "style": ["経営者向け", "マーケター向け", "専門的"],
    "purpose": ["ビジネス", "プロフェッショナル", "課題解決"],
    "quality": ["専門性", "実績重視"],
    "unique": ["業界特化", "ROI重視"]
  },
  "contentTypeAnalysis": "ビジネスコンテンツとして、業界専門知識と実績データを活用した高品質な課題解決型記事",
  "strengths": {
    "creativity": [
      "業界トレンドを先取りした視点と独自の分析アプローチ",
      "複雑なビジネス課題を分かりやすく構造化する能力",
      "データとストーリーを組み合わせた説得力のある表現"
    ],
    "expertise": [
      "業界特有の専門用語と慣習への深い理解",
      "ビジネス意思決定プロセスと購買行動の知識",
      "定量的データの適切な活用と解釈力"
    ],
    "impact": [
      "読者のビジネス課題解決に直結する実践的価値提供",
      "意思決定者への影響力と行動変容の促進",
      "企業や組織のROI向上に貢献するコンテンツ戦略"
    ]
  },
  "improvementSuggestions": [
    "より具体的な導入事例と成功指標の追加",
    "競合分析と差別化ポイントの明確化",
    "読者の意思決定プロセスに沿った構成の最適化"
  ],
  "professionalInsights": {
    "marketPositioning": "ビジネス専門コンテンツクリエイターとしての市場でのポジショニング",
    "scalabilityPotential": "業界横断的な専門知識の展開可能性",
    "industryTrends": "DX、AI、SaaS等の技術トレンドとの高い関連性"
  },
  "oneLinerSummary": "ビジネス課題を解決する専門性と実績を兼ね備えたプロクリエイター",
  "tagCloud": ["#SaaS", "#DX", "#AI", "#不動産テック", "#リード獲得", "#業務効率化", "#経営者向け", "#マーケター向け", "#ビジネス", "#専門性"],
  "btobAnalysis": {
    "summaries": {
      "industryIdentification": "SaaS・DX・AI領域の専門知識を活用した業界特化コンテンツ",
      "problemPurposeAnalysis": "リード獲得・業務効率化等の具体的ビジネス課題に焦点を当てた解決志向",
      "achievementExtraction": "定量的成果とROI重視の実績データを効果的に活用",
      "targetReaderEstimation": "経営層・マーケター等の意思決定者向けに最適化された専門的コンテンツ",
      "btobContextUnderstanding": "ビジネス取引の意思決定プロセスと購買行動への深い理解を反映"
    },
    "scores": {
      "industryIdentification": {
        "score": 92,
        "reason": "SaaS、DX、AI等の業界キーワードと専門用語を適切に使用し、業界特化性が高い",
        "industryTags": ["SaaS", "DX", "AI", "不動産テック"],
        "domainKeywords": ["クラウド", "API", "セキュリティ", "データ分析", "デジタル変革"]
      },
      "problemPurposeAnalysis": {
        "score": 88,
        "reason": "リード獲得、業務効率化等の具体的ビジネス課題を明確に特定し、解決策を提示",
        "problemTags": ["リード獲得", "業務効率化", "認知度向上", "売上向上"],
        "purposeKeywords": ["課題解決", "ROI向上", "コスト削減", "顧客満足度向上"]
      },
      "achievementExtraction": {
        "score": 85,
        "reason": "定量的な成果指標と具体的な改善効果を適切に提示",
        "quantitativeResults": ["導入社数3倍", "リード獲得率40%向上", "ROI 250%達成"],
        "impactScore": 87
      },
      "targetReaderEstimation": {
        "score": 90,
        "reason": "経営層・マーケター等の意思決定者向けに最適化された専門的トーンと内容",
        "targetTags": ["経営者向け", "マーケター向け", "意思決定者向け"],
        "readerLevel": "C-level・部長級"
      },
      "btobContextUnderstanding": {
        "score": 93,
        "reason": "ビジネス取引特有の表現と意思決定プロセスへの深い理解を示す",
        "contextScore": 91,
        "btobElements": ["ROI", "TCO", "PoC", "RFP", "決裁者", "導入プロセス", "購買行動", "意思決定"]
      }
    }
  },
  "detailedMetrics": {
    "technology": {
      "score": 95,
      "headline": "ビジネス専門知識を活用した論理的構成力",
      "goodHighlight": "業界特有の専門用語と慣習を適切に使用し、信頼性の高い情報提供を実現",
      "nextTip": "より具体的な導入事例を追加し、実践的な価値を高めましょう"
    },
    "expertise": {
      "score": 92,
      "headline": "業界専門知識と実績データの効果的活用",
      "goodHighlight": "SaaS・DX・AI領域の深い専門知識と定量的成果を組み合わせた説得力のある内容",
      "nextTip": "競合分析を追加し、差別化ポイントをより明確にしましょう"
    },
    "creativity": {
      "score": 88,
      "headline": "複雑なビジネス課題を分かりやすく構造化",
      "goodHighlight": "データとストーリーを組み合わせ、読者の理解と行動を促進する構成",
      "nextTip": "ビジュアル要素を活用し、より直感的な理解を促進しましょう"
    },
    "impact": {
      "score": 90,
      "headline": "意思決定者への影響力と行動変容の促進",
      "goodHighlight": "具体的なROIと成果指標により、読者の意思決定をサポート",
      "nextTip": "成功事例をより詳細に展開し、説得力をさらに高めましょう"
    },
    "overall": {
      "score": 91,
      "headline": "ビジネス専門性と実績重視の高品質コンテンツ"
    }
  },
  "learningPoints": ["業界専門知識の継続的なアップデート", "定量的成果の効果的な可視化手法"],
  "clientAppeal": ["ビジネスリード獲得率40%向上の実績", "経営層への影響力と意思決定サポート力"]
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
`;

    // AI分析を実行
    const generatedText = await callGeminiAPI(articleAnalysisPrompt, 0.3, 4096);
    const analysisResult = parseAnalysisResult(generatedText);

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      contentType: "記事・ライティング",
      analysisType: "article_specialized_analysis",
      rawResponse: generatedText,
    });
  } catch (error) {
    return handleAnalysisError(error);
  }
}
