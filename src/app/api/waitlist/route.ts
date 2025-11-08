import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidEmail } from "@/utils/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 簡易 Rate Limit（メモリベース）: IP+メールの組み合わせで短時間の過剰送信を抑止
// 注意: サーバレス/複数インスタンスでは共有されないため、本番は外部ストア推奨
type RateKey = string;
const recentHits = new Map<RateKey, number[]>();
const WINDOW_MS = 60 * 1000; // 1分
const LIMIT = 8; // 1分あたり8リクエストまで

function isRateLimited(key: RateKey, now: number): boolean {
  const timestamps = recentHits.get(key) || [];
  const cutoff = now - WINDOW_MS;
  const filtered = timestamps.filter((t) => t > cutoff);
  if (filtered.length >= LIMIT) {
    return true;
  }
  filtered.push(now);
  recentHits.set(key, filtered);
  return false;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is required");
}

if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      source,
      industry,
      companyName,
      jobRole,
      painPoints,
      expectations,
      budget,
      budgetMin,
      budgetMax,
      budgetPeriod,
      preferredBusinessModel,
      businessModelChoice,
      preferredPeople,
      contentIntent,
      freeText,
      interviewOptIn,
    } = body || {};
    const trimmed = typeof email === "string" ? email.trim() : "";
    if (!isValidEmail(trimmed)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 },
      );
    }

    const userAgent = request.headers.get("user-agent") || null;
    const referer = request.headers.get("referer") || null;
    const ipAddress = (request.headers.get("x-forwarded-for") || "").split(",")[0] || null;

    // レート制限チェック（IP+メール）
    const rateKey = `${ipAddress || "unknown"}:${trimmed.toLowerCase()}`;
    if (isRateLimited(rateKey, Date.now())) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらく経ってから再度お試しください。" },
        { status: 429 },
      );
    }

    // 幂等: 一意制約(lower(email))により重複時は23505を返す
    const baseInsert = {
      email: trimmed,
      source: source || "enterprise",
      user_agent: userAgent,
      referer,
      ip_address: ipAddress,
    };
    const { error: insertError } = await supabase
      .from("waitlist_submissions")
      .insert(baseInsert);

    if (insertError) {
      // 一意制約競合(重複)は成功扱い
      if (insertError.code === "23505") {
        // 後続でアップサート的に任意項目を更新
      } else {
        return NextResponse.json(
          { error: "登録に失敗しました" },
          { status: 500 },
        );
      }
    }
    // 任意アンケートが含まれる場合は部分更新（新規でも重複でも共通）
    const surveyUpdate: Record<string, any> = {};
    const setIfDefined = (key: string, value: any) => {
      if (value !== undefined && value !== "") surveyUpdate[key] = value;
    };
    setIfDefined("industry", industry ?? undefined);
    setIfDefined("company_name", companyName ?? undefined);
    setIfDefined("job_role", jobRole ?? undefined);
    setIfDefined("pain_points", painPoints ?? undefined);
    setIfDefined("expectations", expectations ?? undefined);
    setIfDefined("budget", budget ?? undefined);
    if (typeof budgetMin === "number") surveyUpdate["budget_min"] = budgetMin;
    if (typeof budgetMax === "number") surveyUpdate["budget_max"] = budgetMax;
    setIfDefined("budget_period", budgetPeriod ?? undefined);
    setIfDefined("preferred_business_model", preferredBusinessModel ?? undefined);
    setIfDefined("business_model_choice", businessModelChoice ?? undefined);
    setIfDefined("preferred_people", preferredPeople ?? undefined);
    setIfDefined("content_intent", contentIntent ?? undefined);
    setIfDefined("free_text", freeText ?? undefined);
    if (typeof interviewOptIn === "boolean")
      surveyUpdate["interview_opt_in"] = interviewOptIn;

    if (Object.keys(surveyUpdate).length > 0) {
      await supabase
        .from("waitlist_submissions")
        .update(surveyUpdate)
        .eq("email", trimmed);
      return NextResponse.json({ success: true, updated: true });
    }

    return NextResponse.json({ success: true, inserted: !insertError });
  } catch (error) {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}


