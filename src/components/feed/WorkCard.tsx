"use client";

import { useState, useMemo, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Share,
  ExternalLink,
  User,
  Heart,
  MessageCircle,
  Eye,
} from "lucide-react";
import { takeFirst } from "@/utils/arrayUtils";

interface WorkCardProps {
  work: {
    id: string;
    type: "work";
    title: string;
    description?: string;
    external_url?: string;
    tags?: string[];
    roles?: string[];
    banner_image_url?: string;
    created_at: string;
    user: {
      id: string;
      display_name: string;
      avatar_image_url?: string;
    };
    likes_count?: number;
    comments_count?: number;
    user_has_liked?: boolean;
  };
  currentUser?: any;
  isAuthenticated: boolean;
  onLike: (_workId: string, _workType: "work") => void;
  onShare: (_work: any) => void;
  onOpenComments: (_workId: string) => void;
}

export const WorkCard = memo(function WorkCard({
  work: _work,
  currentUser,
  isAuthenticated: _isAuthenticated,
  onLike,
  onShare,
  onOpenComments,
}: WorkCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentUser && _work.user.id === currentUser.id) {
      router.push("/profile");
    } else {
      router.push(`/share/profile/${_work.user.id}`);
    }
  };

  const handleWorkClick = () => {
    router.push(`/works/${_work.id}`);
  };

  // formatTimeAgoをメモ化して再計算を防ぐ
  const timeAgo = useMemo(() => {
    const date = new Date(_work.created_at);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "今";
    if (diffInHours < 24) return `${diffInHours}時間前`;
    if (diffInDays < 7) return `${diffInDays}日前`;
    return date.toLocaleDateString("ja-JP");
  }, [_work.created_at]);

  return (
    <div
      className="group bg-white rounded-[24px] overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border-none"
      onClick={handleWorkClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleWorkClick();
        }
      }}
      aria-label={`${_work.title} の詳細を開く`}
    >
      {/* 作品画像 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {_work.banner_image_url && !imageError ? (
          <>
            <Image
              src={_work.banner_image_url}
              alt={_work.title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 mx-auto shadow-sm">
                <span className="text-2xl">🎨</span>
              </div>
              <p className="text-sm font-medium">{_work.title}</p>
            </div>
          </div>
        )}

        {/* ホバー時のオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-white/95 hover:bg-white rounded-full shadow-lg backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(_work);
                }}
              >
                <Share className="h-4 w-4 text-gray-700" />
              </Button>
              {_work.external_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-white/95 hover:bg-white rounded-full shadow-lg backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(_work.external_url, "_blank");
                  }}
                >
                  <ExternalLink className="h-4 w-4 text-gray-700" />
                </Button>
              )}
            </div>
          </div>

          {/* 画像中央のビュー詳細ボタン */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="ghost"
              className="bg-white/95 hover:bg-white rounded-full px-6 py-2.5 shadow-xl backdrop-blur-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
              onClick={handleWorkClick}
            >
              <Eye className="h-4 w-4 mr-2" />
              詳細を見る
            </Button>
          </div>
        </div>

        {/* タグ表示（左下） */}
        {_work.tags && _work.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-wrap gap-1.5">
              {takeFirst(_work.tags, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium shadow-lg"
                >
                  #{tag}
                </span>
              ))}
              {_work.tags.length > 2 && (
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium shadow-lg">
                  +{_work.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* カード下部の情報 */}
      <div className="p-5 space-y-3">
        {/* 作品タイトル */}
        <h3
          className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleWorkClick}
        >
          {_work.title}
        </h3>

        {/* 作品の説明 */}
        {_work.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {_work.description}
          </p>
        )}

        {/* 役割 */}
        {_work.roles && _work.roles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {takeFirst(_work.roles, 3).map((role, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-100"
              >
                {role}
              </span>
            ))}
          </div>
        )}

        {/* ユーザー情報と統計 */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {/* ユーザー情報 */}
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity flex-1 min-w-0"
            onClick={handleUserClick}
          >
            {_work.user.avatar_image_url ? (
              <Image
                src={_work.user.avatar_image_url}
                alt={_work.user.display_name}
                width={36}
                height={36}
                className="rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-100">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {_work.user.display_name}
              </p>
              <p className="text-xs text-gray-500">
                {timeAgo}
              </p>
            </div>
          </div>

          {/* アクション統計 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 transition-colors ${_work.user_has_liked
                ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                onLike(_work.id, _work.type);
              }}
            >
              <Heart
                className={`h-4 w-4 ${_work.user_has_liked ? "fill-current" : ""}`}
              />
              <span className="ml-1 text-xs font-medium">
                {_work.likes_count || 0}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onOpenComments(_work.id);
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="ml-1 text-xs font-medium">
                {_work.comments_count || 0}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // カスタム比較関数：必要なプロパティのみを比較
  return (
    prevProps.work.id === nextProps.work.id &&
    prevProps.work.likes_count === nextProps.work.likes_count &&
    prevProps.work.comments_count === nextProps.work.comments_count &&
    prevProps.work.user_has_liked === nextProps.work.user_has_liked &&
    prevProps.currentUser?.id === nextProps.currentUser?.id &&
    prevProps.isAuthenticated === nextProps.isAuthenticated
  );
});
