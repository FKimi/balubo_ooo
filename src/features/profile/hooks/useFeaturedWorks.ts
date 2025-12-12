"use client";

import { useState, useCallback } from "react";
import { WorkData } from "@/features/work/types";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

interface UseFeaturedWorksOptions {
    savedWorks: WorkData[];
    setSavedWorks: (works: WorkData[]) => void;
}

interface UseFeaturedWorksReturn {
    featuredWorks: WorkData[];
    nonFeaturedWorks: WorkData[];
    isEditingFeatured: boolean;
    isUpdating: boolean;
    setIsEditingFeatured: (value: boolean) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    addToFeatured: (workId: string) => Promise<void>;
    removeFromFeatured: (workId: string) => Promise<void>;
    handleSaveFeatured: () => Promise<void>;
}

/**
 * 代表作（Featured Works）の管理を行うカスタムフック
 * - 代表作の追加・削除
 * - ドラッグ&ドロップによる並び替え
 * - データベースへの保存
 */
export function useFeaturedWorks({
    savedWorks,
    setSavedWorks,
}: UseFeaturedWorksOptions): UseFeaturedWorksReturn {
    const [isEditingFeatured, setIsEditingFeatured] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // 代表作と非代表作の分類
    const featuredWorks = savedWorks
        .filter((work) => work.is_featured)
        .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));

    const nonFeaturedWorks = savedWorks.filter((work) => !work.is_featured);

    // データベースに代表作情報を保存
    const updateFeaturedWorksInDatabase = useCallback(async (works: WorkData[]) => {
        const { supabase } = await import("@/lib/supabase");
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) return;

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
        };

        // 代表作の情報のみを更新
        const featuredUpdates = works
            .filter((work) => work.is_featured !== undefined)
            .map((work) => ({
                id: work.id,
                is_featured: work.is_featured,
                featured_order: work.featured_order,
            }));

        for (const update of featuredUpdates) {
            await fetch(`/api/works/${update.id}/featured`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    is_featured: update.is_featured,
                    featured_order: update.featured_order,
                }),
            });
        }
    }, []);

    // ドラッグ&ドロップハンドラー
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = featuredWorks.findIndex((work) => work.id === active.id);
        const newIndex = featuredWorks.findIndex((work) => work.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedFeatured = arrayMove(featuredWorks, oldIndex, newIndex);

            // featured_orderを更新
            const updatedFeatured = reorderedFeatured.map((work, index) => ({
                ...work,
                featured_order: index + 1,
            }));

            // 全作品リストを更新
            const updatedWorks = savedWorks.map((work) => {
                const featured = updatedFeatured.find((f) => f.id === work.id);
                return featured || work;
            });

            setSavedWorks(updatedWorks);
        }
    };

    // 代表作に追加
    const addToFeatured = async (workId: string) => {
        if (featuredWorks.length >= 3) {
            alert("代表作は最大3つまで設定できます");
            return;
        }

        setIsUpdating(true);
        try {
            const updatedWorks = savedWorks.map((work) =>
                work.id === workId
                    ? {
                        ...work,
                        is_featured: true,
                        featured_order: featuredWorks.length + 1,
                    }
                    : work,
            );

            setSavedWorks(updatedWorks);
            await updateFeaturedWorksInDatabase(updatedWorks);
        } catch (error) {
            console.error("代表作追加エラー:", error);
            alert("代表作の設定に失敗しました");
        } finally {
            setIsUpdating(false);
        }
    };

    // 代表作から削除
    const removeFromFeatured = async (workId: string) => {
        setIsUpdating(true);
        try {
            const updatedWorks = savedWorks.map((work) => {
                if (work.id === workId) {
                    // eslint-disable-next-line unused-imports/no-unused-vars
                    const { featured_order: _, ...workWithoutOrder } = work;
                    return {
                        ...workWithoutOrder,
                        is_featured: false,
                    };
                }
                return work;
            });

            setSavedWorks(updatedWorks);
            await updateFeaturedWorksInDatabase(updatedWorks);
        } catch (error) {
            console.error("代表作削除エラー:", error);
            alert("代表作の解除に失敗しました");
        } finally {
            setIsUpdating(false);
        }
    };

    // 編集モードの保存
    const handleSaveFeatured = async () => {
        setIsUpdating(true);
        try {
            await updateFeaturedWorksInDatabase(savedWorks);
            setIsEditingFeatured(false);
        } catch (error) {
            console.error("保存エラー:", error);
            alert("保存に失敗しました");
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        featuredWorks,
        nonFeaturedWorks,
        isEditingFeatured,
        isUpdating,
        setIsEditingFeatured,
        handleDragEnd,
        addToFeatured,
        removeFromFeatured,
        handleSaveFeatured,
    };
}
