import { useLayout } from "@/contexts/LayoutContext";
import { calculateTopTags } from "@/features/profile/lib/profileUtils";
import { useEffect, useMemo, useCallback } from "react";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { CreatorAnalysis } from "./CreatorAnalysis";
import { ProfileData, InputData } from "../types";
import { ProfileOverview } from "./ProfileOverview";
import { ProfileWorks } from "./ProfileWorks";

interface ProfileTabsProps {
  activeTab: "profile" | "works" | "details";
  setActiveTab: (tab: "profile" | "works" | "details") => void;
  profileData: ProfileData | null;
  savedWorks: any[];
  setSavedWorks: (works: any[]) => void;
  deleteWork: (workId: string) => void;
  // スキル管理
  onRemoveSkill: (index: number) => void;
  setIsSkillModalOpen: (isOpen: boolean) => void;
  // キャリア管理
  onEditCareer: (career: any) => void;
  onDeleteCareerConfirm: (careerId: string) => void;
  setIsCareerModalOpen: (isOpen: boolean) => void;
  // 自己紹介管理
  setIsIntroductionModalOpen: (isOpen: boolean) => void;
  // AI分析による強みのデータ
  strengthsAnalysis: any; // 型定義の不一致を避けるため一旦anyにするか、正しい型を定義する

  // タブ情報を外部に提供
  getTabsInfo?: (info: {
    tabs: Array<{
      key: string;
      label: string;
      icon?: React.ReactNode;
      count?: number;
    }>;
    activeTab: string;
    onTabChange: (tab: string) => void;
  }) => void;
  inputs?: InputData[];
  isLoading?: boolean;
}

export function ProfileTabs({
  activeTab,
  setActiveTab,
  profileData,
  savedWorks,
  setSavedWorks,
  deleteWork,
  onRemoveSkill,
  setIsSkillModalOpen,
  onEditCareer,
  onDeleteCareerConfirm,
  setIsCareerModalOpen,
  setIsIntroductionModalOpen,
  strengthsAnalysis,
  getTabsInfo,
  inputs,
  isLoading,
}: ProfileTabsProps) {
  const { openContentTypeSelector } = useLayout();

  // よく使用するタグを計算（作品データから）- useMemoでメモ化
  const _topTags = useMemo(() => calculateTopTags(savedWorks), [savedWorks]);

  // タブ設定
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

  // タブ情報を外部に提供する関数
  useEffect(() => {
    if (getTabsInfo) {
      getTabsInfo({
        tabs,
        activeTab,
        onTabChange: (tab: string) =>
          setActiveTab(tab as "profile" | "works" | "details"),
      });
    }
  }, [getTabsInfo, tabs, activeTab, setActiveTab]);

  // ローディング状態のチェックはすべてのフックの後に実行
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div>
      {/* タブナビゲーション（全画面共通） */}
      {/* モバイル・タブレット用ナビゲーション（デスクトップでは左ナビを使用） */}
      <div className="mb-6 md:mb-8 px-2 sm:px-0 lg:hidden">
        <div className="bg-white/95 backdrop-blur border border-gray-200/80 rounded-2xl shadow-[0_12px_35px_-25px_rgba(15,23,42,0.35)] px-2 sm:px-4 py-3">
          <nav
            className="grid grid-cols-3 gap-2"
            role="tablist"
            aria-label="プロフィールセクションナビゲーション"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              let label = tab.label;
              if (tab.key === "profile") label = "プロフィール";
              if (tab.key === "works") label = "作品";
              if (tab.key === "details") label = "クリエイター詳細";

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
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl border text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isActive
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
            <ProfileOverview
              profileData={profileData}
              onAddSkill={() => setIsSkillModalOpen(true)}
              onRemoveSkill={onRemoveSkill}
              onEditCareer={onEditCareer}
              onDeleteCareerConfirm={onDeleteCareerConfirm}
              onAddCareer={() => setIsCareerModalOpen(true)}
              onUpdateIntroduction={() => setIsIntroductionModalOpen(true)}
            />
          )}

          {/* 作品タブ */}
          {activeTab === "works" && (
            <ProfileWorks
              savedWorks={savedWorks}
              setSavedWorks={setSavedWorks}
              deleteWork={deleteWork}
              openContentTypeSelector={openContentTypeSelector}
            />
          )}

          {/* Creator Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-8">
              <CreatorAnalysis
                works={savedWorks}
                strengthsAnalysis={strengthsAnalysis}
                inputs={inputs || []}
              />
            </div>
          )}
        </div>
      </div>

      {/* 作品追加モーダルは GlobalModalManager が document.body へポータル挿入 */}
    </div>
  );
}
