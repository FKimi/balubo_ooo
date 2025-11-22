"use client";

import { fetcher } from "@/utils/fetcher";

/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

interface LikeButtonProps {
  workId: string;
  initialCount?: number;
  initialIsLiked?: boolean;
}

export default function LikeButton({
  workId,
  initialCount = 0,
  initialIsLiked = false,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const checkAuthAndFetchLikes = async () => {
      try {
        // 認証状態を確認
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const authToken = session?.access_token;
        setIsAuthenticated(!!authToken);

        // いいね数と状態を取得
        if (!authToken) {
          setIsAuthenticated(false);
          setLikeCount(0);
          setIsLiked(false);
          return;
        }

        try {
          const data = await fetcher<{ count: number; isLiked: boolean }>(
            `/api/likes?workId=${workId}`,
            {},
            { requireAuth: true },
          );
          setLikeCount(data.count || 0);
          setIsLiked(data.isLiked || false);
        } catch (err) {
          console.error("いいね取得エラー:", err);
          setLikeCount(0);
          setIsLiked(false);
        }
      } catch (error) {
        console.error("いいね取得エラー:", error);
        setLikeCount(0);
        setIsLiked(false);
      }
    };

    if (workId) {
      checkAuthAndFetchLikes();
    }
  }, [workId]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      // ログインページへリダイレクト（ブロッキングなアラートを回避）
      window.location.href = "/login";
      return;
    }

    if (isLoading) return;

    // 楽観的更新のための現在の状態を保存
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    // 楽観的更新
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        throw new Error("認証エラー");
      }

      const url = previousIsLiked ? `/api/likes?workId=${workId}` : "/api/likes";
      const method = previousIsLiked ? "DELETE" : "POST";

      const fetchOptions: RequestInit = {
        method,
      };

      if (!previousIsLiked) {
        fetchOptions.body = JSON.stringify({
          workId,
          targetType: "work",
        });
      }

      await fetcher(url, fetchOptions, { requireAuth: true });
    } catch (error) {
      console.error("いいね操作エラー:", error);
      // エラー時は状態を戻す
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center justify-center w-full space-x-2 px-4 py-3 rounded-full transition-all duration-200 font-medium text-sm transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLiked
        ? "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 focus:ring-red-500"
        : "text-slate-600 bg-white hover:bg-slate-50 hover:text-red-500 border border-slate-200 focus:ring-slate-500 shadow-sm"
        } ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-200 ${isLiked ? "fill-current" : ""
          } ${isLoading ? "" : "group-hover:scale-110"}`}
      />
      <span>
        {likeCount > 0 ? likeCount : "いいね"}
      </span>
    </button>
  );
}
