"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { fetcher } from "@/utils/fetcher";
import { NotificationDropdown } from "./NotificationDropdown";
import { supabase } from "@/lib/supabase";

interface NotificationData {
  notifications: Array<{
    id: string;
    type: string;
    message: string;
    is_read: boolean;
    created_at: string;
    related_entity_id?: string;
    related_entity_type?: string;
  }>;
  unreadCount: number;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    NotificationData["notifications"]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const channelRef = useRef<any>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isSubscribedRef = useRef<boolean>(false);

  // 通知データを取得（リトライ機能付き）
  const fetchNotifications = useCallback(
    async (retryCount = 0) => {
      if (!user) return;

      // 前回の取得から30秒経過していない場合はスキップ
      const now = Date.now();
      if (now - lastFetchTimeRef.current < 30000) {
        return;
      }

      try {
        setIsLoading(true);
        lastFetchTimeRef.current = now;

        // 認証トークンを取得
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const authToken = session?.access_token;

        if (!authToken) {
          console.log("通知取得: 認証トークンがありません");
          setNotifications([]);
          setUnreadCount(0);
          return;
        }

        const data: NotificationData = await fetcher(
          "/api/notifications?limit=10",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("通知取得エラー:", error);

        // エラー時は空の配列を設定
        setNotifications([]);
        setUnreadCount(0);

        // 3回まで再試行
        if (retryCount < 3) {
          setTimeout(
            () => {
              fetchNotifications(retryCount + 1);
            },
            5000 * (retryCount + 1),
          ); // 5秒、10秒、15秒後に再試行
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  // 通知を既読にマーク
  const markAsRead = async (notificationIds: string[]) => {
    if (!user) return;

    try {
      // 認証トークンを取得
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        console.log("既読マーク: 認証トークンがありません");
        return;
      }

      await fetcher("/api/notifications", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ notificationIds }),
      });

      // ローカル状態を更新
      setNotifications((prev) =>
        prev.map((notification) =>
          notificationIds.includes(notification.id)
            ? { ...notification, is_read: true }
            : notification,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error("既読マークエラー:", error);
    }
  };

  // すべての通知を既読にマーク
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // 認証トークンを取得
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        console.log("全既読マーク: 認証トークンがありません");
        return;
      }

      await fetcher("/api/notifications", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      // ローカル状態を更新
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("全既読マークエラー:", error);
    }
  };

  // チャンネルのクリーンアップ
  const cleanupChannel = useCallback(async () => {
    if (channelRef.current) {
      try {
        await supabase.removeChannel(channelRef.current);
        console.log("✅ チャンネルを削除しました");
      } catch (error) {
        console.error("❌ チャンネル削除でエラー:", error);
      }
      channelRef.current = null;
    }

    isSubscribedRef.current = false;
  }, []);

  // ポーリング設定（リアルタイム通知のフォールバック）
  const setupPolling = useCallback(() => {
    console.log("🔄 ポーリングモードに切り替えます");

    // 既存のインターバルがあればクリア
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // 5分ごとにポーリング（頻度を大幅に下げる）
    const interval = setInterval(
      () => {
        console.log("📡 ポーリングで通知を取得中...");
        fetchNotifications();
      },
      5 * 60 * 1000,
    ); // 5分間隔

    pollingIntervalRef.current = interval;

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // リアルタイム通知の購読
  const subscribeToNotifications = useCallback(async () => {
    if (!user?.id || isSubscribedRef.current) return;

    try {
      // チャンネル名を固定（ユーザーごとに1つ）
      const channelName = `user-notifications-${user.id}`;

      // 既に同じ名前のチャンネルが存在する場合は、それを再利用するか、一度削除する
      // ここでは安全のため一度削除して再作成する戦略をとる
      const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
      if (existingChannel) {
        console.log("既存のチャンネルを削除します:", channelName);
        await supabase.removeChannel(existingChannel);
      }

      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("リアルタイム通知イベント受信:", payload);

            if (payload.eventType === "INSERT") {
              console.log("新しい通知を受信:", payload);
              const newNotification =
                payload.new as NotificationData["notifications"][0];
              setNotifications((prev) => [newNotification, ...prev]);
              setUnreadCount((prev) => prev + 1);
            } else if (payload.eventType === "UPDATE") {
              console.log("通知更新を受信:", payload);
              const updatedNotification =
                payload.new as NotificationData["notifications"][0];
              setNotifications((prev) =>
                prev.map((notification) =>
                  notification.id === updatedNotification.id
                    ? updatedNotification
                    : notification,
                ),
              );

              // 既読になった場合は未読数を減らす
              if (updatedNotification.is_read && !payload.old?.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
              }
            }
          },
        );

      // 購読を開始
      const _subscription = channel.subscribe((status, error) => {
        console.log("リアルタイム購読ステータス:", status);

        if (status === "SUBSCRIBED") {
          console.log("✅ 通知のリアルタイム購読が開始されました");
          isSubscribedRef.current = true;
        } else if (status === "CHANNEL_ERROR") {
          console.error(
            "❌ リアルタイム通知でエラーが発生しました。SupabaseのRealtime設定やRLSポリシーを確認してください。",
            error,
          );
          isSubscribedRef.current = false;
          // フォールバック: ポーリングに切り替え
          setupPolling();
        } else if (status === "TIMED_OUT") {
          console.warn("⚠️ リアルタイム接続がタイムアウトしました");
          isSubscribedRef.current = false;
          // 再接続を試行（30秒後に再試行）
          setTimeout(() => {
            cleanupChannel();
            subscribeToNotifications();
          }, 30000);
        } else if (status === "CLOSED") {
          console.warn("⚠️ リアルタイム接続が閉じられました");
          isSubscribedRef.current = false;
          // 自動的にポーリングに切り替え
          setupPolling();
        }
      });

      // チャンネルオブジェクトを保存
      channelRef.current = channel;
    } catch (error) {
      console.error("リアルタイム購読の設定中にエラーが発生:", error);
      isSubscribedRef.current = false;
      // エラーが発生した場合は即座にポーリングに切り替え
      setupPolling();
    }
  }, [user?.id, setupPolling, cleanupChannel]);

  // 初回読み込みとリアルタイム通知の設定
  useEffect(() => {
    // ユーザーがログアウトしている場合は何もしない
    if (!user?.id) {
      console.log("👻 ユーザーがログアウトしています");
      cleanupChannel();
      return;
    }

    console.log("👤 ユーザーがログインしています。通知システムを初期化...");

    // 初回の通知取得
    fetchNotifications();

    // リアルタイム購読を試行
    subscribeToNotifications();

    // クリーンアップ関数を必ず返す
    return () => {
      console.log("🧹 通知システムをクリーンアップ中...");
      cleanupChannel();

      // タイマーやインターバルのクリア
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        console.log("✅ ポーリングインターバルをクリアしました");
      }
    };
  }, [
    user?.id,
    fetchNotifications,
    subscribeToNotifications,
    setupPolling,
    cleanupChannel,
  ]);

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        disabled={isLoading}
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClose={() => setIsOpen(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
