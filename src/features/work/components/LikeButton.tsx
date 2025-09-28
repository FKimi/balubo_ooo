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
        try {
          const data = await fetcher<{ count: number; isLiked: boolean }>(
            `/api/likes?workId=${workId}`,
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
      alert("いいねするにはログインが必要です");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        alert("認証エラーが発生しました");
        return;
      }

      const url = isLiked ? `/api/likes?workId=${workId}` : "/api/likes";
      const method = isLiked ? "DELETE" : "POST";

      const fetchOptions: RequestInit = {
        method,
      };

      if (!isLiked) {
        fetchOptions.body = JSON.stringify({
          workId,
          targetType: "work",
        });
      }

      try {
        await fetcher(url, fetchOptions);
        // 楽観的更新
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      } catch (error) {
        alert(error instanceof Error ? error.message : "エラーが発生しました");
      }
    } catch (error) {
      console.error("いいね操作エラー:", error);
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isLiked
          ? "text-red-600 bg-red-50 hover:bg-red-100"
          : "text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-red-500"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Heart
        className={`h-5 w-5 transition-all duration-200 ${
          isLiked ? "fill-current" : ""
        } ${isLoading ? "" : "group-hover:scale-110"}`}
      />
      <span className="text-sm font-medium">
        {likeCount > 0 ? likeCount : "いいね"}
      </span>
    </button>
  );
}
