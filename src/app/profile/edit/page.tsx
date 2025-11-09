"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileData } from "@/features/profile/types";
import { apiEndpoints, safeApiCall } from "@/utils/fetcher";

export default function ProfileEditPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // データベースからプロフィールデータを取得する関数
  const fetchProfileData = async () => {
    const { data, error } = await safeApiCall(() => apiEndpoints.profile.get());
    if (error) {
      console.error("プロフィール取得エラー:", error);
      return null;
    }
    // API は { data: profile, error: null } 形式
    // 古い実装との互換のため profile もフォールバックで確認
    return (data as any)?.data || (data as any)?.profile || null;
  };

  // useEffectでデータベースからプロフィールデータを読み込み
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const dbProfile = await fetchProfileData();

        if (dbProfile) {
          // データベースから取得したデータをフォームに設定
          const convertedProfile: ProfileData = {
            displayName:
              dbProfile.display_name || user?.user_metadata?.display_name || "",
            title: dbProfile.title || "",
            bio: dbProfile.bio || dbProfile.introduction || "",
            professions: dbProfile.professions || [],
            skills: dbProfile.skills || [],
            location: dbProfile.location || "",
            websiteUrl: dbProfile.website_url || "",
            portfolioVisibility: dbProfile.portfolio_visibility || "public",
            backgroundImageUrl: dbProfile.background_image_url || "",
            avatarImageUrl: dbProfile.avatar_image_url || "",
            desiredRate: dbProfile.desired_rate || "",
            jobChangeIntention:
              dbProfile.job_change_intention || "not_considering",
            sideJobIntention: dbProfile.side_job_intention || "not_considering",
            projectRecruitmentStatus:
              dbProfile.project_recruitment_status || "not_recruiting",
            ...(dbProfile.experience_years && {
              experienceYears: dbProfile.experience_years,
            }),
            workingHours: dbProfile.working_hours || "",
            career: dbProfile.career || [],
          };

          setFormData(convertedProfile);
        } else {
          // データベースにデータがない場合はローカルストレージから読み込み
          const savedProfile = localStorage.getItem(
            `profileData_${user?.id || "anon"}`,
          );
          if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            setFormData({
              ...parsedProfile,
              displayName:
                parsedProfile.displayName ||
                user?.user_metadata?.display_name ||
                "",
            });
          }
        }
      } catch (error) {
        console.error("プロフィールデータの読み込みエラー:", error);
        // エラー時はローカルストレージから読み込み
        try {
          const savedProfile = localStorage.getItem(
            `profileData_${user?.id || "anon"}`,
          );
          if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);
            setFormData({
              ...parsedProfile,
              displayName:
                parsedProfile.displayName ||
                user?.user_metadata?.display_name ||
                "",
            });
          }
        } catch (localError) {
          console.error("ローカルデータの読み込みにも失敗:", localError);
        }
      }
    };

    loadProfileData();
  }, [user]);

  const [formData, setFormData] = useState<ProfileData>(() => {
    const baseData = {
      displayName: user?.user_metadata?.display_name || "",
      title: "",
      bio: "",
      professions: [],
      skills: [],
      location: "",
      websiteUrl: "",
      portfolioVisibility: "public" as const,
      backgroundImageUrl: "",
      avatarImageUrl: "",
      desiredRate: "",
      jobChangeIntention: "not_considering" as const,
      sideJobIntention: "not_considering" as const,
      projectRecruitmentStatus: "not_recruiting" as const,
      workingHours: "",
      career: [],
    };

    // experienceYearsは条件付きで追加
    return baseData;
  });

  // ドラッグ&ドロップ状態の管理
  const [_isDraggingBackground, setIsDraggingBackground] = useState(false);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "background" | "avatar",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, type);
    }
  };

  // ファイル処理の共通関数
  const processFile = async (file: File, type: "background" | "avatar") => {
    // ファイル形式の検証
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }

    // ファイルサイズの検証（背景画像: 5MB、プロフィール画像: 2MB）
    const maxSize = type === "background" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = type === "background" ? "5MB" : "2MB";
      alert(`ファイルサイズが${maxSizeMB}を超えています。`);
      return;
    }

    try {
      // Supabase Storage にアップロード
      const { supabase } = await import("@/lib/supabase");
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath =
        type === "background"
          ? `backgrounds/${fileName}`
          : `avatars/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("work-files")
        .upload(filePath, file);

      if (uploadError) {
        console.error("アップロードエラー:", uploadError);
        alert("ファイルのアップロードに失敗しました。");
        return;
      }

      // 公開URLを取得
      const { data: urlData } = supabase.storage
        .from("work-files")
        .getPublicUrl(uploadData.path);

      const publicUrl = urlData.publicUrl;

      // フォームデータを更新
      if (type === "background") {
        setFormData((prev) => ({ ...prev, backgroundImageUrl: publicUrl }));
      } else if (type === "avatar") {
        setFormData((prev) => ({ ...prev, avatarImageUrl: publicUrl }));
      }

      console.log(`${type} image uploaded:`, publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("ファイルのアップロードに失敗しました。");
    }
  };

  // ドラッグ&ドロップイベントハンドラー
  const handleDragOver = (
    e: React.DragEvent,
    type: "background" | "avatar",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "background") {
      setIsDraggingBackground(true);
    } else {
      setIsDraggingAvatar(true);
    }
  };

  const handleDragLeave = (
    e: React.DragEvent,
    type: "background" | "avatar",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // relatedTargetが子要素でない場合のみドラッグ状態を解除
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (type === "background") {
        setIsDraggingBackground(false);
      } else {
        setIsDraggingAvatar(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, type: "background" | "avatar") => {
    e.preventDefault();
    e.stopPropagation();

    // ドラッグ状態をリセット
    if (type === "background") {
      setIsDraggingBackground(false);
    } else {
      setIsDraggingAvatar(false);
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file) {
        processFile(file, type);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("保存するデータ:", formData);

      // データベースに保存
      const { data, error } = await safeApiCall(() =>
        apiEndpoints.profile.save(formData),
      );

      if (error) {
        console.error("保存エラー:", error);
        alert(`保存に失敗しました: ${error}

問題が続く場合は、ページを再読み込みしてもう一度お試しください。`);
        return;
      }

      if (data) {
        // ローカルストレージにも保存（バックアップ用）
        const userId = user?.id || "anon";
        localStorage.setItem(`profileData_${userId}`, JSON.stringify(formData));

        // Supabase Auth 側の user_metadata も更新して表示名を同期
        try {
          const { supabase } = await import("@/lib/supabase");
          await supabase.auth.updateUser({
            data: { display_name: formData.displayName },
          });
        } catch (metaErr) {
          console.warn("user_metadata 更新失敗:", metaErr);
        }

        // 更新フラグを付けてプロフィール画面に遷移
        router.push("/profile?updated=true");
      }
    } catch (error) {
      console.error("保存エラー（例外）:", error);
      console.error(
        "エラースタック:",
        error instanceof Error ? error.stack : "スタックなし",
      );

      let errorMessage = `保存に失敗しました。

エラー詳細: ${error instanceof Error ? error.message : "不明なエラー"}`;

      // ネットワークエラーの判定
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage += `

ネットワーク接続を確認してください:
- インターネット接続が有効か確認
- ファイアウォールやセキュリティソフトが通信をブロックしていないか確認
- 開発サーバーが起動しているか確認 (localhost:3000)`;
      }

      // JSONパースエラーの判定
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        errorMessage += `

サーバーから不正なレスポンスが返されました。
開発者にお知らせください。`;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-3xl mx-auto">
            {/* ページヘッダー - プロフェッショナルなデザイン */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 rounded-full transition-colors"
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                </Link>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    プロフィール編集
                  </h1>
                  <p className="text-gray-600 mt-2 text-sm">
                    あなたのプロフィール情報を更新して、より魅力的なポートフォリオを作成しましょう
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本情報 */}
              <Card className="border border-gray-200 shadow-lg shadow-gray-100/50 bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-blue-50/50 to-blue-50/30 border-b border-gray-100">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    </div>
                    <div>
                      <div>基本情報</div>
                      <CardDescription className="text-gray-600 mt-1 text-sm">
                        プロフィールの基本情報を設定します
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-6 sm:p-8">
                  {/* 背景画像設定 */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-1 block">
                      背景画像
                    </Label>
                      <p className="text-xs text-gray-500">
                        プロフィールページの上部に表示される背景画像を設定できます
                      </p>
                    </div>
                    <div className="space-y-4">
                      {/* 背景画像プレビュー - プロフェッショナルなデザイン */}
                      <div
                        className={`relative w-full h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer group ${
                          formData.backgroundImageUrl
                            ? "border-gray-300 hover:border-blue-500 hover:shadow-lg"
                            : "border-gray-300 hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-50/50"
                        }`}
                        onDragOver={(e) => handleDragOver(e, "background")}
                        onDragLeave={(e) => handleDragLeave(e, "background")}
                        onDrop={(e) => handleDrop(e, "background")}
                        onClick={() =>
                          document.getElementById("backgroundImage")?.click()
                        }
                      >
                        {formData.backgroundImageUrl ? (
                          <>
                            <Image
                              src={formData.backgroundImageUrl}
                              alt="背景画像プレビュー"
                              fill
                              sizes="100vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              quality={85}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-900 shadow-lg">
                                画像を変更
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center px-4">
                              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors shadow-inner">
                                <svg
                                  className="w-8 h-8 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">
                                背景画像をアップロード
                              </p>
                              <p className="text-xs text-gray-500">
                                クリックまたはドラッグ&ドロップで画像を追加
                              </p>
                            </div>
                          </div>
                        )}
                        {formData.backgroundImageUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="背景画像削除"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData((prev) => ({
                                ...prev,
                                backgroundImageUrl: "",
                              }));
                            }}
                            className="absolute top-3 right-3 w-9 h-9 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110 backdrop-blur-sm"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </Button>
                        )}
                      </div>

                      {/* ファイル選択ボタン - 改善されたデザイン */}
                      <div className="flex gap-3 flex-wrap">
                        <input
                          type="file"
                          id="backgroundImage"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "background")}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all shadow-sm rounded-xl"
                        >
                          <label
                            htmlFor="backgroundImage"
                            className="cursor-pointer flex items-center"
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
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            画像を選択
                          </label>
                        </Button>
                      </div>
                      <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-3">
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">推奨サイズ:</span> 1200×300px
                          <span className="mx-2">•</span>
                          <span className="font-semibold">形式:</span> JPG, PNG
                          <span className="mx-2">•</span>
                          <span className="font-semibold">最大サイズ:</span> 5MB
                      </p>
                      </div>
                    </div>
                  </div>

                  {/* プロフィール画像 - 改善されたデザイン */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-900 mb-4 block">
                      プロフィール画像
                    </Label>
                    <div className="flex items-start space-x-6">
                      <div className="relative group">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
                      {formData.avatarImageUrl ? (
                        <Image
                          src={formData.avatarImageUrl}
                          alt="プロフィール画像"
                              width={112}
                              height={112}
                          className="rounded-full object-cover w-full h-full"
                              quality={90}
                        />
                      ) : (
                            <span className="text-gray-500 font-bold text-3xl">
                          {formData.displayName.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                        {formData.avatarImageUrl && (
                          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg
                                className="w-6 h-6 text-white drop-shadow-lg"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap gap-3">
                        <input
                          type="file"
                          id="avatarImage"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "avatar")}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          type="button"
                          size="sm"
                          asChild
                            className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all shadow-sm rounded-xl"
                        >
                          <label
                            htmlFor="avatarImage"
                              className="cursor-pointer flex items-center"
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
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            画像を変更
                          </label>
                        </Button>
                        {formData.avatarImageUrl && (
                          <Button
                            variant="outline"
                            type="button"
                            size="sm"
                            aria-label="プロフィール画像削除"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                avatarImageUrl: "",
                              }))
                            }
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
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
                          </Button>
                        )}
                      </div>
                        <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-3">
                      <p
                        className={`text-xs transition-colors ${
                              isDraggingAvatar
                                ? "text-orange-600 font-medium"
                                : "text-gray-600"
                        }`}
                      >
                        {isDraggingAvatar
                              ? "📎 画像をドロップしてください"
                              : "推奨サイズ: 400×400px • 形式: JPG, PNG • 最大サイズ: 2MB"}
                      </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 表示名 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="displayName"
                      className="text-sm font-semibold text-gray-900 flex items-center gap-2"
                    >
                      表示名
                      <span className="text-red-500 text-xs">*</span>
                    </Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="あなたの名前またはニックネーム"
                      required
                      className="h-11 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all rounded-xl"
                    />
                  </div>

                  {/* 肩書き */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-sm font-semibold text-gray-900"
                    >
                      肩書き・役職
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="例: フロントエンドエンジニア、デザイナー、ライター"
                      className="h-11 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all rounded-xl"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      あなたの現在の肩書きや役職を入力してください
                    </p>
                  </div>

                  {/* 自己紹介 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="text-sm font-semibold text-gray-900"
                    >
                      自己紹介
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="あなたの経歴、得意分野、価値観などを簡潔に記述してください"
                      className="min-h-[140px] border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all rounded-xl resize-none"
                      maxLength={300}
                    />
                    <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        簡潔で魅力的な自己紹介を心がけましょう
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          formData.bio.length > 280
                            ? "text-orange-600"
                            : formData.bio.length > 250
                              ? "text-gray-600"
                              : "text-gray-400"
                        }`}
                      >
                      {formData.bio.length}/300文字
                    </p>
                    </div>
                  </div>

                  {/* 居住地 */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-sm font-semibold text-gray-900"
                    >
                      居住地
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="例: 東京都"
                      className="h-11 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all rounded-xl"
                    />
                  </div>

                  {/* ウェブサイト */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="websiteUrl"
                      className="text-sm font-semibold text-gray-900"
                    >
                      ウェブサイト・ポートフォリオURL
                    </Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="https://your-portfolio.com"
                      className="h-11 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all rounded-xl"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      あなたのポートフォリオサイトやブログのURLを入力してください
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 保存ボタン - プロフェッショナルなデザイン */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 h-12 text-base font-semibold rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>保存中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>変更を保存</span>
                    </div>
                  )}
                </Button>
                <Link href="/profile" className="flex-1 sm:flex-initial">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto sm:px-8 h-12 text-base font-medium border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
                  >
                    キャンセル
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
