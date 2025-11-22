import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkCard } from "./WorkCard";
import { WorkData } from "@/features/work/types";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
// @ts-ignore
import { SortableWorkCard } from "./SortableWorkCard";

interface FeaturedWorksSectionProps {
  savedWorks: WorkData[];
  setSavedWorks: (_works: WorkData[]) => void;
  deleteWork: (_workId: string) => void;
}

export function FeaturedWorksSection({
  savedWorks,
  setSavedWorks,
  deleteWork,
}: FeaturedWorksSectionProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 代表作を取得（featured_orderでソート）
  const featuredWorks = savedWorks
    .filter((work) => work.is_featured)
    .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));

  // 代表作以外の作品を取得
  const nonFeaturedWorks = savedWorks.filter((work) => !work.is_featured);

  // 代表作の順序を更新
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
        _featured_order: index + 1,
      }));

      // 全作品リストを更新
      const updatedWorks = [...updatedFeatured, ...nonFeaturedWorks];

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
          // featured_order プロパティを削除し、is_featured を false に設定
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

  // データベースに代表作情報を保存
  const updateFeaturedWorksInDatabase = async (works: WorkData[]) => {
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
  };

  // 編集モードの保存
  const handleSaveEditMode = async () => {
    setIsUpdating(true);
    try {
      await updateFeaturedWorksInDatabase(savedWorks);
      setIsEditMode(false);
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  if (featuredWorks.length === 0 && !isEditMode) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            代表作
          </h3>
          <Button
            onClick={() => setIsEditMode(true)}
            variant="outline"
            className="text-sm"
          >
            代表作を設定
          </Button>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-500/25">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            代表作を設定しましょう
          </h4>
          <p className="text-gray-600 mb-4">
            最大3つまでの作品を代表作として設定できます。
            <br />
            訪問者が最初に目にする重要な作品です。
          </p>
          <Button
            onClick={() => setIsEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"
          >
            代表作を選択
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          代表作
          <span className="text-sm font-normal text-gray-500">
            ({featuredWorks.length}/3)
          </span>
        </h3>
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <Button
                onClick={() => setIsEditMode(false)}
                variant="outline"
                className="text-sm"
                disabled={isUpdating}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSaveEditMode}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"
                disabled={isUpdating}
              >
                {isUpdating ? "保存中..." : "保存"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditMode(true)}
              variant="outline"
              className="text-sm"
            >
              編集
            </Button>
          )}
        </div>
      </div>

      {isEditMode ? (
        <div className="space-y-6">
          {/* 現在の代表作 */}
          {featuredWorks.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                現在の代表作
              </h4>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={featuredWorks.map((w) => w.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredWorks.map((work) => (
                      <div key={work.id} className="relative">
                        <SortableWorkCard
                          work={work}
                          onDelete={deleteWork}
                          isDraggable={true}
                        />
                        <Button
                          onClick={() => removeFromFeatured(work.id)}
                          className="absolute top-2 right-2 w-8 h-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                          disabled={isUpdating}
                        >
                          ×
                        </Button>
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                          #{work.featured_order}
                        </div>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* 代表作候補 */}
          {featuredWorks.length < 3 && nonFeaturedWorks.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                代表作に追加
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (クリックして追加)
                </span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {nonFeaturedWorks.slice(0, 6).map((work) => (
                  <div
                    key={work.id}
                    className="relative cursor-pointer transform hover:scale-105 transition-transform"
                    onClick={() => addToFeatured(work.id)}
                  >
                    <WorkCard
                      work={work}
                      onDelete={deleteWork}
                      isDraggable={false}
                    />
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-0 hover:bg-opacity-10 rounded-2xl transition-all flex items-center justify-center">
                      <div className="bg-blue-600 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`grid gap-6 ${featuredWorks.length === 1
              ? "grid-cols-1 max-w-2xl mx-auto"
              : featuredWorks.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            }`}
        >
          {featuredWorks.map((work) => (
            <div key={work.id} className="relative">
              <WorkCard
                work={work}
                onDelete={deleteWork}
                isDraggable={false}
                isFeatured={true} // isFeaturedプロップを追加
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
