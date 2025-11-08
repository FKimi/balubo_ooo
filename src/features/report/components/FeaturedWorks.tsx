"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { FeaturedWorkData } from "./types";

interface FeaturedWorksProps {
  works: FeaturedWorkData[];
}

export function FeaturedWorks({ works }: FeaturedWorksProps) {
  if (works.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">代表作データがありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">代表作</h3>
        <p className="text-sm text-gray-600">専門性を端的に示す作品</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <Card
            key={work.id}
            className="border-gray-200 bg-white hover:shadow-md transition-shadow rounded-xl overflow-hidden"
          >
            <CardContent className="p-0">
              {/* サムネイル */}
              {work.thumbnailUrl && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={work.thumbnailUrl}
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* タイトルのみ */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {work.title}
                </h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
