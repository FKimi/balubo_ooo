import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { PublicProfileContent } from "./public-profile-content";
import Link from "next/link";
import { getArrayLength, isNotEmptyArray, takeFirst } from "@/utils/arrayUtils";

async function getPublicProfile(userId: string) {
  console.log("公開プロフィール取得開始:", userId);

  // Service Role Keyの存在確認
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_SERVICE_ROLE_KEY environment variable is not set");
    return null;
  }

  // サーバーサイドアクセス用のSupabaseクライアント（Service Role Key使用してRLSをバイパス）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase環境変数が設定されていません");
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Supabase接続テスト
  try {
    const { data: _testData, error: testError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("Supabase接続テスト失敗:", testError);
    } else {
      console.log("Supabase接続テスト成功");
    }
  } catch (connectionError) {
    console.error("Supabase接続エラー:", connectionError);
  }

  console.log("Supabase設定状況:", {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    isConfigured:
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  try {
    // プロフィール情報を取得（user_idで検索）
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .eq("portfolio_visibility", "public")
      .single();

    console.log("プロフィール取得結果:", {
      profileExists: !!profile,
      error: profileError,
      profile: profile
        ? {
            displayName: profile.display_name,
            visibility: profile.portfolio_visibility,
          }
        : null,
    });

    if (profileError || !profile) {
      console.log("プロフィールが見つからない、または非公開:", {
        profileError,
        hasProfile: !!profile,
      });
      return null;
    }

    console.log("公開プロフィール確認OK、作品データを取得中...");

    // Service Role Keyの設定確認
    console.log("Service Role Key設定状況:", {
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      userId: userId,
    });

    // Service Role Keyを使用して作品データを取得（RLSバイパス）
    // 注意：Service Role Keyは管理者権限を持ち、RLSを自動的にバイパスします
    console.log("作品データ取得開始 - ユーザーID:", userId);

    // 既存のテーブル構造に合わせて作品データを取得
    // is_publicカラムは存在しないため、全ての作品を取得
    const { data: works, error: worksError } = await supabase
      .from("works")
      .select(
        `
        id,
        title,
        description,
        roles,
        external_url,
        tags,
        categories,
        production_date,
        banner_image_url,
        preview_data,
        ai_analysis_result,
        content_type,
        article_word_count,
        is_featured,
        featured_order,
        created_at,
        updated_at,
        design_tools,
        color_palette,
        target_platform,
        file_urls,
        view_count
      `,
      )
      .eq("user_id", userId)
      .order("featured_order", { ascending: true })
      .order("created_at", { ascending: false });

    // エラーハンドリングの改善
    if (worksError) {
      console.error("作品取得エラー詳細:", {
        message: worksError?.message || "メッセージなし",
        details: worksError?.details || "詳細なし",
        hint: worksError?.hint || "ヒントなし",
        code: worksError?.code || "コードなし",
        fullError: worksError,
        userId: userId,
        hasError: !!worksError,
        errorKeys: worksError ? Object.keys(worksError) : [],
        errorType: worksError ? typeof worksError : "unknown",
      });

      // エラーの詳細をさらに確認
      if (worksError && Object.keys(worksError).length === 0) {
        console.error(
          "空のエラーオブジェクトが返されました。RLSポリシーまたは接続の問題の可能性があります",
        );
        console.error("Service Role Keyの設定を確認してください:", {
          hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          serviceRoleKeyLength:
            process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        });
      }
    }

    console.log("作品取得結果:", {
      worksCount: getArrayLength(works),
      works: takeFirst(works || [], 2), // 最初の2件のみログ出力
      hasError: !!worksError,
      errorType: worksError ? typeof worksError : "なし",
      worksType: works ? typeof works : "null/undefined",
      worksIsArray: Array.isArray(works),
    });

    // 作品データが取得できたか確認
    if (isNotEmptyArray(works)) {
      console.log(
        "作品データ取得成功:",
        getArrayLength(works) + "件の作品が見つかりました",
      );
    } else if (works && Array.isArray(works) && works.length === 0) {
      console.log("作品データは空ですが、エラーなし（作品が存在しない可能性）");
    } else {
      console.warn("作品データが正しく取得できていません:", {
        works,
        worksType: typeof works,
        isArray: Array.isArray(works),
      });
    }

    // インプット機能は削除されているので、inputsは空配列を使用
    const _inputs: any[] = [];
    const _inputsError: any = null;

    // インプット機能が削除されているので、inputAnalysisもnull
    const _inputAnalysis: any = null;

    const result = {
      profileExists: true,
      worksCount: getArrayLength(works),
      profile,
      works: works || [],
      inputs: _inputs,
      inputAnalysis: _inputAnalysis,
    };

    console.log("公開プロフィール取得完了:", result);
    return result;
  } catch (error) {
    console.error("公開プロフィール取得エラー:", error);
    return null;
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const data = await getPublicProfile(userId);

  if (!data) {
    console.log("公開プロフィールが見つからないため、404ページを表示します");
    notFound();
  }

  // プロフィールが存在してもデータ取得に失敗した場合
  if (!data.profile) {
    console.error("プロフィールデータが存在しません:", { userId, data });
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            プロフィールが見つかりません
          </h1>
          <p className="text-gray-600 mb-6">
            指定されたユーザーのプロフィールが見つからないか、公開設定されていません。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">プロフィールを読み込み中...</p>
            </div>
          </div>
        }
      >
        <PublicProfileContent data={data} userId={userId} />
      </Suspense>
    </div>
  );
}

// メタデータの生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const data = await getPublicProfile(userId);

  if (!data) {
    return {
      title: "プロフィールが見つかりません",
    };
  }

  const { profile } = data;
  const displayName = profile.display_name || "ユーザー";
  const bio = profile.bio || "";

  return {
    title: `${displayName}のポートフォリオ`,
    description:
      bio || `${displayName}のクリエイターポートフォリオをご覧ください。`,
    openGraph: {
      title: `${displayName}のポートフォリオ`,
      description:
        bio || `${displayName}のクリエイターポートフォリオをご覧ください。`,
      type: "profile",
      images: profile.avatar_image_url
        ? [
            {
              url: profile.avatar_image_url,
              width: 400,
              height: 400,
              alt: `${displayName}のプロフィール画像`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary",
      title: `${displayName}のポートフォリオ`,
      description:
        bio || `${displayName}のクリエイターポートフォリオをご覧ください。`,
      images: profile.avatar_image_url ? [profile.avatar_image_url] : [],
    },
  };
}
