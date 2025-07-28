import { Metadata } from 'next'
import WorkDetailClient from './WorkDetailClient'
import { sanitizeOGPInput } from '@/lib/ogp-utils'
import { supabase } from '@/lib/supabase'

type WorkError = {
  type: 'not_found' | 'invalid_id' | 'database_error' | 'unknown'
  message: string
  details?: any
}

// 作品データを取得する関数
async function getWork(id: string): Promise<{ work: any | null; error: WorkError | null }> {
  try {
    // IDの形式を検証
    if (!id || typeof id !== 'string' || id.length === 0) {
      return {
        work: null,
        error: {
          type: 'invalid_id',
          message: '無効な作品IDです',
          details: { id }
        }
      }
    }

    // Supabaseからデータを取得
    const { data: work, error } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .single()

    // エラーハンドリング
    if (error) {
      if (error.code === 'PGRST116') {
        if (process.env.NODE_ENV === 'development') {
          console.log(`作品が見つかりません: ID = ${id}`)
        }
        return {
          work: null,
          error: {
            type: 'not_found',
            message: '指定された作品が見つかりません',
            details: { id }
          }
        }
      }
      
      const errorType = 'database_error'
      const errorMessage = 'データベースエラーが発生しました'
      
      console.error('作品取得エラー:', {
        id,
        type: errorType,
        message: errorMessage,
        details: error
      })

      return {
        work: null,
        error: {
          type: errorType,
          message: errorMessage,
          details: error
        }
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`作品取得成功: ID = ${id}, タイトル = ${work.title}`)
    }
    return { work, error: null }

  } catch (error) {
    console.error('予期しないエラー:', {
      id,
      error
    })

    return {
      work: null,
      error: {
        type: 'unknown',
        message: '予期しないエラーが発生しました',
        details: error
      }
    }
  }
}

// メタデータ生成関数
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const { work } = await getWork(id)
  
  if (!work) {
    return {
      title: '作品が見つかりません | balubo',
      description: '指定された作品が見つかりませんでした。',
      openGraph: {
        title: '作品が見つかりません | balubo',
        description: '指定された作品が見つかりませんでした。',
        images: ['/og-image.svg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: '作品が見つかりません | balubo',
        description: '指定された作品が見つかりませんでした。',
        images: ['/og-image.svg'],
      },
    }
  }

  const title = sanitizeOGPInput(work.title, 100, '作品詳細')
  const description = sanitizeOGPInput(work.description, 200, 'クリエイターの作品をチェックしよう')
  const tags = work.tags?.slice(0, 3) || []
  const roles = work.roles?.slice(0, 2) || []

  // 動的OGP画像のURL
  const ogImageUrl = `/api/og/analysis/${id}`

  return {
    title: `${title} | balubo`,
    description: description,
    keywords: [...tags, ...roles, 'ポートフォリオ', 'クリエイター', '作品'],
    openGraph: {
      title: `${title} | balubo`,
      description: description,
      url: `https://www.balubo.jp/works/${id}`,
      siteName: 'balubo',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - ${description}`,
        },
      ],
      locale: 'ja_JP',
      type: 'article',
      authors: [work.user_id],
      publishedTime: work.created_at,
      modifiedTime: work.updated_at || work.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | balubo`,
      description: description,
      images: [ogImageUrl],
      creator: '@AiBalubo56518',
      site: '@AiBalubo56518',
    },
    alternates: {
      canonical: `/works/${id}`,
    },
  }
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id || typeof id !== 'string') {
    console.log('無効なパラメータ:', { id })
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">作品が見つかりません</h1>
          <p className="text-gray-600">指定された作品は存在しないか、削除された可能性があります。</p>
        </div>
      </div>
    )
  }
  return <WorkDetailClient workId={id} />
} 