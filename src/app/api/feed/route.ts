import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 動的レンダリングを強制
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// レスポンスキャッシュを追加
export const revalidate = 60; // 60秒間キャッシュに延長

interface FeedUser {
  id: string;
  display_name: string;
  avatar_image_url?: string;
}

interface FeedItem {
  id: string;
  type: "work";
  title: string;
  created_at: string;
  user: FeedUser;
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
  // work specific
  description?: string;
  external_url?: string;
  tags?: string[];
  roles?: string[];
  banner_image_url?: string;
}

interface Work {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  external_url?: string;
  tags?: string[];
  roles?: string[];
  banner_image_url?: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  console.log("=== Feed API: フィードデータ取得開始 ===");

  // リクエストタイムアウトを20秒に延長
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("リクエストタイムアウト")), 20000);
  });

  try {
    return (await Promise.race([
      timeoutPromise,
      processFeedRequest(request),
    ])) as NextResponse;
  } catch (error) {
    console.error("Feed API: タイムアウトまたはエラー:", error);

    // エラー時は空の配列を返却（デモデータの代わりに）
    return NextResponse.json({
      items: [],
      stats: { total: 0, works: 0, inputs: 0, unique_users: 0 },
      total: 0,
      pagination: { hasMore: false, nextCursor: null },
      debug: {
        message: "エラーが発生しました",
        error: true,
        errorMessage: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
    });
  }
}

async function processFeedRequest(request: NextRequest) {
  const startTime = Date.now();

  // URLパラメータから検索条件を取得
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50); // 最大50件
  const cursor = searchParams.get("cursor"); // カーソルベースページネーション
  const searchQuery = searchParams.get("q"); // 検索クエリ
  const filterType = searchParams.get("type") as "work" | null; // タイプフィルター
  const filterTag = searchParams.get("tag"); // タグフィルター
  const followingOnly = searchParams.get("followingOnly") === "true"; // フォロー中のみ

  // フィード用にService roleクライアントを作成（全ユーザーのパブリックデータにアクセス）
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

  // 認証されたユーザーの取得（簡素化）
  const authHeader = request.headers.get("authorization");
  let currentUserId = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const userSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const {
        data: { user },
      } = await userSupabase.auth.getUser(token);
      if (user) {
        currentUserId = user.id;
      }
    } catch (authError) {
      console.log("Feed API: 認証処理エラー（続行）:", authError);
    }
  }

  console.log("Feed API: Step 1 - 軽量データ取得開始", {
    limit,
    cursor,
    searchQuery,
    filterType,
    filterTag,
    followingOnly,
    currentUserId,
  });

  // フォロー中のユーザーIDを取得（フォロー中フィルターが有効な場合）
  let followingUserIds: string[] = [];
  if (followingOnly && currentUserId) {
    try {
      const { data: followData } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      followingUserIds = followData?.map((f) => f.following_id) || [];

      // フォロー中のユーザーがいない場合は空の結果を返す
      if (followingUserIds.length === 0) {
        console.log("フォロー中のユーザーがいません");
        return NextResponse.json({
          items: [],
          stats: { total: 0, works: 0, inputs: 0, unique_users: 0 },
          total: 0,
          pagination: { hasMore: false, nextCursor: null, limit },
          debug: {
            message: "フォロー中のユーザーがいません",
            followingOnly: true,
            followingCount: 0,
            timestamp: new Date().toISOString(),
          },
        });
      }

      console.log("フォロー中のユーザー数:", followingUserIds.length);
    } catch (followError) {
      console.error("フォロー関係取得エラー:", followError);
      // エラーの場合はフォローフィルターを無効化
    }
  }

  // 作品のみを取得（インプット機能は削除済み）
  let worksQuery = supabase
    .from("works")
    .select(
      "id, user_id, title, description, external_url, tags, roles, banner_image_url, created_at",
    )
    .order("created_at", { ascending: false });

  // フォロー中フィルタリング
  if (followingOnly && followingUserIds.length > 0) {
    worksQuery = worksQuery.in("user_id", followingUserIds);
  }

  // 検索クエリがある場合のフィルタリング
  if (searchQuery) {
    worksQuery = worksQuery.or(
      `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
    );
  }

  // タグフィルタリング
  if (filterTag) {
    worksQuery = worksQuery.contains("tags", [filterTag]);
  }

  // カーソルベースページネーション
  if (cursor) {
    const cursorDate = new Date(cursor).toISOString();
    worksQuery = worksQuery.lt("created_at", cursorDate);
  }

  // 作品のみを取得
  const worksPromise = worksQuery.limit(limit);

  const dataTimeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("データ取得タイムアウト")), 15000); // 15秒に延長
  });

  try {
    // works取得（タイムアウト付き）
    let worksResult;
    try {
      worksResult = await Promise.race([worksPromise, dataTimeout]);
    } catch (timeoutError) {
      console.error("Feed API: works取得タイムアウト:", timeoutError);
      throw new Error("データ取得がタイムアウトしました");
    }

    // エラーチェック
    if (worksResult.error) {
      console.error("Feed API: works取得エラー:", worksResult.error);
      throw new Error(
        `Works取得エラー: ${worksResult.error.message || JSON.stringify(worksResult.error)}`,
      );
    }

    const works = worksResult.data || [];

    console.log("Feed API: Step 2 - データ取得結果:", {
      works: works.length,
    });

    // ユーザーIDを収集
    const userIds = [...new Set(works.map((w: Work) => w.user_id))];

    // 作品IDリスト
    const workIds = works.map((w: Work) => w.id);
    const allIds = workIds;

    // likes、comments、profilesを並列取得してパフォーマンスを向上
    // SQL集約を使用してデータ転送量を削減
    let likesCountResult, userLikesResult, commentsCountResult, profilesResult;
    try {
      [likesCountResult, userLikesResult, commentsCountResult, profilesResult] =
        await Promise.all([
        // likesカウントをSQL集約で取得（全件取得ではなく集約のみ）
        allIds.length > 0
          ? supabase
              .rpc("get_likes_count", {
                work_ids: allIds,
                target_type: "work",
              })
              .catch((rpcError) => {
                // RPCが存在しない場合はフォールバック
                console.log(
                  "Feed API: RPC get_likes_countが利用できないため、フォールバックを使用",
                  rpcError,
                );
                return supabase
                  .from("likes")
                  .select("target_id, target_type")
                  .in("target_id", allIds)
                  .eq("target_type", "work");
              })
          : Promise.resolve({ data: null, error: null }),
        // 現在のユーザーのいいね状態を取得（user_has_liked判定用）
        allIds.length > 0 && currentUserId
          ? supabase
              .from("likes")
              .select("target_id")
              .in("target_id", allIds)
              .eq("target_type", "work")
              .eq("user_id", currentUserId)
          : Promise.resolve({ data: [], error: null }),
        // commentsカウントをSQL集約で取得
        allIds.length > 0
          ? supabase
              .rpc("get_comments_count", {
                work_ids: allIds,
                target_type: "work",
              })
              .catch((rpcError) => {
                // RPCが存在しない場合はフォールバック
                console.log(
                  "Feed API: RPC get_comments_countが利用できないため、フォールバックを使用",
                  rpcError,
                );
                return supabase
                  .from("comments")
                  .select("target_id, target_type")
                  .in("target_id", allIds)
                  .eq("target_type", "work");
              })
          : Promise.resolve({ data: null, error: null }),
        // プロフィール情報を一括取得（軽量化）
        userIds.length > 0
          ? supabase
              .from("profiles")
              .select("user_id, display_name, avatar_image_url")
              .in("user_id", userIds)
          : Promise.resolve({ data: null, error: null }),
      ]);
    } catch (parallelError) {
      console.error("Feed API: 並列取得エラー:", parallelError);
      // エラーが発生しても部分的にデータを返せるように、デフォルト値を設定
      likesCountResult = { data: null, error: parallelError };
      userLikesResult = { data: [], error: null };
      commentsCountResult = { data: null, error: parallelError };
      profilesResult = { data: null, error: parallelError };
    }

    // likesカウント集計（RPCまたはフォールバック）
    let likesCountMap = new Map<string, number>();
    let userLikesSet = new Set<string>();
    try {
      const likesData = likesCountResult.data || [];
      // RPCの結果が配列の場合は集約済み、オブジェクトの場合は集計が必要
      if (Array.isArray(likesData) && likesData.length > 0) {
        if (likesData[0]?.target_id) {
          // フォールバック: 全件取得の場合
          likesData.forEach((like: any) => {
            const key = `work_${like.target_id}`;
            likesCountMap.set(key, (likesCountMap.get(key) || 0) + 1);
          });
        } else if (likesData[0]?.work_id !== undefined) {
          // RPC結果: {work_id, count}形式
          likesData.forEach((item: any) => {
            const key = `work_${item.work_id}`;
            likesCountMap.set(key, item.count || 0);
          });
        }
      }
      // ユーザーのいいね状態
      const userLikesData = userLikesResult.data || [];
      userLikesData.forEach((like: any) => {
        userLikesSet.add(`work_${like.target_id}`);
      });
    } catch (e) {
      // 失敗してもfeedItemsは生成
      likesCountMap = new Map();
      userLikesSet = new Set();
    }

    // commentsカウント集計（RPCまたはフォールバック）
    let commentsCountMap = new Map<string, number>();
    try {
      const commentsData = commentsCountResult.data || [];
      if (Array.isArray(commentsData) && commentsData.length > 0) {
        if (commentsData[0]?.target_id) {
          // フォールバック: 全件取得の場合
          commentsData.forEach((c: any) => {
            const key = `work_${c.target_id}`;
            commentsCountMap.set(key, (commentsCountMap.get(key) || 0) + 1);
          });
        } else if (commentsData[0]?.work_id !== undefined) {
          // RPC結果: {work_id, count}形式
          commentsData.forEach((item: any) => {
            const key = `work_${item.work_id}`;
            commentsCountMap.set(key, item.count || 0);
          });
        }
      }
    } catch (e) {
      commentsCountMap = new Map();
    }

    // プロフィール情報を処理
    const profiles = profilesResult.data || [];
    
    // プロフィール取得エラーのログ出力
    if (profilesResult.error) {
      console.error("Feed API: プロフィール取得エラー:", profilesResult.error);
    }
    
    if (process.env.NODE_ENV === "development") {
      console.log("Feed API: プロフィール取得結果:", {
        profilesCount: profiles?.length || 0,
        userIds: userIds.length,
        profiles: profiles?.map((p: any) => p.user_id),
      });
    }

    const profileMap = new Map<string, FeedUser>(
      (profiles || []).map((p: any) => [
        p.user_id,
        {
          id: p.user_id,
          display_name: p.display_name || "ユーザー",
          avatar_image_url: p.avatar_image_url || undefined,
        },
      ]),
    );

    // フィードアイテムを統合
    const feedItems: FeedItem[] = [];

    // 作品を処理（プロフィールがない場合でもデフォルトユーザー情報で表示）
    for (const work of works) {
      let userProfile = profileMap.get(work.user_id);
      
      // プロフィールが見つからない場合はデフォルトユーザー情報を作成
      if (!userProfile) {
        console.warn(`Feed API: プロフィールが見つかりません (user_id: ${work.user_id})`);
        userProfile = {
          id: work.user_id,
          display_name: "ユーザー",
          avatar_image_url: undefined,
        };
      }
      
      const key = `work_${work.id}`;
      feedItems.push({
        id: work.id,
        type: "work" as const,
        title: work.title,
        description: work.description
          ? work.description.substring(0, 200)
          : undefined,
        external_url: work.external_url,
        tags: work.tags?.slice(0, 5) || [],
        roles: work.roles?.slice(0, 3) || [],
        banner_image_url: work.banner_image_url,
        created_at: work.created_at,
        user: userProfile,
        likes_count: likesCountMap.get(key) || 0,
        comments_count: commentsCountMap.get(key) || 0,
        user_has_liked: userLikesSet.has(key),
      });
    }

    // 作成日時でソート
    feedItems.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    // 実際に返すアイテム数を制限
    const limitedItems = feedItems.slice(0, limit);

    // ページネーション情報を計算
    const hasMore = feedItems.length === limit && works.length === limit;
    const nextCursor =
      limitedItems.length > 0
        ? limitedItems[limitedItems.length - 1]?.created_at
        : null;

    const stats = {
      total: limitedItems.length,
      works: limitedItems.filter((item) => item.type === "work").length,
      inputs: 0, // インプットは削除済み
      unique_users: new Set(limitedItems.map((item) => item.user.id)).size,
    };

    const processingTime = Date.now() - startTime;

    console.log("=== Feed API: 軽量フィードデータ取得成功 ===", {
      total: limitedItems.length,
      stats,
      hasMore,
      nextCursor,
      processingTime: `${processingTime}ms`,
    });

    // 開発環境のみ詳細ログを出力
    if (process.env.NODE_ENV === "development") {
      console.log("=== Feed API: 軽量フィードデータ取得成功 ===", {
        total: limitedItems.length,
        stats,
        hasMore,
        nextCursor,
        processingTime: `${processingTime}ms`,
      });
      console.log("Feed API: works件数", works.length);
      console.log("Feed API: likesCountMap", Array.from(likesCountMap.entries()));
      console.log(
        "Feed API: commentsCountMap",
        Array.from(commentsCountMap.entries()),
      );
    }

    // レスポンスを構築（本番環境ではdebug情報を削除してサイズ削減）
    const responseData: any = {
      items: limitedItems,
      stats,
      total: limitedItems.length,
      pagination: {
        hasMore,
        nextCursor,
        limit,
      },
    };

    // 開発環境のみdebug情報を追加
    if (process.env.NODE_ENV === "development") {
      responseData.debug = {
        message: "軽量フィード取得成功",
        currentUserId: currentUserId ? "あり" : "なし",
        worksCount: works.length,
        searchQuery,
        filterType,
        filterTag,
        followingOnly,
        followingCount: followingOnly ? followingUserIds.length : undefined,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
      };
    }

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control":
          "public, s-maxage=30, stale-while-revalidate=60, max-age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (dataError) {
    console.error("Feed API: 重大なエラー", dataError);
    const errorMessage =
      dataError instanceof Error ? dataError.message : String(dataError);
    const errorStack =
      dataError instanceof Error ? dataError.stack : undefined;

    return NextResponse.json(
      {
        items: [],
        stats: { total: 0, works: 0, inputs: 0, unique_users: 0 },
        total: 0,
        pagination: { hasMore: false, nextCursor: null },
        error: true,
        errorMessage,
        ...(process.env.NODE_ENV === "development" && {
          errorStack,
          debug: {
            message: "重大なエラーが発生しました",
            error: true,
            errorMessage,
            errorStack,
            timestamp: new Date().toISOString(),
          },
        }),
      },
      { status: 500 },
    );
  }
}
