import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { PublicProfileContent } from './public-profile-content'
import { calculateInputTopTags, calculateGenreDistribution } from '@/features/profile/lib/profileUtils'
import { InputData } from '@/types/input'

async function getPublicProfile(userId: string) {
  console.log('公開プロフィール取得開始:', userId)
  
  // Service Role Keyの存在確認
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
    return null
  }
  
  // サーバーサイドアクセス用のSupabaseクライアント（Service Role Key使用してRLSをバイパス）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase環境変数が設定されていません')
    return null
  }
  
  const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  
  console.log('Supabase設定状況:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    isConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
  })
  
  try {
    // プロフィール情報を取得（user_idで検索）
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('portfolio_visibility', 'public')
      .single()

    console.log('プロフィール取得結果:', {
      profileExists: !!profile,
      error: profileError,
      profile: profile ? {
        displayName: profile.display_name,
        visibility: profile.portfolio_visibility
      } : null
    })

    if (profileError || !profile) {
      console.log('プロフィールが見つからない、または非公開:', { profileError, hasProfile: !!profile })
      return null
    }

    console.log('公開プロフィール確認OK、作品・インプットデータを取得中...')

    // Service Role Keyを使用して作品データを取得（RLSバイパス）
    // 注意：Service Role Keyは管理者権限を持ち、RLSを自動的にバイパスします
    const { data: works, error: worksError } = await supabase
      .from('works')
      .select(`
        id,
        title,
        description,
        roles,
        external_url,
        tags,
        categories,
        production_date,
        banner_image_url,
        thumbnail_url,
        preview_data,
        ai_analysis_result,
        content_type,
        article_word_count,
        is_featured,
        featured_order,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .order('featured_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (worksError) {
      console.error('作品取得エラー詳細:', {
        message: worksError.message,
        details: worksError.details,
        hint: worksError.hint,
        code: worksError.code
      })
    }

    console.log('作品取得結果:', { 
      worksCount: works?.length || 0, 
      error: worksError,
      works: works,
      errorMessage: worksError?.message,
      errorDetails: worksError?.details 
    })

    // Service Role Keyを使用してインプットデータを取得（RLSバイパス）  
    const { data: inputs, error: inputsError } = await supabase
      .from('inputs')
      .select(`
        id,
        user_id,
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

    if (inputsError) {
      console.error('インプット取得エラー詳細:', {
        message: inputsError.message,
        details: inputsError.details,
        hint: inputsError.hint,
        code: inputsError.code
      })
    }

    console.log('インプット取得結果:', { 
      inputsCount: inputs?.length || 0, 
      error: inputsError,
      inputs: inputs,
      errorMessage: inputsError?.message,
      errorDetails: inputsError?.details 
    })



    // インプット分析を計算
    let inputAnalysis = null
    if (inputs && inputs.length > 0) {
      // データベースから取得したデータを InputData 型に変換
      const mappedInputs: InputData[] = inputs.map(item => ({
        id: item.id,
        title: item.title,
        authorCreator: item.author_creator,
        type: item.type,
        genres: item.genres,
        status: item.status,
        rating: item.rating,
        favorite: item.favorite,
        notes: item.notes,
        tags: item.tags,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        userId: userId,
        review: '',
        externalUrl: item.external_url,
        coverImageUrl: item.cover_image_url,
      }))
      
      const totalInputs = mappedInputs.length
      const favoriteCount = mappedInputs.filter((input: InputData) => input.favorite).length
      const averageRating = totalInputs > 0
        ? mappedInputs.reduce((sum: number, input: InputData) => sum + (input.rating || 0), 0) / totalInputs
        : 0

      const typeDistribution = mappedInputs.reduce((acc: any, input: InputData) => {
        const type = input.type || '未分類'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})

      // ジャンル分布を計算
      const genresDistribution = mappedInputs.reduce((acc: any, input: InputData) => {
        if (input.genres) {
          input.genres.forEach(genre => {
            acc[genre] = (acc[genre] || 0) + 1
          })
        }
        return acc
      }, {})

      const topGenres = calculateGenreDistribution(mappedInputs).map(([name, count]) => ({ name, count }))
      const topTags = calculateInputTopTags(mappedInputs).map(([tag, count]) => ({ tag, count }))

      inputAnalysis = {
        totalInputs,
        favoriteCount,
        averageRating,
        typeDistribution,
        genresDistribution,
        topGenres,
        topTags
      }
      
    }

    const result = {
      profileExists: true,
      worksCount: works?.length || 0,
      inputsCount: inputs?.length || 0,
      profile,
      works: works || [],
      inputs: inputs || [],
      inputAnalysis
    }

    console.log('公開プロフィール取得完了:', result)
    return result

  } catch (error) {
    console.error('公開プロフィール取得エラー:', error)
    return null
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const data = await getPublicProfile(userId)
  
  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div>読み込み中...</div>}>
        <PublicProfileContent data={data} userId={userId} />
      </Suspense>
    </div>
  )
}

// メタデータの生成
export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const data = await getPublicProfile(userId)
  
  if (!data) {
    return {
      title: 'プロフィールが見つかりません'
    }
  }

  const { profile } = data
  const displayName = profile.display_name || 'ユーザー'
  const bio = profile.bio || ''

  return {
    title: `${displayName}のポートフォリオ`,
    description: bio || `${displayName}のクリエイターポートフォリオをご覧ください。`,
    openGraph: {
      title: `${displayName}のポートフォリオ`,
      description: bio || `${displayName}のクリエイターポートフォリオをご覧ください。`,
      type: 'profile',
      images: profile.avatar_image_url ? [
        {
          url: profile.avatar_image_url,
          width: 400,
          height: 400,
          alt: `${displayName}のプロフィール画像`,
        }
      ] : []
    },
    twitter: {
      card: 'summary',
      title: `${displayName}のポートフォリオ`,
      description: bio || `${displayName}のクリエイターポートフォリオをご覧ください。`,
      images: profile.avatar_image_url ? [profile.avatar_image_url] : []
    }
  }
} 