"use client";

import { Button } from "@/components/ui/button";
import { WorkData } from "@/features/work/types";
import { WorksCategoryManager } from "@/features/work/components/WorksCategoryManager";
import { EmptyState } from "@/components/common";
import { useWorkCategories } from "@/features/work/hooks/useWorkCategories";
import Image from "next/image";
import { Plus, Sparkles, Star, ChevronLeft, ChevronRight, Settings2, X, Check } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

// 分離したコンポーネントとフック
import { SortableFeaturedCard } from "./ProfileWorks/SortableFeaturedCard";
import { useFeaturedWorks } from "../hooks/useFeaturedWorks";

interface ProfileWorksProps {
    savedWorks: WorkData[];
    setSavedWorks: (_works: WorkData[]) => void;
    deleteWork: (_workId: string) => void;
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

    // 代表作管理のカスタムフック
    const {
        featuredWorks,
        nonFeaturedWorks,
        isEditingFeatured,
        isUpdating,
        setIsEditingFeatured,
        handleDragEnd,
        addToFeatured,
        removeFromFeatured,
        handleSaveFeatured,
    } = useFeaturedWorks({ savedWorks, setSavedWorks });

    // カルーセルのスクロール管理
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // スクロール状態をチェック
    const checkScrollState = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollState();
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', checkScrollState);
            window.addEventListener('resize', checkScrollState);
            return () => {
                carousel.removeEventListener('scroll', checkScrollState);
                window.removeEventListener('resize', checkScrollState);
            };
        }
        return undefined;
    }, [featuredWorks.length]);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = 340;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (savedWorks.length === 0) {
        return (
            <EmptyState
                title="まだ作品がありません"
                message="最初の作品を追加してポートフォリオを始めましょう"
                ctaLabel="最初の作品を追加"
                onCtaClick={openContentTypeSelector}
                icon={Plus}
            />
        );
    }

    return (
        <div className="space-y-10">
            {/* 注目作品セクション - プレミアムデザイン */}
            <section className="relative">
                {/* 背景グラデーション */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 rounded-[32px] -z-10" />

                <div className="bg-white/80 backdrop-blur-sm border border-gray-100/80 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden">
                    {/* ヘッダー */}
                    <div className="px-8 py-6 border-b border-gray-100/80">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* クレイモーフィズムアイコン */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200/50 to-orange-200/50 rounded-full blur-md" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(251,191,36,0.25)]">
                                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(251,191,36,0.4)]">
                                            <Sparkles className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        注目の作品
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        あなたの代表作をアピール
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* カルーセルコントロール */}
                                {!isEditingFeatured && featuredWorks.length > 2 && (
                                    <div className="hidden sm:flex items-center gap-2">
                                        <button
                                            onClick={() => scrollCarousel('left')}
                                            disabled={!canScrollLeft}
                                            className={`w-9 h-9 rounded-full border transition-all duration-200 flex items-center justify-center ${canScrollLeft
                                                ? 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 shadow-sm'
                                                : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                                }`}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => scrollCarousel('right')}
                                            disabled={!canScrollRight}
                                            className={`w-9 h-9 rounded-full border transition-all duration-200 flex items-center justify-center ${canScrollRight
                                                ? 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 shadow-sm'
                                                : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                                }`}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {/* カウンター */}
                                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full border border-amber-100/80">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm font-semibold text-amber-700">
                                        {featuredWorks.length}/3
                                    </span>
                                </div>
                                {/* 編集ボタン */}
                                {isEditingFeatured ? (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => setIsEditingFeatured(false)}
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full border-gray-200 hover:bg-gray-50"
                                            disabled={isUpdating}
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            キャンセル
                                        </Button>
                                        <Button
                                            onClick={handleSaveFeatured}
                                            size="sm"
                                            className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-[0_4px_14px_rgba(251,191,36,0.35)]"
                                            disabled={isUpdating}
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            {isUpdating ? "保存中..." : "保存"}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setIsEditingFeatured(true)}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full border-amber-200 bg-white hover:bg-amber-50 text-amber-700 hover:text-amber-800 shadow-sm"
                                    >
                                        <Settings2 className="w-4 h-4 mr-1.5" />
                                        編集
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* カルーセル / 編集モード */}
                    <div className="p-6 sm:p-8">
                        {isEditingFeatured ? (
                            /* 編集モードUI */
                            <div className="space-y-6">
                                {/* 現在の代表作 */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700">現在の代表作</h4>
                                        <span className="text-xs text-gray-500">（ドラッグで順番を変更）</span>
                                    </div>
                                    <DndContext
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={featuredWorks.map((w) => w.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {featuredWorks.map((work, index) => (
                                                    <SortableFeaturedCard
                                                        key={work.id}
                                                        work={work}
                                                        index={index}
                                                        onRemove={removeFromFeatured}
                                                        isUpdating={isUpdating}
                                                    />
                                                ))}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                </div>

                                {/* 代表作候補 */}
                                {featuredWorks.length < 3 && nonFeaturedWorks.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700">作品を追加</h4>
                                            <span className="text-xs text-gray-500">（クリックで追加、あと{3 - featuredWorks.length}つ選択可能）</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {nonFeaturedWorks.map((work) => (
                                                <button
                                                    key={work.id}
                                                    onClick={() => addToFeatured(work.id)}
                                                    disabled={isUpdating}
                                                    className="group relative bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-400 overflow-hidden transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                                >
                                                    <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                                        {work.banner_image_url ? (
                                                            <Image
                                                                src={work.banner_image_url}
                                                                alt={work.title}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                loading="lazy"
                                                                quality={75}
                                                                sizes="200px"
                                                            />
                                                        ) : work.preview_data?.image ? (
                                                            <Image
                                                                src={work.preview_data.image}
                                                                alt={work.title}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                loading="lazy"
                                                                quality={75}
                                                                sizes="200px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* ホバー時のオーバーレイ */}
                                                        <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-200 flex items-center justify-center">
                                                            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                                                                <Plus className="w-5 h-5" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                                                            {work.title}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 追加する作品がない場合 */}
                                {featuredWorks.length < 3 && nonFeaturedWorks.length === 0 && (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-500 text-sm">
                                            追加できる作品がありません。<br />
                                            まず作品を追加してください。
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* 通常表示（カルーセル） */
                            <div
                                ref={carouselRef}
                                className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {featuredWorks.map((work, index) => (
                                    <div
                                        key={work.id}
                                        className="flex-shrink-0 w-[320px] group"
                                    >
                                        {/* 作品カード */}
                                        <div className="relative bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
                                            {/* ランキングバッジ */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <div
                                                    className={`
                                                            w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white
                                                            shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                                                            ${index === 0
                                                            ? "bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400"
                                                            : index === 1
                                                                ? "bg-gradient-to-br from-slate-400 via-gray-400 to-zinc-400"
                                                                : "bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600"
                                                        }
                                                        `}
                                                >
                                                    {index + 1}
                                                </div>
                                            </div>

                                            {/* サムネイル */}
                                            <a href={`/works/${work.id}`} className="block">
                                                <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                                    {work.banner_image_url ? (
                                                        <Image
                                                            src={work.banner_image_url}
                                                            alt={work.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                            loading="lazy"
                                                            quality={85}
                                                            sizes="320px"
                                                        />
                                                    ) : work.preview_data?.image ? (
                                                        <Image
                                                            src={work.preview_data.image}
                                                            alt={work.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                            loading="lazy"
                                                            quality={85}
                                                            sizes="320px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                                <svg
                                                                    className="w-8 h-8 text-gray-400"
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
                                                    {/* オーバーレイグラデーション */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>

                                                {/* コンテンツ */}
                                                <div className="p-5">
                                                    <h4 className="font-semibold text-gray-900 text-base line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                                                        {work.title}
                                                    </h4>
                                                    {work.tags && work.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {work.tags.slice(0, 2).map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full border border-blue-100/80 font-medium"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {work.tags.length > 2 && (
                                                                <span className="text-xs px-3 py-1.5 bg-gray-50 text-gray-500 rounded-full border border-gray-100">
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
                                {/* 代表作が0件の場合の空状態 */}
                                {featuredWorks.length === 0 && (
                                    <button
                                        onClick={() => setIsEditingFeatured(true)}
                                        className="flex-shrink-0 w-full max-w-xl mx-auto group"
                                    >
                                        <div className="flex flex-col items-center justify-center py-12 px-8 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-2xl border-2 border-dashed border-amber-200 hover:border-amber-400 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300 cursor-pointer">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                                                <Sparkles className="w-8 h-8 text-amber-500" />
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-800 mb-2">
                                                代表作を設定しましょう
                                            </h4>
                                            <p className="text-sm text-gray-600 text-center mb-4 max-w-sm">
                                                最大3つまでの作品を代表作として設定できます。<br />
                                                訪問者が最初に目にする重要な作品です。
                                            </p>
                                            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg group-hover:shadow-xl group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300">
                                                <Plus className="w-4 h-4" />
                                                <span className="font-medium">代表作を選択する</span>
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* すべての作品セクション - モダンデザイン */}
            <section className="bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden">
                {/* ヘッダー */}
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            {/* クレイモーフィズムアイコン */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-indigo-200/50 rounded-full blur-md" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(59,130,246,0.2)]">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(59,130,246,0.35)]">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    すべての作品
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    合計 <span className="font-semibold text-blue-600">{savedWorks.length}</span> 件のポートフォリオ
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={openContentTypeSelector}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full text-sm px-6 py-2.5 shadow-[0_4px_14px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            作品を追加
                        </Button>
                    </div>
                </div>

                {/* カテゴリマネージャー */}
                <div className="p-6 sm:p-8">
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
            </section>
        </div>
    );
}
