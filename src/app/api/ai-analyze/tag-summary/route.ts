import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent";
const CACHE_VERSION = "v5";

// Service Role Key を使用した Supabase クライアント
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function POST(request: NextRequest) {
  try {
    const { tags } = await request.json();

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({ error: "Invalid tags data" }, { status: 400 });
    }

    // hash 作成（タグ名と件数で安定化）
    const canonical = [
      CACHE_VERSION,
      ...tags
        .sort((a: any, b: any) => a.name.localeCompare(b.name))
        .map((t: any) => `${t.name}:${t.count}`),
    ].join("|");

    const tagsHash = createHash("sha256").update(canonical).digest("hex");

    // 1. キャッシュ確認
    const { data: cached, error: cacheErr } = await supabaseAdmin
      .from("tag_summaries")
      .select("summary")
      .eq("tags_hash", tagsHash)
      .single();

    const cacheOnly = request.headers.get("x-cache-only") === "true";
    const forceRegenerate =
      request.headers.get("x-force-regenerate") === "true";

    if (!forceRegenerate && !cacheErr && cached) {
      return NextResponse.json({ summary: cached.summary });
    }

    // キャッシュのみ要求時はここで終了
    if (cacheOnly) {
      return NextResponse.json({ summary: null }, { status: 204 });
    }

    // タグ一覧をプロンプト用テキストへ整形
    const tagList = tags
      .map((t: { name: string; count: number }) => `${t.name}: ${t.count}件`)
      .join("\n");

    const prompt = `あなたはクリエイターの強みを見抜くキャリアアドバイザーです。以下のタグ一覧から作品傾向を分析し、クライアントに魅力が伝わる紹介文を300字以内で日本語で生成してください。\n\n【重要】絶対に守るべきルール:\n1. 必ず句点（。）で文章を終える\n2. 文章の途中で切れないよう、必ず最後まで書き終える\n3. 300字以内で完結した文章にする\n4. 改行せずに1段落で書く\n5. 作品の特徴を具体的かつ魅力的に描写する\n6. 技術力・創造性・専門性・影響力をバランスよく織り交ぜる\n7. 親しみやすくプロフェッショナルなトーンを保つ\n8. 名前や「Aさん」「このクリエイター」といった呼称を使わず、作品特徴の描写から自然に始める\n9. 読者が「このクリエイターと仕事をしてみたい」と思えるような表現を心がける\n10. 文字数制限に近づいたら適切に文章を終わらせる\n\nタグ一覧:\n${tagList}`;

    // Gemini へリクエスト
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 300,
          stopSequences: [],
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Gemini API Error");
    }

    const data = await response.json();
    const summaryText: string | undefined =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summaryText) {
      return NextResponse.json(
        { error: "No summary generated" },
        { status: 500 },
      );
    }

    // 文字数制限（300字以内）と文章の完結性を確保
    let finalSummary = summaryText.trim();

    // 300字を超える場合は、最後の句点（。）で区切って完結させる
    if (finalSummary.length > 300) {
      const truncated = finalSummary.slice(0, 300);
      const lastPeriodIndex = truncated.lastIndexOf("。");
      if (lastPeriodIndex > 150) {
        // 150字以上ある場合は句点で区切る
        finalSummary = truncated.slice(0, lastPeriodIndex + 1);
      } else {
        // 句点がない場合は、最後に句点を追加
        finalSummary = truncated + "。";
      }
    }

    // 最後に句点がない場合は追加
    if (
      !finalSummary.endsWith("。") &&
      !finalSummary.endsWith("！") &&
      !finalSummary.endsWith("？")
    ) {
      finalSummary = finalSummary + "。";
    }

    // 2. キャッシュ保存
    await supabaseAdmin.from("tag_summaries").upsert({
      tags_hash: tagsHash,
      summary: finalSummary,
    });

    return NextResponse.json({ summary: finalSummary });
  } catch (error) {
    console.error("tag-summary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
