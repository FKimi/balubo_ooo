import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userIdが必要です" }, { status: 400 });
  }

  // Service Role Keyを使用してRLSをバイパス
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Supabase設定エラー" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // フォロワーのIDを取得
    const { data: followData, error: followError } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("following_id", userId);

    if (followError) {
      console.error("フォロー関係取得エラー:", followError);
      return NextResponse.json(
        { error: "フォロー関係の取得に失敗しました" },
        { status: 500 },
      );
    }

    if (!followData || followData.length === 0) {
      return NextResponse.json([]);
    }

    // フォロワーのプロフィール情報を取得（公開プロフィールのみ）
    const followerIds = followData.map((item) => item.follower_id);
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, display_name, bio, avatar_image_url, professions")
      .in("user_id", followerIds)
      .eq("portfolio_visibility", "public");

    if (profileError) {
      console.error("プロフィール取得エラー:", profileError);
      return NextResponse.json(
        { error: "プロフィール取得に失敗しました" },
        { status: 500 },
      );
    }

    // データを整形
    const formattedFollowers =
      profiles?.map((profile) => ({
        id: profile.user_id,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_image_url: profile.avatar_image_url,
        professions: profile.professions || [],
      })) || [];

    return NextResponse.json(formattedFollowers);
  } catch (error) {
    console.error("フォロワー取得エラー:", error);
    return NextResponse.json(
      { error: "フォロワー取得に失敗しました" },
      { status: 500 },
    );
  }
}
