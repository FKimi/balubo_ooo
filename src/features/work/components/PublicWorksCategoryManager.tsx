"use client";

import { useState, useMemo } from "react";
import type { WorkData } from "@/features/work/types";
import { EmptyState } from "@/components/common";
import { WorkCard } from "@/features/work/components/WorkCard";

interface Category {
  id: string;
  name: string;
  works: WorkData[];
}

interface PublicWorksCategoryManagerProps {
  works: WorkData[];
  categories: Category[];
}

export function PublicWorksCategoryManager({
  works,
  categories,
}: PublicWorksCategoryManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allCategoriesWithAll = useMemo(() => {
    const categoryList = [
      { id: "all", name: "ALL", works: works },
      ...categories.filter((cat) => cat.id !== "uncategorized"),
    ];
    // "未分類" タブは非表示
    return categoryList;
  }, [categories, works]);

  const filteredWorks = useMemo(() => {
    if (selectedCategory === "all") {
      return works;
    }
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category?.works || [];
  }, [selectedCategory, categories, works]);

  return (
    <div>
      {/* カテゴリタブ */}
      <div className="flex items-center gap-1 mb-8 p-1 bg-gray-50/50 rounded-2xl w-fit">
        {allCategoriesWithAll.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`relative px-6 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
              selectedCategory === category.id
                ? "text-[#1e3a8a]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center gap-2">
              {category.name}
              <span
                className={`text-xs font-normal ${
                  selectedCategory === category.id
                    ? "text-[#1e3a8a]/70"
                    : "text-gray-400"
                }`}
              >
                {category.works.length}
              </span>
            </span>

            {/* アクティブ時の背景 */}
            {selectedCategory === category.id && (
              <div className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-100 -z-10"></div>
            )}
          </button>
        ))}
      </div>

      {/* 作品一覧 */}
      {filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredWorks.map((work) => (
            <WorkCard
              key={work.id}
              work={work as WorkData}
              onDelete={() => {}}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            selectedCategory === "all"
              ? "まだ作品がありません"
              : "このカテゴリには作品がありません"
          }
          message={
            selectedCategory === "all"
              ? "作品が投稿されるとここに表示されます"
              : "別のカテゴリを選択してください"
          }
        />
      )}
    </div>
  );
}
