import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL environment variable is required for /api/works/public/[id]",
  );
}

if (!supabaseServiceKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY environment variable is required for /api/works/public/[id]",
  );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "作品IDが指定されていません" },
      { status: 400 },
    );
  }

  try {
    const { data: work, error } = await supabaseAdmin
      .from("works")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !work) {
      return NextResponse.json(
        { error: "指定された作品が見つかりません" },
        { status: 404 },
      );
    }

    let profile: Record<string, any> | null = null;
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select(
        "user_id, display_name, avatar_image_url, slug, professions, bio, company, title",
      )
      .eq("user_id", work.user_id)
      .single();

    if (profileError) {
      console.info("作品詳細API: プロフィール取得はスキップしました", {
        id,
        error: profileError.message,
      });
    } else if (profileData) {
      profile = profileData;
    }

    return NextResponse.json({
      work,
      profile,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("作品詳細API: 予期しないエラーが発生しました", {
      id,
      error,
    });
    return NextResponse.json(
      { error: "作品情報の取得に失敗しました" },
      { status: 500 },
    );
  }
}

