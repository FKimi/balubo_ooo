"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
// ブラウザでクッキー保存された Supabase セッションを取得するため `@supabase/ssr` のヘルパーを利用
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { RecommendedUsers } from "@/features/feed";
import { Share, ExternalLink, User } from "lucide-react";
import { EmptyState } from "@/components/common";
// import { TabNavigation } from '@/components/ui/TabNavigation' // 未使用のため一時的にコメントアウト

import { SearchFilters } from "@/components/feed/SearchFilters";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useFeedScrollRestoration } from "@/hooks/useFeedScrollRestoration";
import { useDebounce } from "react-use";
import { WorkCard } from "@/components/feed/WorkCard";
import { WorkCardSkeleton } from "@/components/feed/WorkCardSkeleton";
import { DiscoverySection } from "@/components/feed/DiscoverySection";
import { formatTimeAgo } from "@/utils/dateFormat";
import { takeFirst, getArrayLength } from "@/utils/arrayUtils";

// Supabaseクライアントをコンポーネント外で初期化
// `getSupabaseBrowserClient` はクッキーに保存されたセッションを自動で参照します
const supabase = getSupabaseBrowserClient();

interface User {
  id: string;
  display_name: string;
  avatar_image_url?: string;
}

interface FeedItem {
  id: string;
  type: "work";
  title: string;
  description?: string;
  external_url?: string;
  tags?: string[];
  roles?: string[];
  banner_image_url?: string;
  created_at: string;
  user: User;
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

function FeedPageContent() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_activeTab, _setActiveTab] = useState<"works">("works");
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [_stats, setStats] = useState({
    total: 0,
    works: 0,
    inputs: 0,
    unique_users: 0,
  });
  const [_total, setTotal] = useState(0);

  // 新しい状態変数：検索・フィルタリング・ページネーション
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "work">("all");
  const [filterTag, setFilterTag] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  // スクロール復元フック
  const { clearScrollRestoration } = useFeedScrollRestoration(
    feedItems,
    nextCursor,
    hasMore,
    setFeedItems,
    setNextCursor,
    setHasMore
  );

  // 検索クエリのデバウンス処理
  useDebounce(
    () => {
      setDebouncedSearchQuery(searchQuery);
    },
    800,
    [searchQuery]
  );

  // 認証状態確認
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError && authError.message !== "Auth session missing!") {
          console.error("フィード画面: 認証エラー:", authError);
        }

        setIsAuthenticated(!!user);
        setCurrentUser(user);
      } catch (error) {
        console.error("認証確認エラー:", error);
      }
    };

    checkAuth();
  }, []);

  // フィードデータ取得関数
  const fetchFeedData = useCallback(
    async (
      append = false,
      params: {
        searchQuery?: string;
        filterType?: "all" | "work";
        filterTag?: string;
        cursor?: string | null;
      } = {},
    ) => {
      const startTime = Date.now();
      console.log("フィード画面: データ取得開始", { append, params });

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError(null);
        }

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (currentSession?.access_token) {
          headers["Authorization"] = `Bearer ${currentSession.access_token}`;
        }

        // クエリパラメータを構築(最大20件で打ち止め)
        const searchParams = new URLSearchParams({
          limit: "20",
          ...(params.cursor && { cursor: params.cursor }),
          ...(params.searchQuery && { q: params.searchQuery }),
          ...(params.filterType &&
            params.filterType !== "all" && { type: params.filterType }),
          ...(params.filterTag && { tag: params.filterTag }),
        });

        const cacheOptions: RequestInit = {
          method: "GET",
          headers,
          // フィードを12時間キャッシュ（1日2回更新）
          next: { revalidate: 43200 },
        };

        const response = await fetch(`/api/feed?${searchParams}`, cacheOptions);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.errorMessage ||
            errorData.error ||
            `HTTP error! status: ${response.status}`;
          console.error("フィード画面: APIエラー", {
            status: response.status,
            errorData,
          });
          throw new Error(errorMessage);
        }

        const feedData = await response.json();

        const processingTime = Date.now() - startTime;
        console.log("フィード画面: データ取得成功", {
          items: getArrayLength(feedData.items),
          append,
          processingTime: `${processingTime}ms`,
        });

        if (feedData.items && Array.isArray(feedData.items)) {
          if (append) {
            setFeedItems((prev) => [...prev, ...feedData.items]);
          } else {
            setFeedItems(feedData.items);
          }

          setStats(
            feedData.stats || {
              total: 0,
              works: 0,
              inputs: 0,
              unique_users: 0,
            },
          );
          setTotal(feedData.total || 0);
          // 無限スクロールを無効化(最大20件で打ち止め)
          setHasMore(false);
          setNextCursor(null);

          // 人気タグの更新（初回のみ）
          if (!append && feedData.items.length > 0) {
            const allTags = feedData.items.flatMap(
              (item: FeedItem) => item.tags || [],
            );
            const tagCounts = allTags.reduce(
              (acc: Record<string, number>, tag: string) => {
                acc[tag] = (acc[tag] || 0) + 1;
                return acc;
              },
              {},
            );
            const sortedTags = takeFirst(
              Object.entries(tagCounts).sort(
                ([, a], [, b]) => (b as number) - (a as number),
              ),
              10,
            ).map(([tag]) => tag);
            setPopularTags(sortedTags);
          }

          setError(null);
        } else {
          console.warn("フィード画面: 無効なデータ形式:", feedData);
          if (!append) {
            setFeedItems([]);
            setStats({ total: 0, works: 0, inputs: 0, unique_users: 0 });
            setTotal(0);
          }
          setError("データ形式エラー");
        }
      } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error("フィード画面: データ取得エラー:", error);
        console.log("処理時間:", processingTime);

        setError(error instanceof Error ? error.message : "データ取得エラー");
        if (!append) {
          setFeedItems([]);
          setStats({ total: 0, works: 0, inputs: 0, unique_users: 0 });
          setTotal(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [], // 依存配列を空にして、関数を安定化
  );

  // 初回データ取得（検索条件変更時にも再取得）
  useEffect(() => {
    if (isAuthenticated !== null) {
      // 復元されたデータがある場合は初回フェッチをスキップ
      // ただし、フィルターが変更された場合はフェッチする
      const isInitialLoad = feedItems.length === 0 && !debouncedSearchQuery && !filterTag;
      const isFilterChanged = debouncedSearchQuery || filterTag || filterType !== "all";

      if (isInitialLoad || isFilterChanged) {
        // 既にデータがある場合（復元後など）で、フィルター変更がない場合はスキップしたいが、
        // 依存配列の都合上、ここで制御するのは難しい。
        // シンプルに「データが空」または「フィルター適用時」にフェッチするようにする。

        // 復元直後は feedItems がセットされているはずなので、ここはスキップされるはず
        if (feedItems.length === 0 || isFilterChanged) {
          fetchFeedData(false, {
            searchQuery: debouncedSearchQuery,
            filterType,
            filterTag,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    filterTag,
    filterType,
    debouncedSearchQuery,
    // feedItems.length を依存配列に含めると無限ループの恐れがあるため注意が必要だが、
    // ここでは初期ロード制御のために意図的に外している、もしくはロジック内でガードしている
  ]);

  // 無限スクロール
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && nextCursor) {
      fetchFeedData(true, {
        searchQuery,
        filterType,
        filterTag,
        cursor: nextCursor,
      });
    }
  }, [
    hasMore,
    loadingMore,
    nextCursor,
    searchQuery,
    filterType,
    filterTag,
    fetchFeedData,
  ]);

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: loadMore,
  });

  // 検索・フィルタリング用のハンドラー関数
  const handleApplyFilters = useCallback(() => {
    console.log("フィルター適用:", {
      searchQuery,
      filterType,
      filterTag,
    });
    clearScrollRestoration(); // フィルター適用時はスクロール位置をリセット
    setHasMore(true);
    setNextCursor(null);
    setFeedItems([]); // リセット
    fetchFeedData(false, { searchQuery, filterType, filterTag });
  }, [searchQuery, filterType, filterTag, fetchFeedData, clearScrollRestoration]);

  const handleClearFilters = useCallback(() => {
    clearScrollRestoration();
    setSearchQuery("");
    setFilterType("all");
    setFilterTag("");
    setHasMore(true);
    setNextCursor(null);
    setFeedItems([]); // リセット
    fetchFeedData(false);
  }, [fetchFeedData, clearScrollRestoration]);

  const handleRefresh = useCallback(() => {
    clearScrollRestoration();
    setRefreshing(true);
    setHasMore(true);
    setNextCursor(null);
    // setFeedItems([]); // リフレッシュ時は既存を表示したままにするか、クリアするか。ここではクリアしない
    fetchFeedData(false, { searchQuery, filterType, filterTag });
  }, [searchQuery, filterType, filterTag, fetchFeedData, clearScrollRestoration]);

  // 作品のみをフィルタリング（インプットは削除済み）
  const filteredItems = useMemo(() => {
    return feedItems.filter((item) => item.type === "work");
  }, [feedItems]);

  const _tabConfigs = [{ key: "works", label: "作品" }];

  // いいね処理
  const handleLike = async (itemId: string, itemType: "work") => {
    // console.log("いいね処理開始:", { itemId, itemType, isAuthenticated });

    if (!isAuthenticated) {
      // console.log("認証されていないため、ログインページにリダイレクト");
      router.push("/login");
      return;
    }

    // 対象アイテムの現在の状態を確認
    const targetItem = feedItems.find((item) => item.id === itemId);
    if (!targetItem) {
      console.error("対象アイテムが見つかりません:", itemId);
      return;
    }

    const isCurrentlyLiked = targetItem.user_has_liked;
    const previousLikesCount = targetItem.likes_count || 0;

    // 1. 楽観的更新 (Optimistic Update) - API呼び出し前にUIを更新
    setFeedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
            ...item,
            likes_count: isCurrentlyLiked
              ? Math.max(0, (item.likes_count || 0) - 1)
              : (item.likes_count || 0) + 1,
            user_has_liked: !isCurrentlyLiked,
          }
          : item,
      ),
    );

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        // console.log("認証トークンが取得できません");
        throw new Error("認証トークンが取得できません");
      }

      // console.log("認証トークン取得成功");

      let response;
      if (isCurrentlyLiked) {
        // console.log("いいね削除処理開始");
        // いいね削除
        response = await fetch(`/api/likes?workId=${itemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        // console.log("いいね追加処理開始");
        // いいね追加
        response = await fetch("/api/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            workId: itemId,
            targetType: itemType,
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error("いいね処理エラー (Reverting):", error);
      // エラー発生時は状態を元に戻す (Revert)
      setFeedItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
              ...item,
              likes_count: previousLikesCount,
              user_has_liked: !!isCurrentlyLiked,
            }
            : item,
        ),
      );

      if (error instanceof Error && error.message === "認証トークンが取得できません") {
        router.push("/login");
      }
    }
  };

  // コメント一覧を取得
  const fetchComments = async (itemId: string) => {
    setLoadingComments(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(`/api/comments?workId=${itemId}`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        console.error("コメント取得エラー:", response.status);
        setComments([]);
      }
    } catch (error) {
      console.error("コメント取得ネットワークエラー:", error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  // コメント投稿（修正版）
  const handleSubmitComment = async (itemId: string) => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (!newComment.trim() || isSubmittingComment) return;

    // 対象アイテムの情報を取得
    const targetItem = feedItems.find((item) => item.id === itemId);
    if (!targetItem) {
      alert("対象のアイテムが見つかりません");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        router.push("/auth");
        return;
      }

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          workId: itemId,
          content: newComment.trim(),
          targetType: targetItem.type, // 'work'
        }),
      });

      if (response.ok) {
        // 楽観的更新
        setFeedItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, comments_count: (item.comments_count || 0) + 1 }
              : item,
          ),
        );

        // 選択中のアイテムも更新
        if (selectedItem && selectedItem.id === itemId) {
          setSelectedItem((prev) =>
            prev
              ? {
                ...prev,
                comments_count: (prev.comments_count || 0) + 1,
              }
              : null,
          );
        }

        setNewComment("");

        // コメント一覧を再取得
        await fetchComments(itemId);

        // 最新のコメント数を取得
        // setTimeout(() => fetchItemStats(itemId), 500) // この行は削除
      } else {
        const errorData = await response.json();
        console.error("コメントAPIエラー:", {
          status: response.status,
          errorData,
          itemId,
        });
        alert(
          `コメント投稿に失敗しました: ${errorData.details || errorData.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("コメントネットワークエラー:", error);
      alert("ネットワークエラーが発生しました");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // コメントモーダルを開く
  const openCommentModal = async (itemId: string) => {
    setShowCommentModal(itemId);
    await fetchComments(itemId);
  };

  // コメントモーダルを閉じる
  const closeCommentModal = () => {
    setShowCommentModal(null);
    setComments([]);
    setNewComment("");
  };

  // シェア機能
  const handleShare = async (item: FeedItem) => {
    const shareUrl = `${window.location.origin}/works/${item.id}`;
    const shareText = `${item.title} - ${item.user.display_name}のポートフォリオをチェック！`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("シェアがキャンセルされました");
      }
    } else {
      // フォールバック: クリップボードにコピー
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert("リンクをクリップボードにコピーしました！");
      } catch (error) {
        console.error("コピーに失敗しました:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FF] fade-in">
        <div className="max-w-full">
          {/* スケルトンヘッダー */}
          <div className="bg-white border-b border-gray-200">
            <div className="h-16 w-full loading-shimmer" />
          </div>
          {/* WorkCardSkeletonグリッド */}
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 max-w-[1920px] mx-auto">
            {[...Array(10)].map((_, idx) => (
              <WorkCardSkeleton key={idx} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <div className="max-w-full">
        <div className="flex">
          {/* メインフィード - フル幅対応 */}
          <div className="flex-1 max-w-full">
            {/* 検索・フィルタリング（スティッキー） */}
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              filterTag={filterTag}
              onFilterTagChange={setFilterTag}
              popularTags={popularTags}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />

            {/* 見つけるセクション（カルーセル） */}
            <DiscoverySection
              onTagClick={(tag) => {
                clearScrollRestoration();
                setFilterTag(tag);
                setSearchQuery("");
                setFilterType("all");
                setHasMore(true);
                setNextCursor(null);
                setFeedItems([]);
                fetchFeedData(false, {
                  searchQuery: "",
                  filterType: "all",
                  filterTag: tag,
                });
              }}
              onWorkClick={(work) => {
                // 作品詳細ページに遷移
                router.push(`/works/${work.id}`);
              }}
            />

            {/* 未ログインユーザー向け登録CTA */}
            {!isAuthenticated && (
              <div className="px-4 py-6 sm:px-6">
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white shadow-[0_20px_50px_rgba(37,99,235,0.35)]">
                  <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_top,_#fff,_transparent_55%)]" />
                  <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-2xl space-y-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        無料ではじめられます
                      </span>
                      <h2 className="text-2xl font-bold leading-snug sm:text-3xl md:text-4xl">
                        「専門性スコア」を見て、自分だけの強みを言語化しよう
                      </h2>
                      <ul className="space-y-2 text-sm sm:text-base text-blue-50/90">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                            1
                          </span>
                          <span>
                            最新のポートフォリオから、BtoBライティングのトレンドや構成を学べます
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                            2
                          </span>
                          <span>
                            AIがあなたの実績を分析して専門性を可視化。営業資料としても使いやすいサマリーを生成
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                            3
                          </span>
                          <span>
                            作品ページには執筆背景メモや成果を添付でき、企業担当者にスムーズに伝えられます
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col items-stretch gap-3 rounded-2xl bg-white/10 p-6 backdrop-blur">
                      <p className="text-sm font-medium text-blue-50">
                        3分で無料登録。あとから作品を追加してもOKです。
                      </p>
                      <Button
                        onClick={() => router.push("/register")}
                        className="rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-md transition-transform hover:-translate-y-0.5 hover:bg-blue-50"
                      >
                        無料で専門性スコアを見る
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        onClick={() => router.push("/auth")}
                      >
                        ログインはこちら
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* エラー表示 */}
            {error && (
              <div className="bg-red-50 border-b border-red-200 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* フィードアイテム - グリッドレイアウト */}
            {filteredItems.length > 0 ? (
              <div className="bg-[#F4F7FF] min-h-screen">
                {/* セクションタイトル - 改善版 */}
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 pt-8 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      最近追加されたコンテンツ
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    新着のポートフォリオ作品をチェックしよう
                  </p>
                </div>

                {/* グリッドコンテナ */}
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 auto-rows-max max-w-[1920px] mx-auto">
                  {filteredItems.map((item) => (
                    <WorkCard
                      key={`${item.id}-${item.type}`}
                      work={item}
                      currentUser={currentUser}
                      isAuthenticated={isAuthenticated}
                      onLike={handleLike}
                      onShare={handleShare}
                      onOpenComments={openCommentModal}
                    />
                  ))}
                </div>

                {/* 無限スクロール用のセンチネル要素 */}
                {hasMore && (
                  <div ref={sentinelRef} className="py-12 px-4">
                    {loadingMore && (
                      <div className="flex flex-col items-center justify-center space-y-3 fade-in">
                        <div className="relative">
                          <div className="loading-spin rounded-full h-10 w-10 border-3 border-blue-100 border-t-blue-600"></div>
                          <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border-2 border-blue-200 opacity-20"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          さらに読み込み中...
                        </span>
                      </div>
                    )}
                  </div>
                )}



                {/* フィード下部フッター */}
                <footer className="bg-white border-t border-gray-200 mt-8">
                  <div className="container mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                      <a
                        href="https://corp.balubo.jp"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="運営会社：株式会社balubo（新しいタブで開く）"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900 flex items-center gap-1"
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
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        運営会社
                      </a>
                      <a
                        href="https://x.com/AiBalubo56518"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="balubo公式X（旧Twitter）アカウント（新しいタブで開く）"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900 flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X (Twitter)
                      </a>
                      <Link
                        href="/terms"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        利用規約
                      </Link>
                      <Link
                        href="/privacy"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        プライバシーポリシー
                      </Link>
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                      <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; 2025 balubo. All rights reserved.
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            ) : (
              <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-lg max-w-md mx-4">
                  <EmptyState
                    title={
                      error
                        ? "データの取得に失敗しました"
                        : "作品がまだありません"
                    }
                    message={
                      error
                        ? "サーバーに接続できませんでした。しばらくしてから再度お試しください。"
                        : !isAuthenticated
                          ? "ログインすると、クリエイターのポートフォリオを閲覧できます。"
                          : "クリエイターの作品が投稿されるとここに表示されます。"
                    }
                    ctaLabel={
                      error
                        ? "再読み込み"
                        : !isAuthenticated
                          ? "ログイン"
                          : "作品を投稿"
                    }
                    onCtaClick={
                      error
                        ? () => window.location.reload()
                        : !isAuthenticated
                          ? () => router.push("/auth")
                          : () => router.push("/works/new")
                    }
                  >
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6">
                      <span className="text-3xl">
                        {error ? "⚠️" : "🎨"}
                      </span>
                    </div>
                  </EmptyState>
                </div>
              </div>
            )}
          </div>

          {/* 右サイドバー - 小さく調整 */}
          <div className="hidden 2xl:block w-72 flex-shrink-0 p-4">
            <div className="sticky top-[97px] space-y-4">
              <RecommendedUsers
                currentUserId={currentUser?.id}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      // 自分の投稿の場合は自分のプロフィールページに遷移
                      if (
                        currentUser &&
                        selectedItem.user.id === currentUser.id
                      ) {
                        router.push("/profile");
                      } else {
                        router.push(`/share/profile/${selectedItem.user.id}`);
                      }
                    }}
                  >
                    {selectedItem.user.avatar_image_url ? (
                      <Image
                        src={selectedItem.user.avatar_image_url as string}
                        alt={selectedItem.user.display_name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover hover:ring-2 hover:ring-blue-300 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition-all duration-200">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      onClick={() => {
                        // 自分の投稿の場合は自分のプロフィールページに遷移
                        if (
                          currentUser &&
                          selectedItem.user.id === currentUser.id
                        ) {
                          router.push("/profile");
                        } else {
                          router.push(`/share/profile/${selectedItem.user.id}`);
                        }
                      }}
                    >
                      {selectedItem.user.display_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTimeAgo(selectedItem.created_at)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
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
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedItem.title}
              </h2>

              {selectedItem.description && (
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  {selectedItem.description}
                </p>
              )}

              {selectedItem.banner_image_url && (
                <Image
                  src={selectedItem.banner_image_url}
                  alt={selectedItem.title}
                  width={1000}
                  height={320}
                  className="w-full h-80 object-cover rounded-xl mb-6 shadow-lg"
                />
              )}

              {/* アクションボタン */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="コメントする"
                    className="text-gray-500 hover:text-blue-500 hover:bg-blue-50 group"
                    onClick={() => openCommentModal(selectedItem.id)}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z"
                      />
                    </svg>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="いいね"
                    className={`transition-colors group ${selectedItem.user_has_liked
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                      }`}
                    onClick={() =>
                      handleLike(selectedItem.id, selectedItem.type)
                    }
                  >
                    <svg
                      className={`h-5 w-5 ${selectedItem.user_has_liked ? "fill-current" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="シェア"
                    className="text-gray-500 hover:text-green-500 hover:bg-green-50 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(selectedItem);
                    }}
                  >
                    <Share className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={isAuthenticated ? "プロフィールを見る" : "ログイン"}
                    className={`px-6 py-3 font-semibold rounded-full transition-all duration-200 ${isAuthenticated
                      ? "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"
                      : "bg-gray-900 text-white hover:bg-gray-800 border border-gray-900 shadow-md shadow-gray-900/20 hover:shadow-lg hover:shadow-gray-900/30"
                      }`}
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/auth");
                        return;
                      }
                      router.push(`/share/profile/${selectedItem.user.id}`);
                    }}
                  >
                    {isAuthenticated ? "プロフィールを見る" : "ログイン"}
                  </Button>
                  {selectedItem.external_url && (
                    <a
                      href={selectedItem.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 shadow-md shadow-gray-900/20 hover:shadow-lg hover:shadow-gray-900/30"
                    >
                      <ExternalLink className="h-5 w-5" />
                      外部リンク
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* コメントモーダル */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  コメント
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="閉じる"
                  className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  onClick={closeCommentModal}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            {/* コメント一覧 */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {loadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
                  <span className="ml-2 text-gray-600">読み込み中...</span>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {comment.user?.avatar_image_url ? (
                          <Image
                            src={comment.user.avatar_image_url as string}
                            alt={comment.user.display_name || "User"}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {(comment.user?.display_name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.user?.display_name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(comment.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="まだコメントがありません"
                  message="最初のコメントを投稿してみましょう"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.93-6.94c-.042-.3-.07-.611-.07-.94v-.12A8.001 8.001 0 0112 4c4.418 0 8 3.582 8 8z"
                      />
                    </svg>
                  </div>
                </EmptyState>
              )}
            </div>

            {/* コメント投稿フォーム */}
            {isAuthenticated ? (
              <div className="p-4 border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (showCommentModal) {
                      handleSubmitComment(showCommentModal);
                    }
                  }}
                  className="space-y-3"
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="コメントを入力..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    disabled={isSubmittingComment}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label="キャンセル"
                      onClick={closeCommentModal}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      aria-label="投稿"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? "投稿中..." : "投稿"}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-4 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm mb-3">
                  コメントを投稿するにはログインが必要です
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="ログイン"
                  onClick={() => {
                    closeCommentModal();
                    router.push("/auth");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  ログイン
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FeedPage() {
  return (
    <AuthenticatedLayout>
      <FeedPageContent />
    </AuthenticatedLayout>
  );
}
