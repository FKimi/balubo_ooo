import { NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables')
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

// 共通の型定義
export interface AnalysisRequest {
  description?: string
  title?: string
  url?: string
  fullContent?: string
  productionNotes?: string
  uploadedFiles?: any[]
  fileCount?: number
  designTools?: string[]
  imageFiles?: any[]
  contentType?: string
}

export interface AnalysisResult {
  tags: string[]
  keywords: string[]
  category: string
  summary: string
  detailedAnalysis: {
    genreClassification: string
    technicalAnalysis: string
    styleCharacteristics: string
    targetAndPurpose: string
    uniqueValueProposition: string
    professionalAssessment: string
  }
  tagClassification: {
    genre: string[]
    technique: string[]
    style: string[]
    purpose: string[]
    quality: string[]
    unique: string[]
  }
  contentTypeAnalysis: string
  strengths: {
    creativity: string[]
    expertise: string[]
    impact: string[]
  }
  improvementSuggestions: string[]
  professionalInsights: {
    marketPositioning: string
    scalabilityPotential: string
    industryTrends: string
  }
  oneLinerSummary: string
  tagCloud: string[]
  detailedMetrics: {
    technology: {
      score: number
      headline: string
      goodHighlight: string
      nextTip: string
    }
    expertise: {
      score: number
      headline: string
      goodHighlight: string
      nextTip: string
    }
    creativity: {
      score: number
      headline: string
      goodHighlight: string
      nextTip: string
    }
    impact: {
      score: number
      headline: string
      goodHighlight: string
      nextTip: string
    }
    overall: {
      score: number
      headline: string
      goodHighlight: string
      nextTip: string
    }
  }
  learningPoints: string[]
  clientAppeal: string[]
}

interface GeminiImage {
  mimeType: string
  data: string
}

export async function callGeminiAPI(prompt: string, temperature: number = 0.3, maxTokens: number = 4096, images: GeminiImage[] = []) {
  // v1beta では gemini-pro が利用できなくなったため、
  // 画像付き → gemini-1.5-flash、テキストのみ → gemini-1.5-pro を使用
  // 将来的に v1 (GA) へ移行する際はエンドポイントを変更すること

  // 画像がある場合は Vision 対応モデル、それ以外は 1.5 Pro を使用
  const model = images.length > 0 ? 'gemini-1.5-flash' : 'gemini-1.5-pro'
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const urlWithKey = `${endpoint}?key=${GEMINI_API_KEY}`

  // parts 配列を構築
  const parts: any[] = []
  // 画像パート（inline_data）
  images.forEach(img => {
    parts.push({
      inline_data: {
        mime_type: img.mimeType,
        data: img.data
      }
    })
  })
  // テキストパートは最後にまとめて追加
  parts.push({ text: prompt })

  const response = await fetch(urlWithKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: maxTokens,
      }
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('=== Gemini API Error ===')
    console.error('ステータス:', response.status)
    console.error('エラーデータ:', errorData)
    console.error('エラーデータ型:', typeof errorData)
    console.error('エラーデータキー:', Object.keys(errorData))
    console.error('=======================')
    
    // エラーメッセージの適切な処理
    let errorMessage = `HTTP ${response.status}`
    
    if (errorData && typeof errorData === 'object') {
      if (typeof errorData.error === 'string') {
        errorMessage = errorData.error
      } else if (errorData.error && typeof errorData.error === 'object') {
        if (errorData.error.message && typeof errorData.error.message === 'string') {
          errorMessage = errorData.error.message
        } else {
          try {
            errorMessage = JSON.stringify(errorData.error, null, 2)
          } catch (stringifyError) {
            errorMessage = 'Gemini APIエラー（詳細不明）'
          }
        }
      } else if (errorData.message && typeof errorData.message === 'string') {
        errorMessage = errorData.message
      }
    }
    
    throw new Error(`AI分析に失敗しました: ${errorMessage}`)
  }

  const data = await response.json()
  console.log('=== Gemini API Response ===')
  console.log('レスポンスデータ:', data)
  console.log('レスポンスデータ型:', typeof data)
  console.log('レスポンスデータキー:', Object.keys(data))
  console.log('==========================')
  
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!generatedText) {
    console.error('=== Gemini API Response Error ===')
    console.error('生成されたテキストがありません')
    console.error('candidates:', data.candidates)
    console.error('candidates[0]:', data.candidates?.[0])
    console.error('content:', data.candidates?.[0]?.content)
    console.error('parts:', data.candidates?.[0]?.content?.parts)
    console.error('===============================')
    throw new Error('AI分析結果が取得できませんでした')
  }

  return generatedText
}

// JSONパース用の共通関数
export function parseAnalysisResult(generatedText: string): AnalysisResult {
  try {
    const cleanedText = cleanJsonString(generatedText)
    return JSON.parse(cleanedText)
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError)
    console.error('Generated Text:', generatedText)
    
    // パースに失敗した場合のフォールバック
    return {
      tags: ['AI分析'],
      keywords: ['自動生成'],
      category: 'その他',
      summary: 'AI分析結果の解析に失敗しました',
      detailedAnalysis: {
        genreClassification: '分析に失敗しました',
        technicalAnalysis: '分析に失敗しました',
        styleCharacteristics: '分析に失敗しました',
        targetAndPurpose: '分析に失敗しました',
        uniqueValueProposition: '分析に失敗しました',
        professionalAssessment: '分析に失敗しました'
      },
      tagClassification: {
        genre: ['分析失敗'],
        technique: ['分析失敗'],
        style: ['分析失敗'],
        purpose: ['分析失敗'],
        quality: ['分析失敗'],
        unique: ['分析失敗']
      },
      contentTypeAnalysis: '分析に失敗しました',
      strengths: {
        creativity: ['ユニークな作品'],
        expertise: ['ユニークな作品'],
        impact: ['ユニークな作品']
      },
      improvementSuggestions: ['分析を再実行してください'],
      professionalInsights: {
        marketPositioning: '分析に失敗しました',
        scalabilityPotential: '分析に失敗しました',
        industryTrends: '分析に失敗しました'
      },
      oneLinerSummary: '分析に失敗しました',
      tagCloud: ['#分析失敗'],
      detailedMetrics: {
        technology: {
          score: 70,
          headline: '分析に失敗しました',
          goodHighlight: '分析に失敗しました',
          nextTip: '分析を再実行してください'
        },
        expertise: {
          score: 70,
          headline: '分析に失敗しました',
          goodHighlight: '分析に失敗しました',
          nextTip: '分析を再実行してください'
        },
        creativity: {
          score: 70,
          headline: '分析に失敗しました',
          goodHighlight: '分析に失敗しました',
          nextTip: '分析を再実行してください'
        },
        impact: {
          score: 70,
          headline: '分析に失敗しました',
          goodHighlight: '分析に失敗しました',
          nextTip: '分析を再実行してください'
        },
        overall: {
          score: 70,
          headline: '分析に失敗しました',
          goodHighlight: '分析に失敗しました',
          nextTip: '分析を再実行してください'
        }
      },
      learningPoints: ['分析を再実行してください'],
      clientAppeal: ['分析を再実行してください']
    }
  }
}

// -----------------------------
// JSON 文字列のクリーンアップ & 簡易リペア
// -----------------------------
function cleanJsonString(str: string): string {
  let txt = str
    .replace(/```[a-zA-Z]*\n?/g, '') // コードフェンス除去
    .replace(/^[^\{]*\{/, '{')      // 先頭の { より前を削除
    .replace(/\}[^\}]*$/, '}')      // 末尾の } 以降を削除
    .replace(/[“”]/g, '"')           // 全角ダブルクォート
    .replace(/[‘’]/g, "'")           // 全角シングルクォート
    .trim()

  // 末尾カンマ → 削除  ,}\n など
  txt = txt.replace(/,\s*}/g, '}')
  txt = txt.replace(/,\s*]/g, ']')

  return txt
}

// 共通のエラーハンドリング
export function handleAnalysisError(error: any) {
  console.error('=== AI Analysis Error ===')
  console.error('エラー:', error)
  console.error('エラー型:', typeof error)
  console.error('エラーメッセージ:', error instanceof Error ? error.message : 'Unknown error')
  console.error('エラースタック:', error instanceof Error ? error.stack : 'No stack trace')
  console.error('=======================')
  
  // エラーの種類に応じて適切なメッセージを返す
  let errorMessage = 'AI分析中にエラーが発生しました'
  let statusCode = 500
  
  if (error instanceof Error) {
    if (error.message.includes('GEMINI_API_KEY')) {
      errorMessage = 'AI分析の設定に問題があります。GEMINI_API_KEYが設定されていません。'
      statusCode = 500
    } else if (error.message.includes('AI分析に失敗しました')) {
      errorMessage = error.message
      statusCode = 500
    } else {
      errorMessage = `AI分析エラー: ${error.message}`
      statusCode = 500
    }
  }
  
  return NextResponse.json(
    { 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
      errorType: typeof error,
      timestamp: new Date().toISOString()
    },
    { status: statusCode }
  )
}

// ファイル情報の処理
export function processFileInfo(uploadedFiles?: any[], fileCount?: number) {
  if (!uploadedFiles || uploadedFiles.length === 0) return ''
  
  return `
アップロードされたファイル情報:
- ファイル数: ${fileCount || uploadedFiles.length}個
- ファイル詳細:
${uploadedFiles.map((file: any, index: number) => 
  `  ${index + 1}. ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)}KB)`
).join('\n')}
`
}

// 画像ファイルの処理
export function processImageFiles(imageFiles?: any[]) {
  if (!imageFiles || imageFiles.length === 0) return ''
  
  const validImageFiles = imageFiles.filter((file: any) => 
    file.data && !file.data.startsWith('[ファイルサイズが大きすぎる') && !file.data.startsWith('[ファイル読み込みエラー]') && !file.data.startsWith('[トークン数が多すぎる')
  )
  
  if (validImageFiles.length > 0) {
    // トークン数を削減するため、画像データを短縮
    return `
【重要】アップロードされた画像ファイルの詳細分析対象:
${validImageFiles.map((imageFile: any, index: number) => {
  // Base64データを短縮（最初の1000文字のみ）
  const shortData = imageFile.data.length > 1000 ? 
    imageFile.data.substring(0, 1000) + '...(データが長いため省略)' : 
    imageFile.data
    
  return `画像${index + 1}: ${imageFile.name}
ファイル形式: ${imageFile.type}
ファイルサイズ: ${(imageFile.size / 1024).toFixed(1)}KB
画像内容（短縮版）: ${shortData}

この画像について以下の観点から詳細に分析してください：
- 視覚的要素（色彩、構図、スタイル、技法）
- デザインの特徴と品質
- 技術的な完成度
- ブランド価値や市場適合性
- 創造性と独創性
- 使用されているデザイン要素（タイポグラフィ、アイコン、レイアウトなど）
- 感情やメッセージの伝達力
- ターゲット層への訴求力`
}).join('\n\n')}
`
  } else {
    return `
アップロードされた画像ファイル（メタデータのみ）:
${imageFiles.map((imageFile: any, index: number) => 
  `画像${index + 1}: ${imageFile.name} - ${imageFile.data}`
).join('\n')}
`
  }
}

// 使用ツール情報の処理
export function processToolsInfo(designTools?: string[]) {
  if (!designTools || designTools.length === 0) return ''
  return `使用ツール: ${designTools.join(', ')}`
} 