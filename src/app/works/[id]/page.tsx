import { Metadata } from 'next'
import WorkDetailClient from './WorkDetailClient'
import { supabase } from '@/lib/supabase'
import { 
  generateWorkOGPMetadata, 
  generateErrorOGPMetadata,
  type WorkData 
} from '@/lib/ogp-utils'

type WorkError = {
  type: 'not_found' | 'invalid_id' | 'database_error' | 'unknown'
  message: string
  details?: any
}

// 作品データを取得する関数
async function getWork(id: string): Promise<{ work: WorkData | null; error: WorkError | null }> {
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
    return generateErrorOGPMetadata({
      title: '作品が見つかりません',
      description: '指定された作品が見つかりませんでした。'
    })
  }

  return generateWorkOGPMetadata({
    title: work.title,
    description: work.description || 'クリエイターの作品をチェックしよう',
    workId: work.id,
    tags: work.tags || [],
    roles: work.roles || [],
    publishedTime: work.created_at,
    modifiedTime: work.updated_at || work.created_at,
  })
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await getWork(id)

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              エラーが発生しました
            </h1>
            <p className="text-gray-600 mb-8">
              {error.message}
            </p>
            <a
              href="/works"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              作品一覧に戻る
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <WorkDetailClient workId={id} />
} 