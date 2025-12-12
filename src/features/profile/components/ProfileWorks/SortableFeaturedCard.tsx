"use client";

import Image from "next/image";
import { X, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WorkData } from "@/features/work/types";

export interface SortableFeaturedCardProps {
    work: WorkData;
    index: number;
    onRemove: (_workId: string) => void;
    isUpdating: boolean;
}

/**
 * ドラッグ可能な代表作カードコンポーネント
 * 代表作編集モードで使用され、並び替えと削除が可能
 */
export function SortableFeaturedCard({
    work,
    index,
    onRemove,
    isUpdating,
}: SortableFeaturedCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: work.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 0,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            {/* ドラッグハンドル */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 z-20 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm hover:bg-gray-50 transition-colors"
            >
                <GripVertical className="w-4 h-4 text-gray-400" />
            </div>

            {/* 順位バッジ */}
            <div className="absolute top-2 right-12 z-20">
                <div
                    className={`
            w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
            shadow-md
            ${index === 0
                            ? "bg-gradient-to-br from-amber-400 to-orange-500"
                            : index === 1
                                ? "bg-gradient-to-br from-slate-400 to-zinc-500"
                                : "bg-gradient-to-br from-orange-400 to-amber-600"
                        }
          `}
                >
                    {index + 1}
                </div>
            </div>

            {/* 削除ボタン */}
            <button
                onClick={() => onRemove(work.id)}
                disabled={isUpdating}
                className="absolute top-2 right-2 z-20 w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <X className="w-4 h-4" />
            </button>

            {/* サムネイル */}
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                {work.banner_image_url ? (
                    <Image
                        src={work.banner_image_url}
                        alt={work.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={75}
                        sizes="280px"
                    />
                ) : work.preview_data?.image ? (
                    <Image
                        src={work.preview_data.image}
                        alt={work.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={75}
                        sizes="280px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* タイトル */}
            <div className="p-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {work.title}
                </p>
            </div>
        </div>
    );
}
