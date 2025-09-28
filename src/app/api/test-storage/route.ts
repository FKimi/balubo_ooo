import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(_request: NextRequest) {
  try {
    console.log("=== Supabase Storage Test ===");

    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("Supabase URL:", supabaseUrl ? "設定済み" : "未設定");
    console.log("Supabase Anon Key:", supabaseAnonKey ? "設定済み" : "未設定");

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          error: "Supabase環境変数が設定されていません",
          details: {
            url: supabaseUrl ? "設定済み" : "未設定",
            key: supabaseAnonKey ? "設定済み" : "未設定",
          },
        },
        { status: 500 },
      );
    }

    // Supabaseクライアントの作成
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 認証状態の確認
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    console.log("認証状態:", user ? "ログイン済み" : "未ログイン");
    console.log("認証エラー:", authError);

    if (authError) {
      return NextResponse.json(
        {
          error: "認証エラー",
          details: authError,
        },
        { status: 401 },
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          error: "ログインが必要です",
          details: "ユーザーが認証されていません",
        },
        { status: 401 },
      );
    }

    // ストレージバケットの確認
    console.log("ストレージバケット確認中...");
    const { data: buckets, error: bucketError } =
      await supabase.storage.listBuckets();

    console.log("バケット一覧:", buckets);
    console.log("バケットエラー:", bucketError);

    if (bucketError) {
      return NextResponse.json(
        {
          error: "ストレージバケット取得エラー",
          details: bucketError,
        },
        { status: 500 },
      );
    }

    // work-filesバケットの存在確認
    const workFilesBucket = buckets?.find(
      (bucket) => bucket.name === "work-files",
    );
    console.log("work-filesバケット:", workFilesBucket ? "存在" : "不存在");

    if (!workFilesBucket) {
      return NextResponse.json(
        {
          error: "work-filesバケットが存在しません",
          details: {
            availableBuckets: buckets?.map((b) => b.name) || [],
            message: "work-filesバケットを作成してください",
          },
        },
        { status: 500 },
      );
    }

    // テストファイルのアップロード
    console.log("テストファイルアップロード中...");
    const testFileName = `test_${Date.now()}.txt`;
    const testContent = "This is a test file for storage verification.";
    const testFile = new Blob([testContent], { type: "text/plain" });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("work-files")
      .upload(testFileName, testFile);

    console.log("アップロード結果:", uploadData);
    console.log("アップロードエラー:", uploadError);

    if (uploadError) {
      return NextResponse.json(
        {
          error: "ファイルアップロードエラー",
          details: {
            message: uploadError.message,
            error: uploadError,
          },
        },
        { status: 500 },
      );
    }

    // アップロードしたファイルの削除
    if (uploadData) {
      const { error: deleteError } = await supabase.storage
        .from("work-files")
        .remove([testFileName]);

      console.log("テストファイル削除エラー:", deleteError);
    }

    return NextResponse.json({
      success: true,
      message: "ストレージテストが成功しました",
      details: {
        user: user.email,
        buckets: buckets?.map((b) => b.name) || [],
        uploadTest: "成功",
        workFilesBucket: "存在",
      },
    });
  } catch (error) {
    console.error("ストレージテストエラー:", error);
    return NextResponse.json(
      {
        error: "予期しないエラーが発生しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
