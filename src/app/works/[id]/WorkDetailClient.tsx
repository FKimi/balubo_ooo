"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WorkBanner } from "@/features/work/components/WorkBanner";
import LikeButton from "@/features/work/components/LikeButton";
import CommentsSection from "@/features/comment/components/CommentsSection";
import { ShareModal } from "@/features/social/components/ShareModal";
import { BtoBAnalysisSection } from "@/components/works/BtoBAnalysisSection";
import { WorkData } from "@/features/work/types";
import { supabase } from "@/lib/supabase";

interface WorkDetailData extends WorkData {
  user_id: string;
  externalUrl?: string;
  productionDate?: string;
  previewData?: any;
  preview_data?: any;
  createdAt: string;
  updatedAt: string;
}

interface ProfileData {
  user_id: string;
  display_name: string;
  avatar_image_url?: string;
  slug?: string;
  bio?: string;
  professions?: string[];
}

// AI評価セクションコンポーネント - 削除済み

export default function WorkDetailClient({ workId }: { workId: string }) {
  const [work, setWork] = useState<WorkDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authorProfile, setAuthorProfile] = useState<ProfileData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingProductionNotes, setIsEditingProductionNotes] =
    useState(false);
  const [productionNotes, setProductionNotes] = useState("");
  const [isSavingProductionNotes, setIsSavingProductionNotes] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  useEffect(() => {
    // 閲覧数をインクリメントする非同期関数
    const incrementViewCount = async () => {
      // 開発環境でも閲覧数をカウント（Discovery機能のテスト用）
      console.log("閲覧数をカウントしています...");
      try {
        await fetch(`/api/works/${workId}/view`, {
          method: "POST",
        });
      } catch (error) {
        console.error("閲覧数の更新リクエストに失敗:", error);
      }
    };

    if (workId) {
      incrementViewCount();
    }
  }, [workId]);

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setLoading(true);
        setError(null);

        if (process.env.NODE_ENV === "development") {
          console.log(`WorkDetailClient: 作品取得開始 - ID = ${workId}`);
        }

        // 認証トークンを取得
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        // 作品データを取得
        const { data: workData, error: workError } = await supabase
          .from("works")
          .select("*")
          .eq("id", workId)
          .single();

        if (workError) {
          // 開発環境でのみ詳細エラー情報を出力
          if (process.env.NODE_ENV === "development") {
            console.error("WorkDetailClient: 作品取得エラー - 詳細情報:", {
              id: workId,
              error: workError.message,
              code: workError.code,
              details: workError.details,
              hint: workError.hint,
              // エラーオブジェクト全体も出力
              fullError: workError,
              // エラーオブジェクトのプロパティ一覧
              errorKeys: Object.keys(workError),
              // エラーオブジェクトの型情報
              errorType: typeof workError,
              errorConstructor: workError.constructor.name,
              // スタックトレース（利用可能な場合）
              stack: workError.stack,
            });
          } else {
            console.error(
              "WorkDetailClient: 作品取得エラー:",
              workError.message,
            );
          }

          // エラータイプに応じてメッセージを設定
          let errorMessage = "作品の取得に失敗しました";

          if (workError.code === "PGRST116") {
            errorMessage = "指定された作品が見つかりません";
          } else if (workError.code === "PGRST301") {
            errorMessage = "無効な作品IDです";
          } else if (workError.code?.startsWith("PGRST")) {
            errorMessage = "データベースエラーが発生しました";
          }

          setError(errorMessage);
          return;
        }

        if (!workData) {
          if (process.env.NODE_ENV === "development") {
            console.log(
              `WorkDetailClient: 作品が見つかりません - ID = ${workId}`,
            );
          }
          setError("作品が見つかりません");
          return;
        }

        if (process.env.NODE_ENV === "development") {
          console.log(
            `WorkDetailClient: 作品取得成功 - ID = ${workId}, タイトル = ${workData.title}`,
          );
        }

        // データを整形
        const formattedWork: WorkDetailData = {
          ...workData,
          externalUrl: workData.external_url,
          productionDate: workData.production_date,
          previewData: workData.preview_data,
          createdAt: workData.created_at,
          updatedAt: workData.updated_at,
        };

        setWork(formattedWork);
        setProductionNotes(formattedWork.production_notes || "");
        setDescription(formattedWork.description || "");

        // 現在のユーザー情報を取得
        if (token) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          setCurrentUser(user);
        }

        // 作品の作者のプロフィール情報を取得
        try {
          const profileResponse = await fetch(
            `/api/profile?userId=${formattedWork.user_id}`,
          );
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            if (profileData.data) {
              setAuthorProfile(profileData.data);
            }
          }
        } catch (profileError) {
          console.error("作者プロフィール取得エラー:", profileError);
          // プロフィール取得に失敗しても作品表示は続行
        }
      } catch (err) {
        console.error(
          "WorkDetailClient: 作品詳細取得中に予期しないエラーが発生 - 詳細情報:",
          {
            id: workId,
            error: err instanceof Error ? err.message : "Unknown error",
            errorType: typeof err,
            errorConstructor:
              err instanceof Error ? err.constructor.name : "Unknown",
            // エラーオブジェクト全体
            fullError: err,
            // エラーオブジェクトのプロパティ一覧
            errorKeys: err && typeof err === "object" ? Object.keys(err) : [],
            // スタックトレース（利用可能な場合）
            stack: err instanceof Error ? err.stack : undefined,
            // 追加のデバッグ情報
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
          },
        );
        setError("作品の取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [workId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              {/* バナーとタイトルのスケルトン */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* バナーのスケルトン */}
                <div className="h-64 md:h-80 lg:h-[400px] bg-gray-200"></div>
                {/* タイトルのスケルトン */}
                <div className="bg-white p-6 lg:p-8 lg:pl-10 flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* コンテンツのスケルトン */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error || "作品が見つかりません"}
              </h1>
              <p className="text-gray-600 mb-6">
                指定された作品は存在しないか、削除された可能性があります。
              </p>
              <Link href="/profile">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  ポートフォリオに戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI分析データの取得（previewDataまたはpreview_dataまたはai_analysis_resultから）
  const aiAnalysis =
    work.ai_analysis_result ||
    work.previewData?.analysis ||
    work.preview_data?.analysis;

  // 制作メモ保存処理
  const handleSaveProductionNotes = async () => {
    if (!work || !currentUser) return;

    try {
      setIsSavingProductionNotes(true);

      // 認証トークンを取得
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/works/${work.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: work.title,
          description: work.description || "",
          externalUrl: work.external_url || "",
          tags: work.tags || [],
          roles: work.roles || [],
          categories: work.categories || [],
          productionDate: work.production_date || "",
          productionNotes: productionNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("制作メモ保存エラー詳細:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(
          `制作メモの保存に失敗しました: ${errorData.error || response.statusText}`,
        );
      }

      // 保存成功後、編集モードを終了
      setIsEditingProductionNotes(false);

      // 作品データを更新
      if (work) {
        setWork({
          ...work,
          production_notes: productionNotes,
        });
      }
    } catch (error) {
      console.error("制作メモ保存エラー:", error);
      alert("制作メモの保存に失敗しました");
    } finally {
      setIsSavingProductionNotes(false);
    }
  };

  // 制作メモ編集キャンセル処理
  const handleCancelProductionNotes = () => {
    setProductionNotes(work?.production_notes || "");
    setIsEditingProductionNotes(false);
  };

  // 作品説明の保存処理
  const handleSaveDescription = async () => {
    if (!work || !currentUser) return;

    try {
      setIsSavingDescription(true);

      // 認証トークンを取得
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/works/${work.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: work.title,
          description: description,
          externalUrl: work.external_url || "",
          tags: work.tags || [],
          roles: work.roles || [],
          categories: work.categories || [],
          productionDate: work.production_date || "",
          productionNotes: work.production_notes || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("作品説明保存エラー詳細:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(
          `作品説明の保存に失敗しました: ${errorData.error || response.statusText}`,
        );
      }

      // 保存成功後、編集モードを終了
      setIsEditingDescription(false);

      // 作品データを更新
      if (work) {
        setWork({
          ...work,
          description: description,
        });
      }
    } catch (error) {
      console.error("作品説明保存エラー:", error);
      alert("作品説明の保存に失敗しました");
    } finally {
      setIsSavingDescription(false);
    }
  };

  // 作品説明編集キャンセル処理
  const handleCancelDescription = () => {
    setDescription(work?.description || "");
    setIsEditingDescription(false);
  };

  // 削除処理
  const handleDelete = async () => {
    if (!work || !currentUser) return;

    try {
      setIsDeleting(true);

      // 認証トークンを取得
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/works/${work.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("作品の削除に失敗しました");
      }

      // 削除成功後、プロフィールページにリダイレクト
      window.location.href = "/profile";
    } catch (error) {
      console.error("作品削除エラー:", error);
      alert("作品の削除に失敗しました");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/profile">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 -ml-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                ポートフォリオに戻る
              </Button>
            </Link>

            {/* 編集・削除ボタンは作品の所有者のみに表示 */}
            {currentUser && work.user_id === currentUser.id && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  削除
                </button>
                <Link href={`/works/${work.id}/edit`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 rounded-xl">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    編集
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* 作品詳細 */}
          <Card className="overflow-hidden shadow-md border border-gray-200 bg-white rounded-xl mb-8 transition-shadow duration-200 hover:shadow-lg">
            {/* バナーとタイトルを2カラムレイアウト */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* 左カラム：バナー画像 */}
              <div className="h-64 md:h-80 lg:h-full lg:min-h-[400px] relative overflow-hidden bg-gray-50 order-1 lg:order-1 transition-opacity duration-300 lg:pl-6 lg:pt-6">
                {work.external_url ||
                work.banner_image_url ||
                work.previewData?.image ||
                work.preview_data?.image ? (
                  <WorkBanner
                    url={work.external_url || ""}
                    title={work.title}
                    previewData={work.previewData || work.preview_data}
                    bannerImageUrl={work.banner_image_url || ""}
                    useProxy={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-white rounded-lg shadow-sm mx-auto mb-3 flex items-center justify-center border border-gray-200">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-gray-500 text-sm font-medium">
                        作品
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 右カラム：タイトルとメタ情報 */}
              <div className="bg-white p-6 lg:p-8 lg:pl-10 flex flex-col justify-center order-2 lg:order-2 transition-all duration-300 hover:bg-gray-50/50">
                <div className="space-y-6">
                  {/* タイトル */}
                  <div>
                    <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-900 leading-[1.3] tracking-tight mb-4 line-clamp-2">
                      {work.title}
                    </h1>
                    {work.productionDate && (
                      <span className="inline-block text-gray-600 text-xs font-medium bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition-all duration-200 hover:bg-gray-200">
                        {new Date(work.productionDate).toLocaleDateString(
                          "ja-JP",
                          { year: "numeric", month: "long" },
                        )}
                      </span>
                    )}
                  </div>

                  {/* メタデータ（2カラム） */}
                  {aiAnalysis && (
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-gray-300">
                      {/* 左カラム */}
                      <div className="space-y-5">
                        {/* 業界 */}
                        {aiAnalysis.tagClassification?.genre && aiAnalysis.tagClassification.genre.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              業界
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {aiAnalysis.tagClassification.genre.slice(0, 4).map((genre: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg border-2 border-blue-700 shadow-sm"
                                >
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* 担当範囲 */}
                        {work.roles && work.roles.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">担当範囲</p>
                            <div className="text-sm text-gray-900 leading-relaxed">
                              {work.roles.map((role, idx) => (
                                <span key={idx}>
                                  {role}
                                  {idx < work.roles.length - 1 && " | "}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 右カラム */}
                      <div className="space-y-5">
                        {/* 専門性 */}
                        {(() => {
                          const allTags = aiAnalysis.tags || [];
                          const genreTags = new Set(aiAnalysis.tagClassification?.genre || []);
                          const expertiseTags = allTags.filter((tag: string) => !genreTags.has(tag)).slice(0, 4);
                          const techniqueTags = aiAnalysis.tagClassification?.technique || [];
                          const purposeTags = aiAnalysis.tagClassification?.purpose || [];
                          const combinedExpertise = [...expertiseTags, ...techniqueTags, ...purposeTags]
                            .filter((tag: string, idx: number, arr: string[]) => arr.indexOf(tag) === idx)
                            .slice(0, 4);

                          return combinedExpertise.length > 0 ? (
                            <div>
                              <p className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                専門性
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {combinedExpertise.map((exp, idx) => (
                                  <span
                                    key={idx}
                                    className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg border-2 border-gray-900 shadow-sm"
                                  >
                                    {exp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : null;
                        })()}
                        {/* 成果物 */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">成果物</p>
                          <div className="text-sm text-gray-900 font-medium">
                            {work.content_type === "article" && "記事"}
                            {work.content_type === "design" && "デザイン"}
                            {work.content_type === "photo" && "写真"}
                            {work.content_type === "video" && "動画"}
                            {work.content_type === "podcast" && "ポッドキャスト"}
                            {work.content_type === "event" && "イベント"}
                            {!work.content_type && "作品"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <CardContent className="p-6 lg:p-8">
              {/* メインコンテンツ（全幅） */}
              <div className="space-y-8">
                {/* 説明文と作者情報を統合 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 左側：説明文（2カラム分） */}
                  <div className="lg:col-span-2">
                    {(work.description ||
                      (currentUser && work.user_id === currentUser.id)) && (
                      <div>
                        {currentUser &&
                          work.user_id === currentUser.id &&
                          !isEditingDescription && (
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg
                                    className="w-3.5 h-3.5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                  </svg>
                                </div>
                                作品について
                              </h2>
                              <button
                                onClick={() => setIsEditingDescription(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                編集
                              </button>
                            </div>
                          )}
                        {!currentUser || work.user_id !== currentUser.id ? (
                          <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg
                                  className="w-3.5 h-3.5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                              </div>
                              作品について
                            </h2>
                          </div>
                        ) : null}
                      <div className="bg-white rounded-lg p-5 border border-gray-200 transition-shadow duration-200 hover:shadow-sm">
                        {isEditingDescription &&
                        currentUser &&
                        work.user_id === currentUser.id ? (
                          <div>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder="作品について説明してください..."
                              className="w-full min-h-[120px] p-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 leading-relaxed transition-all duration-200"
                              aria-label="作品説明を編集"
                            />
                              <div className="flex gap-3 mt-4">
                                <button
                                  onClick={handleSaveDescription}
                                  disabled={isSavingDescription}
                                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {isSavingDescription ? "保存中..." : "保存"}
                                </button>
                                <button
                                  onClick={handleCancelDescription}
                                  disabled={isSavingDescription}
                                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                                >
                                  キャンセル
                                </button>
                              </div>
                            </div>
                          ) : work.description ? (
                            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                              {work.description}
                            </p>
                          ) : currentUser && work.user_id === currentUser.id ? (
                            <div className="text-center py-12">
                              <p className="text-gray-500 mb-4 font-medium">
                                作品の説明がまだ記入されていません
                              </p>
                              <button
                                onClick={() => setIsEditingDescription(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                作品説明を追加
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 右側：作者情報（1カラム分） */}
                  {authorProfile && (
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 sticky top-6 transition-all duration-300 hover:shadow-md">
                        <div className="flex flex-col items-center text-center">
                          {/* プロフィール画像 */}
                          <div className="mb-4">
                            {authorProfile.avatar_image_url ? (
                              <Image
                                src={authorProfile.avatar_image_url}
                                alt={`${authorProfile.display_name}のプロフィール画像`}
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-300 hover:scale-105"
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-md transition-transform duration-300 hover:scale-105">
                                {authorProfile.display_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* 作者情報 */}
                          <div className="w-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {authorProfile.display_name}
                            </h3>
                            {authorProfile.professions &&
                              authorProfile.professions.length > 0 && (
                                <p className="text-sm text-gray-600 font-medium mb-3">
                                  {authorProfile.professions.join(" / ")}
                                </p>
                              )}

                            {authorProfile.bio && (
                              <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3">
                                {authorProfile.bio}
                              </p>
                            )}

                            {/* プロフィールへのリンク */}
                            <Link
                              href={
                                authorProfile.slug
                                  ? `/${authorProfile.slug}`
                                  : `/share/profile/${authorProfile.user_id}`
                              }
                              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02]"
                              aria-label={`${authorProfile.display_name}のプロフィールを見る`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              プロフィールを見る
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 役割 */}
                {work.roles && work.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2" role="list" aria-label="担当役割">
                    {work.roles.map((role, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-full font-medium border border-blue-200 transition-all duration-200 hover:bg-blue-100 hover:scale-105"
                        role="listitem"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}

                {/* 制作メモ */}
                {(work.production_notes ||
                  (currentUser && work.user_id === currentUser.id)) && (
                  <div className="pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2" id="production-notes-heading">
                        <div className="w-7 h-7 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>
                        制作メモ
                      </h2>
                      {currentUser &&
                        work.user_id === currentUser.id &&
                        !isEditingProductionNotes && (
                          <button
                            onClick={() => setIsEditingProductionNotes(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="制作メモを編集する"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            編集
                          </button>
                        )}
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-gray-200 transition-all duration-200 hover:shadow-sm">
                      <div className="mb-3">
                        <span className="text-xs text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-wide">
                          制作過程・背景・こだわり
                        </span>
                      </div>
                      {isEditingProductionNotes &&
                      currentUser &&
                      work.user_id === currentUser.id ? (
                        <div>
                          <label htmlFor="production-notes-textarea" className="sr-only">
                            制作メモを入力
                          </label>
                          <textarea
                            id="production-notes-textarea"
                            value={productionNotes}
                            onChange={(e) => setProductionNotes(e.target.value)}
                            placeholder="制作背景、目的、こだわったポイントなどを入力..."
                            className="w-full min-h-[120px] p-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 leading-relaxed transition-all duration-200"
                            aria-labelledby="production-notes-heading"
                          />
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={handleSaveProductionNotes}
                              disabled={isSavingProductionNotes}
                              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              aria-label="制作メモを保存する"
                            >
                              {isSavingProductionNotes ? "保存中..." : "保存"}
                            </button>
                            <button
                              onClick={handleCancelProductionNotes}
                              disabled={isSavingProductionNotes}
                              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                              aria-label="編集をキャンセルする"
                            >
                              キャンセル
                            </button>
                          </div>
                        </div>
                      ) : work.production_notes ? (
                        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap" aria-labelledby="production-notes-heading">
                          {work.production_notes}
                        </p>
                      ) : currentUser && work.user_id === currentUser.id ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500 mb-4 font-medium">
                            制作メモがまだ記入されていません
                          </p>
                          <button
                            onClick={() => setIsEditingProductionNotes(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
                            aria-label="制作メモを追加する"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            制作メモを追加
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* AI分析結果（全幅） */}
                {aiAnalysis && (
                  <div className="pt-8 border-t border-gray-200">
                    <BtoBAnalysisSection aiAnalysis={aiAnalysis || {}} editable={false} />
                  </div>
                )}

                {/* 補足情報（2カラム） */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-8 border-t border-gray-200">
                  {/* 左カラム */}
                  <div className="space-y-6">
                    {/* タグとキーワードを統合 */}
                    {((aiAnalysis?.tags && aiAnalysis.tags.length > 0) ||
                      (work.tags && work.tags.length > 0) ||
                      (aiAnalysis?.keywords && aiAnalysis.keywords.length > 0)) && (
                      <div className="bg-white rounded-lg p-5 border border-gray-200 transition-shadow duration-200 hover:shadow-md">
                        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                          タグ・キーワード
                        </h3>
                        <div className="space-y-4">
                          {/* 関連タグ */}
                          {(aiAnalysis?.tags && aiAnalysis.tags.length > 0) ||
                          (work.tags && work.tags.length > 0) ? (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">関連タグ</p>
                              <div className="flex flex-wrap gap-2">
                                {(aiAnalysis?.tags || work.tags || []).map(
                                  (tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 font-medium"
                                    >
                                      {tag}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          ) : null}

                          {/* キーワード */}
                          {aiAnalysis?.keywords && aiAnalysis.keywords.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">キーワード</p>
                              <div className="flex flex-wrap gap-2">
                                {aiAnalysis.keywords.map(
                                  (keyword: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                                    >
                                      {keyword}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 右カラム */}
                  <div className="space-y-6">
                    {/* 外部リンク */}
                    {work.external_url && (
                      <div className="bg-white rounded-lg p-5 border border-gray-200 transition-shadow duration-200 hover:shadow-md">
                        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                          外部リンク
                        </h3>
                        <a
                          href={work.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="作品を外部サイトで確認する"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          作品を確認する
                        </a>
                      </div>
                    )}

                    {/* アクションボタン */}
                    <div className="bg-white rounded-lg p-5 border border-gray-200 transition-shadow duration-200 hover:shadow-md">
                      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                          </svg>
                        </div>
                        アクション
                      </h3>
                      <div className="flex flex-col gap-3">
                        <LikeButton workId={work.id} />
                        <Button
                          onClick={() => setShowShareModal(true)}
                          variant="outline"
                          className="w-full border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400 text-gray-700 hover:text-blue-700 transition-all duration-200 text-sm py-3 font-medium transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="作品をシェアする"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                            />
                          </svg>
                          共有
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* コメントセクション */}
          <div className="mt-8">
            <CommentsSection workId={work.id} />
          </div>
        </div>
      </main>

      {/* 共有モーダル */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        type="work"
        data={work}
      />

      {/* 削除確認モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                作品を削除
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              「{work?.title}
              」を削除しますか？この操作は取り消すことができません。
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
