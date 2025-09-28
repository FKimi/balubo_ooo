"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Users, UserCheck } from "lucide-react";
import { fetcher } from "@/utils/fetcher";
import Link from "next/link";

interface User {
  id: string;
  display_name: string;
  bio: string;
  avatar_image_url: string;
  professions: string[];
}

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialTab: "followers" | "following";
}

export function FollowModal({
  isOpen,
  onClose,
  userId,
  initialTab,
}: FollowModalProps) {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    initialTab,
  );
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [followersData, followingData] = await Promise.all([
        fetcher<User[]>(`/api/connections/followers?userId=${userId}`),
        fetcher<User[]>(`/api/connections/following?userId=${userId}`),
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
    } catch (error) {
      console.error("フォローデータ取得エラー:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      fetchData();
    }
  }, [isOpen, initialTab, fetchData]);

  if (!isOpen) return null;

  const currentList = activeTab === "followers" ? followers : following;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab === "followers" ? "フォロワー" : "フォロー中"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "followers"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              <span>フォロワー ({followers.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "following"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>フォロー中 ({following.length})</span>
            </div>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : currentList.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-4xl mb-4">
                {activeTab === "followers" ? "👥" : "👤"}
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {activeTab === "followers"
                  ? "フォロワーがいません"
                  : "フォローしていません"}
              </h3>
              <p className="text-gray-500 text-sm">
                {activeTab === "followers"
                  ? "まだフォロワーがいません"
                  : "まだ誰もフォローしていません"}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {currentList.map((user) => (
                <Link
                  key={user.id}
                  href={`/share/profile/${user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* アバター */}
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {user.avatar_image_url ? (
                      <Image
                        src={user.avatar_image_url}
                        alt={user.display_name}
                        fill
                        sizes="48px"
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {user.display_name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>

                  {/* ユーザー情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {user.display_name || "ユーザー"}
                    </div>
                    {user.professions && user.professions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.professions
                          .slice(0, 2)
                          .map((profession, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {profession}
                            </span>
                          ))}
                        {user.professions.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{user.professions.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    {user.bio && (
                      <p
                        className="text-sm text-gray-600 mt-1 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {user.bio}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
