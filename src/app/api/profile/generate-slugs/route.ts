import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateUserSlug } from "@/utils/slug";

export async function POST(_request: NextRequest) {
  try {
    // Service Role Keyを使用してRLSをバイパス
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Supabase設定エラー" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // スラッグが設定されていないプロフィールを取得
    const { data: profiles, error: fetchError } = await supabase
      .from("profiles")
      .select("user_id, display_name, slug")
      .or("slug.is.null,slug.eq.")
      .not("display_name", "is", null)
      .not("display_name", "eq", "");

    if (fetchError) {
      console.error("プロフィール取得エラー:", fetchError);
      return NextResponse.json(
        { error: "プロフィール取得エラー" },
        { status: 500 },
      );
    }

    console.log("取得したプロフィール:", profiles);

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        message: "スラッグを生成するプロフィールがありません",
        processed: 0,
        debug: { profiles },
      });
    }

    let processed = 0;
    const results = [];

    for (const profile of profiles) {
      if (!profile.display_name) continue;

      const baseSlug = generateUserSlug(profile.display_name);
      if (!baseSlug) continue;

      // スラッグの重複チェックと調整
      let finalSlug = baseSlug;
      let counter = 1;

      while (true) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("slug", finalSlug)
          .neq("user_id", profile.user_id)
          .single();

        if (!existingProfile) {
          break;
        }

        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      // スラッグを更新
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ slug: finalSlug })
        .eq("user_id", profile.user_id);

      if (updateError) {
        console.error(`スラッグ更新エラー (${profile.user_id}):`, updateError);
        results.push({
          user_id: profile.user_id,
          display_name: profile.display_name,
          slug: finalSlug,
          status: "error",
          error: updateError.message,
        });
      } else {
        processed++;
        results.push({
          user_id: profile.user_id,
          display_name: profile.display_name,
          slug: finalSlug,
          status: "success",
        });
      }
    }

    return NextResponse.json({
      message: `${processed}件のプロフィールにスラッグを生成しました`,
      processed,
      total: profiles.length,
      results,
    });
  } catch (error) {
    console.error("スラッグ生成エラー:", error);
    return NextResponse.json({ error: "スラッグ生成エラー" }, { status: 500 });
  }
}
