import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 動的レンダリングを強制
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Service Role Keyでクライアント作成
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is required");
}

// 開発環境では service role key を置かない場合があるため、公開 anon key でフォールバック
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseKey) {
  throw new Error(
    "Supabase key is not configured. Set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId");

    console.log("フォロー統計API: リクエスト開始", { targetUserId });

    if (!targetUserId) {
      return NextResponse.json(
        { error: "ユーザーIDが必要です" },
        { status: 400 },
      );
    }

    // フォロワー数（他のユーザーから自分へのフォロー）
    const { count: followerCount, error: followerError } = await supabaseAdmin
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", targetUserId);

    if (followerError) {
      console.error("フォロワー数取得エラー:", followerError);
      return NextResponse.json(
        { error: "フォロワー数の取得に失敗しました" },
        { status: 500 },
      );
    }

    // フォロー中数（自分から他のユーザーへのフォロー）
    const { count: followingCount, error: followingError } = await supabaseAdmin
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", targetUserId);

    if (followingError) {
      console.error("フォロー中数取得エラー:", followingError);
      return NextResponse.json(
        { error: "フォロー中数の取得に失敗しました" },
        { status: 500 },
      );
    }

    const result = {
      followerCount: followerCount || 0,
      followingCount: followingCount || 0,
    };

    console.log("フォロー統計API: レスポンス", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("フォロー統計取得エラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
