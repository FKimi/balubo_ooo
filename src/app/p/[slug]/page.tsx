import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { PublicProfileContent } from '@/app/share/profile/[userId]/public-profile-content'
import { calculateInputTopTags, calculateGenreDistribution } from '@/utils/profileUtils'

async function getPublicProfileBySlug(slug: string) {
  // anon クライアントで公開プロフィールを取得
  const profileResponse = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .eq('portfolio_visibility', 'public')
    .single()

  let profile = profileResponse.data
  const error = profileResponse.error

  // anon で見つからない場合、Service Role で再試行（ローカルでも env があれば）
  if ((error || !profile) && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: profileAdmin } = await admin
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .single()
    profile = profileAdmin || null
  }

  if (!profile) return null

  const userId = profile.user_id as string

  // admin クライアントが使える場合は RLS をバイパスして取得
  const client = process.env.SUPABASE_SERVICE_ROLE_KEY ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  }) : supabase

  const { data: works } = await client
    .from('works')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const { data: inputs } = await client
    .from('inputs')
    .select(`
      id,
      title,
      author_creator,
      type,
      genres,
      status,
      rating,
      favorite,
      notes,
      tags,
      external_url,
      cover_image_url,
      created_at,
      updated_at
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  // インプット分析を計算
  let inputAnalysis = null
  if (inputs && inputs.length > 0) {
    console.log('[slug] インプット分析を計算中...', 'インプット数:', inputs.length)
    
    const totalInputs = inputs.length
    const favoriteCount = inputs.filter((input: any) => input.favorite).length
    const averageRating = totalInputs > 0
      ? inputs.reduce((sum: number, input: any) => sum + (input.rating || 0), 0) / totalInputs
      : 0

    const typeDistribution = inputs.reduce((acc: any, input: any) => {
      const type = input.type || '未分類'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const topGenres = calculateGenreDistribution(inputs).map(([name, count]) => ({ name, count }))
    const topTags = calculateInputTopTags(inputs).map(([tag, count]) => ({ tag, count }))

    inputAnalysis = {
      totalInputs,
      favoriteCount,
      averageRating,
      typeDistribution,
      genresDistribution,
      topGenres,
      topTags
    }
    
    console.log('[slug] インプット分析完了:', inputAnalysis)
    console.log('[slug] topTags詳細:', inputAnalysis.topTags)
  } else {
    console.log('[slug] インプット分析をスキップ:', 'inputs:', inputs, 'length:', inputs?.length)
  }

  return {
    profileExists: true,
    worksCount: works?.length || 0,
    inputsCount: inputs?.length || 0,
    profile,
    works: works || [],
    inputs: inputs || [],
    inputAnalysis
  }
}

export default async function PublicProfileSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getPublicProfileBySlug(slug)
  if (!data) notFound()
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div>読み込み中...</div>}>
        <PublicProfileContent data={data} userId={data.profile.user_id} />
      </Suspense>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getPublicProfileBySlug(slug)
  if (!data) {
    return { title: 'プロフィールが見つかりません' }
  }
  const { profile } = data
  const displayName = profile.display_name || 'ユーザー'
  const bio = profile.bio || ''
  return {
    title: `${displayName}のポートフォリオ`,
    description: bio || `${displayName}のクリエイターポートフォリオをご覧ください。`,
  }
} 