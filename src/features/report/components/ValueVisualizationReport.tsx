"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ReportHeader } from "./ReportHeader";
import { AISummary } from "./AISummary";
import { KeywordCloud } from "./KeywordCloud";
import { ClientIndustryBreakdown } from "./ClientIndustryBreakdown";
import { FeaturedWorks } from "./FeaturedWorks";
import { SuggestedEngagements } from "./SuggestedEngagements";
import { CareerNarrativeSection } from "./CareerNarrativeSection";
// HighlightChipsはヘッダー統合により不使用
import type { WorkData } from "@/features/work/types";
import type { ReportData } from "./types";

interface ValueVisualizationReportProps {
  works: WorkData[];
  userId: string;
  profile?: any;
}

export function ValueVisualizationReport({
  works,
  userId,
  profile,
}: ValueVisualizationReportProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // キャッシュと再生成ポリシー
  const MANUAL_ONLY = true; // ユーザー操作時のみAPI呼び出し
  const STALE_MS = 6 * 60 * 60 * 1000; // 6時間で古いとみなす（SWR用）
  const EXPIRE_MS = 7 * 24 * 60 * 60 * 1000; // 7日で失効
  const REGEN_COOLDOWN_MS = 60 * 1000; // 1分クールダウン

  // プラン判定（暫定: profilesにplan/is_premium/subscription_tierなどがあれば検出）
  const getPlanInfo = () => {
    const planValue = (
      profile?.plan ||
      (profile as any)?.subscription_tier ||
      (profile as any)?.tier ||
      ""
    )
      .toString()
      .toLowerCase();
    const isPremiumFlag = Boolean(
      (profile as any)?.is_premium || (profile as any)?.isPremium,
    );
    const isPro =
      planValue === "pro" || planValue === "premium" || isPremiumFlag;
    // 無料: 月1回、有料: 1日1回
    return {
      isPro,
      window: (isPro ? "day" : "month") as "day" | "month",
      cap: 1,
    };
  };

  const getCacheKey = (fingerprint: string) =>
    `report_cache:${userId}:${fingerprint}`;
  const computeFingerprint = (items: WorkData[]) => {
    // 変化しやすい最小集合でハッシュ（id/created_at/updated_at/views/likes/tags）
    const basis = items.map((w) => ({
      id: w.id,
      c: (w as any).created_at,
      u: (w as any).updated_at,
      v: (w as any).view_count,
      l: (w as any).likes,
      t: Array.isArray((w as any).tags) ? (w as any).tags.length : 0,
    }));
    const str = JSON.stringify(basis);
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
      hash = hash & 0xffffffff;
    }
    return hash.toString(16);
  };

  const readCache = (
    fingerprint: string,
  ): { data: ReportData; stale: boolean } | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(getCacheKey(fingerprint));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as {
        expireAt: number;
        staleAt: number;
        data: ReportData;
      };
      if (Date.now() > parsed.expireAt) return null;
      return { data: parsed.data, stale: Date.now() > parsed.staleAt };
    } catch {
      return null;
    }
  };

  const writeCache = (fingerprint: string, data: ReportData) => {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        expireAt: Date.now() + EXPIRE_MS,
        staleAt: Date.now() + STALE_MS,
        data,
      };
      window.localStorage.setItem(
        getCacheKey(fingerprint),
        JSON.stringify(payload),
      );
    } catch {}
  };

  const clearCache = (_fingerprint?: string) => {
    if (typeof window === "undefined") return;
    try {
      const fp = _fingerprint || computeFingerprint(works);
      window.localStorage.removeItem(getCacheKey(fp));
    } catch {}
  };

  const formatDateTime = (ts?: number) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // レート制限（クールダウン・日次上限）
  const getRegenMetaKey = () => {
    const { window } = getPlanInfo();
    const now = new Date();
    const key =
      window === "day"
        ? now.toISOString().slice(0, 10) // YYYY-MM-DD
        : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
    return `report_regen:${userId}:${key}`;
  };
  const canRegenerateNow = (): { ok: boolean; reason?: string } => {
    if (typeof window === "undefined") return { ok: true };
    try {
      const { cap, window: billingWindow } = getPlanInfo();
      const raw = window.localStorage.getItem(getRegenMetaKey());
      if (!raw) return { ok: true };
      const meta = JSON.parse(raw) as { lastAt: number; count: number };
      if (Date.now() - meta.lastAt < REGEN_COOLDOWN_MS) {
        return {
          ok: false,
          reason: "少し待ってから再実行してください（クールダウン中）",
        };
      }
      if (meta.count >= cap) {
        return {
          ok: false,
          reason:
            billingWindow === "day"
              ? "本日の再生成上限に達しました（有料: 1日1回）"
              : "今月の再生成上限に達しました（無料: 月1回）",
        };
      }
      return { ok: true };
    } catch {
      return { ok: true };
    }
  };
  const markRegenerated = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(getRegenMetaKey());
      const meta = raw
        ? (JSON.parse(raw) as { lastAt: number; count: number })
        : { lastAt: 0, count: 0 };
      const next = { lastAt: Date.now(), count: meta.count + 1 };
      window.localStorage.setItem(getRegenMetaKey(), JSON.stringify(next));
    } catch {}
  };

  const getNextAvailableAt = (): number | undefined => {
    if (typeof window === "undefined") return undefined;
    try {
      const raw = window.localStorage.getItem(getRegenMetaKey());
      const { cap, window: win } = getPlanInfo();
      if (!raw) return undefined;
      const meta = JSON.parse(raw) as { lastAt: number; count: number };
      // クールダウン優先
      if (Date.now() - meta.lastAt < REGEN_COOLDOWN_MS) {
        return meta.lastAt + REGEN_COOLDOWN_MS;
      }
      if (meta.count >= cap) {
        const now = new Date();
        if (win === "day") {
          const next = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
          );
          return next.getTime();
        } else {
          const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          return next.getTime();
        }
      }
      return undefined;
    } catch {
      return undefined;
    }
  };

  // レポートデータを生成
  const generateReport = async (
    options: { bypassCache?: boolean; silent?: boolean } = {},
  ) => {
    if (!options.silent) setLoading(true);
    setError(null);

    try {
      const fingerprint = computeFingerprint(works);
      if (!options.bypassCache) {
        const cached = readCache(fingerprint);
        if (cached) {
          setReportData(cached.data);
          if (!MANUAL_ONLY && cached.stale) {
            // 背景で静かに再検証
            generateReport({ bypassCache: true, silent: true });
          }
          if (!options.silent) setLoading(false);
          return;
        }
      }

      // レート制限（手動時のみ）
      if (!options.silent) {
        const { ok, reason } = canRegenerateNow();
        if (!ok) {
          const next = getNextAvailableAt();
          const msg = reason || "再生成を後ほどお試しください";
          toast(msg + (next ? `（次回 ${formatDateTime(next)}）` : ""));
          setError(msg);
          if (!options.silent) setLoading(false);
          return;
        }
      }

      // 実際のAPIコール（現在はモックデータ）
      const response = await fetch(
        `/api/report/value-visualization/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ works }),
        },
      );

      if (!response.ok) {
        throw new Error("レポート生成に失敗しました");
      }

      const data = await response.json();
      // プロフィールの経験年数をメトリクスへ注入（存在する場合）
      const experienceYears = (() => {
        // profilesテーブルのexperience_yearsや型のexperienceYearsに対応
        const years = profile?.experience_years ?? profile?.experienceYears;
        return typeof years === "number" ? years : undefined;
      })();

      const merged: ReportData = {
        ...data.data,
        performanceMetrics: {
          ...data.data.performanceMetrics,
          experienceYears,
        },
      };
      setReportData(merged);
      // キャッシュへ保存
      writeCache(fingerprint, merged);
      if (!options.silent) markRegenerated();
    } catch (err) {
      console.error("レポート生成エラー:", err);
      setError(
        err instanceof Error ? err.message : "レポート生成に失敗しました",
      );
    } finally {
      if (!options.silent) setLoading(false);
    }
  };

  // 初期表示
  useEffect(() => {
    if (works.length === 0) return;
    const fingerprint = computeFingerprint(works);
    const cached = readCache(fingerprint);
    if (cached) {
      setReportData(cached.data);
      if (!MANUAL_ONLY && cached.stale) {
        generateReport({ bypassCache: true, silent: true });
      }
      return;
    }
    // MANUAL_ONLYの場合は自動生成しない
    if (!MANUAL_ONLY) {
      generateReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works, userId]);

  if (works.length === 0) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              作品データが不足しています
            </h3>
            <p className="text-sm text-gray-600">
              価値可視化レポートを生成するには、最低3作品以上のデータが必要です
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark-blue mx-auto mb-4"></div>
            <p className="text-gray-600">価値可視化レポートを生成中...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              レポート生成エラー
            </h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => generateReport()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reportData && works.length > 0 && !loading) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              レポート未生成
            </h3>
            <p className="text-sm text-gray-600">
              最新の作品データからレポートを生成します（プランにより回数制限あり）
            </p>
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={() => generateReport({ bypassCache: true })}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                レポート生成
              </Button>
              <p className="text-xs text-gray-500">
                {(() => {
                  const { isPro } = getPlanInfo();
                  const next = getNextAvailableAt();
                  const label = isPro ? "有料: 1日1回" : "無料: 月1回";
                  return next
                    ? `${label} • 次回可能: ${formatDateTime(next)}`
                    : label;
                })()}
              </p>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!reportData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 1) ヘッダー */}
      {(() => {
        const totalWorksMetric =
          (reportData.performanceMetrics?.totalWorks as number | undefined) ??
          works.length;
        // マッチング未実装のため、総作品数のみ表示
        const metrics: { totalWorks?: number } = {
          ...(typeof totalWorksMetric === "number" && { totalWorks: totalWorksMetric }),
        };
        return <ReportHeader profile={profile} metrics={metrics} />;
      })()}

      {/* 2) サマリー */}
      <AISummary
        aiCatchphrase={reportData.aiSummary?.catchphrase || "分析中..."}
        coreCompetencies={reportData.aiSummary?.coreCompetencies || []}
      />

      {/* 上位スキル（チップ表示）は削除 */}

      {/* メトリクスは別ページと重複するため非表示 */}

      {/* Part 1: あなたの実績のサマリー（既存再構成） */}
      {/* 3) 専門領域の可視化（キーワード + 業界比率） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">
              専門キーワード（上位{reportData.keywordAnalysis?.length || 0}）
            </CardTitle>
            <p className="text-sm text-gray-600">近年の出現傾向から抽出</p>
          </CardHeader>
          <CardContent>
            <KeywordCloud keywords={reportData.keywordAnalysis || []} />
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">
              クライアント業界比率
            </CardTitle>
            <p className="text-sm text-gray-600">業界経験の分布</p>
          </CardHeader>
          <CardContent>
            <ClientIndustryBreakdown
              showHeader={false}
              industryData={reportData.clientIndustryBreakdown || []}
            />
          </CardContent>
        </Card>
      </div>

      {/* 5) 代表作 */}
      <FeaturedWorks works={reportData.featuredWorks || []} />

      {/* Part 2: キャリアの物語 */}
      {reportData.careerNarrative && (
        <CareerNarrativeSection narrative={reportData.careerNarrative} />
      )}

      {/* 6) 提案できる業務 */}
      <SuggestedEngagements
        strengths={reportData.aiSummary?.coreCompetencies || []}
        industries={(reportData.clientIndustryBreakdown || []).map(
          (i: any) => i.industry,
        )}
      />

      {/* Part 3: 提言（軽量） */}
      {reportData.recommendations && (
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">
              価値最大化の提言
            </CardTitle>
            <p className="text-sm text-gray-600">ポジショニングと次の一手</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
              <div className="text-xs text-gray-500 mb-1">ポジショニング</div>
              <div className="text-sm text-gray-900">{reportData.recommendations.positioning}</div>
            </div>

            {reportData.recommendations.profileVariants?.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900">プロフィール文案</div>
                <div className="grid md:grid-cols-3 gap-3">
                  {reportData.recommendations.profileVariants.slice(0, 3).map((v, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm font-semibold text-gray-900">{v.title}</div>
                      <div className="text-xs text-gray-600">{v.tagline}</div>
                      <div className="text-sm text-gray-700 mt-2">{v.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportData.recommendations.nextProjects?.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-900">次に狙うべきプロジェクト</div>
                <div className="grid md:grid-cols-3 gap-3">
                  {reportData.recommendations.nextProjects.slice(0, 3).map((p, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm font-semibold text-gray-900">{p.title}</div>
                      <div className="text-sm text-gray-700">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportData.recommendations.keywords?.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900">アピールすべきキーワード</div>
                <div className="flex flex-wrap gap-2">
                  {reportData.recommendations.keywords.slice(0, 10).map((k, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* アクションボタン */}
      <div className="flex flex-col items-center gap-2 pt-4 print:hidden">
        <div className="flex justify-center gap-4 w-full">
          {(() => {
            const r = canRegenerateNow();
            const disabled = !r.ok;
            const next = getNextAvailableAt();
            const nextText = next ? `（次回 ${formatDateTime(next)}）` : "";
            return (
              <Button
                onClick={() => generateReport({ bypassCache: true })}
                variant="outline"
                disabled={disabled}
                title={disabled ? `${r.reason || ""}${nextText}` : ""}
                className={`border-gray-300 text-gray-700 ${disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}`}
              >
                {disabled ? "🔒 再生成不可" : "レポート再生成"}
              </Button>
            );
          })()}
          <Button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            PDF出力
          </Button>
        </div>
        {(() => {
          const r = canRegenerateNow();
          if (r.ok) return null;
          const next = getNextAvailableAt();
          return (
            <div
              aria-live="polite"
              className="text-xs text-gray-600 text-center"
            >
              {r.reason}
              {next ? `（次回 ${formatDateTime(next)}）` : ""}
            </div>
          );
        })()}
      </div>

      {/* プラン/上限情報 */}
      <div className="text-center text-xs text-gray-500 print:hidden">
        {(() => {
          const { isPro, cap } = getPlanInfo();
          const next = getNextAvailableAt();
          const label = isPro ? "有料: 1日1回" : "無料: 月1回";
          let remaining: number | undefined;
          try {
            const raw =
              typeof window !== "undefined"
                ? window.localStorage.getItem(getRegenMetaKey())
                : null;
            const meta = raw
              ? (JSON.parse(raw) as { lastAt: number; count: number })
              : { lastAt: 0, count: 0 };
            remaining = Math.max(0, cap - meta.count);
          } catch {
            remaining = undefined;
          }
          return `${label}${typeof remaining === "number" ? ` • 残り ${remaining}/${cap}` : ""}${next ? ` • 次回 ${formatDateTime(next)}` : ""}`;
        })()}
      </div>
    </div>
  );
}
