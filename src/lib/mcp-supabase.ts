// 軽量版Supabaseクライアント（MCP風のインターフェース）
class EnhancedSupabaseClient {
  private subscriptions: Map<string, any> = new Map()
  private retryCount: Map<string, number> = new Map()
  private maxRetries = 3

  // 認証されたSupabaseクライアントを作成するヘルパー（統一化）
  private async createAuthenticatedClient(token?: string) {
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
    
    if (token) {
      console.log('認証トークン付きSupabaseクライアントを作成')
      return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      })
    } else {
      console.log('標準Supabaseクライアントを作成（認証なし）')
      return createClient(supabaseUrl, supabaseAnonKey)
    }
  }

  // プロフィールデータの取得
  async getProfile(userId: string, token?: string) {
    try {
      console.log('高度なSupabaseクライアントでプロフィールを取得中...', userId, 'token:', !!token)
      
      const client = await this.createAuthenticatedClient(token)
      
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('プロフィール取得エラー詳細:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('プロフィール取得成功:', data)
      return data
    } catch (error) {
      console.error('プロフィール取得エラー:', error)
      throw error
    }
  }

  // プロフィールデータの保存（認証対応版）
  async saveProfile(userId: string, profileData: any, token?: string) {
    try {
      console.log('=== プロフィール保存開始 ===')
      console.log('User ID:', userId, 'token:', !!token)
      console.log('Profile Data:', JSON.stringify(profileData, null, 2))
      
      const client = await this.createAuthenticatedClient(token)
      
      // 既存プロフィールの確認（認証クライアント使用）
      console.log('既存プロフィールを確認中...')
      const { data: existingProfile, error: selectError } = await client
        .from('profiles')
        .select('user_id')
        .eq('user_id', userId)
        .single()

      console.log('既存プロフィール確認結果:', { existingProfile, selectError })

      const baseProfileData = {
        user_id: userId,
        display_name: profileData.displayName || '',
        bio: profileData.bio || '',
        professions: profileData.professions || [],
        skills: profileData.skills || [],
        location: profileData.location || '',
        website_url: profileData.websiteUrl || '',
        portfolio_visibility: profileData.portfolioVisibility || 'public',
        background_image_url: profileData.backgroundImageUrl || '',
        avatar_image_url: profileData.avatarImageUrl || '',
        desired_rate: profileData.desiredRate || '',
        job_change_intention: profileData.jobChangeIntention || 'not_considering',
        side_job_intention: profileData.sideJobIntention || 'not_considering',
        project_recruitment_status: profileData.projectRecruitmentStatus || 'not_recruiting',
        experience_years: profileData.experienceYears || null,
        working_hours: profileData.workingHours || '',
        career: profileData.career || [],
        updated_at: new Date().toISOString()
      }

      console.log('保存用データ:', JSON.stringify(baseProfileData, null, 2))

      if (existingProfile) {
        // 更新（認証クライアント使用）
        console.log('プロフィールを更新中...')
        const { data, error } = await client
          .from('profiles')
          .update(baseProfileData)
          .eq('user_id', userId)
          .select()
          .single()

        console.log('更新結果:', { data, error })
        if (error) {
          console.error('更新エラー詳細:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw error
        }
        console.log('プロフィール更新成功:', data)
        return data
      } else {
        // 新規作成（認証クライアント使用）
        console.log('新規プロフィールを作成中...')
        const profileToCreate = {
          ...baseProfileData,
          created_at: new Date().toISOString()
        }
        
        console.log('作成用データ:', JSON.stringify(profileToCreate, null, 2))
        
        const { data, error } = await client
          .from('profiles')
          .insert(profileToCreate)
          .select()
          .single()

        console.log('作成結果:', { data, error })
        if (error) {
          console.error('作成エラー詳細:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw error
        }
        console.log('プロフィール作成成功:', data)
        return data
      }
    } catch (error) {
      console.error('=== プロフィール保存エラー ===')
      console.error('エラー詳細:', error)
      console.error('エラータイプ:', typeof error)
      console.error('エラーメッセージ:', error instanceof Error ? error.message : 'Unknown error')
      console.error('エラースタック:', error instanceof Error ? error.stack : 'No stack')
      throw error
    }
  }

  // リアルタイム購読の設定（エラーハンドリング強化版・認証対応）
  async subscribeToProfile(userId: string, callback: (data: any) => void, token?: string) {
    try {
      console.log('高度なSupabaseクライアントでリアルタイム購読を開始...', userId, 'token:', !!token)
      
      // 認証されたクライアントを作成
      const client = await this.createAuthenticatedClient(token)
      
      // Supabaseのリアルタイム機能の状態確認
      const realtimeStatus = client.realtime.channels.length
      console.log('現在のリアルタイムチャンネル数:', realtimeStatus)
      
      // 既存の購読があれば削除
      await this.unsubscribeFromProfile(userId)
      
      // ユニークなチャンネル名を生成（タイムスタンプ付き）
      const channelName = `profile-changes-${userId}-${Date.now()}`
      console.log('新しいチャンネル名:', channelName)

      // リアルタイム購読を試行（段階的フォールバック）
      try {
        const subscription = await this.createRealtimeSubscription(channelName, userId, callback, client)
        
        if (subscription) {
          // 購読オブジェクトにクライアントインスタンスを保存
          ;(subscription as any).clientInstance = client
          this.subscriptions.set(userId, subscription)
          this.retryCount.set(userId, 0)
          console.log('リアルタイム購読が正常に設定されました')
          return subscription
        } else {
          console.warn('リアルタイム購読の作成に失敗しました。ポーリング方式にフォールバックします。')
          return this.startPollingFallback(userId, callback, token)
        }
      } catch (realtimeError) {
        console.warn('リアルタイム購読でエラーが発生しました。ポーリング方式にフォールバックします:', realtimeError)
        return this.startPollingFallback(userId, callback, token)
      }
    } catch (error) {
      console.error('購読設定で予期しないエラーが発生しました。ポーリング方式にフォールバックします:', error)
      
      // 重大なエラーでもポーリング方式で継続
      try {
        return this.startPollingFallback(userId, callback, token)
      } catch (fallbackError) {
        console.error('ポーリング方式のフォールバックも失敗しました:', fallbackError)
        // 最後の手段: 何もしない（サイレント失敗）
        return null
      }
    }
  }

  // リアルタイム購読の実際の作成（認証クライアント対応）
  private async createRealtimeSubscription(channelName: string, userId: string, callback: (data: any) => void, client: any) {
    return new Promise((resolve, reject) => {
      let subscriptionTimeout: NodeJS.Timeout | undefined
      let isResolved = false

      try {
        const subscription = client
          .channel(channelName)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'profiles',
              filter: `user_id=eq.${userId}`
            },
            (payload: any) => {
              console.log('リアルタイムでプロフィール変更を検出:', payload)
              
              try {
                // 変更イベントに応じて適切なデータを返す
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                  callback(payload.new)
                } else if (payload.eventType === 'DELETE') {
                  callback(null)
                }
              } catch (callbackError) {
                console.error('コールバック実行エラー:', callbackError)
              }
            }
          )
          .subscribe((status: any) => {
            console.log('リアルタイム購読ステータス:', status)
            
            if (!isResolved) {
              if (status === 'SUBSCRIBED') {
                isResolved = true
                if (subscriptionTimeout) clearTimeout(subscriptionTimeout)
                console.log('リアルタイム購読が正常に開始されました')
                resolve(subscription)
              } else if (status === 'CHANNEL_ERROR') {
                isResolved = true
                if (subscriptionTimeout) clearTimeout(subscriptionTimeout)
                console.warn('リアルタイム購読でエラーが発生しました。ポーリング方式にフォールバックします。')
                resolve(null)
              } else if (status === 'TIMED_OUT') {
                isResolved = true
                if (subscriptionTimeout) clearTimeout(subscriptionTimeout)
                console.warn('リアルタイム購読がタイムアウトしました。ポーリング方式にフォールバックします。')
                resolve(null)
              } else if (status === 'CLOSED') {
                isResolved = true
                if (subscriptionTimeout) clearTimeout(subscriptionTimeout)
                console.warn('リアルタイム購読が閉じられました。')
                resolve(null)
              }
            }
          })

        // 10秒でタイムアウト
        subscriptionTimeout = setTimeout(() => {
          if (!isResolved) {
            isResolved = true
            console.warn('リアルタイム購読の接続がタイムアウトしました')
            client.removeChannel(subscription)
            resolve(null)
          }
        }, 10000)

      } catch (error) {
        if (!isResolved) {
          isResolved = true
          if (subscriptionTimeout) clearTimeout(subscriptionTimeout)
          console.error('リアルタイム購読作成エラー:', error)
          reject(error)
        }
      }
    })
  }

  // ポーリング方式のフォールバック（認証対応）
  private startPollingFallback(userId: string, callback: (data: any) => void, token?: string) {
    console.log('ポーリング方式を開始します（認証対応）')
    
    let lastData: any = null
    const pollInterval = setInterval(async () => {
      try {
        const currentData = await this.getProfile(userId, token)
        
        // データが変更されていればコールバックを実行
        if (JSON.stringify(currentData) !== JSON.stringify(lastData)) {
          console.log('ポーリングでデータ変更を検出')
          callback(currentData)
          lastData = currentData
        }
      } catch (error) {
        console.error('ポーリングエラー:', error)
      }
    }, 5000) // 5秒間隔

    // ポーリング用の疑似購読オブジェクトを返す
    const pollingSubscription = {
      unsubscribe: () => {
        console.log('ポーリングを停止します')
        clearInterval(pollInterval)
      },
      isPolling: true
    }

    this.subscriptions.set(userId, pollingSubscription)
    return pollingSubscription
  }

  // 購読の解除（認証クライアント対応）
  async unsubscribeFromProfile(userId: string) {
    try {
      const subscription = this.subscriptions.get(userId)
      if (subscription) {
        if (subscription.isPolling) {
          // ポーリング方式の場合
          subscription.unsubscribe()
        } else {
          // 通常のリアルタイム購読の場合 - 認証されたクライアントを使用
          try {
            // 購読時に使用したクライアントがあれば、それを使用
            if (subscription.clientInstance) {
              await subscription.clientInstance.removeChannel(subscription)
            } else {
              // フォールバック: 新しい認証されたクライアントを作成
              const client = await this.createAuthenticatedClient()
              await client.removeChannel(subscription)
            }
          } catch (removeError) {
            console.warn('チャンネル削除でエラーが発生しましたが、購読は解除されました:', removeError)
          }
        }
        this.subscriptions.delete(userId)
        this.retryCount.delete(userId)
        console.log('リアルタイム購読を解除しました:', userId)
      }
    } catch (error) {
      console.error('購読解除エラー:', error)
    }
  }

  // すべての購読を解除（認証クライアント対応）
  async unsubscribeAll() {
    try {
      const subscriptions = Array.from(this.subscriptions.entries())
      for (const [userId, subscription] of subscriptions) {
        if (subscription.isPolling) {
          subscription.unsubscribe()
        } else {
          try {
            if (subscription.clientInstance) {
              await subscription.clientInstance.removeChannel(subscription)
            } else {
              const client = await this.createAuthenticatedClient()
              await client.removeChannel(subscription)
            }
          } catch (removeError) {
            console.warn('チャンネル削除でエラーが発生しました:', removeError)
          }
        }
      }
      this.subscriptions.clear()
      this.retryCount.clear()
      console.log('すべてのリアルタイム購読を解除しました')
    } catch (error) {
      console.error('全購読解除エラー:', error)
    }
  }

  // 高度なクエリメソッド（認証対応版）
  async executeSelectQuery(table: string, filters?: Record<string, any>, select = '*', token?: string) {
    try {
      console.log('SELECTクエリを実行中:', { table, filters, select })

      const client = await this.createAuthenticatedClient(token)
      let query = client.from(table).select(select)

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      const { data, error } = await query
      
      if (error) throw error
      
      console.log('SELECTクエリ実行成功:', data)
      return { data, error: null }
    } catch (error) {
      console.error('SELECTクエリ実行エラー:', error)
      return { data: null, error }
    }
  }

  async executeInsertQuery(table: string, data: any, token?: string) {
    try {
      console.log('INSERTクエリを実行中:', { table, data })

      const client = await this.createAuthenticatedClient(token)
      const { data: result, error } = await client
        .from(table)
        .insert(data)
        .select()
      
      if (error) throw error
      
      console.log('INSERTクエリ実行成功:', result)
      return { data: result, error: null }
    } catch (error) {
      console.error('INSERTクエリ実行エラー:', error)
      return { data: null, error }
    }
  }

  async executeUpdateQuery(table: string, data: any, filters: Record<string, any>, token?: string) {
    try {
      console.log('UPDATEクエリを実行中:', { table, data, filters })

      const client = await this.createAuthenticatedClient(token)
      let query = client.from(table).update(data)

      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })

      const { data: result, error } = await query.select()
      
      if (error) throw error
      
      console.log('UPDATEクエリ実行成功:', result)
      return { data: result, error: null }
    } catch (error) {
      console.error('UPDATEクエリ実行エラー:', error)
      return { data: null, error }
    }
  }

  // 接続状態の確認
  getConnectionStatus() {
    return {
      activeSubscriptions: this.subscriptions.size,
      subscriptionDetails: Array.from(this.subscriptions.entries()).map(([userId, subscription]) => ({
        userId,
        type: subscription.isPolling ? 'polling' : 'realtime',
        status: subscription.isPolling ? 'active' : 'unknown'
      }))
    }
  }
}

// シングルトンインスタンス
export const mcpSupabase = new EnhancedSupabaseClient()

// 初期化関数（認証対応版）
export const initializeMCPSupabase = async () => {
  console.log('高度なSupabaseクライアントの初期化完了')
  
  // リアルタイム機能の確認（認証なしクライアントで基本チェックのみ）
  try {
    // 基本的な接続確認のみ（認証は不要）
    const client = await import('@supabase/supabase-js').then(mod => 
      mod.createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    )
    const realtimeStatus = client.realtime.isConnected()
    console.log('Supabaseリアルタイム接続状態:', realtimeStatus)
  } catch (error) {
    console.warn('リアルタイム状態確認エラー:', error)
  }
  
  return Promise.resolve()
} 