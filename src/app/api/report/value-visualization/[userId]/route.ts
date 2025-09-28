import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateMockReportData } from "@/features/report/components/mockData";
import type {
  ReportData,
  AISummaryData,
  SpecialtyAnalysisData,
  KeywordData,
  PerformanceMetricsData,
  IndustryData,
  FeaturedWorkData,
} from "@/features/report/components/types";

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { works } = body;

    if (!works || !Array.isArray(works)) {
      return NextResponse.json(
        { error: "作品データが必要です" },
        { status: 400 },
      );
    }

    // プロフィールを取得（経験年数・見出しなどの補助情報）
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      // プロフィール非致命、ログのみ
      console.warn("profiles fetch error:", profileError);
    }

    // 追加データ（存在すれば活用）
    const { data: tagSummary, error: _tagErr } = await supabase
      .from("tag_summaries")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: articleStats, error: _articleErr } = await supabase
      .from("user_article_stats")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: designStats, error: _designErr } = await supabase
      .from("user_design_stats")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // 実データから分析を生成
    const aiSummary: AISummaryData = generateAISummary(works, profile, {
      articleStats,
      designStats,
    });
    const specialtyAnalysis: SpecialtyAnalysisData =
      generateSpecialtyAnalysis(works);
    const keywordAnalysis: KeywordData[] = generateKeywordAnalysis(
      works,
      tagSummary,
    );
    const performanceMetrics: PerformanceMetricsData =
      generatePerformanceMetrics(works);
    const clientIndustryBreakdown: IndustryData[] =
      generateIndustryBreakdown(works);
    const featuredWorks: FeaturedWorkData[] = generateFeaturedWorks(works);

    // 経験年数を注入（profiles.experience_years優先）
    const experienceYears: number | undefined =
      typeof profile?.experience_years === "number"
        ? profile.experience_years
        : undefined;

    const data: ReportData = {
      aiSummary,
      specialtyAnalysis,
      keywordAnalysis,
      performanceMetrics: {
        ...performanceMetrics,
        experienceYears,
      },
      clientIndustryBreakdown,
      featuredWorks,
    };

    return NextResponse.json({
      success: true,
      data,
      profile: {
        display_name: profile?.display_name,
        headline: profile?.headline,
        title: profile?.title,
        professions: profile?.professions,
        experience_years: profile?.experience_years,
      },
    });
  } catch (error) {
    console.error("レポート生成エラー:", error);
    return NextResponse.json(
      { error: "レポート生成に失敗しました" },
      { status: 500 },
    );
  }
}

// AIサマリー生成（モック実装）
function generateAISummary(
  works: any[],
  profile?: any,
  extras?: { articleStats?: any; designStats?: any },
): AISummaryData {
  const name = profile?.display_name || profile?.full_name || "クリエイター";
  const headline = profile?.headline || profile?.title || "";

  // トップタグ抽出
  const tagCounts: Record<string, number> = {};
  works.forEach((w: any) => {
    const allTags = [
      ...(w.tags || []),
      ...((w.ai_analysis_result?.tags as string[] | undefined) || []),
    ];
    allTags.forEach((t: string) => {
      const k = String(t).trim();
      if (!k) return;
      tagCounts[k] = (tagCounts[k] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  // 業界推定（clientIndustryBreakdownに合わせた簡易ルール）
  const industries = ["SaaS", "製造業", "金融", "医療", "小売"];
  const industryScore: Record<string, number> = {
    SaaS: 0,
    製造業: 0,
    金融: 0,
    医療: 0,
    小売: 0,
  };
  works.forEach((w: any) => {
    const tags = w.tags || [];
    if (
      tags.some((t: string) => t.includes("SaaS") || t.includes("ソフトウェア"))
    )
      industryScore["SaaS"]++;
    else if (tags.some((t: string) => t.includes("製造") || t.includes("工場")))
      industryScore["製造業"]++;
    else if (tags.some((t: string) => t.includes("金融") || t.includes("銀行")))
      industryScore["金融"]++;
    else if (tags.some((t: string) => t.includes("医療") || t.includes("病院")))
      industryScore["医療"]++;
    else if (tags.some((t: string) => t.includes("小売") || t.includes("EC")))
      industryScore["小売"]++;
  });
  const mainIndustry = industries.sort(
    (a, b) => (industryScore[b] || 0) - (industryScore[a] || 0),
  )[0];

  // 記事/デザイン統計のニュアンスを反映
  const articleTone = extras?.articleStats
    ? "一次情報と構造化に強い"
    : undefined;
  const designTone = extras?.designStats
    ? "視覚的分解と情報設計に長けた"
    : undefined;
  const tone = articleTone || designTone || "価値を生む実務志向の";

  const catchphrase = headline
    ? `${headline}。${tone}${mainIndustry || "B2B領域"}スペシャリスト。`
    : `${name}は${tone}${mainIndustry || "B2B領域"}のスペシャリスト。`;

  const competencies: string[] = [
    topTags[0]
      ? `${topTags[0]}領域での実務知見と再現性の高いプロセス設計`
      : "要件分解から成果設計まで一貫した実行力",
    topTags[1]
      ? `${topTags[1]}を軸にした、意思決定につながる情報構造化`
      : "意思決定につながる情報構造化と関係者調整力",
    topTags[2]
      ? `${topTags[2]}における専門家・現場取材に基づく一次情報活用`
      : "一次情報に基づく検証可能なアウトプット",
  ];

  return { catchphrase, coreCompetencies: competencies };
}

// 専門性分析生成
function generateSpecialtyAnalysis(works: any[]): SpecialtyAnalysisData {
  // 作品データから専門性を分析（簡易実装）
  const totalWorks = works.length;
  const avgWordCount =
    works.reduce((sum, w) => sum + (w.content?.length || 0), 0) / totalWorks;
  const hasSeoTags = works.some((w) =>
    w.tags?.some(
      (tag: string) =>
        tag.toLowerCase().includes("seo") ||
        tag.toLowerCase().includes("マーケティング"),
    ),
  );

  return {
    investigativeDepth: Math.min(85, 60 + (avgWordCount / 1000) * 5),
    logicalStructure: Math.min(90, 70 + totalWorks * 2),
    seoExpertise: hasSeoTags ? 80 : 45,
    industrySpecificity: Math.min(95, 50 + totalWorks * 3),
    readerEngagement: Math.min(88, 65 + Math.random() * 20),
  };
}

// キーワード分析生成
function normalizeKeyword(raw: string): string {
  return String(raw || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function generateKeywordAnalysis(
  works: any[],
  tagSummary?: any,
): KeywordData[] {
  const counts: Record<string, { label: string; count: number }> = {};

  works.forEach((work) => {
    const tags = work.tags || [];
    const aiTags = work.ai_analysis_result?.tags || [];
    const allTags = [...tags, ...aiTags];

    allTags.forEach((tag) => {
      const label = String(tag).trim();
      const key = normalizeKeyword(label);
      if (key) {
        if (!counts[key]) counts[key] = { label, count: 0 };
        counts[key].count += 1;
      }
    });
  });

  // tag_summaries テーブルがあれば重み付け
  if (tagSummary) {
    try {
      const keysFromArray = (arr: any[]) => {
        arr.forEach((it) => {
          if (!it) return;
          const label = (it.keyword || it.tag || it.name || it)
            .toString()
            .trim();
          const k = normalizeKeyword(label);
          const f = Number(it.frequency || it.count || 1);
          if (!k) return;
          if (!counts[k]) counts[k] = { label, count: 0 };
          counts[k].count += isFinite(f) ? f : 1;
        });
      };

      if (Array.isArray(tagSummary?.keywords))
        keysFromArray(tagSummary.keywords);
      if (Array.isArray(tagSummary?.tags)) keysFromArray(tagSummary.tags);
      if (typeof tagSummary?.summary_json === "string") {
        const parsed = JSON.parse(tagSummary.summary_json);
        if (Array.isArray(parsed)) keysFromArray(parsed);
      }
    } catch {
      // 解析失敗は無視
    }
  }

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
    .map(({ label, count }) => ({
      keyword: label,
      frequency: count,
      weight: Math.min(5, Math.max(1, Math.ceil(count / 2))),
    }));
}

// パフォーマンスメトリクス生成
function generatePerformanceMetrics(works: any[]): PerformanceMetricsData {
  const totalWorks = works.length;
  const totalViews = works.reduce((sum, w) => sum + (w.view_count || 0), 0);
  const totalLikes = works.reduce((sum, w) => sum + (w.likes || 0), 0);
  const uniqueClients = new Set(works.map((w) => w.client_name).filter(Boolean))
    .size;
  const totalWordCount = works.reduce(
    (sum, w) => sum + (w.content?.length || 0),
    0,
  );

  return {
    totalWorks,
    totalViews,
    averageLikes: totalWorks > 0 ? totalLikes / totalWorks : 0,
    uniqueClients,
    averageWordCount: totalWorks > 0 ? totalWordCount / totalWorks : 0,
    engagementRate: totalViews > 0 ? (totalLikes / totalViews) * 100 : 0,
  };
}

// 業界分析生成
function generateIndustryBreakdown(works: any[]): IndustryData[] {
  const industryCounts: Record<string, number> = {
    SaaS: 0,
    製造業: 0,
    金融: 0,
    医療: 0,
    小売: 0,
    その他: 0,
  };

  works.forEach((work) => {
    const clientName = work.client_name || "";
    const tags = work.tags || [];

    // 簡易的な業界判定ロジック
    if (
      tags.some(
        (tag: string) => tag.includes("SaaS") || tag.includes("ソフトウェア"),
      )
    ) {
      industryCounts["SaaS"]++;
    } else if (
      tags.some((tag: string) => tag.includes("製造") || tag.includes("工場"))
    ) {
      industryCounts["製造業"]++;
    } else if (
      tags.some((tag: string) => tag.includes("金融") || tag.includes("銀行"))
    ) {
      industryCounts["金融"]++;
    } else if (
      tags.some((tag: string) => tag.includes("医療") || tag.includes("病院"))
    ) {
      industryCounts["医療"]++;
    } else if (
      tags.some((tag: string) => tag.includes("小売") || tag.includes("EC"))
    ) {
      industryCounts["小売"]++;
    } else {
      industryCounts["その他"]++;
    }
  });

  const total = Object.values(industryCounts).reduce(
    (sum, count) => sum + count,
    0,
  );
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#6b7280",
  ];

  return Object.entries(industryCounts)
    .filter(([_, count]) => count > 0)
    .map(([industry, count], index) => ({
      industry,
      percentage: total > 0 ? (count / total) * 100 : 0,
      count,
      color: colors[index % colors.length],
    }));
}

// 代表作生成
function generateFeaturedWorks(works: any[]): FeaturedWorkData[] {
  // スコアリング: views重み0.4、likes重み0.4、新規性0.15、サムネ有り0.05
  const now = Date.now();
  const scored = works
    .filter((w) => w.title && (w.summary || w.description))
    .map((w) => {
      const views = Number(w.view_count || 0);
      const likes = Number(w.likes || 0);
      const created = new Date(w.created_at || 0).getTime();
      const recency = isFinite(created)
        ? Math.max(0, 1 - (now - created) / (1000 * 60 * 60 * 24 * 365))
        : 0; // 1年基準
      const hasThumb = w.thumbnail_url ? 1 : 0;
      const score =
        views * 0.4 +
        likes * 5 * 0.4 +
        recency * 100 * 0.15 +
        hasThumb * 10 * 0.05;
      return { w, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return scored.map(({ w }) => ({
    id: w.id,
    title: w.title,
    summary: w.summary || w.description || "詳細な説明はありません",
    thumbnailUrl:
      w.banner_image_url ||
      w.thumbnail_url ||
      w.preview_data?.image ||
      undefined,
    url: w.url,
    views: w.view_count || 0,
    likes: w.likes || 0,
    tags: w.tags || [],
    publishedAt: w.created_at || new Date().toISOString(),
  }));
}
