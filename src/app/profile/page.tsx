"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfileData, CareerItem } from "@/features/profile/types";
// import type { InputData, InputAnalysis } from '@/types/input'
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileTabs } from "@/features/profile/components/ProfileTabs";
import { ProfileModals } from "@/features/profile/components/ProfileModals";
import { ProfileStatsCards } from "@/features/profile/components/ProfileStatsCards";
import { analyzeStrengthsFromWorks } from "@/features/profile/lib/profileUtils";

// 完全なデフォルトプロフィールデータ
const completeDefaultProfileData: ProfileData = {
  displayName: "",
  title: "",
  bio: "",
  introduction: "",
  professions: [],
  skills: [],
  location: "",
  websiteUrl: "",
  portfolioVisibility: "public",
  backgroundImageUrl: "",
  avatarImageUrl: "",
  desiredRate: "",
  jobChangeIntention: "not_considering",
  sideJobIntention: "not_considering",
  projectRecruitmentStatus: "not_recruiting",
  workingHours: "",
  career: [],
};

function ProfileLoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">プロフィールを読み込んでいます...</p>
      </div>
    </div>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const _router = useRouter();
  const searchParams = useSearchParams();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "works" | "details">(
    "works",
  );
  const [_tabsInfo, setTabsInfo] = useState<{
    tabs: Array<{
      key: string;
      label: string;
      icon?: React.ReactNode;
      count?: number;
    }>;
    activeTab: string;
    onTabChange: (_tab: string) => void;
  } | null>(null);

  // スキル管理用のstate
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [isUpdatingSkills, setIsUpdatingSkills] = useState(false);
  const [skillError, setSkillError] = useState<string | null>(null);

  // 自己紹介管理用のstate
  const [isIntroductionModalOpen, setIsIntroductionModalOpen] = useState(false);
  const [currentIntroduction, setCurrentIntroduction] = useState("");
  const [isUpdatingIntroduction, setIsUpdatingIntroduction] = useState(false);

  // 自己紹介モーダルが開かれた時に現在の内容を設定
  useEffect(() => {
    if (isIntroductionModalOpen && profileData?.introduction) {
      setCurrentIntroduction(profileData.introduction);
    } else if (isIntroductionModalOpen) {
      setCurrentIntroduction("");
    }
  }, [isIntroductionModalOpen, profileData?.introduction]);

  // キャリア管理用のstate
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [newCareer, setNewCareer] = useState<Partial<CareerItem>>({
    company: "",
    position: "",
    department: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrent: false,
  });

  // キャリア編集・削除用のstate
  const [isEditCareerModalOpen, setIsEditCareerModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<CareerItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingCareerId, setDeletingCareerId] = useState<string | null>(null);
  const [isUpdatingCareer, setIsUpdatingCareer] = useState(false);

  const [savedWorks, setSavedWorks] = useState<any[]>([]);
  const [_isLoadingWorks, setIsLoadingWorks] = useState(false);
  const [followerCount, setFollowerCount] = useState<number | undefined>(
    undefined,
  );

  // インプット関連のstate（一時的に未使用）
  // const [_inputs, _setInputs] = useState<InputData[]>([])
  // const [_inputAnalysis, _setInputAnalysis] = useState<InputAnalysis | null>(null)
  // const [_isLoadingInputs, _setIsLoadingInputs] = useState(false)

  // クエリパラメータからタブを設定
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["profile", "works", "details"].includes(tabParam)) {
      setActiveTab(tabParam as "profile" | "works" | "details");
    }
  }, [searchParams]);

  // 作品削除
  const deleteWork = useCallback(
    async (workId: string) => {
      if (!user?.id) return;

      try {
        // Supabaseからアクセストークンを取得
        const { supabase } = await import("@/lib/supabase");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }

        const response = await fetch(`/api/works/${workId}`, {
          method: "DELETE",
          headers,
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error("作品削除エラー");
        }

        // 削除成功後、作品一覧を再取得
        const worksResponse = await fetch(`/api/works`, { headers });
        if (worksResponse.ok) {
          const worksData = await worksResponse.json();
          const sortedWorks = (worksData.works || []).sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
          setSavedWorks(sortedWorks);
        }
      } catch (error) {
        console.error("作品削除エラー:", error);
      }
    },
    [user?.id],
  );

  // 初期データ読み込み
  useEffect(() => {
    if (!user?.id) return;

    const loadAllData = async () => {
      // ローディング状態を設定
      setIsLoadingWorks(true);

      try {
        // プロフィールデータの取得
        const { supabase } = await import("@/lib/supabase");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          setProfileData(completeDefaultProfileData);
          setSavedWorks([]);
          setIsLoadingWorks(false);
          return;
        }

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        };

        // 並列でデータを取得（パフォーマンス改善）
        const [profileResponse, worksResponse, statsResponse] =
          await Promise.all([
          fetch(`/api/profile`, { headers }),
          fetch(`/api/works?userId=${user.id}`, { headers }),
            fetch(`/api/connections/stats?userId=${user.id}`, { headers }).catch(
              () => null,
            ),
        ]);

        // プロフィールデータの処理
        if (profileResponse.ok) {
          const profileJson = await profileResponse.json();
          if (profileJson.data) {
            const profileData = profileJson.data;
            const convertedProfile = {
              ...completeDefaultProfileData,
              displayName:
                profileData.display_name || profileData.displayName || "",
              title: profileData.title || "",
              bio: profileData.bio || "",
              introduction: profileData.introduction || "",
              professions: profileData.professions || [],
              skills: profileData.skills || [],
              location: profileData.location || "",
              websiteUrl:
                profileData.website_url || profileData.websiteUrl || "",
              slug: profileData.slug || "",
              portfolioVisibility:
                profileData.portfolio_visibility ||
                profileData.portfolioVisibility ||
                "public",
              backgroundImageUrl:
                profileData.background_image_url ||
                profileData.backgroundImageUrl ||
                "",
              avatarImageUrl:
                profileData.avatar_image_url ||
                profileData.avatarImageUrl ||
                "",
              desiredRate:
                profileData.desired_rate || profileData.desiredRate || "",
              jobChangeIntention:
                profileData.job_change_intention ||
                profileData.jobChangeIntention ||
                "not_considering",
              sideJobIntention:
                profileData.side_job_intention ||
                profileData.sideJobIntention ||
                "not_considering",
              projectRecruitmentStatus:
                profileData.project_recruitment_status ||
                profileData.projectRecruitmentStatus ||
                "not_recruiting",
              workingHours:
                profileData.working_hours || profileData.workingHours || "",
              career: profileData.career || [],
            };
            setProfileData(convertedProfile);
          } else {
            setProfileData(completeDefaultProfileData);
          }
        } else {
          setProfileData(completeDefaultProfileData);
        }

        // 作品データの処理
        if (worksResponse.ok) {
          const worksData = await worksResponse.json();
          const sortedWorks = (worksData.works || []).sort((a: any, b: any) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          });
          setSavedWorks(sortedWorks);
        } else {
          setSavedWorks([]);
        }

        // フォロワー統計の処理
        if (statsResponse?.ok) {
          try {
            const statsData = await statsResponse.json();
            setFollowerCount(statsData.followerCount || 0);
          } catch (error) {
            console.error("フォロワー統計の取得エラー:", error);
            setFollowerCount(undefined);
          }
        } else {
          setFollowerCount(undefined);
        }
      } catch (error) {
        console.error("データ読み込みエラー:", error);
        setProfileData(completeDefaultProfileData);
        setSavedWorks([]);
      } finally {
        setIsLoadingWorks(false);
      }
    };

    loadAllData();
  }, [user?.id]);

  // タブ変更時のURL更新
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", activeTab);
    window.history.replaceState({}, "", url.toString());
  }, [activeTab]);

  // スキル追加
  const handleAddSkill = async () => {
    if (!newSkill.trim() || !profileData) return;

    try {
      setIsUpdatingSkills(true);
      setSkillError(null);

      const updatedSkills = [...profileData.skills, newSkill.trim()];
      const updatedProfile = { ...profileData, skills: updatedSkills };

      await saveSkillsToDatabase(updatedProfile);
      setProfileData(updatedProfile);
      setNewSkill("");
      setIsSkillModalOpen(false);

      // 成功メッセージを表示（オプション）
      console.log("スキルを追加しました");
    } catch (error) {
      console.error("スキル追加エラー:", error);
      setSkillError("スキルの追加に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdatingSkills(false);
    }
  };

  // スキル削除
  const handleRemoveSkill = async (index: number) => {
    if (!profileData) return;

    try {
      setIsUpdatingSkills(true);
      setSkillError(null);

      const updatedSkills = profileData.skills.filter((_, i) => i !== index);
      const updatedProfile = { ...profileData, skills: updatedSkills };

      await saveSkillsToDatabase(updatedProfile);
      setProfileData(updatedProfile);

      // 成功メッセージを表示（オプション）
      console.log("スキルを削除しました");
    } catch (error) {
      console.error("スキル削除エラー:", error);
      setSkillError("スキルの削除に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdatingSkills(false);
    }
  };

  // スキルをデータベースに保存
  const saveSkillsToDatabase = async (updatedProfile: ProfileData) => {
    if (!user) throw new Error("認証が必要です");

    const { supabase } = await import("@/lib/supabase");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        userId: user.id,
        skills: updatedProfile.skills,
      }),
    });

    if (!response.ok) {
      throw new Error("スキルの保存に失敗しました");
    }
  };

  // キャリア追加
  const handleAddCareer = async () => {
    if (!newCareer.company || !newCareer.position || !profileData) return;

    try {
      setIsUpdatingCareer(true);

      const careerItem: CareerItem = {
        id: Date.now().toString(),
        company: newCareer.company || "",
        position: newCareer.position || "",
        department: newCareer.department || "",
        startDate: newCareer.startDate || "",
        endDate: newCareer.isCurrent ? "" : newCareer.endDate || "",
        description: newCareer.description || "",
        isCurrent: newCareer.isCurrent || false,
      };

      const updatedCareer = [...profileData.career, careerItem];
      const updatedProfile = { ...profileData, career: updatedCareer };

      await saveCareerToDatabase(updatedProfile);
      setProfileData(updatedProfile);
      setNewCareer({
        company: "",
        position: "",
        department: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false,
      });
      setIsCareerModalOpen(false);

      // 成功メッセージを表示（オプション）
      console.log("キャリア情報を追加しました");
    } catch (error) {
      console.error("キャリア追加エラー:", error);
      alert("キャリア情報の追加に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdatingCareer(false);
    }
  };

  // キャリア編集
  const handleEditCareer = (careerItem: CareerItem) => {
    setEditingCareer(careerItem);
    setIsEditCareerModalOpen(true);
  };

  // キャリア更新
  const handleUpdateCareer = async () => {
    if (!editingCareer || !profileData) return;

    try {
      setIsUpdatingCareer(true);

      const updatedCareer = profileData.career.map((item) =>
        item.id === editingCareer.id ? editingCareer : item,
      );
      const updatedProfile = { ...profileData, career: updatedCareer };

      await saveCareerToDatabase(updatedProfile);
      setProfileData(updatedProfile);
      setEditingCareer(null);
      setIsEditCareerModalOpen(false);

      // 成功メッセージを表示（オプション）
      console.log("キャリア情報を更新しました");
    } catch (error) {
      console.error("キャリア更新エラー:", error);
      alert("キャリア情報の更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdatingCareer(false);
    }
  };

  // キャリア削除確認
  const handleDeleteCareerConfirm = (careerId: string) => {
    setDeletingCareerId(careerId);
    setIsDeleteConfirmOpen(true);
  };

  // キャリア削除
  const handleDeleteCareer = async () => {
    if (!deletingCareerId || !profileData) return;

    try {
      setIsUpdatingCareer(true);

      const updatedCareer = profileData.career.filter(
        (item) => item.id !== deletingCareerId,
      );
      const updatedProfile = { ...profileData, career: updatedCareer };

      await saveCareerToDatabase(updatedProfile);
      setProfileData(updatedProfile);
      setDeletingCareerId(null);
      setIsDeleteConfirmOpen(false);

      // 成功メッセージを表示（オプション）
      console.log("キャリア情報を削除しました");
    } catch (error) {
      console.error("キャリア削除エラー:", error);
      alert("キャリア情報の削除に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdatingCareer(false);
    }
  };

  // キャリアをデータベースに保存
  const saveCareerToDatabase = async (updatedProfile: ProfileData) => {
    if (!user) throw new Error("認証が必要です");

    const { supabase } = await import("@/lib/supabase");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        userId: user.id,
        career: updatedProfile.career,
      }),
    });

    if (!response.ok) {
      throw new Error("キャリア情報の保存に失敗しました");
    }
  };

  // 自己紹介更新
  const handleUpdateIntroduction = async (introduction: string) => {
    if (!profileData) return;

    try {
      setIsUpdatingIntroduction(true);

      const updatedProfile = { ...profileData, introduction };

      await saveIntroductionToDatabase(updatedProfile);
      setProfileData(updatedProfile);
      setIsIntroductionModalOpen(false);

      // 成功メッセージを表示（オプション）
      console.log("自己紹介を更新しました");
    } catch (error) {
      console.error("自己紹介更新エラー:", error);
      alert("自己紹介の更新に失敗しました。もう一度お試しください。");
    } finally {
      setIsUpdatingIntroduction(false);
    }
  };

  // 自己紹介をデータベースに保存
  const saveIntroductionToDatabase = async (updatedProfile: ProfileData) => {
    if (!user) throw new Error("認証が必要です");

    const { supabase } = await import("@/lib/supabase");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        userId: user.id,
        introduction: updatedProfile.introduction,
      }),
    });

    if (!response.ok) {
      throw new Error("自己紹介の保存に失敗しました");
    }
  };

  // プロフィール情報から表示用データを取得
  const displayName = profileData?.displayName || "ユーザー";
  const title = profileData?.title || "";
  const bio = profileData?.bio || "";
  const location = profileData?.location || "";
  const websiteUrl = profileData?.websiteUrl || "";
  const skills = profileData?.skills || [];
  const career = profileData?.career || [];
  const hasCustomBackground = !!profileData?.backgroundImageUrl;
  const backgroundImageUrl = profileData?.backgroundImageUrl || "";
  const hasCustomAvatar = !!profileData?.avatarImageUrl;
  const avatarImageUrl = profileData?.avatarImageUrl || "";

  const slug = profileData?.slug || "";
  const isProfileEmpty = !bio && skills.length === 0 && career.length === 0;

  // --- AI分析 強み集計 (詳細分析) - useMemoでメモ化（パフォーマンス改善） ---
  const strengthsAnalysis = useMemo(() => {
    if (!savedWorks || savedWorks.length === 0) {
      return {
        strengths: [],
        jobMatchingHints: [],
      };
    }
    return analyzeStrengthsFromWorks(savedWorks);
  }, [savedWorks]);

  if (!profileData) {
    return <ProfileLoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <main className="w-full">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row w-full">
          {/* 左サイドバー - ナビゲーションのみ */}
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-0 h-screen bg-white border-r border-gray-200">
              <div className="flex flex-col h-full">
                {/* ナビゲーションセクション */}
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  <nav className="space-y-1">
                    {[
                      {
                        key: "profile" as const,
                        label: "プロフィール",
                        icon: (
                          <svg
                            className="w-5 h-5"
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
                        key: "works" as const,
                        label: "作品",
                        icon: (
                          <svg
                            className="w-5 h-5"
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
                        key: "details" as const,
                        label: "クリエイター詳細",
                        icon: (
                          <svg
                            className="w-5 h-5"
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
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.key
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツエリア */}
          <div className="flex-1 min-w-0 bg-gray-50 flex flex-col">
            {/* デスクトップ用ヘッダー */}
            <div className="hidden lg:block flex-shrink-0 border-b border-gray-200 bg-white px-8 py-6">
              <div className="mb-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {activeTab === "profile"
                    ? "プロフィール"
                    : activeTab === "works"
                      ? "マイダッシュボード"
                      : "クリエイター詳細"}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeTab === "profile"
                    ? "あなたの経験とスキル"
                    : activeTab === "works"
                      ? "あなたの専門性とパフォーマンス"
                      : "あなたの専門性とパフォーマンス"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 lg:py-8">
              {/* プロフィールタブの時のみプロフィールヘッダーと統計カードを表示 */}
              {activeTab === "profile" && (
                <>
                  {/* デスクトップ用: プロフィールヘッダーと統計カード */}
                  <div className="hidden lg:block space-y-6 mt-6 mb-8">
                    <ProfileHeader
                      displayName={displayName}
                      title={title}
                      bio={bio}
                      location={location}
                      websiteUrl={websiteUrl}
                      backgroundImageUrl={backgroundImageUrl}
                      avatarImageUrl={avatarImageUrl}
                      isProfileEmpty={isProfileEmpty}
                      hasCustomBackground={hasCustomBackground}
                      hasCustomAvatar={hasCustomAvatar}
                      userId={user?.id}
                      slug={slug}
                      portfolioVisibility={profileData?.portfolioVisibility}
                    />
                    <ProfileStatsCards
                      worksCount={savedWorks.length}
                      skillsCount={profileData?.skills?.length || 0}
                      careerCount={profileData?.career?.length || 0}
                      followerCount={followerCount}
                    />
                  </div>

                  {/* モバイル・タブレット用: プロフィールヘッダーと統計カード */}
                  <div className="lg:hidden space-y-6 mb-6">
                    <ProfileHeader
                      displayName={displayName}
                      title={title}
                      bio={bio}
                      location={location}
                      websiteUrl={websiteUrl}
                      backgroundImageUrl={backgroundImageUrl}
                      avatarImageUrl={avatarImageUrl}
                      isProfileEmpty={isProfileEmpty}
                      hasCustomBackground={hasCustomBackground}
                      hasCustomAvatar={hasCustomAvatar}
                      userId={user?.id}
                      slug={slug}
                      portfolioVisibility={profileData?.portfolioVisibility}
                    />
                    <ProfileStatsCards
                      worksCount={savedWorks.length}
                      skillsCount={profileData?.skills?.length || 0}
                      careerCount={profileData?.career?.length || 0}
                      followerCount={followerCount}
                    />
                  </div>
                </>
              )}

              {/* タブコンテンツ */}
              <div>
                <ProfileTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  profileData={profileData}
                  savedWorks={savedWorks}
                  setSavedWorks={setSavedWorks}
                  deleteWork={deleteWork}
                  onAddSkill={() => setIsSkillModalOpen(true)}
                  onRemoveSkill={handleRemoveSkill}
                  setIsSkillModalOpen={setIsSkillModalOpen}
                  onEditCareer={handleEditCareer}
                  onDeleteCareerConfirm={handleDeleteCareerConfirm}
                  setIsCareerModalOpen={setIsCareerModalOpen}
                  onUpdateIntroduction={handleUpdateIntroduction}
                  setIsIntroductionModalOpen={setIsIntroductionModalOpen}
                  strengthsAnalysis={strengthsAnalysis}
                  getTabsInfo={setTabsInfo}
                />
              </div>
            </div>
          </div>
        </div>

        {/* モーダル群 */}
        <ProfileModals
          isSkillModalOpen={isSkillModalOpen}
          setIsSkillModalOpen={setIsSkillModalOpen}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          onAddSkill={handleAddSkill}
          isUpdatingSkills={isUpdatingSkills}
          skillError={skillError}
          setSkillError={setSkillError}
          isIntroductionModalOpen={isIntroductionModalOpen}
          setIsIntroductionModalOpen={setIsIntroductionModalOpen}
          currentIntroduction={currentIntroduction}
          setCurrentIntroduction={setCurrentIntroduction}
          isUpdatingIntroduction={isUpdatingIntroduction}
          onUpdateIntroduction={handleUpdateIntroduction}
          isCareerModalOpen={isCareerModalOpen}
          setIsCareerModalOpen={setIsCareerModalOpen}
          newCareer={newCareer}
          setNewCareer={setNewCareer}
          onAddCareer={handleAddCareer}
          isEditCareerModalOpen={isEditCareerModalOpen}
          setIsEditCareerModalOpen={setIsEditCareerModalOpen}
          editingCareer={editingCareer}
          setEditingCareer={setEditingCareer}
          onUpdateCareer={handleUpdateCareer}
          isDeleteConfirmOpen={isDeleteConfirmOpen}
          setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
          deletingCareerId={deletingCareerId}
          setDeletingCareerId={setDeletingCareerId}
          onDeleteCareer={handleDeleteCareer}
          isUpdatingCareer={isUpdatingCareer}
        />
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AuthenticatedLayout>
        <Suspense fallback={<ProfileLoadingFallback />}>
          <ProfileContent />
        </Suspense>
      </AuthenticatedLayout>
    </ProtectedRoute>
  );
}
