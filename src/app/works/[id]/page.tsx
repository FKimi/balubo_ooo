import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import WorkDetailClient from './WorkDetailClient'
import { generateWorkOGPMetadata, getImageUrlWithPriority, sanitizeOGPInput } from '@/lib/ogp-utils'

// メタデータの設定
const METADATA_CONFIG = {
  defaultTitle: '作品詳細 | balubo',
  defaultDescription: '作品の詳細情報をご覧いただけます。',
  notFoundTitle: '作品が見つかりません - balubo',
  notFoundDescription: '指定された作品が見つかりませんでした。',
} as const

// エラータイプの定義
type WorkError = {
  type: 'not_found' | 'database_error' | 'invalid_id' | 'unknown'
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

    // 開発環境でのみ詳細ログを出力
    if (process.env.NODE_ENV === 'development') {
      console.log(`作品取得開始: ID = ${id}`)
      console.log('Supabase接続状態:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        timestamp: new Date().toISOString()
      })
    }

    const { data: work, error } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      // 開発環境でのみ詳細エラー情報を出力
      if (process.env.NODE_ENV === 'development') {
        console.error('作品取得エラー - 詳細情報:', {
          id,
          error: error.message || 'メッセージなし',
          code: error.code || 'コードなし',
          details: error.details || '詳細なし',
          hint: error.hint || 'ヒントなし',
          // エラーオブジェクト全体も出力（JSON形式で）
          fullError: JSON.stringify(error, null, 2),
          // エラーオブジェクトのプロパティ一覧
          errorKeys: Object.keys(error),
          // エラーオブジェクトの型情報
          errorType: typeof error,
          errorConstructor: error.constructor?.name || 'Unknown',
        })
      } else {
        // 本番環境では簡潔なログ
        console.error('作品取得エラー:', error.message || 'Unknown error')
      }

      // エラータイプを判定
      let errorType: WorkError['type'] = 'unknown'
      let errorMessage = '作品の取得中にエラーが発生しました'

      if (error.code === 'PGRST116') {
        errorType = 'not_found'
        errorMessage = '指定された作品が見つかりません'
      } else if (error.code === 'PGRST301') {
        errorType = 'invalid_id'
        errorMessage = '無効な作品IDです'
      } else if (error.code === '22P02') {
        errorType = 'invalid_id'
        errorMessage = '無効なUUID形式です'
      } else if (error.code?.startsWith('PGRST')) {
        errorType = 'database_error'
        errorMessage = 'データベースエラーが発生しました'
      }

      return {
        work: null,
        error: {
          type: errorType,
          message: errorMessage,
          details: error
        }
      }
    }

    if (!work) {
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

    if (process.env.NODE_ENV === 'development') {
      console.log(`作品取得成功: ID = ${id}, タイトル = ${work.title}`)
    }
    return { work, error: null }

  } catch (error) {
    console.error('作品取得中に予期しないエラーが発生 - 詳細情報:', {
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: typeof error,
      errorConstructor: error instanceof Error ? error.constructor.name : 'Unknown',
      // エラーオブジェクト全体
      fullError: error,
      // エラーオブジェクトのプロパティ一覧
      errorKeys: error && typeof error === 'object' ? Object.keys(error) : [],
      // スタックトレース（利用可能な場合）
      stack: error instanceof Error ? error.stack : undefined,
      // 追加のデバッグ情報
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
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

// メタデータ生成
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params
    
    if (!id || typeof id !== 'string') {
      console.log('無効なパラメータ:', { id })
      return {
        title: METADATA_CONFIG.notFoundTitle,
        description: METADATA_CONFIG.notFoundDescription,
      }
    }

    const { work, error } = await getWork(id)

    if (error) {
      console.log('メタデータ生成時のエラー:', error)
      return {
        title: METADATA_CONFIG.notFoundTitle,
        description: METADATA_CONFIG.notFoundDescription,
      }
    }

    if (!work) {
      console.log('作品データが取得できませんでした')
      return {
        title: METADATA_CONFIG.notFoundTitle,
        description: METADATA_CONFIG.notFoundDescription,
      }
    }

    const title = sanitizeOGPInput(work.title, 100, '無題の作品')
    const description = sanitizeOGPInput(work.description, 200, `${title}の作品詳細ページです。`)
    const imageUrl = getImageUrlWithPriority(work)

    return generateWorkOGPMetadata({
      title,
      description,
      workId: id,
      ...(imageUrl && { imageUrl }),
    })
  } catch (error) {
    console.error('メタデータ生成エラー:', error)
    
    // エラー時はデフォルトのメタデータを返す
    return {
      title: METADATA_CONFIG.defaultTitle,
      description: METADATA_CONFIG.defaultDescription,
    }
  }
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