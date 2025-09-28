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
    // プロフィールの公開設定を確認
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .eq("portfolio_visibility", "public")
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "プロフィールが見つからないか非公開です" },
        { status: 404 },
      );
    }

    // 作品データを取得
    const { data: works, error: _worksError } = await supabase
      .from("works")
      .select(
        `
        id,
        title,
        description,
        roles,
        external_url,
        tags,
        categories,
        production_date,
        banner_image_url,
        preview_data,
        ai_analysis_result,
        created_at,
        updated_at
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // インプットデータを取得
    const { data: inputs, error: _inputsError } = await supabase
      .from("inputs")
      .select(
        `
        id,
        title,
        author_creator,
        type,
        genres,
        status,
        rating,
        favorite,
        notes,
        tags,
        external_url,
        cover_image_url,
        created_at,
        updated_at
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      profile,
      works: works || [],
      inputs: inputs || [],
    });
  } catch (error) {
    console.error("公開プロフィールデータ取得エラー:", error);
    return NextResponse.json(
      { error: "データ取得に失敗しました" },
      { status: 500 },
    );
  }
}
