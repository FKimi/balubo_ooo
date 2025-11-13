import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL environment variable is required for /api/comments/public",
  );
}

if (!supabaseServiceKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY environment variable is required for /api/comments/public",
  );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const workId = searchParams.get("workId");

  if (!workId) {
    return NextResponse.json(
      { error: "作品IDが指定されていません" },
      { status: 400 },
    );
  }

  try {
    const { data: comments, error: commentsError } = await supabaseAdmin
      .from("comments")
      .select("*")
      .eq("target_type", "work")
      .eq("target_id", workId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (commentsError) {
      console.error("公開コメント取得エラー:", commentsError);
      return NextResponse.json(
        { error: "コメントの取得に失敗しました" },
        { status: 500 },
      );
    }

    const commentsWithProfiles = await Promise.all(
      (comments || []).map(async (comment) => {
        const { data: profile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("id, display_name, avatar_image_url")
          .eq("user_id", comment.user_id)
          .single();

        if (profileError) {
          console.warn("公開コメントAPI: プロフィール取得に失敗しました", {
            commentId: comment.id,
            error: profileError.message,
          });
        }

        return {
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          user: profile || {
            id: comment.user_id,
            display_name: "ユーザー",
            avatar_image_url: null,
          },
        };
      }),
    );

    const { count, error: countError } = await supabaseAdmin
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("target_type", "work")
      .eq("target_id", workId);

    if (countError) {
      console.warn("公開コメントAPI: コメント数取得に失敗しました", countError);
    }

    return NextResponse.json({
      comments: commentsWithProfiles,
      count: count ?? commentsWithProfiles.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("公開コメントAPIで予期しないエラーが発生:", error);
    return NextResponse.json(
      { error: "コメントの取得に失敗しました" },
      { status: 500 },
    );
  }
}

