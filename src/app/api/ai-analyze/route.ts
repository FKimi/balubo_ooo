import { NextRequest, NextResponse } from "next/server";
import { POST as articlePOST } from "./article/route";
import { POST as designPOST } from "./design/route";
import { POST as photoPOST } from "./photo/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType } = body;

    if (contentType === "design") return await designPOST(body);
    if (contentType === "photo") return await photoPOST(body);
    return await articlePOST(body);
  } catch (error) {
    console.error("AI Analysis Router Error:", error);
    return NextResponse.json(
      { error: "AI分析のルーティング中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
