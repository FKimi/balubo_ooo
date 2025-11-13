import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

async function loadWorkFromFileSystem(id: string) {
  const worksDir = path.join(process.cwd(), "data", "works");
  const workFilePath = path.join(worksDir, `${id}.json`);

  try {
    const fileContents = await fs.readFile(workFilePath, "utf-8");
    return JSON.parse(fileContents);
  } catch (fileError) {
    if ((fileError as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn("ローカル作品ファイルの読み込みに失敗しました:", {
        id,
        error: fileError,
      });
    }
  }

  // 個別ファイルがない場合は works.json から検索
  const worksSummaryPath = path.join(process.cwd(), "data", "works.json");
  try {
    const summaryContents = await fs.readFile(worksSummaryPath, "utf-8");
    const summaryList = JSON.parse(summaryContents);
    return summaryList.find((item: { id?: string }) => item.id === id) ?? null;
  } catch (summaryError) {
    console.warn("works.json の読み込みに失敗しました:", {
      id,
      error: summaryError,
    });
  }

  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "作品IDが指定されていません" },
      { status: 400 },
    );
  }

  try {
    const work = await loadWorkFromFileSystem(id);
    if (!work) {
      return NextResponse.json(
        { error: "指定された作品が見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json({ work });
  } catch (error) {
    console.error("ローカル作品データ取得中にエラーが発生しました:", {
      id,
      error,
    });

    return NextResponse.json(
      { error: "作品データの取得に失敗しました" },
      { status: 500 },
    );
  }
}

