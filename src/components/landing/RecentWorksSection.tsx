"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RecentWork } from "@/data/recentWorks";

interface RecentWorksSectionProps {
  initialWorks?: RecentWork[];
}

const formatDate = (value: string): string => {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (_error) {
    return "";
  }
};

const mapToRecentWork = (work: any): RecentWork | null => {
  if (!work || !work.id) {
    return null;
  }

  const previewFromBanner =
    typeof work.bannerImageUrl === "string" && work.bannerImageUrl.trim().length
      ? work.bannerImageUrl
      : typeof work.banner_image_url === "string" &&
          work.banner_image_url.trim().length
        ? work.banner_image_url
        : null;

  const authorSource = work.user || work.author;
  const author =
    authorSource && (authorSource.id || authorSource.displayName || authorSource.display_name)
      ? {
          id: String(authorSource.id ?? authorSource.user_id ?? "unknown"),
          displayName:
            authorSource.displayName ??
            authorSource.display_name ??
            authorSource.name ??
            "ユーザー",
          avatarImageUrl:
            authorSource.avatarImageUrl ??
            authorSource.avatar_image_url ??
            null,
        }
      : undefined;

  return {
    id: String(work.id),
    title: work.title ?? "作品タイトル未設定",
    description:
      work.description ??
      "作品の説明がまだ追加されていませんが、ぜひ詳細ページでチェックしてください。",
    externalUrl: work.externalUrl ?? work.external_url ?? "",
    previewImage:
      previewFromBanner ??
      work.previewImage ??
      work.preview_image ??
      work.previewData?.image ??
      work.preview_data?.image ??
      undefined,
    tags: Array.isArray(work.tags) ? work.tags : [],
    createdAt: work.created_at ?? work.createdAt ?? new Date().toISOString(),
    ...(author ? { author } : {}),
  };
};

export default function RecentWorksSection({
  initialWorks = [],
}: RecentWorksSectionProps) {
  const [works, setWorks] = useState<RecentWork[]>(
    () =>
      initialWorks
        .map(mapToRecentWork)
        .filter((work): work is RecentWork => work !== null),
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchLatestWorks = async () => {
      try {
        const response = await fetch("/api/works/latest?limit=3", {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-store",
          },
        });

        if (!response.ok) {
          console.error(
            "RecentWorksSection: 最新作品の取得に失敗しました",
            response.status,
          );
          return;
        }

        const payload = await response.json();
        const latest = payload?.works;
        if (!Array.isArray(latest) || latest.length === 0) {
          return;
        }

        const mapped = latest
          .map(mapToRecentWork)
          .filter((work): work is RecentWork => work !== null);

        if (mapped.length > 0 && isMounted) {
          setWorks(mapped);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error(
          "RecentWorksSection: 最新作品取得中にエラーが発生しました",
          error,
        );
      }
    };

    fetchLatestWorks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const sortedWorks = useMemo(() => {
    return [...works].sort((a, b) => {
      const first = new Date(a.createdAt).getTime();
      const second = new Date(b.createdAt).getTime();
      if (Number.isNaN(first) && Number.isNaN(second)) {
        return 0;
      }
      if (Number.isNaN(first)) {
        return 1;
      }
      if (Number.isNaN(second)) {
        return -1;
      }
      return second - first;
    });
  }, [works]);

  if (!sortedWorks.length) {
    return null;
  }

  return (
    <section
      id="recent-works"
      className="bg-white py-20 px-4 md:py-24"
      aria-labelledby="recent-works-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Recently Added
            </p>
            <h2
              id="recent-works-heading"
              className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl"
            >
              最近追加された作品
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
              baluboに最近追加された作品のハイライトです。直近のアウトプットから専門性の幅をのぞいてみましょう。
            </p>
          </div>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            すべての作品を見る
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedWorks.map((work) => (
            <article
              key={work.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:border-blue-100 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-blue-50">
                {work.previewImage ? (
                  <Image
                    src={work.previewImage}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={false}
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-blue-400">
                    b
                  </div>
                )}
              </div>
              <div className="flex h-full flex-col gap-4 p-6">
                {work.author && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                      {work.author.avatarImageUrl ? (
                        <Image
                          src={work.author.avatarImageUrl}
                          alt={`${work.author.displayName}のプロフィール画像`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                          {work.author.displayName.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {work.author.displayName}
                      </p>
                      <p className="text-xs text-gray-500">最新の追加作品</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">追加日</span>
                  {formatDate(work.createdAt) && (
                    <time dateTime={work.createdAt}>
                      {formatDate(work.createdAt)}
                    </time>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {work.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {work.description}
                </p>
                {work.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {work.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-4">
                  <Link
                    href={`/works/${work.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    作品を詳しく見る
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

