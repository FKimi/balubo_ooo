'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ProfileData, CareerItem } from '@/types/profile'
import type { InputData, InputAnalysis } from '@/types/input'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'
import { ProfileTabs } from '@/features/profile/components/ProfileTabs'
import { ProfileModals } from '@/features/profile/components/ProfileModals'

// 完全なデフォルトプロフィールデータ
const completeDefaultProfileData: ProfileData = {
  displayName: '',
  bio: '',
  introduction: '',
  professions: [],
  skills: [],
  location: '',
  websiteUrl: '',
  portfolioVisibility: 'public',
  backgroundImageUrl: '',
  avatarImageUrl: '',
  desiredRate: '',
  jobChangeIntention: 'not_considering',
  sideJobIntention: 'not_considering',
  projectRecruitmentStatus: 'not_recruiting',
  workingHours: '',
  career: []
}

function ProfileLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">プロフィールを読み込んでいます...</p>
      </div>
    </div>
  )
}

function ProfileContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'works' | 'inputs'>('profile')
  
  // スキル管理用のstate
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [isUpdatingSkills, setIsUpdatingSkills] = useState(false)
  const [skillError, setSkillError] = useState<string | null>(null)
  
  // 自己紹介管理用のstate
  const [isIntroductionModalOpen, setIsIntroductionModalOpen] = useState(false)
  const [currentIntroduction, setCurrentIntroduction] = useState('')
  const [isUpdatingIntroduction, setIsUpdatingIntroduction] = useState(false)

  // 自己紹介モーダルが開かれた時に現在の内容を設定
  useEffect(() => {
    if (isIntroductionModalOpen && profileData?.introduction) {
      setCurrentIntroduction(profileData.introduction)
    } else if (isIntroductionModalOpen) {
      setCurrentIntroduction('')
    }
  }, [isIntroductionModalOpen, profileData?.introduction])
  
  // キャリア管理用のstate
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false)
  const [newCareer, setNewCareer] = useState<Partial<CareerItem>>({
    company: '',
    position: '',
    department: '',
    startDate: '',
    endDate: '',
    description: '',
    isCurrent: false
  })
  
  // キャリア編集・削除用のstate
  const [isEditCareerModalOpen, setIsEditCareerModalOpen] = useState(false)
  const [editingCareer, setEditingCareer] = useState<CareerItem | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deletingCareerId, setDeletingCareerId] = useState<string | null>(null)
  const [isUpdatingCareer, setIsUpdatingCareer] = useState(false)
  
  const [savedWorks, setSavedWorks] = useState<any[]>([])
  const [isLoadingWorks, setIsLoadingWorks] = useState(false)
  
  // インプット関連のstate
  const [inputs, setInputs] = useState<InputData[]>([])
  const [inputAnalysis, setInputAnalysis] = useState<InputAnalysis | null>(null)
  const [isLoadingInputs, setIsLoadingInputs] = useState(false)

  // クエリパラメータからタブを設定
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['profile', 'works', 'inputs'].includes(tabParam)) {
      setActiveTab(tabParam as 'profile' | 'works' | 'inputs')
    }
  }, [searchParams])

  // 作品削除
  const deleteWork = useCallback(async (workId: string) => {
    if (!user?.id) return

    try {
      // Supabaseからアクセストークンを取得
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch(`/api/works/${workId}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ userId: user.id })
      })

      if (!response.ok) {
        throw new Error('作品削除エラー')
      }

      // 削除成功後、作品一覧を再取得
      const worksResponse = await fetch(`/api/works?userId=${user.id}`, { headers })
      if (worksResponse.ok) {
        const worksData = await worksResponse.json()
        setSavedWorks(worksData.works || [])
      }
    } catch (error) {
      console.error('作品削除エラー:', error)
    }
  }, [user?.id])

  // 初期データ読み込み
  useEffect(() => {
    if (!user?.id) return

    const loadAllData = async () => {
      // ローディング状態を設定
      setIsLoadingWorks(true)
      setIsLoadingInputs(true)
      
      try {
        // プロフィールデータの取得
        const { supabase } = await import('@/lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        }
        
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        // 並列でデータを取得
        const [profileResponse, worksResponse, inputsResponse, analysisResponse] = await Promise.all([
          fetch(`/api/profile?userId=${user.id}`, { headers }),
          fetch(`/api/works?userId=${user.id}`, { headers }),
          fetch(`/api/inputs?userId=${user.id}`, { headers }),
          fetch(`/api/inputs/analysis?userId=${user.id}`, { headers })
        ])

        // プロフィールデータの処理
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          if (profileData.profile) {
            const convertedProfile = {
              ...completeDefaultProfileData,
              displayName: profileData.profile.display_name || profileData.profile.displayName || '',
              bio: profileData.profile.bio || '',
              introduction: profileData.profile.introduction || '',
              professions: profileData.profile.professions || [],
              skills: profileData.profile.skills || [],
              location: profileData.profile.location || '',
              websiteUrl: profileData.profile.website_url || profileData.profile.websiteUrl || '',
              slug: profileData.profile.slug || '',
              portfolioVisibility: profileData.profile.portfolio_visibility || profileData.profile.portfolioVisibility || 'public',
              backgroundImageUrl: profileData.profile.background_image_url || profileData.profile.backgroundImageUrl || '',
              avatarImageUrl: profileData.profile.avatar_image_url || profileData.profile.avatarImageUrl || '',
              desiredRate: profileData.profile.desired_rate || profileData.profile.desiredRate || '',
              jobChangeIntention: profileData.profile.job_change_intention || profileData.profile.jobChangeIntention || 'not_considering',
              sideJobIntention: profileData.profile.side_job_intention || profileData.profile.sideJobIntention || 'not_considering',
              projectRecruitmentStatus: profileData.profile.project_recruitment_status || profileData.profile.projectRecruitmentStatus || 'not_recruiting',
              workingHours: profileData.profile.working_hours || profileData.profile.workingHours || '',
              career: profileData.profile.career || []
            }
            setProfileData(convertedProfile)
          } else {
            setProfileData(completeDefaultProfileData)
          }
        } else {
          setProfileData(completeDefaultProfileData)
        }

        // 作品データの処理
        if (worksResponse.ok) {
          const worksData = await worksResponse.json()
          setSavedWorks(worksData.works || [])
        } else {
          setSavedWorks([])
        }

        // インプットデータの処理
        if (inputsResponse.ok) {
          const inputsData = await inputsResponse.json()
          setInputs(inputsData.inputs || [])
        } else {
          setInputs([])
        }

        // 分析データの処理
        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json()
          setInputAnalysis(analysisData.analysis || null)
        } else {
          setInputAnalysis(null)
        }

      } catch (error) {
        console.error('データ読み込みエラー:', error)
        setProfileData(completeDefaultProfileData)
        setSavedWorks([])
        setInputs([])
        setInputAnalysis(null)
      } finally {
        setIsLoadingWorks(false)
        setIsLoadingInputs(false)
      }
    }

    loadAllData()
  }, [user?.id])

  // タブ変更時のURL更新
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('tab', activeTab)
    window.history.replaceState({}, '', url.toString())
  }, [activeTab])

  // スキル追加
  const handleAddSkill = async () => {
    if (!newSkill.trim() || !profileData) return

    try {
      setIsUpdatingSkills(true)
      setSkillError(null)
      
      const updatedSkills = [...profileData.skills, newSkill.trim()]
      const updatedProfile = { ...profileData, skills: updatedSkills }
      
      await saveSkillsToDatabase(updatedProfile)
      setProfileData(updatedProfile)
      setNewSkill('')
      setIsSkillModalOpen(false)
      
      // 成功メッセージを表示（オプション）
      console.log('スキルを追加しました')
    } catch (error) {
      console.error('スキル追加エラー:', error)
      setSkillError('スキルの追加に失敗しました。もう一度お試しください。')
    } finally {
      setIsUpdatingSkills(false)
    }
  }

  // スキル削除
  const handleRemoveSkill = async (index: number) => {
    if (!profileData) return

    try {
      setIsUpdatingSkills(true)
      setSkillError(null)
      
      const updatedSkills = profileData.skills.filter((_, i) => i !== index)
      const updatedProfile = { ...profileData, skills: updatedSkills }
      
      await saveSkillsToDatabase(updatedProfile)
      setProfileData(updatedProfile)
      
      // 成功メッセージを表示（オプション）
      console.log('スキルを削除しました')
    } catch (error) {
      console.error('スキル削除エラー:', error)
      setSkillError('スキルの削除に失敗しました。もう一度お試しください。')
    } finally {
      setIsUpdatingSkills(false)
    }
  }

  // スキルをデータベースに保存
  const saveSkillsToDatabase = async (updatedProfile: ProfileData) => {
    if (!user) throw new Error('認証が必要です')

    const { supabase } = await import('@/lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        userId: user.id,
        skills: updatedProfile.skills
      })
    })

    if (!response.ok) {
      throw new Error('スキルの保存に失敗しました')
    }
  }

  // キャリア追加
  const handleAddCareer = async () => {
    if (!newCareer.company || !newCareer.position || !profileData) return

    try {
      setIsUpdatingCareer(true)
      
      const careerItem: CareerItem = {
        id: Date.now().toString(),
        company: newCareer.company || '',
        position: newCareer.position || '',
        department: newCareer.department || '',
        startDate: newCareer.startDate || '',
        endDate: newCareer.isCurrent ? '' : (newCareer.endDate || ''),
        description: newCareer.description || '',
        isCurrent: newCareer.isCurrent || false
      }
      
      const updatedCareer = [...profileData.career, careerItem]
      const updatedProfile = { ...profileData, career: updatedCareer }
      
      await saveCareerToDatabase(updatedProfile)
      setProfileData(updatedProfile)
      setNewCareer({
        company: '',
        position: '',
        department: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrent: false
      })
      setIsCareerModalOpen(false)
      
      // 成功メッセージを表示（オプション）
      console.log('キャリア情報を追加しました')
    } catch (error) {
      console.error('キャリア追加エラー:', error)
      alert('キャリア情報の追加に失敗しました。もう一度お試しください。')
    } finally {
      setIsUpdatingCareer(false)
    }
  }

  // キャリア編集
  const handleEditCareer = (careerItem: CareerItem) => {
    setEditingCareer(careerItem)
    setIsEditCareerModalOpen(true)
  }

  // キャリア更新
  const handleUpdateCareer = async () => {
    if (!editingCareer || !profileData) return

    try {
      setIsUpdatingCareer(true)
      
      const updatedCareer = profileData.career.map(item =>
        item.id === editingCareer.id ? editingCareer : item
      )
      const updatedProfile = { ...profileData, career: updatedCareer }
      
      await saveCareerToDatabase(updatedProfile)
      setProfileData(updatedProfile)
      setEditingCareer(null)
      setIsEditCareerModalOpen(false)
      
      // 成功メッセージを表示（オプション）
      console.log('キャリア情報を更新しました')
    } catch (error) {
      console.error('キャリア更新エラー:', error)
      alert('キャリア情報の更新に失敗しました。もう一度お試しください。')
    } finally {
      setIsUpdatingCareer(false)
    }
  }

  // キャリア削除確認
  const handleDeleteCareerConfirm = (careerId: string) => {
    setDeletingCareerId(careerId)
    setIsDeleteConfirmOpen(true)
  }

  // キャリア削除
  const handleDeleteCareer = async () => {
    if (!deletingCareerId || !profileData) return

    try {
      setIsUpdatingCareer(true)
      
      const updatedCareer = profileData.career.filter(item => item.id !== deletingCareerId)
      const updatedProfile = { ...profileData, career: updatedCareer }
      
      await saveCareerToDatabase(updatedProfile)
      setProfileData(updatedProfile)
      setDeletingCareerId(null)
      setIsDeleteConfirmOpen(false)
      
      // 成功メッセージを表示（オプション）
      console.log('キャリア情報を削除しました')
    } catch (error) {
      console.error('キャリア削除エラー:', error)
      alert('キャリア情報の削除に失敗しました。もう一度お試しください。')
    } finally {
      setIsUpdatingCareer(false)
    }
  }

  // キャリアをデータベースに保存
  const saveCareerToDatabase = async (updatedProfile: ProfileData) => {
    if (!user) throw new Error('認証が必要です')

    const { supabase } = await import('@/lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        userId: user.id,
        career: updatedProfile.career
      })
    })

    if (!response.ok) {
      throw new Error('キャリア情報の保存に失敗しました')
    }
  }

  // 自己紹介更新
  const handleUpdateIntroduction = async (introduction: string) => {
    if (!profileData) return

    try {
      setIsUpdatingIntroduction(true)
      
      const updatedProfile = { ...profileData, introduction }
      
      await saveIntroductionToDatabase(updatedProfile)
      setProfileData(updatedProfile)
      setIsIntroductionModalOpen(false)
      
      // 成功メッセージを表示（オプション）
      console.log('自己紹介を更新しました')
    } catch (error) {
      console.error('自己紹介更新エラー:', error)
      alert('自己紹介の更新に失敗しました。もう一度お試しください。')
    } finally {
      setIsUpdatingIntroduction(false)
    }
  }

  // 自己紹介をデータベースに保存
  const saveIntroductionToDatabase = async (updatedProfile: ProfileData) => {
    if (!user) throw new Error('認証が必要です')

    const { supabase } = await import('@/lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        userId: user.id,
        introduction: updatedProfile.introduction
      })
    })

    if (!response.ok) {
      throw new Error('自己紹介の保存に失敗しました')
    }
  }

  if (!profileData) {
    return <ProfileLoadingFallback />
  }

  // プロフィール情報から表示用データを取得
  const displayName = profileData?.displayName || 'ユーザー'
  const bio = profileData?.bio || ''
  const location = profileData?.location || ''
  const websiteUrl = profileData?.websiteUrl || ''
  const skills = profileData?.skills || []
  const career = profileData?.career || []
  const hasCustomBackground = !!(profileData?.backgroundImageUrl)
  const backgroundImageUrl = profileData?.backgroundImageUrl || ''
  const hasCustomAvatar = !!(profileData?.avatarImageUrl)
  const avatarImageUrl = profileData?.avatarImageUrl || ''
  const slug = profileData?.slug || ''
  const isProfileEmpty = !bio && skills.length === 0 && career.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* プロフィールヘッダー */}
          <ProfileHeader
            displayName={displayName}
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
          
          {/* タブコンテンツ */}
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            profileData={profileData}
            savedWorks={savedWorks}
            setSavedWorks={setSavedWorks}
            inputs={inputs}
            inputAnalysis={inputAnalysis}
            isLoadingInputs={isLoadingInputs}
            deleteWork={deleteWork}
            onAddSkill={() => setIsSkillModalOpen(true)}
            onRemoveSkill={handleRemoveSkill}
            setIsSkillModalOpen={setIsSkillModalOpen}
            onEditCareer={handleEditCareer}
            onDeleteCareerConfirm={handleDeleteCareerConfirm}
            setIsCareerModalOpen={setIsCareerModalOpen}
            onUpdateIntroduction={handleUpdateIntroduction}
            setIsIntroductionModalOpen={setIsIntroductionModalOpen}
          />
          
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
        </div>
      </main>
    </div>
  )
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
  )
}