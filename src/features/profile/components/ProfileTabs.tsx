/* eslint-disable unused-imports/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import type { WorkData } from "@/features/work/types";
import type { ProfileData, CareerItem } from "@/features/profile/types";
import { useWorkStatistics } from "@/features/work/hooks/useWorkStatistics";
import { useLayout } from "@/contexts/LayoutContext";
import { useWorkCategories } from "@/features/work/hooks/useWorkCategories";
import { WorksCategoryManager } from "@/features/work/components/WorksCategoryManager";
// ContentTypeSelector はグローバルモーダル（GlobalModalManager）経由で表示するため、ここでは直接使用しない

import { calculateTopTags } from "@/features/profile/lib/profileUtils";
import type { JobMatchingHint } from "@/features/profile/lib/profileUtils";

import { useState, useEffect, useMemo, useCallback } from "react";
import { RolePieChart } from "./RolePieChart";
import { EmptyState } from "@/components/common";
// useTagStatisticsは使用されていないため削除（パフォーマンス改善）
import { AIAnalysisStrengths } from "./AIAnalysisStrengths";
import { DashboardMetrics } from "./DashboardMetrics";
import { ExpertiseScores } from "./ExpertiseScores";
import { RecentActivity } from "./RecentActivity";

interface ProfileTabsProps {
  activeTab: string;
  // eslint-disable-next-line unused-imports/no-unused-vars
  setActiveTab: (tab: "profile" | "works" | "details") => void;
  profileData: ProfileData | null;
  savedWorks: WorkData[];
  // eslint-disable-next-line unused-imports/no-unused-vars
  setSavedWorks: (works: WorkData[]) => void;

  // eslint-disable-next-line unused-imports/no-unused-vars
  deleteWork: (workId: string) => void;
  // スキル管理
  onAddSkill?: () => void;
  onRemoveSkill?: (index: number) => void;
  setIsSkillModalOpen: (open: boolean) => void;
  // キャリア管理
  onEditCareer: (career: CareerItem) => void;
  onDeleteCareerConfirm: (careerId: string) => void;
  setIsCareerModalOpen: (open: boolean) => void;
  // 自己紹介管理
  onUpdateIntroduction?: (introduction: string) => void;
  setIsIntroductionModalOpen: (open: boolean) => void;
  showTabHeader?: boolean;
  // AI分析による強みのデータ
  strengthsAnalysis?: {
    strengths: Array<{ title: string; description: string }>;
    jobMatchingHints?: JobMatchingHint[];
  };
  // タブ情報を外部に提供
  getTabsInfo?: (
    callback: () => {
      tabs: Array<{
        key: string;
        label: string;
        icon?: React.ReactNode;
        count?: number;
      }>;
      activeTab: string;
      onTabChange: (tab: string) => void;
    },
  ) => void;
}

export function ProfileTabs({
  activeTab,
  setActiveTab,
  profileData,
  savedWorks,
  setSavedWorks,
  deleteWork,
  onAddSkill,
  onRemoveSkill,
  setIsSkillModalOpen,
  onEditCareer,
  onDeleteCareerConfirm,
  setIsCareerModalOpen,
  onUpdateIntroduction,
  setIsIntroductionModalOpen,
  showTabHeader = true,
  strengthsAnalysis,
  getTabsInfo,
}: ProfileTabsProps) {
  const [isClient, setIsClient] = useState(false);
  const { openContentTypeSelector } = useLayout();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // カスタムフックからデータを取得
  const workStats = useWorkStatistics(savedWorks);
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    updateWorkCategory,
  } = useWorkCategories(savedWorks, setSavedWorks);
  // useTagStatisticsは使用されていないため削除（パフォーマンス改善）

  // 作品追加モーダルはレイアウトのグローバル管理を利用

  // よく使用するタグを計算（作品データから）- useMemoでメモ化
  const topTags = useMemo(() => calculateTopTags(savedWorks), [savedWorks]);

  // タブ設定
  const worksCount = savedWorks.length;

  const tabs = useMemo(
    () => [
      {
        key: "profile",
        label: "プロフィール",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      },
      {
        key: "works",
        label: "作品",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        ),
      },
      {
        key: "details",
        label: "クリエイター詳細",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const handleTabChange = useCallback(
    (tabKey: "profile" | "works" | "details") => {
      setActiveTab(tabKey);
    },
    [setActiveTab],
  );

  // タグランキングサマリー生成
  const summary =
    topTags.length === 0
      ? ""
      : topTags.length === 1
        ? `${topTags[0]?.[0] ?? ""}が特に多く使われています。`
        : topTags.length === 2
          ? `${topTags[0]?.[0] ?? ""}・${topTags[1]?.[0] ?? ""}が特に多く使われています。`
          : `${topTags[0]?.[0] ?? ""}・${topTags[1]?.[0] ?? ""}・${topTags[2]?.[0] ?? ""}が特に多く使われています。`;

  // タブ情報を外部に提供する関数
  useEffect(() => {
    if (getTabsInfo) {
      getTabsInfo(() => ({
        tabs,
        activeTab,
        onTabChange: (tab: string) =>
          setActiveTab(tab as "profile" | "works" | "details"),
      }));
    }
  }, [getTabsInfo, tabs, activeTab, setActiveTab]);

  return (
    <div>
      {/* タブナビゲーション（全画面共通） */}
      {/* モバイル・タブレット用ナビゲーション（デスクトップでは左ナビを使用） */}
      <div className="mb-6 md:mb-8 px-2 sm:px-0 lg:hidden">
        <div className="bg-white/95 backdrop-blur border border-gray-200/80 rounded-2xl shadow-[0_12px_35px_-25px_rgba(15,23,42,0.35)] px-2 sm:px-4 py-3">
          <nav
            className="grid grid-cols-3 gap-2"
            role="tablist"
            aria-label="プロフィールセクション切り替え"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              let label = tab.label;
              if (tab.key === "profile") label = "Profile";
              if (tab.key === "works") label = "Works";
              if (tab.key === "details") label = "Analytics";

              return (
                <button
                  key={tab.key}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-label={label}
                  onClick={() =>
                    handleTabChange(tab.key as "profile" | "works" | "details")
                  }
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl border text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                      : "bg-white border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="tracking-wide uppercase">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* タブコンテンツのみ（ナビゲーションはサイドバーに移動） */}
      <div className="lg:border-0">
          <div className="w-full lg:px-0 py-6 lg:py-0">
            {/* プロフィールタブ */}
            {activeTab === "profile" && (
              <div className="space-y-5">
                {/* 新規ユーザー向けウェルカムメッセージ */}
                {!profileData?.bio &&
                  (!profileData?.skills || profileData.skills.length === 0) &&
                  (!profileData?.career || profileData.career.length === 0) && (
                    <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg p-6 text-center">
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        プロフィールを充実させましょう
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        あなたの経験やスキルを追加して、他のクリエイターとのつながりを深めましょう。
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button
                          onClick={() => setIsSkillModalOpen(true)}
                          className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm"
                        >
                          スキルを追加
                        </Button>
                        <Button
                          onClick={() => setIsCareerModalOpen(true)}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                        >
                          キャリアを追加
                        </Button>
                      </div>
                    </div>
                  )}

                {/* 詳細自己紹介セクション */}
                <div className="border border-gray-200 rounded-lg bg-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      自己紹介
                    </h3>
                    <Button
                      onClick={() => setIsIntroductionModalOpen(true)}
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs px-3 py-1.5"
                    >
                      編集
                    </Button>
                  </div>

                  {profileData?.introduction ? (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {profileData.introduction}
                    </p>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500 mb-3">
                        まだ詳細な自己紹介が登録されていません
                      </p>
                      <Button
                        onClick={() => setIsIntroductionModalOpen(true)}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                      >
                        自己紹介を追加
                      </Button>
                    </div>
                  )}
                </div>

                {/* できること（スキル）セクション */}
                <div className="border border-gray-200 rounded-lg bg-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      経験・スキル
                    </h3>
                    <Button
                      onClick={() => setIsSkillModalOpen(true)}
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs px-3 py-1.5"
                    >
                      追加
                    </Button>
                  </div>
                  {profileData?.skills && profileData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 text-sm flex items-center gap-2 group"
                        >
                          <span>{skill}</span>
                          {onRemoveSkill && (
                            <button
                              onClick={() => onRemoveSkill(index)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500 mb-3">
                        まだスキルが登録されていません
                      </p>
                      <Button
                        onClick={() => setIsSkillModalOpen(true)}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                      >
                        最初のスキルを追加
                      </Button>
                    </div>
                  )}
                </div>

                {/* キャリアセクション */}
                <div className="border border-gray-200 rounded-lg bg-white p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      キャリア
                    </h3>
                    <Button
                      onClick={() => setIsCareerModalOpen(true)}
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs px-3 py-1.5"
                    >
                      追加
                    </Button>
                  </div>

                  {profileData?.career && profileData.career.length > 0 ? (
                    <div className="space-y-3">
                      {[...profileData.career]
                        .sort((a, b) => {
                          const parseYearMonth = (
                            dateStr: string,
                          ): number => {
                            const match =
                              dateStr.match(/(\d{4})\D*(\d{1,2})?/);
                            if (!match) return 0;
                            const year = Number(match[1]);
                            const month = match[2] ? Number(match[2]) - 1 : 0;
                            return new Date(year, month).getTime();
                          };

                          return (
                            parseYearMonth(b.startDate) -
                            parseYearMonth(a.startDate)
                          );
                        })
                        .map((careerItem) => (
                          <div
                            key={careerItem.id}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-gray-900 text-sm">
                                    {careerItem.position}
                                  </h4>
                                  {careerItem.isCurrent && (
                                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                                      現職
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  {careerItem.company}
                                </p>
                                {careerItem.department && (
                                  <p className="text-xs text-gray-500 mb-1">
                                    {careerItem.department}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mb-2">
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
                              <div className="flex gap-1 ml-3">
                                <button
                                  onClick={() => onEditCareer(careerItem)}
                                  className="w-7 h-7 bg-white hover:bg-gray-50 text-gray-600 rounded border border-gray-200 flex items-center justify-center transition-colors"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() =>
                                    onDeleteCareerConfirm(careerItem.id)
                                  }
                                  className="w-7 h-7 bg-white hover:bg-gray-50 text-gray-600 rounded border border-gray-200 flex items-center justify-center transition-colors"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500 mb-3">
                        まだキャリア情報が登録されていません
                      </p>
                      <Button
                        onClick={() => setIsCareerModalOpen(true)}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                      >
                        最初のキャリアを追加
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 作品タブ */}
            {activeTab === "works" && (
              <div className="space-y-8">
                {/* 主要メトリクスカード */}
                <DashboardMetrics works={savedWorks} />

                {/* 専門性スコアと最近の活動（2カラムレイアウト） */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ExpertiseScores strengths={strengthsAnalysis?.strengths || []} works={savedWorks} />
                  </div>
                  <div className="lg:col-span-1">
                    <RecentActivity works={savedWorks} />
                  </div>
                </div>

                {/* 作品一覧セクション */}
                {savedWorks.length > 0 ? (
                  <div className="space-y-8">
                    {/* 主な作品セクション */}
                    {savedWorks.filter((work) => work.is_featured).length >
                      0 && (
                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                主な作品
                              </h3>
                              <p className="text-sm text-gray-600">
                                あなたの代表的な作品を紹介
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                {
                                  savedWorks.filter((work) => work.is_featured)
                                    .length
                                }
                                /3
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedWorks
                              .filter((work) => work.is_featured)
                              .sort(
                                (a, b) =>
                                  (a.featured_order || 0) -
                                  (b.featured_order || 0),
                              )
                              .map((work, index) => (
                                <div key={work.id} className="relative group">
                                  {/* ランキングバッジ */}
                                  <div className="absolute top-3 left-3 z-10">
                                    <div
                                      className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
                                        index === 0
                                          ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                          : index === 1
                                            ? "bg-gradient-to-r from-gray-400 to-gray-600"
                                            : "bg-gradient-to-r from-amber-500 to-orange-600"
                                      }`}
                                    >
                                      #{index + 1}
                                    </div>
                                  </div>

                                  {/* 作品カード */}
                                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 h-full">
                                    <a
                                      href={`/works/${work.id}`}
                                      className="block h-full"
                                    >
                                      <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                        {work.banner_image_url ? (
                                          <Image
                                            src={work.banner_image_url}
                                            alt={work.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                            quality={85}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                          />
                                        ) : work.preview_data?.image ? (
                                          <Image
                                            src={work.preview_data.image}
                                            alt={work.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                            quality={85}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                            <svg
                                              className="w-12 h-12 text-gray-400"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                              />
                                            </svg>
                                          </div>
                                        )}
                                      </div>
                                      <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 text-base line-clamp-2 mb-2 leading-snug">
                                          {work.title}
                                        </h4>
                                        {work.tags && work.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-1.5">
                                            {work.tags
                                              .slice(0, 2)
                                              .map((tag, idx) => (
                                                <span
                                                  key={idx}
                                                  className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 font-medium"
                                                >
                                                  {tag}
                                                </span>
                                              ))}
                                            {work.tags.length > 2 && (
                                              <span className="text-xs px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-200">
                                                +{work.tags.length - 2}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </a>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* すべての作品セクション */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              すべての作品
                            </h3>
                            <p className="text-sm text-gray-600">
                              {savedWorks.length}件の作品
                            </p>
                          </div>
                          <Button
                            onClick={openContentTypeSelector}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm px-4 py-2 shadow-sm hover:shadow-md transition-all"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
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
                            作品を追加
                          </Button>
                        </div>
                      </div>
                      <div className="p-6">
                        <WorksCategoryManager
                          savedWorks={savedWorks}
                          categories={categories}
                          addCategory={addCategory}
                          updateCategory={updateCategory}
                          deleteCategory={deleteCategory}
                          deleteWork={deleteWork}
                          updateWorkCategory={updateWorkCategory}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="まだ作品がありません"
                    message="最初の作品を追加して、ポートフォリオを始めましょう"
                    ctaLabel="最初の作品を追加"
                    onCtaClick={openContentTypeSelector}
                  />
                )}
              </div>
            )}

            {/* クリエイター詳細タブ */}
            {activeTab === "details" && (
              <div className="space-y-8">
                {/* AI分析による強み */}
                {strengthsAnalysis &&
                  strengthsAnalysis.strengths &&
                  strengthsAnalysis.strengths.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          AI分析による強み
                        </h3>
                        <p className="text-sm text-gray-600">
                          あなたの作品から分析された専門性と強み
                        </p>
                      </div>
                      <div className="p-6">
                        <AIAnalysisStrengths
                          strengths={strengthsAnalysis.strengths}
                          jobMatchingHints={
                            strengthsAnalysis.jobMatchingHints || []
                          }
                          works={savedWorks}
                        />
                      </div>
                    </div>
                  )}

                {/* 活動分析 */}
                {workStats.totalWorks > 0 &&
                  workStats.recentActivity.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          活動分析
                        </h3>
                        <p className="text-sm text-gray-600">
                          最近6ヶ月の作品制作活動
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {workStats.recentActivity.map((activity) => {
                            const maxCount = Math.max(
                              ...workStats.recentActivity.map((a) => a.count),
                              1,
                            );
                            const percentage = (activity.count / maxCount) * 100;
                            return (
                              <div key={activity.displayMonth} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">
                                    {activity.displayMonth}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {activity.count}件
                                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {workStats.mostActiveMonth && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
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
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span>
                                最も活動的だった月は
                                <span className="font-semibold text-gray-900 mx-1">
                                  {workStats.mostActiveMonth.displayMonth}
                                </span>
                                で{workStats.mostActiveMonth.count}件の作品を制作しました
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* 作品統計・役割分析 */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      作品統計・役割分析
                    </h3>
                    <p className="text-sm text-gray-600">
                      あなたの作品の傾向と専門性を分析
                    </p>
                  </div>

                  {workStats.totalWorks > 0 ? (
                    <div className="p-6">
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* 左側: グラフ */}
                        <div className="xl:col-span-2">
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h4 className="text-base font-semibold text-gray-900 mb-4">
                              役割分布
                            </h4>
                            {workStats.roleDistribution.length > 0 ? (
                              isClient ? (
                                <div className="flex justify-center">
                                  <RolePieChart
                                    roles={workStats.roleDistribution}
                                  />
                                </div>
                              ) : (
                                <div className="flex h-[300px] w-full items-center justify-center">
                                  <div className="flex flex-col items-center gap-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="text-sm text-gray-500">
                                      読み込み中...
                                    </p>
                                  </div>
                                </div>
                              )
                            ) : (
                              <EmptyState title="役割データがありません" />
                            )}
                          </div>
                        </div>

                        {/* 右側: 統計情報 */}
                        <div className="space-y-4">
                          {/* 基本統計 */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                  />
                                </svg>
                              </div>
                              <h5 className="font-semibold text-gray-900 text-sm">
                                基本統計
                              </h5>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  総作品数
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                  {workStats.totalWorks}
                                  <span className="text-sm font-normal text-gray-500 ml-1">
                                    件
                                  </span>
                                </span>
                              </div>
                              <div className="h-px bg-blue-100"></div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                  役割種類
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                  {workStats.roleDistribution.length}
                                  <span className="text-sm font-normal text-gray-500 ml-1">
                                    種類
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 専門性分析 */}
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <svg
                                  className="w-5 h-5 text-purple-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                  />
                                </svg>
                              </div>
                              <h5 className="font-semibold text-gray-900 text-sm">
                                専門性分析
                              </h5>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {workStats.roleDistribution.length > 0 &&
                                workStats.roleDistribution[0] && (
                                  <>
                                    <span className="font-semibold text-gray-900">
                                      {workStats.roleDistribution[0].role}
                                    </span>
                                    が
                                    <span className="font-bold text-purple-600 mx-1">
                                      {Math.round(
                                        (workStats.roleDistribution[0].count /
                                          workStats.totalWorks) *
                                          100,
                                      )}%
                                    </span>
                                    を占め、あなたの主要な専門分野となっています。
                                    {workStats.roleDistribution.length > 1 &&
                                      workStats.roleDistribution[1] && (
                                        <>
                                          <br className="mt-2" />
                                          <br />
                                          また、
                                          <span className="font-semibold text-gray-900">
                                            {workStats.roleDistribution[1].role}
                                          </span>
                                          も重要なスキルとして活用されています。
                                        </>
                                      )}
                                  </>
                                )}
                            </p>
                          </div>

                          {/* 役割詳細リスト */}
                          {workStats.roleDistribution.length > 0 && (
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                              <h5 className="font-semibold text-gray-900 text-sm mb-4">
                                役割別内訳
                              </h5>
                              <div className="space-y-2">
                                {workStats.roleDistribution.slice(0, 5).map(
                                  (role, index) => (
                                    <div
                                      key={role.role}
                                      className="flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-3 h-3 rounded-full"
                                          style={{ backgroundColor: role.color }}
                                        />
                                        <span className="text-sm text-gray-700">
                                          {role.role}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                          {role.count}件
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          ({Math.round(role.percentage)}%)
                                        </span>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8">
                      <EmptyState
                        title="まだ作品がありません"
                        message="最初の作品を追加して、統計情報を表示しましょう"
                        ctaLabel="作品を追加"
                        onCtaClick={openContentTypeSelector}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* 作品追加モーダルは GlobalModalManager が document.body へポータル挿入 */}
    </div>
  );
}
