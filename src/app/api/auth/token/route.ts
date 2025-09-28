import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 動的レンダリングを強制
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Cookieからセッション情報を取得
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json(
        {
          error: "No session cookie found",
          authenticated: false,
        },
        { status: 401 },
      );
    }

    // セッションからトークンを抽出する（簡易版）
    // 実際の実装では、Supabaseセッション管理を使用
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json(
        {
          error: "No valid session found",
          authenticated: false,
          details: error?.message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      authenticated: true,
      token: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("Token API error:", error);
    return NextResponse.json(
      {
        error: "Failed to get authentication token",
        authenticated: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
