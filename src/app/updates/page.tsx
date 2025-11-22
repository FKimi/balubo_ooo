"use client";

import Link from "next/link";
import { Footer as SharedFooter } from "@/components/layout/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  recentUpdates,
  roadmapItems,
  type RoadmapStatus,
} from "@/data/recentUpdates";

export default function UpdatesPage() {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeStyles = (status: RoadmapStatus) => {
    switch (status) {
      case "done":
        return "bg-blue-500 text-white border-transparent";
      case "beta":
        return "bg-blue-400 text-white border-transparent";
      case "wip":
        return "bg-white text-blue-600 border-blue-200 shadow-sm";
      case "planned":
        return "bg-white text-gray-500 border-gray-200 shadow-sm";
      default:
        return "bg-white text-gray-500 border-gray-200";
    }
  };

  const getStatusLabel = (status: RoadmapStatus) => {
    switch (status) {
      case "done":
        return "done ✓";
      case "beta":
        return "beta";
      case "wip":
        return "WIP";
      case "planned":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-base-soft-blue">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="balubo トップページ"
          >
            <span className="text-xl font-bold tracking-tight text-blue-600">
              balubo
            </span>
          </Link>
          <nav
            className="hidden items-center space-x-6 text-sm font-medium text-gray-700 md:flex"
            aria-label="グローバルナビゲーション"
          >
            <Link
              href="/"
              className="transition-colors hover:text-blue-600"
            >
              クリエイター向け
            </Link>
            <Link
              href="/enterprise"
              className="transition-colors hover:text-blue-600"
            >
              企業向けサービス
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-16 pb-32">
        <div className="container mx-auto max-w-3xl px-4">
          {/* ヘッダー */}
          <FadeIn>
            <div className="mb-16 text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl shadow-soft">
                🚀
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-display">
                balubo Updates
              </h1>
            </div>
          </FadeIn>

          {/* ロードマップ */}
          <section className="mb-24">
            <FadeIn>
              <h2 className="mb-8 text-xl font-bold text-gray-900">
                ロードマップ
              </h2>
              <div className="flex flex-wrap gap-3">
                {roadmapItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 ${getStatusBadgeStyles(
                      item.status
                    )}`}
                  >
                    {item.status !== "planned" && (
                      <span className="absolute -top-2 right-0 inline-flex items-center rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white shadow-sm group-hover:bg-blue-600">
                        {getStatusLabel(item.status)}
                      </span>
                    )}
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.title}
                  </div>
                ))}
              </div>
            </FadeIn>
          </section>

          {/* 更新情報リスト（タイムライン） */}
          <section>
            <FadeIn className="mb-8">
              <h2 className="text-xl font-bold text-gray-900">更新情報</h2>
            </FadeIn>

            <div className="relative border-l-2 border-dashed border-blue-200 pl-8 sm:pl-12 space-y-12">
              <StaggerContainer>
                {recentUpdates.map((update) => (
                  <StaggerItem key={update.id} className="relative">
                    {/* タイムライン上のアイコン */}
                    <div className="absolute -left-[43px] sm:-left-[59px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-sm border border-blue-100">
                      {update.icon || "✨"}
                    </div>

                    {/* 日付とバージョン */}
                    <div className="mb-3 flex flex-wrap items-baseline gap-3">
                      <time className="text-sm text-gray-500 font-medium">
                        {formatDate(update.date)}
                      </time>
                      {update.updateNumber && (
                        <span className="text-sm font-bold text-blue-500 hover:underline cursor-pointer">
                          update #{update.updateNumber}
                        </span>
                      )}
                    </div>

                    {/* カード */}
                    <div className="rounded-[24px] bg-white p-6 shadow-soft transition-all hover:shadow-soft-lg">
                      <h3 className="mb-4 text-lg font-bold leading-snug text-gray-900">
                        {update.title}
                      </h3>

                      {update.description && (
                        <p className="mb-6 text-sm leading-relaxed text-gray-600">
                          {update.description}
                        </p>
                      )}

                      {/* タグとバージョン情報 */}
                      {(update.tags || update.version) && (
                        <div className="flex flex-wrap items-center gap-2">
                          {update.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                            >
                              {tag}
                            </span>
                          ))}
                          {update.version && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                />
                              </svg>
                              {update.version}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
