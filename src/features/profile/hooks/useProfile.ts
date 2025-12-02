/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
  user_id: string;
  display_name: string;
  bio: string;
  professions: string[];
  skills: string[];
  location: string;
  website_url: string;
  portfolio_visibility: "public" | "connections_only" | "private";
  background_image_url: string;
  avatar_image_url: string;
  desired_rate: string;
  job_change_intention: string;
  side_job_intention: string;
  project_recruitment_status: string;
  experience_years: number | null;
  working_hours: string;
  career: any[];
  slug?: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const fetchProfile = useCallback(async () => {
    // 認証が完了していない場合は何もしない
    if (authLoading) {
      return;
    }

    // ユーザーが存在しない場合は状態をリセット
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("[useProfile] プロフィール取得開始:", user.id);

      // 直接Supabaseからプロフィールを取得（より高速）
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // プロフィールが存在しない場合
          console.log("[useProfile] プロフィールが存在しません");
          setProfile(null);
          return;
        }
        throw error;
      }

      console.log("[useProfile] プロフィール取得成功:", data);
      setProfile(data);
    } catch (err) {
      console.error("[useProfile] プロフィール取得エラー:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "プロフィール取得でエラーが発生しました";

      // 認証エラーの場合は、プロフィールをnullにして静かに失敗
      if (
        errorMessage.includes("認証が必要です") ||
        errorMessage.includes("認証トークン")
      ) {
        console.log("[useProfile] 認証エラーによりプロフィール取得をスキップ");
        setProfile(null);
        setError(null); // 認証エラーは表示しない
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading: authLoading || loading, // 認証中も含めてローディング状態とする
    error,
    refetch: fetchProfile,
  };
}
