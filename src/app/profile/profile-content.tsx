'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ProfileData, CareerItem } from '@/types/profile'
import type { InputData, InputAnalysis } from '@/types/input'
import type { WorkData } from '@/types/work'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileModals } from '@/components/profile/ProfileModals'

// 完全なデフォルトプロフィールデータ
const completeDefaultProfileData: ProfileData = {
  displayName: '',
  bio: '',
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

export default function ProfileContent() {
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

  // プロフィールデータの取得
  const fetchProfileData = async () => {
    if (!user) return

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

      const response = await fetch(`/api/profile?userId=${user.id}`, {
        headers
      })
      
      if (!response.ok) {
        throw new Error('プロフィール取得エラー')
      }
      
      const data = await response.json()
      console.log('プロフィールAPI応答:', data)
      
      if (data.profile) {
        // データベースのsnake_caseフィールドをcamelCaseに変換
        const convertedProfile = {
          ...completeDefaultProfileData,
          displayName: data.profile.display_name || data.profile.displayName || '',
          bio: data.profile.bio || '',
          professions: data.profile.professions || [],
          skills: data.profile.skills || [],
          location: data.profile.location || '',
          websiteUrl: data.profile.website_url || data.profile.websiteUrl || '',
          portfolioVisibility: data.profile.portfolio_visibility || data.profile.portfolioVisibility || 'public',
          backgroundImageUrl: data.profile.background_image_url || data.profile.backgroundImageUrl || '',
          avatarImageUrl: data.profile.avatar_image_url || data.profile.avatarImageUrl || '',
          desiredRate: data.profile.desired_rate || data.profile.desiredRate || '',
          jobChangeIntention: data.profile.job_change_intention || data.profile.jobChangeIntention || 'not_considering',
          sideJobIntention: data.profile.side_job_intention || data.profile.sideJobIntention || 'not_considering',
          projectRecruitmentStatus: data.profile.project_recruitment_status || data.profile.projectRecruitmentStatus || 'not_recruiting',
          workingHours: data.profile.working_hours || data.profile.workingHours || '',
          career: data.profile.career || []
        }
        
        setProfileData(convertedProfile)
        console.log('変換後プロフィールデータ設定完了:', convertedProfile) // デバッグログ追加
      } else {
        console.log('プロフィールデータが空、デフォルト値を設定')
        setProfileData(completeDefaultProfileData)
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error)
      setProfileData(completeDefaultProfileData)
    }
  }

  // 作品データの取得
  const fetchSavedWorks = async () => {
    if (!user) return

    setIsLoadingWorks(true)
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

      const response = await fetch(`/api/works?userId=${user.id}`, {
        headers
      })
      
      if (!response.ok) {
        throw new Error('作品取得エラー')
      }
      
      const data = await response.json()
      setSavedWorks(data.works || [])
    } catch (error) {
      console.error('作品取得エラー:', error)
      setSavedWorks([])
    } finally {
      setIsLoadingWorks(false)
    }
  }

  // 作品削除
  const deleteWork = async (workId: string) => {
    if (!user) return

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
      await fetchSavedWorks()
    } catch (error) {
      console.error('作品削除エラー:', error)
    }
  }

  // インプットデータの取得
  const fetchInputs = async () => {
    if (!user) return

    setIsLoadingInputs(true)
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

      const response = await fetch(`/api/inputs?userId=${user.id}`, {
        headers
      })
      
      if (!response.ok) {
        throw new Error('インプット取得エラー')
      }
      
      const data = await response.json()
      setInputs(data.inputs || [])
    } catch (error) {
      console.error('インプット取得エラー:', error)
      setInputs([])
    } finally {
      setIsLoadingInputs(false)
    }
  }

  // インプット分析の取得
  const fetchInputAnalysis = async () => {
    if (!user) return

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

      const response = await fetch(`/api/inputs/analysis?userId=${user.id}`, {
        headers
      })
      
      if (!response.ok) {
        throw new Error('インプット分析取得エラー')
      }
      
      const data = await response.json()
      setInputAnalysis(data.analysis || null)
    } catch (error) {
      console.error('インプット分析取得エラー:', error)
      setInputAnalysis(null)
    }
  }

  // 初期データ読み込み
  useEffect(() => {
    if (user) {
      const loadAllData = async () => {
        await Promise.all([
          fetchProfileData(),
          fetchSavedWorks(),
          fetchInputs(),
          fetchInputAnalysis()
        ])
      }
      loadAllData()
    }
  }, [user])

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
    } catch (error) {
      console.error('スキル追加エラー:', error)
      setSkillError('スキルの追加に失敗しました')
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
    } catch (error) {
      console.error('スキル削除エラー:', error)
      setSkillError('スキルの削除に失敗しました')
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
    } catch (error) {
      console.error('キャリア追加エラー:', error)
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
    } catch (error) {
      console.error('キャリア更新エラー:', error)
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
    } catch (error) {
      console.error('キャリア削除エラー:', error)
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

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">プロフィールを読み込んでいます...</p>
        </div>
      </div>
    )
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