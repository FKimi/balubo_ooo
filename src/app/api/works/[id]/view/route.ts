import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workId = params.id
    if (!workId) {
      return NextResponse.json({ error: '作品IDが必要です' }, { status: 400 })
    }

    const { error } = await supabase.rpc('increment_work_view_count', {
      work_id_param: workId,
    })

    if (error) {
      console.error('閲覧数の更新エラー:', error)
      throw new Error('閲覧数の更新に失敗しました')
    }

    return NextResponse.json({ success: true, message: '閲覧数を更新しました' })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'サーバーエラーが発生しました'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
} 