import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DatabaseClient } from '@/lib/database'
import fs from 'fs'
import path from 'path'

// 作品データの型定義
interface WorkData {
  id: string
  user_id: string
  title: string
  description: string
  external_url: string
  tags: string[]
  roles: string[]
  categories?: string[]
  production_date?: string
  banner_image_url?: string
  preview_data?: any
  ai_analysis_result?: any
  created_at: string
  updated_at: string
}

// GET: 作品一覧を取得
export async function GET(request: NextRequest) {
  try {
    console.log('作品一覧取得APIが呼び出されました')
    
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('認証ヘッダーがありません')
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: '認証トークンが無効です' }, { status: 401 })
    }
    
    // 認証されたSupabaseクライアントを作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    })
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.log('認証エラー:', userError)
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      )
    }

    const userId = user.id
    console.log('認証成功、ユーザーID:', userId)

    // DatabaseClientを使用して作品一覧を取得（認証トークン付き）
    const works = await DatabaseClient.getWorks(userId, token)

    return NextResponse.json({
      works,
      message: '作品一覧を取得しました'
    })

  } catch (error) {
    console.error('作品一覧取得エラー:', error)
    return NextResponse.json(
      { error: '作品一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しい作品を保存
export async function POST(request: NextRequest) {
  try {
    console.log('作品保存APIが呼び出されました')
    
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('認証ヘッダーがありません')
      return NextResponse.json(
        { error: '認証が必要です', details: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json({ 
        error: '認証トークンが無効です', 
        details: 'Token not found in authorization header' 
      }, { status: 401 })
    }
    
    // 認証されたSupabaseクライアントを作成
    console.log('認証されたSupabaseクライアントを作成中...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'サーバー設定エラー', 
        details: 'Supabase environment variables not configured' 
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    })
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.log('認証エラー:', userError)
      return NextResponse.json(
        { error: '認証に失敗しました', details: userError?.message || 'User not found' },
        { status: 401 }
      )
    }

    const userId = user.id
    console.log('認証成功、ユーザーID:', userId)

    // リクエストボディの解析
    let workData
    try {
      workData = await request.json()
      console.log('受信した作品データ:', Object.keys(workData))
      console.log('作品データの詳細:', workData)
    } catch (parseError) {
      console.error('JSONパースエラー:', parseError)
      return NextResponse.json(
        { error: 'リクエストデータの形式が正しくありません', details: parseError instanceof Error ? parseError.message : '不明なパースエラー' },
        { status: 400 }
      )
    }

    // バリデーション
    if (!workData.title || workData.title.trim() === '') {
      console.log('バリデーションエラー: タイトルが空です')
      return NextResponse.json(
        { error: 'タイトルは必須です', details: 'Title is required and cannot be empty' },
        { status: 400 }
      )
    }

    // 認証されたSupabaseクライアントで作品を保存
    console.log('認証されたSupabaseクライアントで作品を保存中...')
    
    // production_dateの形式変換（YYYY-MM → YYYY-MM-01）
    let productionDate = null
    if (workData.productionDate && workData.productionDate.trim()) {
      if (workData.productionDate.match(/^\d{4}-\d{2}$/)) {
        // YYYY-MM形式の場合、月の最初の日を追加
        productionDate = `${workData.productionDate}-01`
        console.log('production_date変換:', workData.productionDate, '→', productionDate)
      } else if (workData.productionDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // 既にYYYY-MM-DD形式の場合はそのまま使用
        productionDate = workData.productionDate
        console.log('production_date（変換不要）:', productionDate)
      } else {
        console.warn('不正なproduction_date形式:', workData.productionDate)
        productionDate = null
      }
    }
    
    const workToSave = {
      user_id: userId,
      title: workData.title || '',
      description: workData.description || '',
      external_url: workData.externalUrl || '', // フロントエンドのexternalUrlを変換
      tags: workData.tags || [],
      roles: workData.roles || [],
      categories: workData.categories || [],
      content_type: workData.contentType || '', // フロントエンドのcontentTypeを変換
      production_date: productionDate,
      banner_image_url: workData.bannerImageUrl || '', // フロントエンドのbannerImageUrlを変換
      preview_data: workData.previewData || null, // フロントエンドのpreviewDataを変換
      ai_analysis_result: workData.aiAnalysisResult || null, // フロントエンドのaiAnalysisResultを変換
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('保存するデータ:', workToSave)

    const { data: savedWork, error: insertError } = await supabase
      .from('works')
      .insert(workToSave)
      .select()
      .single()
    
    if (insertError) {
      console.error('Supabase挿入エラー:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      })
      return NextResponse.json(
        { 
          error: 'データベースへの保存に失敗しました', 
          details: insertError.message,
          code: 'DATABASE_ERROR',
          supabaseCode: insertError.code,
          hint: insertError.hint
        },
        { status: 500 }
      )
    }

    console.log('作品保存成功:', savedWork.id)

    // ローカルファイルにもバックアップ保存
    try {
      const worksDir = path.join(process.cwd(), 'data', 'works')
      if (!fs.existsSync(worksDir)) {
        fs.mkdirSync(worksDir, { recursive: true })
      }
      
      const workFile = path.join(worksDir, `${savedWork.id}.json`)
      fs.writeFileSync(workFile, JSON.stringify(savedWork, null, 2))
      console.log('作品をローカルファイルにも保存しました:', workFile)
    } catch (fileError) {
      console.warn('ローカルファイル保存エラー:', fileError)
      // ローカルファイル保存の失敗は致命的ではないので、処理を続行
    }

    return NextResponse.json({
      success: true,
      work: savedWork,
      message: '作品を保存しました'
    })

  } catch (error) {
    console.error('作品保存エラー:', error)
    
    // エラーの詳細情報を含むレスポンス
    const errorMessage = error instanceof Error ? error.message : '不明なエラー'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('エラースタック:', errorStack)
    
    return NextResponse.json(
      { 
        error: `作品の保存に失敗しました: ${errorMessage}`,
        details: errorMessage,
        code: 'GENERAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    )
  }
} 