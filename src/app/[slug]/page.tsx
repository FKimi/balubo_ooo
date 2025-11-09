import { Suspense } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { PublicProfileContent } from "@/app/share/profile/[userId]/public-profile-content";
import {
  calculateInputTopTags,
  calculateGenreDistribution,
} from "@/features/profile/lib/profileUtils";
import { isNotEmptyArray, getArrayLength } from "@/utils/arrayUtils";
// import { InputData } from '@/types/input'

async function getPublicProfileBySlug(slug: string) {
  // URLエンコードされたスラッグをデコード
  const decodedSlug = decodeURIComponent(slug);
  console.log("getPublicProfileBySlug: 検索スラッグ:", {
    original: slug,
    decoded: decodedSlug,
  });

  // anon クライアントで公開プロフィールを取得（デコード済みスラッグで検索）
  const profileResponse = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", decodedSlug)
    .eq("portfolio_visibility", "public")
    .single();

  console.log("getPublicProfileBySlug: anonクライアント結果:", {
    data: profileResponse.data,
    error: profileResponse.error,
  });

  let profile = profileResponse.data;
  const error = profileResponse.error;

  // anon で見つからない場合、Service Role で再試行（ローカルでも env があれば）
  if ((error || !profile) && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("getPublicProfileBySlug: Service Roleで再試行中...");
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );
    const { data: profileAdmin, error: adminError } = await admin
      .from("profiles")
      .select("*")
      .eq("slug", decodedSlug)
      .single();
    
    console.log("getPublicProfileBySlug: Service Role結果:", {
      data: profileAdmin ? { displayName: profileAdmin.display_name } : null,
      error: adminError,
    });
    
    profile = profileAdmin || null;
  }
  
  // プロフィールが見つからない場合の詳細ログ
  if (!profile) {
    console.log("getPublicProfileBySlug: プロフィールが見つかりませんでした", {
      searchedSlug: decodedSlug,
      originalSlug: slug,
      anonError: error,
    });
    
    // デバッグ用: すべての公開プロフィールのスラッグを確認（開発環境のみ）
    if (process.env.NODE_ENV === "development" && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: { autoRefreshToken: false, persistSession: false },
        },
      );
      const { data: allProfiles } = await admin
        .from("profiles")
        .select("slug, display_name, portfolio_visibility")
        .eq("portfolio_visibility", "public")
        .limit(10);
      
      console.log("getPublicProfileBySlug: 利用可能な公開プロフィールのスラッグ:", 
        allProfiles?.map(p => ({ slug: p.slug, displayName: p.display_name }))
      );
    }
  }

  if (!profile) return null;

  const userId = profile.user_id as string;

  // admin クライアントが使える場合は RLS をバイパスして取得
  const client = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: { autoRefreshToken: false, persistSession: false },
        },
      )
    : supabase;

  const { data: works } = await client
    .from("works")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const { data: rawInputs } = await client
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

  // データベースから取得したデータを InputData 型に変換
  const inputs: any[] = (rawInputs || []).map((item: any) => ({
    id: item.id,
    userId: userId,
    title: item.title || "",
    type: item.type || "other",
    status: item.status || "completed",
    review: item.notes || "", // notes を review として使用
    tags: item.tags || [],
    genres: item.genres || [],
    externalUrl: item.external_url || "",
    coverImageUrl: item.cover_image_url || "",
    notes: item.notes || "",
    favorite: item.favorite || false,
    rating: item.rating || undefined,
    authorCreator: item.author_creator || "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));

  // インプット分析を計算
  let inputAnalysis = null;
  if (isNotEmptyArray(inputs)) {
    console.log(
      "[slug] インプット分析を計算中...",
      "インプット数:",
      inputs.length,
    );

    const totalInputs = inputs.length;
    const favoriteCount = inputs.filter((input: any) => input.favorite).length;
    const averageRating =
      totalInputs > 0
        ? inputs.reduce(
            (sum: number, input: any) => sum + (input.rating || 0),
            0,
          ) / totalInputs
        : 0;

    const typeDistribution = inputs.reduce((acc: any, input: any) => {
      const type = input.type || "未分類";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // ジャンル分布を計算
    const genresDistribution = inputs.reduce((acc: any, input: any) => {
      if (input.genres && Array.isArray(input.genres)) {
        input.genres.forEach((genre: string) => {
          acc[genre] = (acc[genre] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const topGenres = calculateGenreDistribution(inputs).map(
      ([name, count]) => ({ name, count }),
    );
    const topTags = calculateInputTopTags(inputs).map(([tag, count]) => ({
      tag,
      count,
    }));

    inputAnalysis = {
      totalInputs,
      favoriteCount,
      averageRating,
      typeDistribution,
      genresDistribution,
      topGenres,
      topTags,
    };

    console.log("[slug] インプット分析完了:", inputAnalysis);
    console.log("[slug] topTags詳細:", inputAnalysis.topTags);
  } else {
    console.log(
      "[slug] インプット分析をスキップ:",
      "inputs:",
      inputs,
      "length:",
      inputs?.length,
    );
  }

  return {
    profileExists: true,
    worksCount: getArrayLength(works),
    inputsCount: getArrayLength(inputs),
    profile,
    works: works || [],
    inputs: inputs || [],
    inputAnalysis,
  };
}

export default async function PublicProfileSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublicProfileBySlug(slug);
  if (!data) notFound();
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">プロフィールを読み込んでいます...</p>
          </div>
        </div>
      }
    >
      <PublicProfileContent data={data} userId={data.profile.user_id} />
    </Suspense>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPublicProfileBySlug(slug);
  if (!data) {
    return { title: "プロフィールが見つかりません" };
  }
  const { profile } = data;
  const displayName = profile.display_name || "ユーザー";
  const bio = profile.bio || "";
  return {
    title: `${displayName}のポートフォリオ`,
    description:
      bio || `${displayName}のクリエイターポートフォリオをご覧ください。`,
  };
}
