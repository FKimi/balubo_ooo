"use client";

import { useEffect, useRef } from "react";
import {
  X,
  CheckCheck,
  User,
  Heart,
  MessageSquare,
  Users,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_entity_id?: string;
  related_entity_type?: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (_notificationIds: string[]) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  isLoading,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 通知タイプに応じたアイコンを取得
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "connection_request":
      case "connection_approved":
      case "connection_declined":
        return <Users className="w-4 h-4" />;
      case "new_like":
        return <Heart className="w-4 h-4" />;
      case "new_comment":
        return <MessageSquare className="w-4 h-4" />;
      case "new_review":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // 通知タイプに応じた色を取得
  const getNotificationColor = (type: string) => {
    switch (type) {
      case "connection_request":
        return "text-blue-600 bg-blue-50";
      case "connection_approved":
        return "text-green-600 bg-green-50";
      case "connection_declined":
        return "text-red-600 bg-red-50";
      case "new_like":
        return "text-red-600 bg-red-50";
      case "new_comment":
        return "text-blue-600 bg-blue-50";
      case "new_review":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // 通知をクリックした時の処理
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      onMarkAsRead([notification.id]);
    }

    // 関連エンティティに応じた遷移
    if (
      notification.related_entity_type === "user" &&
      notification.related_entity_id
    ) {
      // ユーザープロフィールページに遷移
      window.open(`/share/profile/${notification.related_entity_id}`, "_blank");
    } else if (
      notification.related_entity_type === "work" &&
      notification.related_entity_id
    ) {
      // 作品詳細ページに遷移
      window.open(`/works/${notification.related_entity_id}`, "_blank");
    }

    onClose();
  };

  // 日時をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "今";
    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`;
    return `${Math.floor(diffInMinutes / 1440)}日前`;
  };

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in-25"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          通知
        </h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              すべて既読
            </Button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* 通知一覧 */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-slate-500">読み込み中...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">通知はありません</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                  !notification.is_read
                    ? "bg-blue-50/50 dark:bg-blue-900/20"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* アイコン */}
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg ${getNotificationColor(notification.type)}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>

                  {/* 既読状態 */}
                  <div className="flex-shrink-0">
                    {notification.is_read ? (
                      <CheckCheck className="w-4 h-4 text-slate-400" />
                    ) : (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* フッター */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <Link
            href="/notifications"
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            onClick={onClose}
          >
            すべての通知を見る
          </Link>
        </div>
      )}
    </div>
  );
}
