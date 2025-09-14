import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateRomajiSlug } from '@/utils/romaji'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    // Service Role Keyを使用してRLSをバイパス
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase設定エラー' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 指定されたユーザーのプロフィールを取得
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, display_name, slug')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('プロフィール取得エラー:', fetchError)
      return NextResponse.json({ error: 'プロフィール取得エラー' }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: 'プロフィールが見つかりません' }, { status: 404 })
    }

    if (!profile.display_name) {
      return NextResponse.json({ error: 'display_nameが設定されていません' }, { status: 400 })
    }

    // ローマ字スラッグを生成
    const baseSlug = generateRomajiSlug(profile.display_name)
    if (!baseSlug) {
      return NextResponse.json({ error: '有効なスラッグを生成できませんでした' }, { status: 400 })
    }

    // スラッグの重複チェックと調整
    let finalSlug = baseSlug
    let counter = 1

    while (true) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('slug', finalSlug)
        .neq('user_id', profile.user_id)
        .single()

      if (!existingProfile) {
        break
      }

      finalSlug = `${baseSlug}-${counter}`
      counter++
    }

    // スラッグを更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ slug: finalSlug })
      .eq('user_id', profile.user_id)

    if (updateError) {
      console.error('スラッグ更新エラー:', updateError)
      return NextResponse.json({ error: 'スラッグ更新エラー' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'スラッグを再生成しました',
      user_id: profile.user_id,
      display_name: profile.display_name,
      old_slug: profile.slug,
      new_slug: finalSlug
    })

  } catch (error) {
    console.error('スラッグ再生成エラー:', error)
    return NextResponse.json({ error: 'スラッグ再生成エラー' }, { status: 500 })
  }
}
