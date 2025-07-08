import { NextRequest, NextResponse } from 'next/server'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabase'
import { DatabaseClient } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('データベーステストAPIが呼び出されました')
    
    // 1. Supabase接続テスト
    console.log('1. Supabase基本接続テスト...')
    const { error: testError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('Supabase接続エラー:', testError)
      return NextResponse.json({
        error: 'Supabase接続エラー',
        details: testError.message,
        code: testError.code
      }, { status: 500 })
    }
    
    console.log('Supabase接続成功')
    
    // 2. DatabaseClient接続テスト
    console.log('2. DatabaseClient接続テスト...')
    const connectionTest = await DatabaseClient.testConnection()
    console.log('DatabaseClient接続テスト結果:', connectionTest)
    
    // 3. 認証テスト（ヘッダーがある場合）
    const authHeader = request.headers.get('authorization')
    let userInfo = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log('3. 認証テスト...')
      const token = authHeader.split(' ')[1]
      const { data: { user }, error: userError } = await supabase.auth.getUser(token)
      
      if (userError) {
        console.error('認証エラー:', userError)
        userInfo = { error: userError.message }
      } else {
        console.log('認証成功:', user?.id)
        userInfo = { id: user?.id, email: user?.email }
      }
    }
    
    // 4. テーブル構造詳細診断
    console.log('4. テーブル構造詳細診断...')
    const tablesInfo: any = {}
    
    // profilesテーブル診断
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      tablesInfo.profiles = {
        accessible: !profilesError,
        error: profilesError?.message,
        sampleData: profilesData?.[0] ? Object.keys(profilesData[0]) : null
      }
    } catch (e) {
      tablesInfo.profiles = { 
        accessible: false, 
        error: e instanceof Error ? e.message : String(e)
      }
    }
    
    // worksテーブル診断
    try {
      const { data: worksData, error: worksError } = await supabase
        .from('works')
        .select('*')
        .limit(1)
      
      tablesInfo.works = {
        accessible: !worksError,
        error: worksError?.message,
        sampleData: worksData?.[0] ? Object.keys(worksData[0]) : null,
        count: worksData?.length || 0
      }
    } catch (e) {
      tablesInfo.works = { 
        accessible: false, 
        error: e instanceof Error ? e.message : String(e)
      }
    }
    
    // 5. 認証されたユーザーでのテスト（トークンがある場合）
    let authenticatedTests = null
    if (authHeader && userInfo && !userInfo.error) {
      console.log('5. 認証されたユーザーでのテーブルアクセステスト...')
      const token = authHeader.split(' ')[1]
      
      try {
        // 認証されたクライアントでのテスト
        const { createClient } = await import('@supabase/supabase-js')
        const authClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          }
        )
        
        // profilesテーブル（認証）
        const { data: authProfilesData, error: authProfilesError } = await authClient
          .from('profiles')
          .select('*')
          .eq('user_id', userInfo.id)
          .limit(1)
        
        // worksテーブル（認証）
        const { data: authWorksData, error: authWorksError } = await authClient
          .from('works')
          .select('*')
          .eq('user_id', userInfo.id)
        
        authenticatedTests = {
          profiles: {
            accessible: !authProfilesError,
            error: authProfilesError?.message,
            found: authProfilesData?.length || 0
          },
          works: {
            accessible: !authWorksError,
            error: authWorksError?.message,
            found: authWorksData?.length || 0,
            data: authWorksData
          }
        }
      } catch (authTestError) {
        authenticatedTests = {
          error: authTestError instanceof Error ? authTestError.message : String(authTestError)
        }
      }
    }
    
    // 6. RLSポリシー状態の推定
    const rlsAnalysis = {
      profiles: {
        hasRLS: tablesInfo.profiles.error?.includes('row-level security') || 
                tablesInfo.profiles.error?.includes('permission denied'),
        suggestion: tablesInfo.profiles.accessible ? 
          'アクセス可能（RLSが正しく設定されているか、パブリックアクセス可能）' :
          'アクセス不可（RLSポリシーまたは権限の問題の可能性）'
      },
      works: {
        hasRLS: tablesInfo.works.error?.includes('row-level security') || 
                tablesInfo.works.error?.includes('permission denied'),
        suggestion: tablesInfo.works.accessible ? 
          'アクセス可能（RLSが正しく設定されているか、パブリックアクセス可能）' :
          'アクセス不可（RLSポリシーまたは権限の問題の可能性）'
      }
    }

    return NextResponse.json({
      success: true,
      tests: {
        supabaseConnection: true,
        databaseClientConnection: connectionTest,
        authentication: userInfo,
        tablesInfo,
        authenticatedTests,
        rlsAnalysis
      },
      message: 'データベース詳細診断完了'
    })
    
  } catch (error) {
    console.error('データベーステストエラー:', error)
    return NextResponse.json({
      error: 'データベーステストに失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 