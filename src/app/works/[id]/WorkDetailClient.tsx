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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-96 bg-gray-200 rounded mb-8"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
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
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/profile">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-white/70"
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
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-colors"
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
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
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
          <Card className="overflow-hidden shadow-lg border border-gray-200 bg-white">
            {/* バナー画像 */}
            <div className="h-80 bg-gray-100 relative overflow-hidden">
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
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
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
                    <div className="text-gray-600 text-lg font-medium">
                      作品
                    </div>
                  </div>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              {/* タイトルと基本情報 */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {work.title}
                  </h1>
                  {work.productionDate && (
                    <span className="text-gray-500 text-sm font-medium bg-gray-100 px-4 py-2 rounded-full whitespace-nowrap ml-4">
                      {new Date(work.productionDate).toLocaleDateString(
                        "ja-JP",
                        { year: "numeric", month: "long" },
                      )}
                    </span>
                  )}
                </div>

                {/* 作者情報 */}
                {authorProfile && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      {/* プロフィール画像 */}
                      <div className="flex-shrink-0">
                        {authorProfile.avatar_image_url ? (
                          <Image
                            src={authorProfile.avatar_image_url}
                            alt={authorProfile.display_name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                            {authorProfile.display_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* 作者情報 */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {authorProfile.display_name}
                          </h3>
                          {authorProfile.professions &&
                            authorProfile.professions.length > 0 && (
                              <span className="text-sm text-gray-600">
                                {authorProfile.professions.join(" / ")}
                              </span>
                            )}
                        </div>

                        {authorProfile.bio && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          プロフィールを見る
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* 役割 */}
                {work.roles && work.roles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {work.roles.map((role, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-800 text-sm rounded-full font-medium border border-blue-200"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 説明文 */}
              {(work.description ||
                (currentUser && work.user_id === currentUser.id)) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                      作品について
                    </h2>
                    {currentUser &&
                      work.user_id === currentUser.id &&
                      !isEditingDescription && (
                        <button
                          onClick={() => setIsEditingDescription(true)}
                          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
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
                      )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    {isEditingDescription &&
                    currentUser &&
                    work.user_id === currentUser.id ? (
                      <div>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="作品について説明してください..."
                          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleSaveDescription}
                            disabled={isSavingDescription}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isSavingDescription ? "保存中..." : "保存"}
                          </button>
                          <button
                            onClick={handleCancelDescription}
                            disabled={isSavingDescription}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : work.description ? (
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                        {work.description}
                      </p>
                    ) : currentUser && work.user_id === currentUser.id ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          作品の説明がまだ記入されていません
                        </p>
                        <button
                          onClick={() => setIsEditingDescription(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2 inline"
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

              {/* 制作メモ */}
              {(work.production_notes ||
                (currentUser && work.user_id === currentUser.id)) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                      制作メモ
                    </h2>
                    {currentUser &&
                      work.user_id === currentUser.id &&
                      !isEditingProductionNotes && (
                        <button
                          onClick={() => setIsEditingProductionNotes(true)}
                          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
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
                      )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="mb-3">
                      <span className="text-sm text-gray-700 font-medium bg-gray-200 px-3 py-1 rounded-full">
                        制作過程・背景・こだわり
                      </span>
                    </div>
                    {isEditingProductionNotes &&
                    currentUser &&
                    work.user_id === currentUser.id ? (
                      <div>
                        <textarea
                          value={productionNotes}
                          onChange={(e) => setProductionNotes(e.target.value)}
                          placeholder="制作背景、目的、こだわったポイントなどを入力..."
                          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleSaveProductionNotes}
                            disabled={isSavingProductionNotes}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isSavingProductionNotes ? "保存中..." : "保存"}
                          </button>
                          <button
                            onClick={handleCancelProductionNotes}
                            disabled={isSavingProductionNotes}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : work.production_notes ? (
                      <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                        {work.production_notes}
                      </p>
                    ) : currentUser && work.user_id === currentUser.id ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          制作メモがまだ記入されていません
                        </p>
                        <button
                          onClick={() => setIsEditingProductionNotes(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-2 inline"
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
                          制作メモを追加
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* AI分析結果 */}
              {aiAnalysis && (
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    AI分析結果
                  </h2>

                  <div className="space-y-6">
                    {/* 作品概要・要約 */}
                    {aiAnalysis.summary && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          <h4 className="text-lg font-bold text-gray-900">
                            コンテンツ概要
                          </h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {aiAnalysis.summary}
                        </p>
                      </div>
                    )}

                    {/* AI評価スコア - 削除済み */}

                    {/* 専門性分析 */}
                    <BtoBAnalysisSection aiAnalysis={aiAnalysis || {}} />

                    {/* 強み分析 */}
                    {aiAnalysis.strengths &&
                      aiAnalysis.strengths.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            この作品の強み
                          </h5>
                          <div className="space-y-4">
                            {/* 創造性 */}
                            {aiAnalysis.strengths.creativity &&
                              aiAnalysis.strengths.creativity.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <h6 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <svg
                                      className="w-4 h-4 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                                      />
                                    </svg>
                                    創造性
                                  </h6>
                                  <ul className="space-y-1">
                                    {aiAnalysis.strengths.creativity.map(
                                      (strength: string, index: number) => (
                                        <li
                                          key={index}
                                          className="flex items-start gap-2 text-gray-700 text-sm"
                                        >
                                          <span className="text-blue-600 mt-1 text-xs">
                                            ●
                                          </span>
                                          <span className="leading-relaxed">
                                            {strength}
                                          </span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}

                            {/* 専門性 */}
                            {aiAnalysis.strengths.expertise &&
                              aiAnalysis.strengths.expertise.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <h6 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <svg
                                      className="w-4 h-4 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    専門性
                                  </h6>
                                  <ul className="space-y-1">
                                    {aiAnalysis.strengths.expertise.map(
                                      (strength: string, index: number) => (
                                        <li
                                          key={index}
                                          className="flex items-start gap-2 text-gray-700 text-sm"
                                        >
                                          <span className="text-blue-600 mt-1 text-xs">
                                            ●
                                          </span>
                                          <span className="leading-relaxed">
                                            {strength}
                                          </span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}

                            {/* 影響力 */}
                            {aiAnalysis.strengths.impact &&
                              aiAnalysis.strengths.impact.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <h6 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <svg
                                      className="w-4 h-4 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                      />
                                    </svg>
                                    影響力
                                  </h6>
                                  <ul className="space-y-1">
                                    {aiAnalysis.strengths.impact.map(
                                      (strength: string, index: number) => (
                                        <li
                                          key={index}
                                          className="flex items-start gap-2 text-gray-700 text-sm"
                                        >
                                          <span className="text-blue-600 mt-1 text-xs">
                                            ●
                                          </span>
                                          <span className="leading-relaxed">
                                            {strength}
                                          </span>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </div>
                      )}

                    {/* キーワード */}
                    {aiAnalysis.keywords && aiAnalysis.keywords.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-blue-600"
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
                          キーワード
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.keywords.map(
                            (keyword: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                              >
                                {keyword}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* タグ */}
                    {aiAnalysis.tags && aiAnalysis.tags.length > 0 && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-blue-600"
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
                          関連タグ
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {aiAnalysis.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* タグ（AI分析タグがない場合のみ表示） */}
              {(!aiAnalysis?.tags || aiAnalysis.tags.length === 0) &&
                work.tags &&
                work.tags.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                      タグ
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-50 text-blue-800 text-sm rounded-full font-medium border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* 外部リンク */}
              {work.external_url && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-blue-600"
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
                    外部リンク
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <a
                      href={work.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
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
                      作品を確認する
                    </a>
                  </div>
                </div>
              )}

              {/* アクションボタン */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200">
                <LikeButton workId={work.id} />

                <Button
                  onClick={() => setShowShareModal(true)}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50"
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  共有
                </Button>
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
