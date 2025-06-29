import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: worksテーブルのスキーマを確認
export async function GET(_request: NextRequest) {
  try {
    // テーブルのカラム情報を取得
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'works' })
      .select()

    if (columnsError) {
      console.error('カラム情報取得エラー:', columnsError)
      
      // 代替方法: information_schemaから直接取得
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', 'works')
        .eq('table_schema', 'public')

      if (schemaError) {
        console.error('スキーマ情報取得エラー:', schemaError)
        
        // 最後の手段: 実際のデータを1件取得してカラムを確認
        const { data: sampleData, error: sampleError } = await supabase
          .from('works')
          .select('*')
          .limit(1)
          .single()

        if (sampleError && sampleError.code !== 'PGRST116') {
          return NextResponse.json({
            error: 'テーブル情報の取得に失敗しました',
            details: sampleError.message,
            code: sampleError.code
          }, { status: 500 })
        }

        return NextResponse.json({
          method: 'sample_data',
          columns: sampleData ? Object.keys(sampleData) : [],
          sample_data: sampleData,
          has_production_notes: sampleData ? 'production_notes' in sampleData : false
        })
      }

      return NextResponse.json({
        method: 'information_schema',
        columns: schemaData,
        has_production_notes: schemaData?.some(col => col.column_name === 'production_notes') || false
      })
    }

    return NextResponse.json({
      method: 'rpc_function',
      columns: columns,
      has_production_notes: columns?.some((col: any) => col.column_name === 'production_notes') || false
    })

  } catch (error) {
    console.error('スキーマ確認エラー:', error)
    return NextResponse.json({
      error: 'スキーマ確認中にエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 