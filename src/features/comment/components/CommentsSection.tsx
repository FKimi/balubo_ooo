"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import Image from "next/image";
import { Send, MessageCircle, User } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { fetcher } from "@/utils/fetcher";
import { EmptyState } from "@/components/common";
import { useAuth } from "@/contexts/AuthContext";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    display_name: string;
    avatar_image_url?: string;
  };
}

interface CommentsSectionProps {
  workId: string;
}

export default function CommentsSection({ workId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const checkAuthAndFetchComments = async () => {
      setIsLoading(true);
      try {
        // 認証状態を確認
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const authToken = session?.access_token;
        setIsAuthenticated(!!authToken);

        if (!authToken) {
          try {
            const data = await fetcher<{ comments: Comment[]; count: number }>(
              `/api/comments/public?workId=${workId}`,
              { cache: "no-store" },
              { requireAuth: false },
            );
            setComments(data.comments || []);
            setCommentCount(data.count || 0);
          } catch (err) {
            console.error("コメント取得エラー(公開API):", err);
            setComments([]);
            setCommentCount(0);
          }
          return;
        }

        try {
          const data = await fetcher<{ comments: Comment[]; count: number }>(
            `/api/comments?workId=${workId}`,
            {},
            { requireAuth: true },
          );
          setComments(data.comments || []);
          setCommentCount(data.count || 0);
        } catch (err) {
          console.error("コメント取得エラー:", err);
          setComments([]);
          setCommentCount(0);
        }
      } catch (error) {
        console.error("コメント取得エラー:", error);
        setComments([]);
        setCommentCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (workId) {
      checkAuthAndFetchComments();
    }
  }, [workId]);

  const { user } = useAuth();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert("コメントするにはログインが必要です");
      return;
    }

    if (!newComment.trim() || isSubmitting) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      content: newComment.trim(),
      created_at: new Date().toISOString(),
      user: {
        id: user.id,
        display_name:
          user.user_metadata?.display_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "ユーザー",
        avatar_image_url:
          user.user_metadata?.avatar_image_url ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture,
      },
    };

    // Optimistic update
    setComments((prev) => [optimisticComment, ...prev]);
    setCommentCount((prev) => prev + 1);
    setNewComment("");
    setIsSubmitting(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        throw new Error("認証エラーが発生しました");
      }

      const data = await fetcher<{ comment: Comment }>(
        "/api/comments",
        {
          method: "POST",
          body: JSON.stringify({
            workId,
            content: optimisticComment.content,
            targetType: "work",
          }),
        },
        { requireAuth: true },
      );

      // Replace temp comment with real one
      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? data.comment : c)),
      );
    } catch (err: any) {
      console.error("コメント投稿エラー:", err);
      // Revert optimistic update
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setCommentCount((prev) => prev - 1);
      setNewComment(optimisticComment.content); // Restore text
      alert(err.message || "コメントの投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "今";
    if (diffInHours < 24) return `${diffInHours}時間前`;
    if (diffInDays < 7) return `${diffInDays}日前`;
    return date.toLocaleDateString("ja-JP");
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          コメント {commentCount > 0 && `(${commentCount})`}
        </h3>
      </div>

      {/* コメント投稿フォーム */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="作品について感想やアドバイスを残してみませんか..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${newComment.trim() && !isSubmitting
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "投稿中..." : "投稿"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-center">
            コメントするには
            <button className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              ログイン
            </button>
            が必要です
          </p>
        </div>
      )}

      {/* コメント一覧 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">コメントを読み込み中...</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {/* アバター */}
                <div className="flex-shrink-0">
                  {comment.user.avatar_image_url ? (
                    <Image
                      src={comment.user.avatar_image_url}
                      alt={comment.user.display_name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* コメント内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.user.display_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="まだコメントがありません"
          message="最初のコメントを投稿してみませんか？"
          icon={MessageCircle}
        />
      )}
    </div>
  );
}
