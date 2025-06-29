import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(_request: NextRequest) {
  try {
    console.log('テスト挿入APIが呼び出されました')
    
    // テスト用のダミーユーザーIDを使用（実際の認証は省略）
    const testUserId = '00000000-0000-0000-0000-000000000000'
    
    const testWorkData = {
      user_id: testUserId,
      title: 'テスト作品',
      description: 'テスト用の説明文',
      external_url: 'https://example.com',
      tags: ['テスト', 'サンプル'],
      roles: ['編集'],
      categories: ['テストカテゴリ'],
      production_date: null,
      banner_image_url: '',
      preview_data: { test: true },
      ai_analysis_result: { test: true },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('テストデータ:', testWorkData)

    const { data, error } = await supabase
      .from('works')
      .insert(testWorkData)
      .select()
      .single()
    
    if (error) {
      console.error('挿入エラー:', error)
      return NextResponse.json({
        error: '挿入エラー',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }

    console.log('挿入成功:', data)
    
    // テストデータを削除
    const { error: deleteError } = await supabase
      .from('works')
      .delete()
      .eq('id', data.id)
    
    if (deleteError) {
      console.warn('テストデータ削除エラー:', deleteError)
    } else {
      console.log('テストデータ削除完了')
    }

    return NextResponse.json({
      success: true,
      message: 'テスト挿入・削除完了',
      insertedData: data
    })
    
  } catch (error) {
    console.error('テスト挿入エラー:', error)
    return NextResponse.json({
      error: 'テスト挿入に失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 