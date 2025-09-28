"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { supabase } from "@/lib/supabase";
import type { WorkData } from "@/features/work/types";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common";
import { ValueVisualizationReport } from "@/features/report/components/ValueVisualizationReport";

function DetailedReportContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get("userId"); // URLパラメータからuserIdを取得
  const [works, setWorks] = useState<WorkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // 表示するユーザーIDを決定（URLパラメータがあればそれを、なければログインユーザーを使用）
  const displayUserId = targetUserId || user?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!displayUserId) return;

      setLoading(true);
      setError(null);

      try {
        // プロフィール情報を取得
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", displayUserId)
          .maybeSingle();

        if (profileError) {
          console.error("プロフィール取得エラー:", profileError);
          // プロフィールエラーは非致命的なので継続
        } else if (profileData) {
          setProfile(profileData);
        } else {
          // プロフィールが存在しない場合
          console.log(
            "プロフィールデータが存在しません。基本情報のみで動作します。",
          );
          setProfile(null);
        }

        // 作品データを取得
        const { data: worksData, error: worksError } = await supabase
          .from("works")
          .select("*")
          .eq("user_id", displayUserId)
          .order("created_at", { ascending: false });

        if (worksError) {
          console.error("作品データ取得エラー:", worksError);
          // 作品データのエラーは致命的ではないが、ログは出力
          setWorks([]);
        } else {
          setWorks(worksData || []);
        }
      } catch (err) {
        console.error("データ取得エラー:", err);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [displayUserId]);

  // 以前はここにPDF出力機能がありましたが、実装コストのため削除しました

  if (loading) {
    return (
      <div className="min-h-screen bg-base-light-gray">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark-blue mx-auto mb-4"></div>
            <p className="text-gray-600">詳細レポートを分析中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-base-light-gray">
          <main className="pt-20 pb-24 px-4">
            <div className="max-w-4xl mx-auto">
              <EmptyState title="エラーが発生しました">
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  再読み込み
                </Button>
              </EmptyState>
            </div>
          </main>
        </div>
      </AuthenticatedLayout>
    );
  }

  const _displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "ユーザー";
  const isOwnProfile = !targetUserId || targetUserId === user?.id;
  const totalWorks = works.length;
  const uniqueTypes = new Set(
    works.map((w) => (w.content_type || "").toLowerCase()).filter(Boolean),
  ).size;
  const totalViews = works.reduce(
    (sum, w) => sum + (typeof w.view_count === "number" ? w.view_count : 0),
    0,
  );
  const recent90Days = (() => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 90);
    return works.filter((w) => new Date(w.created_at || "") > threshold).length;
  })();
  // 平均説明文字数は表示要件から削除
  const _topTags = (() => {
    const counts: Record<string, number> = {};
    works.forEach((w) => {
      const rawTags = [
        ...(w.tags || []),
        ...((w.ai_analysis_result?.tags as string[] | undefined) || []),
      ];
      rawTags.forEach((tag) => {
        const key = String(tag).trim();
        if (!key) return;
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
  })();

  const kpis = [
    { label: "作品", value: String(totalWorks) },
    { label: "種類", value: String(uniqueTypes) },
    { label: "直近90日", value: String(recent90Days) },
    { label: "総閲覧", value: String(totalViews) },
  ];
  const _kpiGridCols =
    kpis.length >= 5
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
      : "grid-cols-2 sm:grid-cols-2 md:grid-cols-4";

  // スパークライン用の週次トレンド（直近8週間）
  const _weeklyTrend = (() => {
    const weeks = 8;
    const counts = Array.from({ length: weeks }, () => 0);
    const now = new Date();

    works.forEach((w) => {
      const createdAt = new Date(w.created_at || "");
      if (isNaN(createdAt.getTime())) return;
      const diffWeeks = Math.floor(
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 7),
      );
      if (diffWeeks >= 0 && diffWeeks < weeks) {
        const idx = weeks - 1 - diffWeeks;
        counts[idx] = (counts[idx] ?? 0) + 1;
        // 説明文字数のスパークラインは不要
      }
    });

    const buildSpark = (values: number[]) => {
      const width = 60;
      const height = 18;
      const max = Math.max(1, ...values);
      const step = values.length > 1 ? width / (values.length - 1) : width;
      const points = values
        .map((v, i) => `${i * step},${height - (v / max) * height}`)
        .join(" ");
      return { width, height, points };
    };

    return {
      countsSpark: buildSpark(counts),
    };
  })();

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-base-light-gray">
        <main className="pt-20 pb-24 px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* ページ冒頭の冗長な説明・KPIは削除。下段のReportHeaderで明確に表示 */}

            {/* 分析不可の場合の案内（シンプル表示） */}
            {works.length === 0 && (
              <Card className="border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      作品がありません
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      分析には作品データが必要です
                    </p>
                    {isOwnProfile && (
                      <Button
                        onClick={() => (window.location.href = "/works/new")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        作品を追加
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 価値可視化レポート */}
            {works.length > 0 && displayUserId && (
              <ValueVisualizationReport
                works={works}
                userId={displayUserId}
                profile={profile}
              />
            )}

            {/* フッター情報 */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="text-center text-xs text-gray-500">
                  <p>
                    データソース: ポートフォリオ •{" "}
                    {new Date().toLocaleDateString("ja-JP")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}

export default function DetailedReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base-light-gray">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-dark-blue mx-auto mb-4"></div>
              <p className="text-gray-600">詳細レポートを準備中...</p>
            </div>
          </div>
        </div>
      }
    >
      <DetailedReportContent />
    </Suspense>
  );
}
