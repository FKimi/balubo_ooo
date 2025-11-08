import { NextRequest } from "next/server";
import { DatabaseClient } from "@/lib/database";
import { withAuth } from "@/lib/api-utils";
import { isValidDateString, isNotEmpty } from "@/utils/validation";
import fs from "fs";
import path from "path";

// 作品データの型定義

// GET: 作品一覧を取得
export async function GET(request: NextRequest) {
  return withAuth(request, async (_userId, token) => {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      throw new Error("ユーザーIDが指定されていません");
    }

    console.log("作品一覧取得APIが呼び出されました、ユーザーID:", userId);

    // DatabaseClientを使用して作品一覧を取得（認証トークン付き）
    const works = await DatabaseClient.getWorks(userId, token);

    return {
      works,
      message: "作品一覧を取得しました",
    };
  });
}

// POST: 新しい作品を保存
export async function POST(request: NextRequest) {
  return withAuth(request, async (userId, token) => {
    console.log("作品保存APIが呼び出されました、ユーザーID:", userId);

    // リクエストボディの解析
    const workData = await request.json();
    console.log("受信した作品データ:", Object.keys(workData));

    // バリデーション
    if (!isNotEmpty(workData.title)) {
      throw new Error("タイトルは必須です");
    }

    // production_dateの形式変換（YYYY-MM → YYYY-MM-01）
    let productionDate = null;
    if (workData.productionDate && workData.productionDate.trim()) {
      const trimmed = workData.productionDate.trim();
      if (isValidDateString(trimmed)) {
        // YYYY-MM形式の場合は-01を追加
        if (trimmed.match(/^\d{4}-\d{2}$/)) {
          productionDate = `${trimmed}-01`;
        } else {
          productionDate = trimmed;
        }
      } else {
        console.warn("不正なproduction_date形式:", workData.productionDate);
        productionDate = null;
      }
    }

    // DatabaseClient 経由で保存
    const savedWork = await DatabaseClient.saveWork(
      userId,
      {
        ...workData,
        productionDate,
      },
      token,
    );

    console.log("作品保存成功:", savedWork.id);

    // ローカルファイルにもバックアップ保存
    try {
      const worksDir = path.join(process.cwd(), "data", "works");
      if (!fs.existsSync(worksDir)) {
        fs.mkdirSync(worksDir, { recursive: true });
      }

      const workFile = path.join(worksDir, `${savedWork.id}.json`);
      fs.writeFileSync(workFile, JSON.stringify(savedWork, null, 2));
      console.log("作品をローカルファイルにも保存しました:", workFile);
    } catch (fileError) {
      console.warn("ローカルファイル保存エラー:", fileError);
    }

    return {
      success: true,
      work: savedWork,
      message: "作品を保存しました",
    };
  });
}
