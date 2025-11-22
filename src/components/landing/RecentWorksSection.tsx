"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RecentWork } from "@/data/recentWorks";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface RecentWorksSectionProps {
  initialWorks?: RecentWork[];
}

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
    <section id="works" className="bg-base-soft-blue py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <FadeIn className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
            Featured Works
          </h2>
          <p className="text-lg text-gray-600">
            baluboを活用して作成された、プロフェッショナルの実績ポートフォリオ。<br className="hidden sm:block" />
            専門性が可視化されることで、新たな価値が生まれています。
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedWorks.map((work) => (
            <StaggerItem
              key={work.id}
              className="group flex h-full flex-col overflow-hidden rounded-[32px] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              {/* サムネイル画像 */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                {work.previewImage ? (
                  <Image
                    src={work.previewImage}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* カテゴリタグ（あれば） */}
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-600 backdrop-blur-sm">
                    New
                  </span>
                </div>
              </div>

              {/* コンテンツ */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium text-gray-900">{work.author?.displayName || "Anonymous"}</span>
                  <span>•</span>
                  <time dateTime={work.createdAt}>
                    {new Date(work.createdAt).toLocaleDateString("ja-JP")}
                  </time>
                </div>

                <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900 group-hover:text-blue-600">
                  <Link href={`/works/${work.id}`} className="before:absolute before:inset-0">
                    {work.title}
                  </Link>
                </h3>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {work.description || "No description available."}
                </p>

                {/* タグ（解析結果の一部を表示） */}
                <div className="mt-auto flex flex-wrap gap-2">
                  {work.tags && work.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.4} className="mt-16 text-center">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-800"
          >
            View all works
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

