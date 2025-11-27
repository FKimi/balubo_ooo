"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfileData, CareerItem, InputData } from "@/features/profile/types";
// import type { InputAnalysis } from '@/types/input'
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileTabs } from "@/features/profile/components/ProfileTabs";
import { ProfileModals } from "@/features/profile/components/ProfileModals";
import { analyzeStrengthsFromWorks } from "@/features/profile/lib/profileUtils";
import { ProfileSkeleton } from "@/features/profile/components/ProfileSkeleton";
import { useToast } from "@/components/ui/toast";

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
    <div className="min-h-screen bg-white flex items-center justify-center fade-in">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <div className="loading-spin rounded-full h-12 w-12 border-3 border-blue-100 border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-blue-200 opacity-20"></div>
        </div>
        <p className="text-gray-600 font-medium">プロフィールを読み込んでいます...</p>
      </div>
    </div>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
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

  // 保存中の状態管理
  const [isSaving, setIsSaving] = useState(false);

  // スキル管理用のstate
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [skillError, setSkillError] = useState<string | null>(null);

  // 自己紹介管理用のstate
  const [isIntroductionModalOpen, setIsIntroductionModalOpen] = useState(false);
  const [currentIntroduction, setCurrentIntroduction] = useState("");

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

  const [savedWorks, setSavedWorks] = useState<any[]>([]);
  const [_isLoadingWorks, setIsLoadingWorks] = useState(false);

  // インプット関連のstate
  const [inputs, setInputs] = useState<InputData[]>([]);
  // const [_inputAnalysis, _setInputAnalysis] = useState<InputAnalysis | null>(null)
  const [_isLoadingInputs, _setIsLoadingInputs] = useState(false);

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
        const [profileResponse, worksResponse, inputsResponse] = await Promise.all([
          fetch(`/api/profile`, { headers }),
          fetch(`/api/works?userId=${user.id}`, { headers }),
          fetch(`/api/inputs?userId=${user.id}`, { headers }),
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

        // インプットデータの処理
        if (inputsResponse.ok) {
          const inputsData = await inputsResponse.json();
          // APIのレスポンス形式に合わせて調整 (inputsData.inputs または inputsData が配列)
          const sortedInputs = (inputsData.inputs || inputsData || []).sort((a: any, b: any) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          });
          setInputs(sortedInputs);
        } else {
          setInputs([]);
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
    if (!newSkill.trim() || !profileData || isSaving) return;

    console.log("[Profile] スキル追加開始:", newSkill.trim());
    const skillToAdd = newSkill.trim();
    const previousProfileData = { ...profileData };
    const updatedSkills = [...profileData.skills, skillToAdd];
    const updatedProfile = { ...profileData, skills: updatedSkills };

    // 1. 楽観的更新: UIを即座に更新し、モーダルを閉じる
    setProfileData(updatedProfile);
    setNewSkill("");
    setIsSkillModalOpen(false);
    setIsSaving(true);

    try {
      // 2. バックグラウンドでAPI呼び出し
      await saveSkillsToDatabase(updatedProfile);
      console.log("[Profile] スキル追加成功:", skillToAdd);
      showToast("スキルを追加しました", "success");
    } catch (error) {
      console.error("[Profile] スキル追加エラー:", error);
      // 3. エラー時はロールバック
      setProfileData(previousProfileData);
      setSkillError("スキルの追加に失敗しました。");
      showToast(
        `スキルの追加に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // スキル削除
  const handleRemoveSkill = async (index: number) => {
    if (!profileData || isSaving) return;

    console.log("[Profile] スキル削除開始:", profileData.skills[index]);
    const previousProfileData = { ...profileData };
    const removedSkill = profileData.skills[index];
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    const updatedProfile = { ...profileData, skills: updatedSkills };

    // 1. 楽観的更新
    setProfileData(updatedProfile);
    setIsSaving(true);

    try {
      // 2. バックグラウンドでAPI呼び出し
      await saveSkillsToDatabase(updatedProfile);
      console.log("[Profile] スキル削除成功:", removedSkill);
      showToast("スキルを削除しました", "success");
    } catch (error) {
      console.error("[Profile] スキル削除エラー:", error);
      // 3. エラー時はロールバック
      setProfileData(previousProfileData);
      showToast(
        `スキルの削除に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // セッショントークンを取得するヘルパー関数
  const getAuthHeaders = async () => {
    if (!user) throw new Error("認証が必要です");

    const { supabase } = await import("@/lib/supabase");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("[Profile] セッション取得エラー:", sessionError);
      throw new Error(`セッションの取得に失敗しました: ${sessionError.message}`);
    }

    if (!session?.access_token) {
      throw new Error("認証トークンが見つかりません。再ログインしてください。");
    }

    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    };
  };

  // スキルをデータベースに保存
  const saveSkillsToDatabase = async (updatedProfile: ProfileData) => {
    console.log("[Profile] スキル保存API呼び出し開始");
    const headers = await getAuthHeaders();

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        userId: user!.id,
        skills: updatedProfile.skills,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Profile] スキル保存APIエラー:", errorText);
      throw new Error(`スキルの保存に失敗しました (${response.status}): ${errorText}`);
    }

    console.log("[Profile] スキル保存API成功");
  };

  // キャリア追加
  const handleAddCareer = async () => {
    if (!newCareer.company || !newCareer.position || !profileData || isSaving) return;

    console.log("[Profile] キャリア追加開始:", newCareer);
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

    const previousProfileData = { ...profileData };
    const updatedCareer = [...profileData.career, careerItem];
    const updatedProfile = { ...profileData, career: updatedCareer };

    // 1. 楽観的更新
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
    setIsSaving(true);

    try {
      // 2. バックグラウンドでAPI呼び出し
      await saveCareerToDatabase(updatedProfile);
      console.log("[Profile] キャリア追加成功");
      showToast("キャリア情報を追加しました", "success");
    } catch (error) {
      console.error("[Profile] キャリア追加エラー:", error);
      // 3. エラー時はロールバック
      setProfileData(previousProfileData);
      showToast(
        `キャリア情報の追加に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // キャリア編集
  const handleEditCareer = (careerItem: CareerItem) => {
    setEditingCareer(careerItem);
    setIsEditCareerModalOpen(true);
  };

  // キャリア更新
  const handleUpdateCareer = async () => {
    if (!editingCareer || !profileData || isSaving) return;

    console.log("[Profile] キャリア更新開始:", editingCareer);
    const previousProfileData = { ...profileData };
    const updatedCareer = profileData.career.map((item) =>
      item.id === editingCareer.id ? editingCareer : item,
    );
    const updatedProfile = { ...profileData, career: updatedCareer };

    // 1. 楽観的更新
    setProfileData(updatedProfile);
    setEditingCareer(null);
    setIsEditCareerModalOpen(false);
    setIsSaving(true);

    try {
      // 2. バックグラウンドでAPI呼び出し
      await saveCareerToDatabase(updatedProfile);
      console.log("[Profile] キャリア更新成功");
      showToast("キャリア情報を更新しました", "success");
    } catch (error) {
      console.error("[Profile] キャリア更新エラー:", error);
      // 3. エラー時はロールバック
      setProfileData(previousProfileData);
      showToast(
        `キャリア情報の更新に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // キャリア削除確認
  const handleDeleteCareerConfirm = (careerId: string) => {
    setDeletingCareerId(careerId);
    setIsDeleteConfirmOpen(true);
  };

  // キャリア削除
  const handleDeleteCareer = async () => {
    if (!deletingCareerId || !profileData || isSaving) return;

    console.log("[Profile] キャリア削除開始:", deletingCareerId);
    const previousProfileData = { ...profileData };
    const updatedCareer = profileData.career.filter(
      (item) => item.id !== deletingCareerId,
    );
    const updatedProfile = { ...profileData, career: updatedCareer };

    // 1. 楽観的更新
    setProfileData(updatedProfile);
    setDeletingCareerId(null);
    setIsDeleteConfirmOpen(false);
    setIsSaving(true);

    try {
      // 2. バックグラウンドでAPI呼び出し
      await saveCareerToDatabase(updatedProfile);
      console.log("[Profile] キャリア削除成功");
      showToast("キャリア情報を削除しました", "success");
    } catch (error) {
      console.error("[Profile] キャリア削除エラー:", error);
      // 3. エラー時はロールバック
      setProfileData(previousProfileData);
      showToast(
        `キャリア情報の削除に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // キャリアをデータベースに保存
  const saveCareerToDatabase = async (updatedProfile: ProfileData) => {
    console.log("[Profile] キャリア保存API呼び出し開始");
    const headers = await getAuthHeaders();

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        userId: user!.id,
        career: updatedProfile.career,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Profile] キャリア保存APIエラー:", errorText);
      throw new Error(`キャリア情報の保存に失敗しました (${response.status}): ${errorText}`);
    }

    console.log("[Profile] キャリア保存API成功");
  };

  // 自己紹介更新
  const handleUpdateIntroduction = async (introduction: string) => {
    if (!profileData || isSaving) return;

    console.log("[Profile] 自己紹介更新開始");
    const previousProfileData = { ...profileData };
    const updatedProfile = { ...profileData, introduction };

    // 1. 楽観的更新
    setProfileData(updatedProfile);
    setIsIntroductionModalOpen(false);
    setIsSaving(true);

    try {
      // 2. バックグラウンドでAPI呼び出し
      await saveIntroductionToDatabase(updatedProfile);
      console.log("[Profile] 自己紹介更新成功");
      showToast("自己紹介を更新しました", "success");
    } catch (error) {
      console.error("[Profile] 自己紹介更新エラー:", error);
      // 3. エラー時はロールバック
      setProfileData(previousProfileData);
      showToast(
        `自己紹介の更新に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 自己紹介をデータベースに保存
  const saveIntroductionToDatabase = async (updatedProfile: ProfileData) => {
    console.log("[Profile] 自己紹介保存API呼び出し開始");
    const headers = await getAuthHeaders();

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        userId: user!.id,
        introduction: updatedProfile.introduction,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Profile] 自己紹介保存APIエラー:", errorText);
      throw new Error(`自己紹介の保存に失敗しました (${response.status}): ${errorText}`);
    }

    console.log("[Profile] 自己紹介保存API成功");
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

  // ローディング状態の管理
  const isLoading = !profileData || _isLoadingWorks;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF] w-full">
      <main className="w-full">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row w-full">

          {/* メインコンテンツエリア */}
          <div className="flex-1 min-w-0 bg-[#F4F7FF] flex flex-col">


            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 lg:py-8">
              {/* プロフィールタブの時のみプロフィールヘッダーと統計カードを表示 */}
              {activeTab === "profile" && (
                <>
                  {/* デスクトップ用: プロフィールヘッダー */}
                  <div className="hidden lg:block mt-6 mb-8">
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
                  </div>

                  {/* モバイル・タブレット用: プロフィールヘッダー */}
                  <div className="lg:hidden mb-6">
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
                  onRemoveSkill={handleRemoveSkill}
                  setIsSkillModalOpen={setIsSkillModalOpen}
                  onEditCareer={handleEditCareer}
                  onDeleteCareerConfirm={handleDeleteCareerConfirm}
                  setIsCareerModalOpen={setIsCareerModalOpen}
                  setIsIntroductionModalOpen={setIsIntroductionModalOpen}
                  strengthsAnalysis={strengthsAnalysis}
                  getTabsInfo={setTabsInfo}
                  inputs={inputs}
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
          skillError={skillError}
          setSkillError={setSkillError}
          isIntroductionModalOpen={isIntroductionModalOpen}
          setIsIntroductionModalOpen={setIsIntroductionModalOpen}
          currentIntroduction={currentIntroduction}
          setCurrentIntroduction={setCurrentIntroduction}
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
          isSaving={isSaving}
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
