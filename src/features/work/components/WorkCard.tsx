import Link from "next/link";
import Image from "next/image";
import type { WorkData } from "@/features/work/types";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, MessageCircle, Calendar } from "lucide-react";

interface WorkCardProps {
  work: WorkData;
  onDelete: (_workId: string) => void;
  isDraggable?: boolean;
  isFeatured?: boolean;
}

export function WorkCard({ work, isFeatured = false }: WorkCardProps) {
  // production_date をフォーマット (例: 2024年3月)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Invalid Dateの場合を考慮
      if (isNaN(date.getTime())) return "";
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    } catch (e) {
      return "";
    }
  };

  const formattedDate = formatDate(work.production_date);

  // いいね・コメント数を安全に取得
  const likesCount = work.likes_count ?? work.likes?.[0]?.count ?? 0;
  const commentsCount = work.comments_count ?? work.comments?.[0]?.count ?? 0;

  return (
    <div
      className={`group relative h-full ${
        isFeatured
          ? "transform group-hover:scale-105 transition-transform duration-300"
          : ""
      }`}
    >
      <Link
        href={`/works/${work.id}`}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a8a]/30 rounded-xl"
      >
        <Card
          className={`h-full overflow-hidden transition-all duration-300 ease-in-out rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5`}
        >
          <CardContent className="p-0 flex flex-col h-full">
            {/* 画像セクション */}
            <div className="relative w-full aspect-video overflow-hidden">
              {work.banner_image_url || work.preview_data?.image ? (
                <Image
                  src={work.banner_image_url || work.preview_data!.image}
                  alt={work.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400">
                    <svg
                      className="w-8 h-8 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* コンテンツセクション */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-gray-800">
                {work.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                {work.description}
              </p>

              {/* タグ */}
              {work.tags && work.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#1e3a8a]/10 text-[#1e3a8a] rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 統計と日付 */}
              <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {work.view_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={12} />
                    {likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    {commentsCount}
                  </span>
                </div>
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
