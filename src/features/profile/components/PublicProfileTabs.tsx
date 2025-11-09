"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabNavigation } from "@/components/ui/TabNavigation";
import { useWorkStatistics } from "@/features/work/hooks/useWorkStatistics";
import { PublicFeaturedWorksSection } from "@/features/work/components/PublicFeaturedWorksSection";
import { PublicWorksCategoryManager } from "@/features/work/components/PublicWorksCategoryManager";
import { RolePieChart } from "./RolePieChart";
import { calculateTopTags } from "@/features/profile/lib/profileUtils";
import { EmptyState } from "@/components/common";
import { useTagStatistics } from "@/hooks/useTagStatistics";
import type { JobMatchingHint } from "@/features/profile/lib/profileUtils";

interface PublicProfileTabsProps {
  activeTab: "profile" | "works" | "details";
  setActiveTab: (_tab: "profile" | "works" | "details") => void;
  profile: any;
  works: any[];
  skills: string[];
  career: any[];
  isProfileEmpty: boolean;
  jobMatchingHints?: JobMatchingHint[];
}

export function PublicProfileTabs({
  activeTab,
  setActiveTab,
  profile,
  works,
  skills,
  career,
  jobMatchingHints,
}: PublicProfileTabsProps) {
  const workStats = useWorkStatistics(works);
  const {
    data: tagStatistics,
    getTagStatistic: _getTagStatistic,
    getTagRanking: _getTagRanking,
  } = useTagStatistics();

  const workCategories = useMemo(() => {
    const categories: { [key: string]: any } = {};

    works.forEach((work) => {
      const categoryId = work.category_id || "uncategorized";
      if (!categories[categoryId]) {
        categories[categoryId] = {
          id: categoryId,
          name:
            work.category_name ||
            (categoryId === "uncategorized" ? "未分類" : "不明なカテゴリ"),
          works: [],
        };
      }
      categories[categoryId].works.push(work);
    });

    return Object.values(categories);
  }, [works]);

  const topTags = useMemo(() => calculateTopTags(works), [works]);
  const introductionText = profile?.introduction || profile?.bio || "";

  const tabs = [
    { key: "profile", label: "プロフィール" },
    { key: "works", label: "作品", count: works.length },
    { key: "details", label: "クリエイター詳細" },
  ];

  return (
    <div className="space-y-8">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) =>
          setActiveTab(tab as "profile" | "works" | "details")
        }
      />

      <div className="mt-8">
        {activeTab === "profile" && (
          <div className="space-y-8">
            {!profile?.bio &&
              (!skills || skills.length === 0) &&
              (!career || career.length === 0) && (
                <Card className="border-dashed border-2 border-[#1e3a8a]/20 bg-gradient-to-br from-[#1e3a8a]/5 via-[#1e3a8a]/5 to-[#1e3a8a]/10">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      素敵なクリエイターです！
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      このクリエイターは現在プロフィールを充実させている最中です。
                      <br />
                      作品を通じて、その才能と個性を表現しています。
                    </p>
                  </CardContent>
                </Card>
              )}

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">自己紹介</h3>
                </div>

                {introductionText ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {introductionText}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      まだ詳細な自己紹介が登録されていません
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    できること
                  </h3>
                </div>

                {skills && skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 bg-[#1e3a8a]/10 text-[#1e3a8a] text-sm border border-[#1e3a8a]/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">
                      スキル情報なし
                    </h4>
                    <p className="text-gray-500">
                      まだスキルが登録されていません
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">キャリア</h3>
                </div>

                {career && career.length > 0 ? (
                  <div className="space-y-4">
                    {career.map((careerItem, index) => (
                      <div
                        key={careerItem.id || index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {careerItem.position}
                              </h4>
                              {careerItem.isCurrent && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  現職
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {careerItem.company}
                            </p>
                            {careerItem.department && (
                              <p className="text-sm text-gray-500 mb-2">
                                {careerItem.department}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mb-3">
                              {careerItem.startDate} -{" "}
                              {careerItem.isCurrent
                                ? "現在"
                                : careerItem.endDate || "不明"}
                            </p>
                            {careerItem.description && (
                              <p className="text-sm text-gray-700">
                                {careerItem.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">
                      キャリア情報なし
                    </h4>
                    <p className="text-gray-500">
                      まだキャリア情報が登録されていません
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "works" && (
          <div>
            {works.length > 0 ? (
              <>
                <PublicFeaturedWorksSection works={works} />
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">全作品</h3>
                  </div>
                  <PublicWorksCategoryManager
                    works={works}
                    categories={workCategories}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                title="まだ作品がありません"
                message="作品が登録されると表示されます"
              />
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    作品統計・役割分布
                  </h3>
                </div>

                {workStats.totalWorks > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="text-center lg:text-left">
                      <div className="bg-gradient-to-br from-[#1e3a8a]/5 to-[#1e3a8a]/10 rounded-xl p-6 border border-[#1e3a8a]/20 h-full">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                          総作品数
                        </h4>
                        <div className="text-4xl font-bold text-[#1e3a8a]">
                          {workStats.totalWorks}
                        </div>
                        <p className="text-gray-600 mt-2">
                          これまでに制作した作品
                        </p>

                        {workStats.totalWordCount > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#1e3a8a]/20">
                            <h5 className="text-sm font-medium text-gray-600 mb-1">
                              総文字数
                            </h5>
                            <div className="text-2xl font-bold text-[#1e3a8a]">
                              {workStats.totalWordCount.toLocaleString("ja-JP")}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              記事・ライティング作品の合計
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-4">
                        役割分布
                      </h4>
                      {workStats.roleDistribution.length > 0 ? (
                        <RolePieChart roles={workStats.roleDistribution} />
                      ) : (
                        <EmptyState title="役割データがありません" />
                      )}
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="まだ作品がありません"
                    message="作品が登録されると統計情報が表示されます"
                  />
                )}
              </CardContent>
            </Card>

            {topTags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        よく使用するタグ
                      </h3>
                      <p className="text-gray-600 mt-1">
                        得意分野・専門領域の分析
                      </p>
                    </div>
                    <div className="text-sm text-[#1e3a8a] bg-[#1e3a8a]/10 px-3 py-1 rounded-full border border-[#1e3a8a]/20">
                      トップ7
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {topTags
                      .slice(0, 7)
                      .map(([tag, count]: [string, number], index: number) => (
                        <div
                          key={tag}
                          className="flex items-center justify-between p-2 rounded-md border border-gray-200 hover:border-[#1e3a8a]/30 hover:bg-[#1e3a8a]/5 transition-all duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                index === 0
                                  ? "bg-yellow-500 text-white"
                                  : index === 1
                                    ? "bg-gray-400 text-white"
                                    : index === 2
                                      ? "bg-amber-600 text-white"
                                      : "bg-blue-500 text-white"
                              }`}
                            >
                              {index + 1}
                            </div>

                            <span className="text-sm font-medium text-gray-900 truncate">
                              {tag}
                            </span>
                          </div>

                          <div className="text-right">
                            <div
                              className={`text-sm font-bold ${
                                index < 3 ? "text-[#1e3a8a]" : "text-gray-600"
                              }`}
                            >
                              {count}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {topTags.length > 7 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        その他のタグ
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {topTags
                          .slice(7)
                          .map(([tag, count]: [string, number]) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                            >
                              {tag}
                              <span className="ml-1 text-gray-500">
                                ({count})
                              </span>
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-[#1e3a8a]/5 rounded-lg border border-[#1e3a8a]/20">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-800">
                            専門性分析
                          </h4>
                          {tagStatistics && (
                            <span className="text-xs text-[#1e3a8a] bg-[#1e3a8a]/10 px-2 py-1 rounded-full">
                              全{tagStatistics.totalWorks}件のデータ
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {topTags[0]?.[0] || "なし"}を中心とした
                          {topTags
                            .slice(0, 3)
                            .map(([tag]) => tag)
                            .join("・")}
                          の分野で専門性を発揮
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-[#1e3a8a]">
                          {topTags.length}
                        </div>
                        <div className="text-xs text-gray-500">分野</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* こんな仕事が向いているかも */}
            {jobMatchingHints && jobMatchingHints.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2M8 6v2a2 2 0 002 2h4a2 2 0 002-2V6m0 0V4a2 2 0 00-2-2H8a2 2 0 00-2 2v2z"
                      />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900">
                      こんな仕事が向いているかも
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {jobMatchingHints.map((hint, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 mb-2">
                              {hint.title}
                            </h4>
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">
                              {hint.description}
                            </p>
                            <div className="space-y-2">
                              <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-blue-700 flex-shrink-0">
                                    理由:
                                  </span>
                                  <p className="text-xs text-gray-700 leading-relaxed">
                                    {hint.reason}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-blue-700 flex-shrink-0">
                                    おすすめの理由:
                                  </span>
                                  <p className="text-xs text-gray-700 leading-relaxed">
                                    {hint.whyRecommended}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
