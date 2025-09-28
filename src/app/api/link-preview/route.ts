import { NextRequest, NextResponse } from "next/server";

const LINKPREVIEW_API_KEY = process.env.LINKPREVIEW_API_KEY;

const LINKPREVIEW_API_URL = "https://api.linkpreview.net";

export async function POST(request: NextRequest) {
  try {
    console.log("Link preview API called");

    // APIキーが設定されていない場合のエラーハンドリング
    if (!LINKPREVIEW_API_KEY) {
      console.log("LINKPREVIEW_API_KEY is not set");
      return NextResponse.json(
        { error: "リンクプレビュー機能は現在利用できません" },
        { status: 503 },
      );
    }

    const { url } = await request.json();
    console.log("Requested URL:", url);

    if (!url) {
      return NextResponse.json(
        { error: "URLが指定されていません" },
        { status: 400 },
      );
    }

    // URLの形式を検証
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "無効なURL形式です" }, { status: 400 });
    }

    const apiUrl = `${LINKPREVIEW_API_URL}/?q=${encodeURIComponent(url)}`;
    console.log("Calling LinkPreview API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Linkpreview-Api-Key": LINKPREVIEW_API_KEY as string,
        "Content-Type": "application/json",
      },
    });

    console.log("LinkPreview API response status:", response.status);

    if (!response.ok) {
      console.error(
        "LinkPreview API エラー:",
        response.status,
        response.statusText,
      );
      const errorText = await response.text();
      console.error("LinkPreview API error response:", errorText);
      return NextResponse.json(
        { error: "プレビューの取得に失敗しました" },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("LinkPreview API success response:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Link preview error:", error);
    return NextResponse.json(
      { error: "プレビューの取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
