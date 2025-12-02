import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 動的レンダリングを強制
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// レスポンスキャッシュを12時間に延長（データ転送量削減）
export const revalidate = 43200; // 12時間

// 今日の注目コンテンツとトレンドタグを取得するAPIエンドポイント
export async function GET(request: NextRequest) {
  console.log("=== Discovery API: データ取得開始 ===");

  try {
    // Discovery用にService roleクライアントを作成（全ユーザーのパブリックデータにアクセス）
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

    const searchParams = request.nextUrl.searchParams;

    // 認証状態確認（任意）
    const authHeader = request.headers.get("authorization");
    let currentUserId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const userSupabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const {
          data: { user },
        } = await userSupabase.auth.getUser(token);
        currentUserId = user?.id || null;
      } catch (error) {
        console.log("認証トークン解析エラー（無視）:", error);
      }
    }

    const type = searchParams.get("type") || "all"; // 'featured', 'tags', 'all'
    const results: any = {};

    // 今日の注目コンテンツ（直近24時間を優先し、足りなければ7日間→全期間の順で補完）
    if (type === "featured" || type === "all") {
      console.log("注目コンテンツ取得開始");

      // 期間フィルタを段階的に適用
      const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000,
      ).toISOString();
      const sevenDaysAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const baseSelect = () =>
        supabase
          .from("works")
          .select(
            `
            id,
            title,
            description,
            banner_image_url,
            external_url,
            tags,
            roles,
            view_count,
            created_at,
            user_id
          `,
          )
          .order("view_count", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .limit(10);

      // view_count が正の作品のみを優先
      const baseSelectPositiveViews = () => baseSelect().gt("view_count", 0);

      // 重複排除＋最大N件に整形
      const mergeUnique = (
        existing: any[] | null | undefined,
        add: any[] | null | undefined,
        max: number,
      ) => {
        const list = [...(existing || [])];
        const seen = new Set<string>(list.map((w) => w.id));
        for (const w of add || []) {
          if (!seen.has(w.id)) {
            list.push(w);
            seen.add(w.id);
            if (list.length >= max) break;
          }
        }
        return list;
      };

      // 1) 直近24時間かつ view_count>0
      let featuredWorks;
      const { data, error: featuredError } =
        await baseSelectPositiveViews().gte("created_at", twentyFourHoursAgo);
      featuredWorks = data;

      // 2) 直近7日（24hで不足時）
      if (!featuredError && (featuredWorks?.length || 0) < 10) {
        const { data: weekWorks, error: weekErr } =
          await baseSelectPositiveViews().gte("created_at", sevenDaysAgo);
        if (!weekErr) featuredWorks = mergeUnique(featuredWorks, weekWorks, 10);
      }

      // 3) 全期間（それでも不足時）
      if (!featuredError && (featuredWorks?.length || 0) < 10) {
        const { data: allWorks, error: allErr } =
          await baseSelectPositiveViews();
        if (!allErr) featuredWorks = mergeUnique(featuredWorks, allWorks, 10);
      }

      // 4) それでも不足時は、view_count=0 も新着順で後方に補完（ランキングの誠実さ維持）
      if (!featuredError && (featuredWorks?.length || 0) < 10) {
        const need = 10 - (featuredWorks?.length || 0);
        const { data: recent24Any } = await baseSelect().gte(
          "created_at",
          twentyFourHoursAgo,
        );
        let list = mergeUnique(
          featuredWorks,
          recent24Any,
          (featuredWorks?.length || 0) + need,
        );
        if ((list?.length || 0) < 10) {
          const { data: recent7Any } = await baseSelect().gte(
            "created_at",
            sevenDaysAgo,
          );
          list = mergeUnique(list, recent7Any, 10);
        }
        if ((list?.length || 0) < 10) {
          const { data: recentAllAny } = await baseSelect();
          list = mergeUnique(list, recentAllAny, 10);
        }
        featuredWorks = list;
      }

      console.log("作品取得結果:", {
        count: featuredWorks?.length || 0,
        error: featuredError,
      });

      if (featuredError) {
        console.error("Featured works error:", featuredError);
        return NextResponse.json(
          {
            error: "Featured works fetch failed",
            details: featuredError.message,
          },
          { status: 500 },
        );
      }

      // ユーザーIDを収集
      const userIds = [...new Set((featuredWorks || []).map((w: any) => w.user_id))];
      const workIds = (featuredWorks || []).map((w: any) => w.id);

      // 並列で関連データを取得
      let likesCountResult, userLikesResult, commentsCountResult, profilesResult;

      try {
        [likesCountResult, userLikesResult, commentsCountResult, profilesResult] = await Promise.all([
          // likesカウント（RPCまたは一括取得）
          (async () => {
            if (workIds.length === 0) return { data: null, error: null };

            // RPCを試行
            const rpcResult = await supabase.rpc("get_likes_count", {
              work_ids: workIds,
              target_type: "work",
            });

            if (!rpcResult.error) return rpcResult;

            // フォールバック: 一括取得
            return supabase
              .from("likes")
              .select("target_id")
              .in("target_id", workIds)
              .eq("target_type", "work");
          })(),

          // ユーザーのいいね状態
          currentUserId && workIds.length > 0
            ? supabase
              .from("likes")
              .select("target_id")
              .in("target_id", workIds)
              .eq("target_type", "work")
              .eq("user_id", currentUserId)
            : Promise.resolve({ data: [], error: null }),

          // commentsカウント（RPCまたは一括取得）
          (async () => {
            if (workIds.length === 0) return { data: null, error: null };

            // RPCを試行
            const rpcResult = await supabase.rpc("get_comments_count", {
              work_ids: workIds,
              target_type: "work",
            });

            if (!rpcResult.error) return rpcResult;

            // フォールバック: 一括取得
            return supabase
              .from("comments")
              .select("target_id")
              .in("target_id", workIds)
              .eq("target_type", "work");
          })(),

          // プロフィール一括取得
          userIds.length > 0
            ? supabase
              .from("profiles")
              .select("user_id, display_name, avatar_image_url")
              .in("user_id", userIds)
            : Promise.resolve({ data: [], error: null }),
        ]);
      } catch (error) {
        console.error("Discovery API: 関連データ取得エラー", error);
        // エラー時は空データで続行
        likesCountResult = { data: [], error };
        userLikesResult = { data: [], error };
        commentsCountResult = { data: [], error };
        profilesResult = { data: [], error };
      }

      // マップ作成
      const likesCountMap = new Map<string, number>();
      const likesData = likesCountResult?.data || [];
      if (Array.isArray(likesData)) {
        if (likesData[0]?.work_id !== undefined) {
          // RPC結果
          likesData.forEach((item: any) => likesCountMap.set(item.work_id, item.count));
        } else {
          // フォールバック結果
          likesData.forEach((item: any) => {
            likesCountMap.set(item.target_id, (likesCountMap.get(item.target_id) || 0) + 1);
          });
        }
      }

      const commentsCountMap = new Map<string, number>();
      const commentsData = commentsCountResult?.data || [];
      if (Array.isArray(commentsData)) {
        if (commentsData[0]?.work_id !== undefined) {
          // RPC結果
          commentsData.forEach((item: any) => commentsCountMap.set(item.work_id, item.count));
        } else {
          // フォールバック結果
          commentsData.forEach((item: any) => {
            commentsCountMap.set(item.target_id, (commentsCountMap.get(item.target_id) || 0) + 1);
          });
        }
      }

      const userLikesSet = new Set<string>();
      userLikesResult?.data?.forEach((item: any) => userLikesSet.add(item.target_id));

      const profileMap = new Map<string, any>();
      profilesResult?.data?.forEach((p: any) => profileMap.set(p.user_id, p));

      // データを結合
      const worksWithStats = (featuredWorks || []).map((work: any) => {
        const profile = profileMap.get(work.user_id);
        return {
          ...work,
          user: profile
            ? {
              id: profile.user_id,
              display_name: profile.display_name || "ユーザー",
              avatar_image_url: profile.avatar_image_url || null,
            }
            : {
              id: work.user_id,
              display_name: "ユーザー",
              avatar_image_url: null,
            },
          likes_count: likesCountMap.get(work.id) || 0,
          comments_count: commentsCountMap.get(work.id) || 0,
          user_has_liked: userLikesSet.has(work.id),
        };
      });

      console.log("統計情報追加完了:", worksWithStats.length);

      results.featured = worksWithStats;
    }

    // トレンドタグ（過去7日間の使用頻度上位）
    if (type === "tags" || type === "all") {
      console.log("トレンドタグ取得開始");

      // 以前の仕様に戻し、全期間の作品からタグを集計
      const { data: recentWorks, error: worksError } = await supabase
        .from("works")
        .select("tags")
        .not("tags", "is", null);

      console.log("タグ取得結果:", {
        count: recentWorks?.length || 0,
        error: worksError,
      });

      if (worksError) {
        console.error("Trend tags error:", worksError);
        results.tags = [];
      } else {
        // タグの使用頻度を計算
        const tagCounts: Record<string, number> = {};
        recentWorks?.forEach((work) => {
          if (work.tags && Array.isArray(work.tags)) {
            work.tags.forEach((tag: string) => {
              if (tag && tag.trim()) {
                const cleanTag = tag.trim();
                tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
              }
            });
          }
        });

        // 使用頻度上位のタグを取得
        const trendingTags = Object.entries(tagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 12)
          .map(([tag, count]) => ({ tag, count }));

        results.tags = trendingTags;
        console.log("トレンドタグ処理完了:", trendingTags.length);
      }
    }

    console.log("=== Discovery API: データ取得完了 ===");
    return NextResponse.json(
      {
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=43200, stale-while-revalidate=86400, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Discovery API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
