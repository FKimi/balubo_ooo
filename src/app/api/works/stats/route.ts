import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(request: NextRequest) {
  try {
    // 認証確認
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "認証が無効です" }, { status: 401 });
    }

    // 記事統計を取得
    const { data: _articleStats, error: statsError } = await supabase
      .from("user_article_stats")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (statsError && statsError.code !== "PGRST116") {
      console.error("記事統計取得エラー:", statsError);
      return NextResponse.json(
        { error: "統計の取得に失敗しました" },
        { status: 500 },
      );
    }

    // 基本統計（ビューが利用できない場合のフォールバック）
    const { data: basicStats, error: basicError } = await supabase
      .from("works")
      .select("article_word_count, article_has_content, created_at")
      .eq("user_id", user.id)
      .eq("content_type", "article");

    if (basicError) {
      console.error("基本統計取得エラー:", basicError);
      return NextResponse.json(
        { error: "統計の取得に失敗しました" },
        { status: 500 },
      );
    }

    // 統計計算
    const totalArticles = basicStats?.length || 0;
    const totalWordCount =
      basicStats?.reduce(
        (sum, article) => sum + (article.article_word_count || 0),
        0,
      ) || 0;
    const articlesWithContent =
      basicStats?.filter((article) => article.article_has_content).length || 0;
    const averageWordCount =
      totalWordCount > 0 && articlesWithContent > 0
        ? Math.round(totalWordCount / articlesWithContent)
        : 0;
    const maxWordCount =
      basicStats?.reduce(
        (max, article) => Math.max(max, article.article_word_count || 0),
        0,
      ) || 0;

    // 日付計算
    const sortedArticles =
      basicStats?.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ) || [];
    const firstArticleDate =
      sortedArticles.length > 0 ? sortedArticles[0]?.created_at : null;
    const latestArticleDate =
      sortedArticles.length > 0
        ? sortedArticles[sortedArticles.length - 1]?.created_at
        : null;

    const stats = {
      total_articles: totalArticles,
      total_word_count: totalWordCount,
      articles_with_content: articlesWithContent,
      avg_word_count: averageWordCount,
      max_word_count: maxWordCount,
      first_article_date: firstArticleDate,
      latest_article_date: latestArticleDate,
      // 追加統計
      articles_without_content: totalArticles - articlesWithContent,
      content_percentage:
        totalArticles > 0
          ? Math.round((articlesWithContent / totalArticles) * 100)
          : 0,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("記事統計API エラー:", error);
    return NextResponse.json(
      { error: "統計の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
