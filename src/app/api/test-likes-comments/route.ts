import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

export async function GET(_request: NextRequest) {
  try {
    console.log('likesとcommentsテーブル状況確認開始')
    
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    }

    // 1. likesテーブルの構造確認
    try {
      const { data: likesStructure, error: likesError } = await supabase
        .from('likes')
        .select('*')
        .limit(1)

      results.tests.likesTable = {
        exists: !likesError,
        error: likesError?.message,
        sampleCount: likesStructure?.length || 0
      }

      if (!likesError) {
        // likesテーブルの全カウント
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
        
        results.tests.likesTable.totalCount = likesCount || 0
      }
    } catch (e) {
      results.tests.likesTable = {
        exists: false,
        error: e instanceof Error ? e.message : String(e)
      }
    }

    // 2. commentsテーブルの構造確認
    try {
      const { data: commentsStructure, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .limit(1)

      results.tests.commentsTable = {
        exists: !commentsError,
        error: commentsError?.message,
        sampleCount: commentsStructure?.length || 0
      }

      if (!commentsError) {
        // commentsテーブルの全カウント
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
        
        results.tests.commentsTable.totalCount = commentsCount || 0
      }
    } catch (e) {
      results.tests.commentsTable = {
        exists: false,
        error: e instanceof Error ? e.message : String(e)
      }
    }

    // 3. worksテーブルの確認（参照整合性のため）
    try {
      const { data: worksStructure, error: worksError } = await supabase
        .from('works')
        .select('id')
        .limit(5)

      results.tests.worksTable = {
        exists: !worksError,
        error: worksError?.message,
        sampleCount: worksStructure?.length || 0
      }

      if (worksStructure && worksStructure.length > 0) {
        results.tests.sampleWorkIds = worksStructure.map(w => w.id)
      }
    } catch (e) {
      results.tests.worksTable = {
        exists: false,
        error: e instanceof Error ? e.message : String(e)
      }
    }

    // 4. auth.usersの確認（外部キー参照のため）
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      results.tests.authSystem = {
        working: !authError,
        error: authError?.message,
        hasCurrentUser: !!user
      }
    } catch (e) {
      results.tests.authSystem = {
        working: false,
        error: e instanceof Error ? e.message : String(e)
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'likesとcommentsテーブル診断完了'
    })

  } catch (error) {
    console.error('テーブル診断エラー:', error)
    return NextResponse.json({
      error: 'テーブル診断に失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    }, { status: 500 })
  }
} 