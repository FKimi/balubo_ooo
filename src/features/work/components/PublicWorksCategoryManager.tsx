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
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {allCategoriesWithAll.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${selectedCategory === category.id
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
          >
            <span className="flex items-center gap-2">
              {category.name}
              <span
                className={`text-xs ${selectedCategory === category.id
                    ? "text-slate-300"
                    : "text-slate-400"
                  }`}
              >
                {category.works.length}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* 作品一覧 */}
      {filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <WorkCard
              key={work.id}
              work={work as WorkData}
              onDelete={() => { }}
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
