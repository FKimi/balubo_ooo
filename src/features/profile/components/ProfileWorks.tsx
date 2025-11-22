"use client";

import { Button } from "@/components/ui/button";
import { WorkData } from "@/features/work/types";
import { WorksCategoryManager } from "@/features/work/components/WorksCategoryManager";
import { EmptyState } from "@/components/common";
import { useWorkCategories } from "@/features/work/hooks/useWorkCategories";
import Image from "next/image";
import { Plus } from "lucide-react";

interface ProfileWorksProps {
    savedWorks: WorkData[];
    setSavedWorks: (works: WorkData[]) => void;
    deleteWork: (workId: string) => void;
    openContentTypeSelector: () => void;
}

export function ProfileWorks({
    savedWorks,
    setSavedWorks,
    deleteWork,
    openContentTypeSelector,
}: ProfileWorksProps) {
    const {
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        updateWorkCategory,
    } = useWorkCategories(savedWorks, setSavedWorks);

    if (savedWorks.length === 0) {
        return (
            <EmptyState
                title="まだ作品がありません"
                message="最初の作品を追加してポートフォリオを始めましょう"
                ctaLabel="最初の作品を追加"
                onCtaClick={openContentTypeSelector}
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* 注目作品セクション */}
            {savedWorks.filter((work) => work.is_featured).length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    注目の作品
                                </h3>
                                <p className="text-sm text-gray-600">
                                    代表的な作品をアピールできます
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                                    {savedWorks.filter((work) => work.is_featured).length}/3
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedWorks
                                .filter((work) => work.is_featured)
                                .sort(
                                    (a, b) => (a.featured_order || 0) - (b.featured_order || 0)
                                )
                                .map((work, index) => (
                                    <div key={work.id} className="relative group">
                                        {/* ランキングバッジ */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <div
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${index === 0
                                                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                                        : index === 1
                                                            ? "bg-gradient-to-r from-gray-400 to-gray-600"
                                                            : "bg-gradient-to-r from-amber-500 to-orange-600"
                                                    }`}
                                            >
                                                #{index + 1}
                                            </div>
                                        </div>

                                        {/* 作品カード */}
                                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 h-full">
                                            <a href={`/works/${work.id}`} className="block h-full">
                                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                                    {work.banner_image_url ? (
                                                        <Image
                                                            src={work.banner_image_url}
                                                            alt={work.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            loading="lazy"
                                                            quality={85}
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    ) : work.preview_data?.image ? (
                                                        <Image
                                                            src={work.preview_data.image}
                                                            alt={work.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            loading="lazy"
                                                            quality={85}
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                                            <svg
                                                                className="w-12 h-12 text-gray-400"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-semibold text-gray-900 text-base line-clamp-2 mb-2 leading-snug">
                                                        {work.title}
                                                    </h4>
                                                    {work.tags && work.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {work.tags.slice(0, 2).map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-medium"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {work.tags.length > 2 && (
                                                                <span className="text-xs px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-200">
                                                                    +{work.tags.length - 2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* すべての作品セクション */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                すべての作品
                            </h3>
                            <p className="text-sm text-gray-600">
                                合計{savedWorks.length}件
                            </p>
                        </div>
                        <Button
                            onClick={openContentTypeSelector}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm px-6 py-2 shadow-sm hover:shadow-md transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            作品を追加
                        </Button>
                    </div>
                </div>
                <div className="p-6">
                    <WorksCategoryManager
                        savedWorks={savedWorks}
                        categories={categories}
                        addCategory={addCategory}
                        updateCategory={updateCategory}
                        deleteCategory={deleteCategory}
                        deleteWork={deleteWork}
                        updateWorkCategory={updateWorkCategory}
                    />
                </div>
            </div>
        </div>
    );
}
