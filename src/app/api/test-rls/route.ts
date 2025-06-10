import { NextRequest, NextResponse } from 'next/server'

// 動的レンダリングを強制
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('RLSポリシー詳細診断APIが呼び出されました')
    
    // 認証ヘッダーの取得
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        error: '認証トークンが必要です',
        help: 'Authorization: Bearer <token> ヘッダーを設定してください'
      }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    
    // 1. ユーザー認証確認
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({
        error: '認証に失敗しました',
        details: userError?.message
      }, { status: 401 })
    }

    console.log('認証成功:', user.id)

    // 2. 認証されたクライアントを作成
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

    const results: any = {
      userId: user.id,
      tests: {}
    }

    // 3. Profilesテーブルのテスト
    console.log('Profilesテーブルのテスト開始')
    
    // 既存プロフィール確認
    try {
      const { data: existingProfile, error: selectError } = await authClient
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      results.tests.existingProfile = {
        found: !!existingProfile,
        error: selectError?.message,
        data: existingProfile ? {
          id: existingProfile.id,
          user_id: existingProfile.user_id,
          display_name: existingProfile.display_name,
          created_at: existingProfile.created_at
        } : null
      }
    } catch (e) {
      results.tests.existingProfile = {
        found: false,
        error: e instanceof Error ? e.message : String(e)
      }
    }

    // プロフィール作成テスト
    const testProfileData = {
      user_id: user.id,
      display_name: 'テストユーザー',
      bio: 'RLSテスト用プロフィール',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      const { data: insertResult, error: insertError } = await authClient
        .from('profiles')
        .insert(testProfileData)
        .select()
        .single()

      results.tests.profileInsert = {
        success: !!insertResult,
        error: insertError?.message,
        errorCode: insertError?.code,
        data: insertResult ? {
          id: insertResult.id,
          user_id: insertResult.user_id
        } : null
      }

      // 作成に成功した場合は削除
      if (insertResult) {
        await authClient
          .from('profiles')
          .delete()
          .eq('id', insertResult.id)
        
        console.log('テストプロフィールを削除しました')
      }
    } catch (e) {
      results.tests.profileInsert = {
        success: false,
        error: e instanceof Error ? e.message : String(e),
        errorCode: (e as any)?.code
      }
    }

    // 4. Worksテーブルのテスト
    console.log('Worksテーブルのテスト開始')
    
    // 既存作品確認
    try {
      const { data: existingWorks, error: worksSelectError } = await authClient
        .from('works')
        .select('*')
        .eq('user_id', user.id)

      results.tests.existingWorks = {
        found: existingWorks?.length || 0,
        error: worksSelectError?.message,
        accessible: !worksSelectError
      }
    } catch (e) {
      results.tests.existingWorks = {
        found: 0,
        error: e instanceof Error ? e.message : String(e),
        accessible: false
      }
    }

    // 作品作成テスト
    const testWorkData = {
      user_id: user.id,
      title: 'RLSテスト作品',
      description: 'RLSポリシーテスト用',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    try {
      const { data: workInsertResult, error: workInsertError } = await authClient
        .from('works')
        .insert(testWorkData)
        .select()
        .single()

      results.tests.workInsert = {
        success: !!workInsertResult,
        error: workInsertError?.message,
        errorCode: workInsertError?.code
      }

      // 作成に成功した場合は削除
      if (workInsertResult) {
        await authClient
          .from('works')
          .delete()
          .eq('id', workInsertResult.id)
        
        console.log('テスト作品を削除しました')
      }
    } catch (e) {
      results.tests.workInsert = {
        success: false,
        error: e instanceof Error ? e.message : String(e),
        errorCode: (e as any)?.code
      }
    }

    // 5. RLSポリシー推定
    const rlsAnalysis = {
      profiles: {
        selectPolicy: results.tests.existingProfile.error ? 
          'SELECT権限に問題がある可能性' : 'SELECT権限は正常',
        insertPolicy: results.tests.profileInsert.error ?
          `INSERT権限に問題: ${results.tests.profileInsert.error}` : 'INSERT権限は正常',
        recommendation: results.tests.profileInsert.errorCode === '42501' ?
          'RLSポリシーでINSERT操作が拒否されています。auth.uid() = user_id のポリシーが必要です。' :
          '権限は正常に設定されています'
      },
      works: {
        selectPolicy: results.tests.existingWorks.error ? 
          'SELECT権限に問題がある可能性' : 'SELECT権限は正常',
        insertPolicy: results.tests.workInsert.error ?
          `INSERT権限に問題: ${results.tests.workInsert.error}` : 'INSERT権限は正常',
        recommendation: results.tests.workInsert.errorCode === '42501' ?
          'RLSポリシーでINSERT操作が拒否されています。auth.uid() = user_id のポリシーが必要です。' :
          '権限は正常に設定されています'
      }
    }

    return NextResponse.json({
      success: true,
      results,
      rlsAnalysis,
      message: 'RLS詳細診断完了'
    })

  } catch (error) {
    console.error('RLS診断エラー:', error)
    return NextResponse.json({
      error: 'RLS診断に失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    }, { status: 500 })
  }
} 