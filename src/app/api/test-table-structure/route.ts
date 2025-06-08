import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

export async function GET(request: NextRequest) {
  try {
    console.log('テーブル構造確認開始')
    
    const results: any = {
      timestamp: new Date().toISOString(),
      tables: {}
    }

    // 1. likesテーブルの構造確認（空のSELECTでカラム情報を取得）
    try {
      const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .select('*')
        .limit(0)  // データは取得せず、構造のみ確認

      results.tables.likes = {
        accessible: !likesError,
        error: likesError?.message,
        errorCode: likesError?.code,
        errorDetails: likesError?.details
      }

      // エラーがある場合は詳細情報を含める
      if (likesError) {
        results.tables.likes.debugInfo = {
          hint: likesError.hint,
          code: likesError.code,
          message: likesError.message
        }
      }
    } catch (e) {
      results.tables.likes = {
        accessible: false,
        error: e instanceof Error ? e.message : String(e),
        type: 'exception'
      }
    }

    // 2. commentsテーブルの構造確認
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .limit(0)

      results.tables.comments = {
        accessible: !commentsError,
        error: commentsError?.message,
        errorCode: commentsError?.code
      }
    } catch (e) {
      results.tables.comments = {
        accessible: false,
        error: e instanceof Error ? e.message : String(e),
        type: 'exception'
      }
    }

    // 3. 既存のlikesデータサンプル取得（テーブルが存在する場合）
    if (results.tables.likes.accessible) {
      try {
        const { data: sampleLikes, error: sampleError } = await supabase
          .from('likes')
          .select('*')
          .limit(1)

        if (!sampleError && sampleLikes && sampleLikes.length > 0) {
          results.tables.likes.sampleData = sampleLikes[0]
          results.tables.likes.availableColumns = Object.keys(sampleLikes[0])
        }
      } catch (e) {
        results.tables.likes.sampleError = e instanceof Error ? e.message : String(e)
      }
    }

    // 4. PostgreSQLのスキーマ情報を直接取得（可能であれば）
    try {
      // information_schemaから列情報を取得
      const { data: columnInfo, error: columnError } = await supabase
        .rpc('get_table_columns', { table_name: 'likes' })
        .select()

      if (!columnError && columnInfo) {
        results.tables.likes.schemaInfo = columnInfo
      } else {
        results.tables.likes.schemaQueryError = columnError?.message
      }
    } catch (e) {
      // RPCが存在しない場合は無視
      results.tables.likes.schemaQueryNote = 'RPC function not available'
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'テーブル構造診断完了'
    })

  } catch (error) {
    console.error('テーブル構造診断エラー:', error)
    return NextResponse.json({
      error: 'テーブル構造診断に失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    }, { status: 500 })
  }
} 