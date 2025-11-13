import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL environment variable is required for /api/works/latest",
  );
}

if (!supabaseServiceKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY environment variable is required for /api/works/latest",
  );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    const limit = Math.max(
      1,
      Math.min(Number.parseInt(limitParam ?? "3", 10) || 3, 6),
    );

    const { data, error } = await supabaseAdmin
      .from("works")
      .select(
        `
        id,
        title,
        description,
        banner_image_url,
        preview_data,
        external_url,
        tags,
        created_at,
        updated_at,
        user_id
      `,
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("最新作品の取得に失敗しました:", error);
      return NextResponse.json(
        { error: "最新の作品取得に失敗しました" },
        { status: 500 },
      );
    }

    const worksData = data ?? [];

    let profilesMap: Record<
      string,
      { id: string; displayName: string; avatarImageUrl: string | null }
    > = {};

    if (worksData.length > 0) {
      const userIds = Array.from(
        new Set(worksData.map((work) => work.user_id).filter(Boolean)),
      );

      if (userIds.length > 0) {
        const { data: profiles, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("user_id, display_name, avatar_image_url")
          .in("user_id", userIds);

        if (profileError) {
          console.warn("最新作品API: プロフィール取得に失敗しました:", {
            error: profileError,
          });
        } else if (profiles) {
          profilesMap = profiles.reduce<typeof profilesMap>((acc, profile) => {
            acc[profile.user_id] = {
              id: profile.user_id,
              displayName: profile.display_name ?? "ユーザー",
              avatarImageUrl: profile.avatar_image_url ?? null,
            };
            return acc;
          }, {});
        }
      }
    }

    const works =
      worksData.map((work) => ({
        id: work.id,
        title: work.title ?? "タイトル未設定の作品",
        description:
          work.description ??
          "詳細な説明がまだ追加されていませんが、ぜひ作品ページでチェックしてください。",
        bannerImageUrl: work.banner_image_url ?? null,
        previewImage:
          work.preview_data?.image ??
          work.preview_data?.ogImage ??
          work.preview_data?.imageUrl ??
          null,
        externalUrl: work.external_url ?? null,
        tags: Array.isArray(work.tags) ? work.tags : [],
        createdAt: work.created_at,
        updatedAt: work.updated_at ?? work.created_at,
        userId: work.user_id,
        user: profilesMap[work.user_id] ?? null,
      })) ?? [];

    return NextResponse.json({
      works,
      count: works.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("最新作品APIで予期しないエラーが発生:", error);
    return NextResponse.json(
      { error: "最新の作品取得でエラーが発生しました" },
      { status: 500 },
    );
  }
}

