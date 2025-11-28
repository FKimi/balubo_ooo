"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabNavigation } from "@/components/ui/TabNavigation";
// import { useWorkStatistics } from "@/features/work/hooks/useWorkStatistics";
import { PublicFeaturedWorksSection } from "@/features/work/components/PublicFeaturedWorksSection";
import { PublicWorksCategoryManager } from "@/features/work/components/PublicWorksCategoryManager";
// import { calculateTopTags } from "@/features/profile/lib/profileUtils";
import { EmptyState } from "@/components/common";
// import { useTagStatistics } from "@/hooks/useTagStatistics";
import type { JobMatchingHint } from "@/features/profile/lib/profileUtils";
import { PublicCreatorAnalysis } from "./PublicCreatorAnalysis";

interface PublicProfileTabsProps {
  activeTab: "profile" | "works" | "details";
  setActiveTab: (_tab: "profile" | "works" | "details") => void;
  profile: any;
  works: any[];
  skills: string[];
  career: any[];
  isProfileEmpty: boolean;
  jobMatchingHints?: JobMatchingHint[];
  inputs?: any[];
}

export function PublicProfileTabs({
  activeTab,
  setActiveTab,
  profile,
  works,
  skills,
  career,
  inputs = [],
}: PublicProfileTabsProps) {
  // const workStats = useWorkStatistics(works);
  // const {
  //   data: tagStatistics,
  // } = useTagStatistics();

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

  // const topTags = useMemo(() => calculateTopTags(works), [works]);
  const introductionText = profile?.introduction || profile?.bio || "";

  const tabs = [
    { key: "profile", label: "プロフィール" },
    { key: "works", label: "作品", count: works.length },
    { key: "details", label: "分析" },
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
                <Card className="border-dashed border-2 border-[#1e3a8a]/20 bg-gradient-to-br from-[#1e3a8a]/5 via-[#1e3a8a]/5 to-[#1e3a8a]/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
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

            <Card className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
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

            <Card className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
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
                        className="px-3 py-1 bg-[#1e3a8a]/10 text-[#1e3a8a] text-sm border border-[#1e3a8a]/20 rounded-full"
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

            <Card className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">キャリア</h3>
                </div>

                {career && career.length > 0 ? (
                  <div className="space-y-4">
                    {career.map((careerItem, index) => (
                      <div
                        key={careerItem.id || index}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {careerItem.position}
                              </h4>
                              {careerItem.isCurrent && (
                                <Badge className="bg-green-100 text-green-800 text-xs rounded-full">
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
            <PublicCreatorAnalysis
              works={works}
              inputs={inputs}
              profileData={{
                displayName: profile?.display_name || "",
                title: profile?.title || "",
                bio: profile?.bio || "",
                introduction: profile?.introduction || "",
                professions: profile?.professions || [],
                skills: skills || [],
                location: profile?.location || "",
                websiteUrl: profile?.website_url || "",
                portfolioVisibility: "public",
                jobChangeIntention: "not_considering",
                sideJobIntention: "not_considering",
                projectRecruitmentStatus: "not_recruiting",
                career: career || []
              }}
            />
          </div>
        )}
      </div >
    </div >
  );
}
