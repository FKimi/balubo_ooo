import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "AI分析APIテストエンドポイントが正常に動作しています",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: "テストリクエストを受信しました",
      receivedData: {
        contentType: body.contentType,
        hasDescription: !!body.description,
        hasTitle: !!body.title,
        hasUrl: !!body.url,
        hasFullContent: !!body.fullContent,
        hasFiles: body.uploadedFiles ? body.uploadedFiles.length : 0,
        hasImageFiles: body.imageFiles ? body.imageFiles.length : 0,
        fileCount: body.fileCount,
        designTools: body.designTools,
        productionNotes: !!body.productionNotes,
      },
      validation: {
        hasContent: !!(
          body.description ||
          body.title ||
          body.url ||
          body.fullContent ||
          (body.uploadedFiles && body.uploadedFiles.length > 0) ||
          (body.imageFiles && body.imageFiles.length > 0)
        ),
        contentTypeValid:
          body.contentType === "design" || body.contentType === "article",
        readyForAnalysis:
          body.contentType === "design"
            ? !!(
                body.description ||
                body.title ||
                body.url ||
                body.fullContent ||
                (body.uploadedFiles && body.uploadedFiles.length > 0) ||
                (body.imageFiles && body.imageFiles.length > 0)
              )
            : !!(
                body.description ||
                body.title ||
                body.url ||
                body.fullContent
              ),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "テストAPIでエラーが発生しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
