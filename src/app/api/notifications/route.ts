import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is required");
}

if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// 通知一覧取得
export async function GET(request: NextRequest) {
  try {
    console.log("通知API: リクエスト開始");

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("通知API: 認証ヘッダーがありません");
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("通知API: トークンがありません");
      return NextResponse.json(
        { error: "トークンが必要です" },
        { status: 401 },
      );
    }

    const decoded = jwt.decode(token) as any;
    if (!decoded?.sub) {
      console.log("通知API: 無効なトークンです");
      return NextResponse.json(
        { error: "無効なトークンです" },
        { status: 401 },
      );
    }

    const userId = decoded.sub;
    console.log("通知API: ユーザーID確認", { userId });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // 通知を取得
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("通知取得エラー:", error);
      return NextResponse.json(
        { error: "通知の取得に失敗しました" },
        { status: 500 },
      );
    }

    // 未読件数を取得
    const { count: unreadCount, error: countError } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (countError) {
      console.error("未読件数取得エラー:", countError);
    }

    const result = {
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
      pagination: {
        page,
        limit,
        hasMore: (notifications?.length || 0) === limit,
      },
    };

    console.log("通知API: レスポンス", {
      notificationsCount: result.notifications.length,
      unreadCount: result.unreadCount,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("通知取得エラー:", error);
    return NextResponse.json(
      {
        error: "サーバーエラーが発生しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// 通知を既読にマーク
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "トークンが必要です" },
        { status: 401 },
      );
    }

    const decoded = jwt.decode(token) as any;
    if (!decoded?.sub) {
      return NextResponse.json(
        { error: "無効なトークンです" },
        { status: 401 },
      );
    }

    const userId = decoded.sub;
    const { notificationIds, markAllAsRead } = await request.json();

    if (markAllAsRead) {
      // すべての通知を既読にマーク
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) {
        console.error("通知既読マークエラー:", error);
        return NextResponse.json(
          { error: "通知の既読マークに失敗しました" },
          { status: 500 },
        );
      }
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // 指定された通知を既読にマーク
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .in("id", notificationIds);

      if (error) {
        console.error("通知既読マークエラー:", error);
        return NextResponse.json(
          { error: "通知の既読マークに失敗しました" },
          { status: 500 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "notificationIdsまたはmarkAllAsReadが必要です" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("通知既読マークエラー:", error);
    return NextResponse.json(
      {
        error: "サーバーエラーが発生しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
