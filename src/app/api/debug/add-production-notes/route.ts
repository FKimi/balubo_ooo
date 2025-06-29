import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST: production_notesカラムを手動で追加
export async function POST(_request: NextRequest) {
  try {
    // まず現在のスキーマを確認
    const { data: sampleData } = await supabase
      .from('works')
      .select('*')
      .limit(1)
      .single()

    if (sampleData && 'production_notes' in sampleData) {
      return NextResponse.json({
        success: true,
        message: 'production_notesカラムは既に存在しています',
        existing_columns: Object.keys(sampleData)
      })
    }

    // SQLを直接実行してカラムを追加
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE works ADD COLUMN production_notes TEXT;'
    })

    if (error) {
      console.error('カラム追加エラー:', error)
      
      // エラーコード42701は「カラムが既に存在する」エラー
      if (error.code === '42701' || error.message?.includes('already exists')) {
        return NextResponse.json({
          success: true,
          message: 'production_notesカラムは既に存在しています',
          warning: 'カラムは既に存在していました'
        })
      }

      return NextResponse.json({
        error: 'カラムの追加に失敗しました',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    // コメントを追加
    const { error: commentError } = await supabase.rpc('exec_sql', {
      sql: "COMMENT ON COLUMN works.production_notes IS '制作メモ・制作過程・背景・狙い・こだわりなどを記録するフィールド';"
    })

    if (commentError) {
      console.warn('コメント追加に失敗:', commentError)
    }

    return NextResponse.json({
      success: true,
      message: 'production_notesカラムを追加しました',
      data: data
    })

  } catch (error) {
    console.error('カラム追加処理エラー:', error)
    return NextResponse.json({
      error: 'カラム追加処理中にエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 