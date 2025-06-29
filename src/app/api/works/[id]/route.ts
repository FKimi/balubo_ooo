import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DatabaseClient } from '@/lib/database'

// GET: 特定の作品を取得
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params
    const authHeader = request.headers.get('authorization')
    
    console.log('GET /api/works/[id] - ID:', id, 'Auth:', !!authHeader)
    
    // 認証なしの場合は既存のJSONファイルから取得（開発用）
    if (!authHeader) {
      try {
        const fs = await import('fs')
        const path = await import('path')
        const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'works.json')
        
        if (fs.existsSync(DATA_FILE_PATH)) {
          const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8')
          const works = JSON.parse(data)
          const work = works.find((w: any) => w.id === id)
          
          console.log('Found work in JSON:', !!work)
          
          if (!work) {
            return NextResponse.json(
              { error: '作品が見つかりません' },
              { 
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }
          
          return NextResponse.json({ work }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
      } catch (error) {
        console.log('JSONファイルの読み込みに失敗:', error)
      }
      
      return NextResponse.json(
        { error: '作品が見つかりません' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Supabaseクライアントを作成（認証トークン付き）
    const token = authHeader.replace('Bearer ', '')
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // DatabaseClient を利用して作品を取得
    console.log('Fetching work via DatabaseClient:', id)
    const work = await DatabaseClient.getWork(id, user.id, token)

    if (!work) {
      return NextResponse.json(
        { error: '作品が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ work })
  } catch (error) {
    console.error('作品取得エラー:', error)
    return NextResponse.json(
      { error: '作品データの取得に失敗しました' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// PUT: 作品を更新
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params
    const body = await request.json()
    const { title, description, externalUrl, tags, roles, categories, productionDate, previewData, aiAnalysisResult, productionNotes } = body

    // バリデーション
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'タイトルは必須です' },
        { status: 400 }
      )
    }

    if (!roles || roles.length === 0) {
      return NextResponse.json(
        { error: '役割は必須です' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    
    // 認証なしの場合は既存のJSONファイルを更新（開発用）
    if (!authHeader) {
      try {
        const fs = await import('fs')
        const path = await import('path')
        const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'works.json')
        
        if (fs.existsSync(DATA_FILE_PATH)) {
          const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8')
          const works = JSON.parse(data)
          const workIndex = works.findIndex((w: any) => w.id === id)
          
          if (workIndex === -1) {
            return NextResponse.json(
              { error: '作品が見つかりません' },
              { 
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // 作品データを更新
          const updatedWork = {
            ...works[workIndex],
            title: title.trim(),
            description: description?.trim() || '',
            externalUrl: externalUrl?.trim() || '',
            tags: tags || [],
            roles: roles || [],
            categories: categories || [],
            productionDate: productionDate || '',
            productionNotes: productionNotes?.trim() || '',
            previewData: previewData || null,
            aiAnalysisResult: aiAnalysisResult || null,
            updatedAt: new Date().toISOString()
          }

          works[workIndex] = updatedWork
          fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(works, null, 2))

          return NextResponse.json({
            success: true,
            work: updatedWork,
            message: '作品を更新しました'
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
      } catch (error) {
        console.error('JSONファイル更新エラー:', error)
      }
      
      return NextResponse.json(
        { error: '作品が見つかりません' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // 認証トークンを取得してSupabaseクライアントを作成
    const token = authHeader.replace('Bearer ', '')
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Supabaseで作品を更新
    console.log('Supabase更新データ:', {
      title: title.trim(),
      description: description?.trim() || '',
      external_url: externalUrl?.trim() || '',
      tags: tags || [],
      roles: roles || [],
      categories: categories || [],
      production_date: productionDate || null,
      production_notes: productionNotes?.trim() || null,
      banner_image_url: previewData?.image || null,
      preview_data: previewData || null,
      ai_analysis_result: aiAnalysisResult || null
    })

    // production_notesカラムが存在しない場合に備えて、まず基本フィールドのみで更新を試行
    const updateData: any = {
      title: title.trim(),
      description: description?.trim() || '',
      external_url: externalUrl?.trim() || '',
      tags: tags || [],
      roles: roles || [],
      categories: categories || [],
      production_date: productionDate || null,
      banner_image_url: previewData?.image || null,
      preview_data: previewData || null,
      ai_analysis_result: aiAnalysisResult || null
    }

    // production_notesが提供されている場合のみ追加
    if (productionNotes !== undefined) {
      updateData.production_notes = productionNotes?.trim() || null
    }

    const { data: work, error } = await supabaseWithAuth
      .from('works')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)  // ユーザーIDでフィルタリング
      .select()
      .single()

    if (error || !work) {
      console.error('Supabase error詳細:', {
        error,
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint
      })

      // production_notesカラムが存在しない場合の再試行
      if (error?.code === '42703' || error?.message?.includes('production_notes')) {
        console.log('production_notesカラムが存在しないため、除外して再試行します')
        
        const retryUpdateData = {
          title: title.trim(),
          description: description?.trim() || '',
          external_url: externalUrl?.trim() || '',
          tags: tags || [],
          roles: roles || [],
          categories: categories || [],
          production_date: productionDate || null,
          banner_image_url: previewData?.image || null,
          preview_data: previewData || null,
          ai_analysis_result: aiAnalysisResult || null
        }

        const { data: retryWork, error: retryError } = await supabaseWithAuth
          .from('works')
          .update(retryUpdateData)
          .eq('id', id)
          .eq('user_id', user.id)  // ユーザーIDでフィルタリング
          .select()
          .single()

        if (retryError || !retryWork) {
          console.error('再試行でもエラー:', retryError)
          return NextResponse.json(
            { 
              error: '作品の更新に失敗しました',
              details: retryError?.message || 'Unknown error',
              code: retryError?.code
            },
            { 
              status: 500,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }

        return NextResponse.json({
          success: true,
          work: retryWork,
          message: '作品を更新しました（制作メモは保存されませんでした）'
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      return NextResponse.json(
        { 
          error: '作品の更新に失敗しました',
          details: error?.message || 'Unknown error',
          code: error?.code
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return NextResponse.json({
      success: true,
      work,
      message: '作品を更新しました'
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('作品更新エラー:', error)
    
    // エラーの詳細情報を含める
    let errorMessage = '作品の更新に失敗しました'
    let errorDetails = null
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// DELETE: 作品を削除
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = context.params
    const authHeader = request.headers.get('authorization')
    
    // 認証なしの場合は既存のJSONファイルから削除（開発用）
    if (!authHeader) {
      try {
        const fs = await import('fs')
        const path = await import('path')
        const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'works.json')
        
        if (fs.existsSync(DATA_FILE_PATH)) {
          const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8')
          const works = JSON.parse(data)
          const workIndex = works.findIndex((w: any) => w.id === id)
          
          if (workIndex === -1) {
            return NextResponse.json(
              { error: '作品が見つかりません' },
              { 
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }

          // 作品を削除
          const deletedWork = works.splice(workIndex, 1)[0]
          fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(works, null, 2))

          return NextResponse.json({
            success: true,
            work: deletedWork,
            message: '作品を削除しました'
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
      } catch (error) {
        console.error('JSONファイル削除エラー:', error)
      }
      
      return NextResponse.json(
        { error: '作品が見つかりません' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Supabaseクライアントを作成（認証トークン付き）
    const token = authHeader.replace('Bearer ', '')
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )

    // 現在のユーザーを取得
    const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Supabaseから作品を削除（ユーザーIDでフィルタリング）
    const { data: work, error } = await supabaseWithAuth
      .from('works')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !work) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: '作品の削除に失敗しました' },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    return NextResponse.json({
      success: true,
      work,
      message: '作品を削除しました'
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('作品削除エラー:', error)
    return NextResponse.json(
      { error: '作品の削除に失敗しました' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
} 