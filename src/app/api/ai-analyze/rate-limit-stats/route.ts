import { NextRequest, NextResponse } from "next/server";
import { getRateLimitStats } from "../utils/ai-analyzer";

// Gemini APIのレート制限統計情報を取得するAPIエンドポイント
export async function GET(_request: NextRequest) {
  try {
    const stats = getRateLimitStats();

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        timestamp: new Date().toISOString(),
        geminiPlan: "Tier 1 (無料枠 + 課金設定)",
        rateLimits: {
          "gemini-1.5-flash": "15 RPM (1分間に15リクエスト)",
          "gemini-1.5-pro": "2 RPM (1分間に2リクエスト)",
        },
        tips: [
          "レート制限エラーが発生した場合、自動的にリトライ処理が実行されます",
          "頻繁にレート制限に引っかかる場合は、API呼び出し間隔を調整してください",
          "より高いレート制限が必要な場合は、上位プランへのアップグレードを検討してください",
        ],
      },
    });
  } catch (error) {
    console.error("Rate limit stats API error:", error);
    return NextResponse.json(
      {
        error: "統計情報の取得に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
