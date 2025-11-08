import { NextResponse } from "next/server";

// 複数のGemini APIキーを管理
const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_BACKUP,
  process.env.GEMINI_API_KEY_THIRD,
].filter(Boolean); // undefinedを除外

if (GEMINI_API_KEYS.length === 0) {
  console.error("No GEMINI_API_KEY is set in environment variables");
  throw new Error("No GEMINI_API_KEY is set in environment variables");
}

// APIキーの使用状況を追跡
let currentApiKeyIndex = 0;
const apiKeyFailures: { [key: string]: number } = {};
const MAX_FAILURES_PER_KEY = 3; // キーあたりの最大失敗回数

// 現在のAPIキーを取得
function getCurrentApiKey(): string {
  return GEMINI_API_KEYS[currentApiKeyIndex] as string;
}

// 次のAPIキーに切り替え
function switchToNextApiKey(): boolean {
  const currentKey = getCurrentApiKey();
  console.log(`🔄 APIキー切り替え: ${currentKey.substring(0, 10)}... → `);

  currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length;
  const newKey = getCurrentApiKey();

  console.log(`🔄 新しいAPIキー: ${newKey.substring(0, 10)}...`);
  console.log(`📊 利用可能なAPIキー数: ${GEMINI_API_KEYS.length}`);

  return true;
}

// APIキーの失敗を記録
function recordApiKeyFailure(apiKey: string): void {
  apiKeyFailures[apiKey] = (apiKeyFailures[apiKey] || 0) + 1;
  console.log(
    `❌ APIキー失敗記録: ${apiKey.substring(0, 10)}... (${apiKeyFailures[apiKey]}/${MAX_FAILURES_PER_KEY})`,
  );

  if (apiKeyFailures[apiKey] >= MAX_FAILURES_PER_KEY) {
    console.warn(`⚠️ APIキーが制限に達しました: ${apiKey.substring(0, 10)}...`);
  }
}

// 利用可能なAPIキーがあるかチェック
function hasAvailableApiKey(): boolean {
  return GEMINI_API_KEYS.some(
    (key) => key && (apiKeyFailures[key] || 0) < MAX_FAILURES_PER_KEY,
  );
}

// APIキーの使用状況を取得
function getApiKeyStatus(): {
  [key: string]: { failures: number; isAvailable: boolean };
} {
  const status: { [key: string]: { failures: number; isAvailable: boolean } } =
    {};

  GEMINI_API_KEYS.forEach((key) => {
    if (key) {
      const failures = apiKeyFailures[key] || 0;
      status[key.substring(0, 10) + "..."] = {
        failures,
        isAvailable: failures < MAX_FAILURES_PER_KEY,
      };
    }
  });

  return status;
}

// APIキーの使用状況をログ出力
function logApiKeyStatus(): void {
  console.log("📊 APIキー使用状況:");
  const status = getApiKeyStatus();
  Object.entries(status).forEach(([key, info]) => {
    const statusIcon = info.isAvailable ? "✅" : "❌";
    console.log(
      `  ${statusIcon} ${key}: 失敗${info.failures}/${MAX_FAILURES_PER_KEY}回`,
    );
  });
}

// 共通の型定義
export interface AnalysisRequest {
  description?: string;
  title?: string;
  url?: string;
  fullContent?: string;
  productionNotes?: string;
  uploadedFiles?: any[];
  fileCount?: number;
  designTools?: string[];
  imageFiles?: any[];
  contentType?: string;
}

export interface AnalysisResult {
  tags: string[];
  keywords: string[];
  category: string;
  summary: string;
  detailedAnalysis: {
    genreClassification: string;
    technicalAnalysis: string;
    styleCharacteristics: string;
    targetAndPurpose: string;
    uniqueValueProposition: string;
    professionalAssessment: string;
  };
  tagClassification: {
    genre: string[];
    technique: string[];
    style: string[];
    purpose: string[];
    quality: string[];
    unique: string[];
  };
  contentTypeAnalysis: string;
  strengths: {
    creativity: string[];
    expertise: string[];
    impact: string[];
  };
  improvementSuggestions: string[];
  professionalInsights: {
    marketPositioning: string;
    scalabilityPotential: string;
    industryTrends: string;
  };
  oneLinerSummary: string;
  tagCloud: string[];
  contentAnalysis: {
    problem: string;
    solution: string;
    result: string;
  };
  learningPoints: string[];
  clientAppeal: string[];
  // 写真分析用の詳細メトリクス（オプショナル）
  detailedMetrics?: {
    technology?: {
      score?: number;
      headline?: string;
      goodHighlight?: string;
      nextTip?: string;
    };
    expertise?: {
      score?: number;
      headline?: string;
      goodHighlight?: string;
      nextTip?: string;
    };
    creativity?: {
      score?: number;
      headline?: string;
      goodHighlight?: string;
      nextTip?: string;
    };
    impact?: {
      score?: number;
      headline?: string;
      goodHighlight?: string;
      nextTip?: string;
    };
    overall?: {
      score?: number;
      headline?: string;
      goodHighlight?: string;
      nextTip?: string;
    };
  };
}

interface GeminiImage {
  mimeType: string;
  data: string;
}

// レート制限監視用のグローバル変数
let rateLimitCount = 0;
let lastRateLimitTime = 0;
let totalRateLimitCount = 0; // 総レート制限回数
let firstRateLimitTime = 0; // 最初のレート制限時刻
const RATE_LIMIT_WINDOW = 60000; // 1分間のウィンドウ
const RATE_LIMIT_ALERT_THRESHOLD = 3; // 3回で警告（無料トライアル終了により厳格化）
const RATE_LIMIT_CRITICAL_THRESHOLD = 5; // 5回でクリティカル（無料トライアル終了により厳格化）

// エクスポネンシャルバックオフでリトライ処理を実装
async function callGeminiAPIWithRetry(
  prompt: string,
  temperature: number = 0.3,
  maxTokens: number = 4096,
  images: GeminiImage[] = [],
  maxRetries: number = 3,
) {
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await callGeminiAPISingle(
        prompt,
        temperature,
        maxTokens,
        images,
      );

      // 成功時はレート制限カウンターをリセット
      if (attempt === 0) {
        rateLimitCount = 0;
      }

      return result;
    } catch (error: any) {
      lastError = error;

      // 401/403（未有効API・無効キー・権限不足）の場合はキー切替して即時再試行
      if (
        (error.status === 401 || error.status === 403) &&
        GEMINI_API_KEYS.length > 1
      ) {
        console.warn(
          `🔐 認可エラー(${error.status})を検知。別のAPIキーへフォールバックします。`,
        );
        if (hasAvailableApiKey()) {
          switchToNextApiKey();
          // 即時リトライ（attemptは消費しない）
          try {
            const retryResult = await callGeminiAPISingle(
              prompt,
              temperature,
              maxTokens,
              images,
            );
            return retryResult;
          } catch (retryErr: any) {
            lastError = retryErr;
          }
        }
      }

      // 429エラー（レート制限）の場合のみリトライ
      if (error.status === 429 && attempt < maxRetries) {
        const now = Date.now();

        // レート制限統計を更新
        if (now - lastRateLimitTime < RATE_LIMIT_WINDOW) {
          rateLimitCount++;
        } else {
          rateLimitCount = 1;
          lastRateLimitTime = now;
        }

        // 総レート制限回数を更新
        totalRateLimitCount++;
        if (firstRateLimitTime === 0) {
          firstRateLimitTime = now;
        }

        // 利用可能なAPIキーがある場合は切り替えを試行
        if (hasAvailableApiKey() && GEMINI_API_KEYS.length > 1) {
          console.log(`🔄 レート制限によりAPIキーを切り替えます...`);
          logApiKeyStatus();
          switchToNextApiKey();
        } else {
          console.warn(
            `⚠️ 利用可能なAPIキーがありません。全てのキーが制限に達しています。`,
          );
          logApiKeyStatus();
        }

        const delay = Math.min(2000 * Math.pow(2, attempt), 30000); // 最大30秒（無料トライアル終了により延長）
        console.log(
          `🚨 Gemini API レート制限エラー (${rateLimitCount}回目/分, 総計${totalRateLimitCount}回)`,
        );
        console.log(
          `⏳ ${delay}ms後にリトライします... (試行 ${attempt + 1}/${maxRetries + 1})`,
        );

        // レート制限が頻繁に発生している場合は警告
        if (rateLimitCount >= RATE_LIMIT_ALERT_THRESHOLD) {
          console.warn(
            `⚠️ レート制限が頻繁に発生しています (${rateLimitCount}回/分)。API利用頻度の調整を検討してください。`,
          );
        }

        // クリティカルな状況の場合は追加の警告
        if (totalRateLimitCount >= RATE_LIMIT_CRITICAL_THRESHOLD) {
          const timeSinceFirst = Math.round(
            (now - firstRateLimitTime) / 1000 / 60,
          ); // 分単位
          console.error(
            `🚨 クリティカル: レート制限が${totalRateLimitCount}回発生 (${timeSinceFirst}分間)。Gemini APIのプラン・課金設定を確認してください。`,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // 429以外のエラーまたは最大リトライ回数に達した場合はエラーを投げる
      throw error;
    }
  }

  throw lastError;
}

async function callGeminiAPISingle(
  prompt: string,
  temperature: number = 0.3,
  maxTokens: number = 4096,
  images: GeminiImage[] = [],
) {
  // Gemini 1.5シリーズが終了したため、Gemini 2.0 Flash-Lite を使用
  // gemini-2.0-flash-lite はテキストと画像の両方に対応しており、1.5 Flashと同等の速度とコストでより高い性能を実現
  const model = "gemini-2.0-flash-lite";
  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;
  const currentApiKey = getCurrentApiKey();
  const urlWithKey = `${endpoint}?key=${currentApiKey}`;

  // parts 配列を構築
  const parts: any[] = [];
  // 画像パート（inline_data）
  images.forEach((img) => {
    parts.push({
      inline_data: {
        mime_type: img.mimeType,
        data: img.data,
      },
    });
  });
  // テキストパートは最後にまとめて追加
  parts.push({ text: prompt });

  const response = await fetch(urlWithKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const currentApiKey = getCurrentApiKey();

    console.error("=== Gemini API Error ===");
    console.error("使用中のAPIキー:", currentApiKey.substring(0, 10) + "...");
    console.error("ステータス:", response.status);
    console.error("ステータステキスト:", response.statusText);
    console.error("エラーデータ:", JSON.stringify(errorData, null, 2));
    console.error("エラーデータ型:", typeof errorData);
    console.error("エラーデータキー:", Object.keys(errorData));
    
    // エラーデータの詳細を確認
    if (errorData && typeof errorData === "object") {
      if (errorData.error) {
        console.error("errorData.error:", JSON.stringify(errorData.error, null, 2));
        if (errorData.error.message) {
          console.error("errorData.error.message:", errorData.error.message);
        }
        if (errorData.error.code) {
          console.error("errorData.error.code:", errorData.error.code);
        }
        if (errorData.error.status) {
          console.error("errorData.error.status:", errorData.error.status);
        }
      }
      if (errorData.message) {
        console.error("errorData.message:", errorData.message);
      }
    }
    
    console.error("レスポンスヘッダー:", Object.fromEntries(response.headers.entries()));
    console.error("=======================");

    // APIキーの失敗を記録
    recordApiKeyFailure(currentApiKey);

    // エラーメッセージの適切な処理
    let errorMessage = `HTTP ${response.status}`;
    const errorDetails: any = {
      status: response.status,
      statusText: response.statusText,
      apiKey: currentApiKey.substring(0, 10) + "...",
    };

    if (errorData && typeof errorData === "object") {
      if (typeof errorData.error === "string") {
        errorMessage = errorData.error;
        errorDetails.errorMessage = errorData.error;
      } else if (errorData.error && typeof errorData.error === "object") {
        if (
          errorData.error.message &&
          typeof errorData.error.message === "string"
        ) {
          errorMessage = errorData.error.message;
          errorDetails.errorMessage = errorData.error.message;
          errorDetails.errorCode = errorData.error.code;
          errorDetails.errorStatus = errorData.error.status;
        } else {
          try {
            errorMessage = JSON.stringify(errorData.error, null, 2);
            errorDetails.errorObject = errorData.error;
          } catch (stringifyError) {
            errorMessage = "Gemini APIエラー（詳細不明）";
          }
        }
      } else if (errorData.message && typeof errorData.message === "string") {
        errorMessage = errorData.message;
        errorDetails.errorMessage = errorData.message;
      }
      
      // エラーデータ全体を保存
      errorDetails.fullErrorData = errorData;
    }

    // 返却用の Error に追加情報を付与
    const err: any = new Error(`AI分析に失敗しました: ${errorMessage}`);
    err.status = response.status;
    err.code =
      response.status === 429 || /rate limit|quota/i.test(errorMessage)
        ? "RATE_LIMIT"
        : "GEMINI_ERROR";
    err.isRateLimit = err.code === "RATE_LIMIT";
    err.errorDetails = errorDetails; // エラー詳細を追加
    throw err;
  }

  const data = await response.json();
  console.log("=== Gemini API Response ===");
  console.log("レスポンスデータ:", data);
  console.log("レスポンスデータ型:", typeof data);
  console.log("レスポンスデータキー:", Object.keys(data));
  console.log("==========================");

  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!generatedText) {
    console.error("=== Gemini API Response Error ===");
    console.error("生成されたテキストがありません");
    console.error("candidates:", data.candidates);
    console.error("candidates[0]:", data.candidates?.[0]);
    console.error("content:", data.candidates?.[0]?.content);
    console.error("parts:", data.candidates?.[0]?.content?.parts);
    console.error("===============================");
    throw new Error("AI分析結果が取得できませんでした");
  }

  return generatedText;
}

// 外部から呼び出すメイン関数（リトライ機能付き）
export async function callGeminiAPI(
  prompt: string,
  temperature: number = 0.3,
  maxTokens: number = 4096,
  images: GeminiImage[] = [],
) {
  return await callGeminiAPIWithRetry(prompt, temperature, maxTokens, images);
}

// レート制限統計情報を取得する関数
export function getRateLimitStats() {
  const now = Date.now();
  const timeSinceLastRateLimit = now - lastRateLimitTime;

  return {
    rateLimitCount,
    lastRateLimitTime:
      lastRateLimitTime > 0 ? new Date(lastRateLimitTime).toISOString() : null,
    timeSinceLastRateLimit: timeSinceLastRateLimit,
    isRecentRateLimit: timeSinceLastRateLimit < RATE_LIMIT_WINDOW,
    recommendation:
      rateLimitCount >= 3
        ? "レート制限が頻繁に発生しています。API利用頻度の調整または上位プランへのアップグレードを検討してください。"
        : "正常な利用状況です。",
  };
}

// JSONパース用の共通関数
export function parseAnalysisResult(generatedText: string): AnalysisResult {
  try {
    const cleanedText = cleanJsonString(generatedText);
    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError);
    console.error("Generated Text:", generatedText);

    // パースに失敗した場合のフォールバック
    return {
      tags: ["AI分析"],
      keywords: ["自動生成"],
      category: "その他",
      summary: "AI分析結果の解析に失敗しました",
      detailedAnalysis: {
        genreClassification: "分析に失敗しました",
        technicalAnalysis: "分析に失敗しました",
        styleCharacteristics: "分析に失敗しました",
        targetAndPurpose: "分析に失敗しました",
        uniqueValueProposition: "分析に失敗しました",
        professionalAssessment: "分析に失敗しました",
      },
      tagClassification: {
        genre: ["分析失敗"],
        technique: ["分析失敗"],
        style: ["分析失敗"],
        purpose: ["分析失敗"],
        quality: ["分析失敗"],
        unique: ["分析失敗"],
      },
      contentTypeAnalysis: "分析に失敗しました",
      strengths: {
        creativity: ["ユニークな作品"],
        expertise: ["ユニークな作品"],
        impact: ["ユニークな作品"],
      },
      improvementSuggestions: ["分析を再実行してください"],
      professionalInsights: {
        marketPositioning: "分析に失敗しました",
        scalabilityPotential: "分析に失敗しました",
        industryTrends: "分析に失敗しました",
      },
      oneLinerSummary: "分析に失敗しました",
      tagCloud: ["#分析失敗"],
      contentAnalysis: {
        problem: "分析に失敗しました",
        solution: "分析に失敗しました",
        result: "分析に失敗しました",
      },
      learningPoints: ["分析を再実行してください"],
      clientAppeal: ["分析を再実行してください"],
    };
  }
}

// -----------------------------
// JSON 文字列のクリーンアップ & 簡易リペア
// -----------------------------
function cleanJsonString(str: string): string {
  let txt = str
    .replace(/```[a-zA-Z]*\n?/g, "") // コードフェンス除去
    .replace(/^[^\{]*\{/, "{") // 先頭の { より前を削除
    .replace(/\}[^\}]*$/, "}") // 末尾の } 以降を削除
    .replace(/[“”]/g, '"') // 全角ダブルクォート
    .replace(/[‘’]/g, "'") // 全角シングルクォート
    .trim();

  // 末尾カンマ → 削除  ,}\n など
  txt = txt.replace(/,\s*}/g, "}");
  txt = txt.replace(/,\s*]/g, "]");

  return txt;
}

// 共通のエラーハンドリング
export function handleAnalysisError(error: any) {
  console.error("=== AI Analysis Error ===");
  console.error("エラー:", error);
  console.error("エラー型:", typeof error);
  console.error(
    "エラーメッセージ:",
    error instanceof Error ? error.message : "Unknown error",
  );
  console.error(
    "エラースタック:",
    error instanceof Error ? error.stack : "No stack trace",
  );
  console.error("=======================");

  // エラーの種類に応じて適切なメッセージを返す
  let errorMessage = "AI分析中にエラーが発生しました";
  let statusCode = 500;
  let statusFromError: number | undefined;
  let isRateLimit = false;

  if (error instanceof Error) {
    const messageLower = error.message.toLowerCase();
    statusFromError = (error as any).status as number | undefined;
    isRateLimit =
      (error as any).isRateLimit ||
      messageLower.includes("rate limit") ||
      messageLower.includes("quota");

    if (error.message.includes("GEMINI_API_KEY")) {
      errorMessage =
        "AI分析の設定に問題があります。GEMINI_API_KEYが設定されていません。";
      statusCode = 500;
    } else if (isRateLimit || statusFromError === 429) {
      // レート制限の詳細情報を含むメッセージ
      const timeSinceFirst =
        firstRateLimitTime > 0
          ? Math.round((Date.now() - firstRateLimitTime) / 1000 / 60)
          : 0;
      const isFrequent = totalRateLimitCount >= RATE_LIMIT_ALERT_THRESHOLD;

      if (isFrequent) {
        errorMessage = `現在AI分析の上限に達しています。\n\n・${totalRateLimitCount}回の制限が発生しています（${timeSinceFirst}分間）\n・Google Cloud Platformの無料トライアルが終了している可能性があります\n・数分〜10分ほど待ってから再度お試しください\n・継続するにはGoogle Cloud PlatformとGemini APIの有料プランへのアップグレードをご検討ください\n\n頻繁に制限が発生しているため、しばらく時間を置いてからご利用ください。`;
      } else {
        errorMessage =
          "現在AI分析の上限に達しています。Google Cloud Platformの無料トライアル終了により制限が厳しくなっている可能性があります。数分〜10分ほど待ってから再度お試しください。継続するには有料プランへのアップグレードをご検討ください。";
      }
      statusCode = 429;
    } else if (error.message.includes("AI分析に失敗しました")) {
      errorMessage = error.message;
      statusCode = statusFromError || 500;
    } else {
      errorMessage = `AI分析エラー: ${error.message}`;
      statusCode = statusFromError || 500;
    }
  }

  // エラー詳細を取得
  const errorDetails = (error as any)?.errorDetails || null;
  
  return NextResponse.json(
    {
      error: errorMessage,
      details: error instanceof Error ? error.message : "Unknown error",
      errorType: typeof error,
      timestamp: new Date().toISOString(),
      errorDetails: errorDetails, // エラー詳細を追加
      status: statusFromError || statusCode,
      isRateLimit: isRateLimit || statusFromError === 429,
    },
    { status: statusCode },
  );
}

// ファイル情報の処理
export function processFileInfo(uploadedFiles?: any[], fileCount?: number) {
  if (!uploadedFiles || uploadedFiles.length === 0) return "";

  return `
アップロードされたファイル情報:
- ファイル数: ${fileCount || uploadedFiles.length}個
- ファイル詳細:
${uploadedFiles
  .map(
    (file: any, index: number) =>
      `  ${index + 1}. ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)}KB)`,
  )
  .join("\n")}
`;
}

// 画像ファイルの処理
export function processImageFiles(imageFiles?: any[]) {
  if (!imageFiles || imageFiles.length === 0) return "";

  const validImageFiles = imageFiles.filter(
    (file: any) =>
      file.data &&
      !file.data.startsWith("[ファイルサイズが大きすぎる") &&
      !file.data.startsWith("[ファイル読み込みエラー]") &&
      !file.data.startsWith("[トークン数が多すぎる"),
  );

  if (validImageFiles.length > 0) {
    // トークン数を削減するため、画像データを短縮
    return `
【重要】アップロードされた画像ファイルの詳細分析対象:
${validImageFiles
  .map((imageFile: any, index: number) => {
    // Base64データを短縮（最初の1000文字のみ）
    const shortData =
      imageFile.data.length > 1000
        ? imageFile.data.substring(0, 1000) + "...(データが長いため省略)"
        : imageFile.data;

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
- ターゲット層への訴求力`;
  })
  .join("\n\n")}
`;
  } else {
    return `
アップロードされた画像ファイル（メタデータのみ）:
${imageFiles
  .map(
    (imageFile: any, index: number) =>
      `画像${index + 1}: ${imageFile.name} - ${imageFile.data}`,
  )
  .join("\n")}
`;
  }
}

// 使用ツール情報の処理
export function processToolsInfo(designTools?: string[]) {
  if (!designTools || designTools.length === 0) return "";
  return `使用ツール: ${designTools.join(", ")}`;
}
