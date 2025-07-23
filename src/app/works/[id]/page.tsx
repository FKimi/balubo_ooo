import { Metadata } from 'next'
import WorkDetailClient from './WorkDetailClient'
import { generateWorkOGPMetadata, getImageUrlWithPriority, sanitizeOGPInput } from '@/lib/ogp-utils'
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
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { work } = await getWork(params.id)
  
  if (!work) {
    return {
      title: '作品が見つかりません',
      description: '指定された作品は存在しないか、削除された可能性があります。',
    }
  }

  // OGPメタデータに必要な情報をサニタイズ
  const sanitizedTitle = sanitizeOGPInput(work.title, 60, '無題の作品')
  const sanitizedDescription = sanitizeOGPInput(work.description, 160, '作品の詳細説明')
  
  // バナー画像、プレビュー画像、フォールバック画像の優先順位で画像URLを決定
  const imageUrl = getImageUrlWithPriority(work) || '/og-image.svg'

  // OGPメタデータを生成
  return generateWorkOGPMetadata({
    title: sanitizedTitle,
    description: sanitizedDescription,
    imageUrl: imageUrl,
    workId: work.id
  })
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
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
  } catch (error) {
    console.error('作品詳細ページエラー:', error)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">エラーが発生しました</h1>
          <p className="text-gray-600">ページの読み込み中にエラーが発生しました。</p>
        </div>
      </div>
    )
  }
} 