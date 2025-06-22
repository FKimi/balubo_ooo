/* eslint-disable react-hooks/exhaustive-deps */
import { fetcher } from '@/utils/fetcher'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export interface Profile {
  user_id: string
  display_name: string
  bio: string
  professions: string[]
  skills: string[]
  location: string
  website_url: string
  portfolio_visibility: 'public' | 'connections_only' | 'private'
  background_image_url: string
  avatar_image_url: string
  desired_rate: string
  job_change_intention: string
  side_job_intention: string
  project_recruitment_status: string
  experience_years: number | null
  working_hours: string
  career: any[]
  created_at: string
  updated_at: string
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await fetcher<{ profile: Profile }>('/api/profile')
      setProfile(data.profile)
    } catch (err) {
      console.error('プロフィール取得エラー:', err)
      setError(err instanceof Error ? err.message : 'プロフィール取得でエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user?.id]) // user.idの変更時のみ実行

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile
  }
} 