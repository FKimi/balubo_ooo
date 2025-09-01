import { NextResponse } from 'next/server'
import { 
  callGeminiAPI, 
  parseAnalysisResult,
  handleAnalysisError, 
  processFileInfo,
  processImageFiles,
  AnalysisRequest
} from '../utils/ai-analyzer'

export async function POST(body: any) {
  try {
    const {
      description,
      title,
      url,
      fullContent: _fullContent,
      productionNotes,
      uploadedFiles,
      fileCount,
      imageFiles
    }: AnalysisRequest = body

    const hasContent = description || title || url || 
                      (uploadedFiles && uploadedFiles.length > 0) || 
                      (imageFiles && imageFiles.length > 0)
    
    if (!hasContent) {
      return NextResponse.json(
        { error: '分析する写真がありません' }, 
        { status: 400 }
      )
    }

    const fileInfo = processFileInfo(uploadedFiles, fileCount)
    // Vision API 用の画像パーツ
    let visionImages: {mimeType: string, data: string}[] = []
    if (imageFiles && imageFiles.length > 0) {
      visionImages = imageFiles
        .filter((file: any) => file.data && file.data.startsWith('data:'))
        .map((file: any) => {
          const base64Full = file.data.split(',')[1] || file.data
          const base64 = base64Full.length > 1000000 ? base64Full.slice(0,1000000) : base64Full // 1MB 以上ならカット
          return {
            mimeType: file.type || 'image/jpeg',
            data: base64
          }
        })
    }

    const imageContent = processImageFiles(imageFiles)

    // アップデートされた写真特化プロンプト
    const prompt = `あなたは国際的に活躍するプロフォトグラファー兼写真評論家です。以下の写真作品を専門的な観点から詳細に分析し、主要被写体（犬・人物・建築物など）が何かを明確に特定したうえで、具体的で実用的なタグを生成してください。

## 作品情報
- タイトル: ${title || '未設定'}
- 説明: ${description || '未設定'}
${productionNotes ? `- 制作メモ: ${productionNotes}` : ''}
${fileInfo}
${imageContent}

## 分析観点
以下の観点から作品を評価し、それぞれの特徴を表すタグを生成してください：

### 📸 技術的要素
- 構図（三分割法、対角構図、中央構図、黄金比など）
- 光の使い方（自然光、人工光、サイド光、逆光、時間帯など）
- 色彩（色温度、彩度、コントラスト、色調、モノクローム）
- 焦点とボケ（被写界深度、パンフォーカス、ボケ味、ピント位置）
- 露出（適正露出、ハイキー、ローキー、HDR風）
- 画角（広角、標準、望遠、魚眼、マクロ）

### 🎨 表現・演出
- 雰囲気（ドラマチック、ソフト、シャープ、ナチュラル、アート性）
- 感情表現（躍動感、静寂感、緊張感、安らぎ、力強さ）
- ストーリー性（物語性、瞬間性、日常性、非日常性）
- スタイル（モダン、クラシック、ミニマル、ヴィンテージ、コンテンポラリー）

### 🏷️ ジャンル・用途
写真のジャンルを特定し、そのジャンル特有の評価基準で分析：
- ポートレート（表情、ポーズ、背景処理、ライティング）
- 風景写真（奥行き、季節感、天候、時間帯）
- ストリート（決定的瞬間、人間性、社会性、リアリティ）
- 建築・インテリア（空間構成、線の美しさ、質感）
- 商品撮影（クリーンさ、魅力的な見せ方、商業的価値）
- アート・ファッション（創造性、独創性、トレンド性）

### 🎯 プロフェッショナリズム
- 商業的価値（使用用途、汎用性、需要）
- 技術レベル（プロ級、セミプロ、アマチュア上級）
- 編集技術（レタッチ品質、色補正、合成技術）
- 発表媒体適性（SNS向け、印刷媒体、展示用、Web用）

## 出力要求
1. **最低15個以上のタグ**を生成してください
2. タグは日本語で、具体的で検索しやすいものにしてください
3. 被写体を直接表すタグ（例: 犬、柴犬、ポートレートなど）を必ず1〜3個含めてください
4. 技術的なタグと表現的なタグをバランスよく含めてください
5. フォトグラファーが自身のスキルや特徴を理解できるタグにしてください

## JSON出力形式
{
  "tags": ["タグ1", "タグ2", "..."],
  "summary": "作品全体の魅力を2-3文で要約",
  "category": "メインジャンル（ポートレート/風景/ストリート/建築/商品/アートなど）",
  "keywords": ["検索キーワード1", "検索キーワード2", "..."],
  "strengths": {
    "impact": ["この作品が与える感情的・視覚的インパクト"],
    "expertise": ["撮影技術・専門知識に関する強み"],
    "creativity": ["創造性・独創性・表現力に関する特徴"]
  },
  "detailedMetrics": {
    "technology": {
      "score": "0-100点の数値",
      "headline": "技術力の要約",
      "goodHighlight": "優れている具体的な技術的ポイント",
      "nextTip": "さらに技術を向上させるためのアドバイス"
    },
    "expertise": {
      "score": "0-100点の数値",
      "headline": "専門性の要約",
      "goodHighlight": "専門性が発揮されている点",
      "nextTip": "専門性をさらに深めるためのヒント"
    },
    "creativity": {
      "score": "0-100点の数値",
      "headline": "創造性の要約",
      "goodHighlight": "独創的な表現やアイデア",
      "nextTip": "新しい視点を得るための提案"
    },
    "impact": {
      "score": "0-100点の数値",
      "headline": "影響力の要約",
      "goodHighlight": "鑑賞者に強い印象を与える要素",
      "nextTip": "よりインパクトを与えるためのアイデア"
    },
    "overall": {
      "score": "0-100点の数値",
      "headline": "この作品の総評。具体的な強みや特徴を複数盛り込み、50文字以上で魅力が伝わるように解説した文章。",
      "goodHighlight": "最も称賛すべきユニークな点を1つだけ挙げてください",
      "nextTip": "さらに作品を昇華させるための中心的なアドバイスを1つだけ提案してください"
    }
  }
}

上記のJSON形式で、写真作品の魅力と特徴を具体的に言語化してください。`

    const generated = await callGeminiAPI(prompt, 0.3, 4096, visionImages)
    const analysisResult = parseAnalysisResult(generated)

    const dm = analysisResult.detailedMetrics;
    const evalSummaries = {
      summaries: {
        overall: dm?.overall?.headline || '総合的な評価の生成に失敗しました。',
        technology: dm?.technology?.goodHighlight || '具体的な技術的ポイントの分析に失敗しました。',
        expertise: dm?.expertise?.goodHighlight || '専門性に関する分析に失敗しました。',
        creativity: dm?.creativity?.goodHighlight || '創造性に関する分析に失敗しました。',
        impact: dm?.impact?.goodHighlight || '影響力に関する分析に失敗しました。'
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      evaluation: evalSummaries,
      contentType: '写真',
      analysisType: 'photo_specialized_analysis_v2',
      rawResponse: generated
    })

  } catch (err) {
    return handleAnalysisError(err)
  }
}