import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET: 特定の作品を取得
export async function GET(
  request: NextRequest,
  context: any
) {
  const startTime = Date.now()
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    console.log(`[${requestId}] GET /api/works/[id] - リクエスト開始`)
    
    // パラメータの検証
    if (!context?.params) {
      console.log(`[${requestId}] エラー: パラメータが無効`)
      return NextResponse.json(
        { error: 'パラメータが無効です' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const { id } = await context.params
    
    if (!id || typeof id !== 'string') {
      console.log(`[${requestId}] エラー: 作品IDが無効 - ID:`, id)
      return NextResponse.json(
        { error: '作品IDが無効です' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const authHeader = request.headers.get('authorization')
    
    console.log(`[${requestId}] GET /api/works/[id] - ID: ${id}, Auth: ${!!authHeader}`)
    
    // 環境変数の確認
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log(`[${requestId}] 環境変数確認:`, {
      hasSupabaseUrl,
      hasSupabaseServiceKey,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    })
    
    // 認証の有無に関わらず、同じロジックを使用（Service roleクライアント）
    let work = null
      
      // まずJSONファイルから検索
      try {
        console.log(`[${requestId}] JSONファイルからの検索を開始`)
        const fs = await import('fs')
        const path = await import('path')
        const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'works.json')
        
        console.log(`[${requestId}] JSONファイルパス:`, DATA_FILE_PATH)
        console.log(`[${requestId}] ファイル存在確認:`, fs.existsSync(DATA_FILE_PATH))
        
        if (fs.existsSync(DATA_FILE_PATH)) {
          const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8')
          const works = JSON.parse(data)
          console.log(`[${requestId}] 利用可能なJSONファイル作品ID:`, works.map((w: any) => w.id))
          
          work = works.find((w: any) => w.id === id)
          console.log(`[${requestId}] JSONファイルで見つかった作品:`, !!work)
        }
      } catch (error) {
        console.log(`[${requestId}] JSONファイルの読み込みに失敗:`, error)
      }
      
      // JSONファイルで見つからない場合、Supabaseから検索（public作品のみ）
      if (!work) {
        try {
          console.log(`[${requestId}] Supabaseで公開作品を検索中:`, id)
          
          // Service roleクライアントを使用（フィードAPIと同じアプローチ）
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
          
          if (!supabaseUrl || !supabaseServiceKey) {
            console.log(`[${requestId}] Supabase環境変数が設定されていません`)
            throw new Error('Supabase設定エラー')
          }
          
          const supabaseForPublic = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          })
          
          
           
           // まず作品のみを検索（profilesの結合なし）
           console.log(`[${requestId}] Supabaseクエリ実行中...`)
           const { data: supabaseWork, error: supabaseError } = await supabaseForPublic
             .from('works')
             .select('*')
             .eq('id', id)
             .single()
          
           if (supabaseError) {
             console.log(`[${requestId}] Supabase検索エラー:`, supabaseError.message)
             console.log(`[${requestId}] Supabase検索エラー詳細:`, supabaseError)
           } else if (supabaseWork) {
             console.log(`[${requestId}] Supabaseで作品が見つかりました:`, supabaseWork.title)
             console.log(`[${requestId}] 作品データ:`, { id: supabaseWork.id, title: supabaseWork.title, user_id: supabaseWork.user_id })
             
             // profilesデータを別途取得
             let profileData = null
             try {
               const { data: profile } = await supabaseForPublic
                 .from('profiles')
                 .select('display_name, avatar_image_url, portfolio_visibility')
                 .eq('user_id', supabaseWork.user_id)
                 .single()
               
               profileData = profile
               console.log('プロフィールデータ:', profileData)
             } catch (profileError) {
               console.log('プロフィール取得エラー:', profileError)
             }
             
             // 作品データを構築
             work = {
               id: supabaseWork.id,
               title: supabaseWork.title,
               description: supabaseWork.description,
               externalUrl: supabaseWork.external_url,
               productionDate: supabaseWork.production_date,
               tags: supabaseWork.tags || [],
               roles: supabaseWork.roles || [],
               categories: supabaseWork.categories || [],
               previewData: supabaseWork.preview_data,
               banner_image_url: supabaseWork.banner_image_url,
               ai_analysis_result: supabaseWork.ai_analysis_result,
               production_notes: supabaseWork.production_notes,
               createdAt: supabaseWork.created_at,
               updatedAt: supabaseWork.updated_at,
               user_id: supabaseWork.user_id,
               user: {
                 id: supabaseWork.user_id,
                 display_name: profileData?.display_name || 'ユーザー',
                 avatar_image_url: profileData?.avatar_image_url || null
               }
             }
             console.log('Supabaseで作品データを構築しました:', work.title)
          } else {
            console.log('Supabaseでも作品が見つかりませんでした')
          }
        } catch (supabaseError) {
          console.log('Supabase検索中にエラー:', supabaseError)
        }
      }
          
          if (!work) {
        console.log(`[${requestId}] どこからも作品が見つかりませんでした ID:`, id)
        
        // 利用可能なIDを取得してエラーレスポンスに含める
        let availableIds: string[] = []
        try {
          const fs = await import('fs')
          const path = await import('path')
          const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'works.json')
          
          if (fs.existsSync(DATA_FILE_PATH)) {
            const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8')
            const works = JSON.parse(data)
            availableIds = [...availableIds, ...works.map((w: any) => w.id)]
          }
          
          // Supabaseからも取得（Service roleクライアント使用）
          const supabaseForIds = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            }
          )
          
                     const { data: supabaseWorks, error: supabaseWorksError } = await supabaseForIds
             .from('works')
             .select('id')
             .limit(10)
           

           
           if (supabaseWorks) {
             availableIds = [...availableIds, ...supabaseWorks.map(w => w.id)]
           }
        } catch (error) {
          console.log('利用可能ID取得エラー:', error)
        }
        
            return NextResponse.json(
          { 
            error: '作品が見つかりません',
            details: `ID "${id}" の作品は存在しないか、非公開設定になっています。`,
            searchedSources: ['JSONファイル', 'Supabaseデータベース（公開作品のみ）'],
            availableIds: availableIds,
            requestedId: id
          },
              { 
                status: 404,
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          }
          
          const endTime = Date.now()
          console.log(`[${requestId}] 成功: 作品データを返却 - 処理時間: ${endTime - startTime}ms`)
          
          return NextResponse.json({ work }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
  } catch (error) {
    console.error(`[${requestId}] 作品取得エラー:`, error)
    
    // エラーの詳細を含める
    let errorMessage = '作品データの取得に失敗しました'
    let errorDetails = null
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
        requestId: requestId
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

// PUT: 作品を更新
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const { id } = await context.params
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
    const { id } = await context.params
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