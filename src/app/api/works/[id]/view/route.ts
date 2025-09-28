import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    // URLからidを抽出
    const url = new URL(req.url);
    const match = url.pathname.match(/\/api\/works\/(.+)\/view/);
    const workId = match ? match[1] : null;
    if (!workId) {
      return NextResponse.json({ error: "作品IDが必要です" }, { status: 400 });
    }

    console.log("閲覧数API: 作品ID =", workId);

    // Service Role Keyを使ってRLSをバイパス
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // まず現在のview_countを取得
    const { data: currentData, error: fetchError } = await supabase
      .from("works")
      .select("view_count")
      .eq("id", workId)
      .single();

    if (fetchError) {
      console.error("作品取得エラー:", fetchError);
      throw new Error("作品が見つかりません");
    }

    // view_countを1増やして更新
    const newViewCount = (currentData.view_count || 0) + 1;
    const { data, error } = await supabase
      .from("works")
      .update({ view_count: newViewCount })
      .eq("id", workId)
      .select("view_count");

    if (error) {
      console.error("閲覧数の更新エラー:", error);
      throw new Error("閲覧数の更新に失敗しました");
    }

    console.log("閲覧数API: 更新後のview_count =", data?.[0]?.view_count);

    console.log("閲覧数API: 更新成功 - 作品ID =", workId);
    return NextResponse.json({
      success: true,
      message: "閲覧数を更新しました",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "サーバーエラーが発生しました";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
