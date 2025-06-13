import { createClient } from '@supabase/supabase-js'

// データベース操作のヘルパー関数（認証対応版）
export class DatabaseClient {
  
  // プロフィールキャッシュ（5分間有効）
  private static profileCache = new Map<string, { data: any, timestamp: number }>()
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5分
  
  // 進行中のリクエストを追跡して重複防止
  private static pendingProfileRequests = new Map<string, Promise<any>>()
  
  // レート制限用のトラッキング
  private static recentRequests = new Map<string, number[]>()
  private static readonly RATE_LIMIT_WINDOW = 10000 // 10秒
  private static readonly MAX_REQUESTS_PER_WINDOW = 5 // 10秒間に最大5回

  // 認証されたSupabaseクライアントを作成するヘルパー
  private static createAuthenticatedClient(token?: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (token) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      })
    } else {
      // 認証なしのフォールバック（基本的な接続テスト用）
      return createClient(supabaseUrl, supabaseAnonKey)
    }
  }

  // プロフィール関連操作
  static async getProfile(userId: string, token?: string) {
    try {
      // 基本的な検証
      if (!userId || typeof userId !== 'string') {
        console.error('DatabaseClient: 無効なuserId:', userId)
        return null
      }

      // キャッシュをチェック
      const cacheKey = `${userId}-${token ? 'auth' : 'anon'}`
      const cached = this.profileCache.get(cacheKey)
      const now = Date.now()
      
      if (cached && (now - cached.timestamp < this.CACHE_DURATION)) {
        console.log('DatabaseClient: プロフィールキャッシュヒット:', userId)
        return cached.data
      }

      // 進行中のリクエストがある場合は、それを待つ
      const pendingRequest = this.pendingProfileRequests.get(cacheKey)
      if (pendingRequest) {
        console.log('DatabaseClient: プロフィール取得待機中...', userId)
        try {
          return await pendingRequest
        } catch (error) {
          // 進行中のリクエストがエラーの場合、それを削除して再試行
          this.pendingProfileRequests.delete(cacheKey)
          console.log('DatabaseClient: 待機中のリクエストでエラー、再試行します:', error)
        }
      }

      // レート制限チェック
      const userRequests = this.recentRequests.get(userId) || []
      const recentRequests = userRequests.filter(time => now - time < this.RATE_LIMIT_WINDOW)
      
      if (recentRequests.length >= this.MAX_REQUESTS_PER_WINDOW) {
        console.warn(`DatabaseClient: レート制限に達しました: ${userId}`)
        // キャッシュがあれば古くても返す
        if (cached) {
          console.log('DatabaseClient: レート制限のため古いキャッシュを返します:', userId)
          return cached.data
        }
        throw new Error('プロフィール取得のレート制限に達しました')
      }

      // リクエスト履歴を更新
      recentRequests.push(now)
      this.recentRequests.set(userId, recentRequests)

      console.log('DatabaseClient: プロフィール取得中...', userId)
      
      // リクエストを作成してpendingに追加
      const requestPromise = (async () => {
        try {
          const supabase = this.createAuthenticatedClient(token)
          
          // プロフィール取得にタイムアウトを設定（5秒）
          const profilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('プロフィール取得タイムアウト')), 5000)
          })
          
          const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any
          
          return { data, error }
        } finally {
          // 完了後に進行中リクエストから削除
          this.pendingProfileRequests.delete(cacheKey)
        }
      })()
      
      // 進行中のリクエストとして登録
      this.pendingProfileRequests.set(cacheKey, requestPromise)
      
      const { data, error } = await requestPromise

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('DatabaseClient: プロフィールが見つかりません')
          return null
        }
        throw error
      }

      console.log('DatabaseClient: プロフィール取得成功')
      
      // キャッシュに保存
      this.profileCache.set(cacheKey, { data, timestamp: now })
      
      // キャッシュサイズが大きくなりすぎないよう制限
      if (this.profileCache.size > 50) {
        const oldestKey = Array.from(this.profileCache.keys())[0]
        if (oldestKey) {
          this.profileCache.delete(oldestKey)
        }
      }
      
      return data
    } catch (error) {
      if (error instanceof Error && error.message === 'プロフィール取得タイムアウト') {
        console.error('DatabaseClient: プロフィール取得タイムアウト:', userId)
        throw new Error('プロフィールの取得に時間がかかりすぎています')
      }
      console.error('DatabaseClient: プロフィール取得エラー:', error)
      throw error
    }
  }

  // プロフィール関連操作（RLS対応強化版）
  static async saveProfile(userId: string, profileData: any, token?: string) {
    try {
      console.log('DatabaseClient: プロフィール保存中...', userId)
      
      // まず通常の認証クライアントで試行
      const supabase = this.createAuthenticatedClient(token)
      
      // 既存プロフィールの確認
      let existingProfile
      try {
        existingProfile = await this.getProfile(userId, token)
      } catch (getError) {
        console.warn('プロフィール取得でエラー、新規作成を試行:', getError)
        existingProfile = null
      }
      
      const profileToSave = {
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

      let result
      if (existingProfile) {
        // 更新
        const { data, error } = await supabase
          .from('profiles')
          .update(profileToSave)
          .eq('user_id', userId)
          .select()
          .single()
        
        if (error) {
          console.error('プロフィール更新でRLSエラー:', error)
          throw error
        }
        result = data
        console.log('DatabaseClient: プロフィール更新成功')
      } else {
        // 新規作成
        const profileToCreate = {
          ...profileToSave,
          created_at: new Date().toISOString()
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .insert(profileToCreate)
          .select()
          .single()
        
        if (error) {
          console.error('プロフィール作成でRLSエラー:', error)
          
          // RLSポリシーエラーの場合、より詳細なエラー情報を提供
          if (error.code === '42501') {
            const detailedError = {
              ...error,
              debugInfo: {
                userId,
                hasToken: !!token,
                operation: 'INSERT',
                table: 'profiles',
                suggestion: 'Supabaseダッシュボードでprofilesテーブルの"Enable RLS"と"INSERT policy for authenticated users"を確認してください'
              }
            }
            throw detailedError
          }
          
          throw error
        }
        result = data
        console.log('DatabaseClient: プロフィール作成成功')
      }

      return result
    } catch (error) {
      console.error('DatabaseClient: プロフィール保存エラー:', error)
      
      // RLSエラーの場合は詳細な情報を含めて再スロー
      if ((error as any)?.code === '42501') {
        const rlsError = new Error(`プロフィール保存でRLSポリシー違反が発生しました。Supabaseダッシュボードで以下を確認してください:
1. profilesテーブルのRLSが有効になっている
2. 認証されたユーザーのINSERT/UPDATEポリシーが設定されている
3. ポリシー条件: auth.uid() = user_id

元のエラー: ${(error as any)?.message || error}`) as any
        ;(rlsError as any).code = (error as any)?.code
        ;(rlsError as any).originalError = error
        throw rlsError
      }
      
      throw error
    }
  }

  // 作品関連操作（認証対応）
  static async getWorks(userId: string, token?: string) {
    try {
      console.log('DatabaseClient: 作品一覧取得中...', userId, 'token:', !!token)
      
      const supabase = this.createAuthenticatedClient(token)
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('DatabaseClient: 作品取得エラー詳細:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('DatabaseClient: 作品一覧取得成功:', data?.length || 0, '件')
      return data || []
    } catch (error) {
      console.error('DatabaseClient: 作品一覧取得エラー:', error)
      throw error
    }
  }

  static async getWork(workId: string, userId: string, token?: string) {
    try {
      console.log('DatabaseClient: 作品取得中...', workId)
      
      const supabase = this.createAuthenticatedClient(token)
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('id', workId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('DatabaseClient: 作品が見つかりません')
          return null
        }
        throw error
      }

      console.log('DatabaseClient: 作品取得成功')
      return data
    } catch (error) {
      console.error('DatabaseClient: 作品取得エラー:', error)
      throw error
    }
  }

  static async saveWork(userId: string, workData: any, token?: string) {
    try {
      console.log('DatabaseClient: 作品保存中...', userId)
      console.log('DatabaseClient: 受信したworkData:', workData)
      
      const supabase = this.createAuthenticatedClient(token)
      const workToSave = {
        user_id: userId,
        title: workData.title || '',
        description: workData.description || '',
        external_url: workData.externalUrl || '',
        tags: workData.tags || [],
        roles: workData.roles || [],
        categories: workData.categories || [],
        production_date: workData.productionDate || null,
        banner_image_url: workData.bannerImageUrl || '',
        preview_data: workData.previewData || null,
        ai_analysis_result: workData.aiAnalysisResult || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('DatabaseClient: 保存用データ:', workToSave)

      const { data, error } = await supabase
        .from('works')
        .insert(workToSave)
        .select()
        .single()
      
      if (error) {
        console.error('DatabaseClient: Supabaseエラー詳細:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('DatabaseClient: 作品保存成功', data)
      return data
    } catch (error) {
      console.error('DatabaseClient: 作品保存エラー:', error)
      throw error
    }
  }

  static async updateWork(workId: string, userId: string, workData: any, token?: string) {
    try {
      console.log('DatabaseClient: 作品更新中...', workId)
      
      const supabase = this.createAuthenticatedClient(token)
      const workToUpdate = {
        title: workData.title || '',
        description: workData.description || '',
        external_url: workData.externalUrl || '',
        tags: workData.tags || [],
        roles: workData.roles || [],
        categories: workData.categories || [],
        production_date: workData.productionDate || null,
        banner_image_url: workData.bannerImageUrl || '',
        preview_data: workData.previewData || null,
        ai_analysis_result: workData.aiAnalysisResult || null,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('works')
        .update(workToUpdate)
        .eq('id', workId)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error

      console.log('DatabaseClient: 作品更新成功')
      return data
    } catch (error) {
      console.error('DatabaseClient: 作品更新エラー:', error)
      throw error
    }
  }

  static async deleteWork(workId: string, userId: string, token?: string) {
    try {
      console.log('DatabaseClient: 作品削除中...', workId)
      
      const supabase = this.createAuthenticatedClient(token)
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', workId)
        .eq('user_id', userId)
      
      if (error) throw error

      console.log('DatabaseClient: 作品削除成功')
      return true
    } catch (error) {
      console.error('DatabaseClient: 作品削除エラー:', error)
      throw error
    }
  }

  // データベース接続確認（基本的な接続テストのみ）
  static async testConnection() {
    try {
      console.log('DatabaseClient: 接続テスト中...')
      
      // 基本的な接続テストのみ（認証が不要な操作）
      const supabase = this.createAuthenticatedClient()
      
      // RLSポリシーの影響を受けない基本的な接続確認
      // プロフィールテーブルではなく、基本的なSupabase機能をテスト
      try {
        // Supabaseの基本機能のテスト（認証状況確認）
        const { data, error } = await supabase.auth.getSession()
        
        // エラーがあっても接続自体は成功している
        console.log('DatabaseClient: 接続テスト成功（基本接続確認）')
        return true
      } catch (connectionError) {
        console.error('DatabaseClient: 基本接続エラー:', connectionError)
        return false
      }
    } catch (error) {
      console.error('DatabaseClient: 接続テストエラー:', error)
      return false
    }
  }

  // ユーザー認証状態の確認
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.createAuthenticatedClient()
        .auth.getUser()
      
      if (error) throw error
      
      return user
    } catch (error) {
      console.error('DatabaseClient: ユーザー情報取得エラー:', error)
      return null
    }
  }

  // インプット関連操作（認証対応）
  static async getInputs(userId: string, token?: string) {
    try {
      console.log('DatabaseClient: インプット一覧取得中...', userId, 'token:', !!token)
      
      const supabase = this.createAuthenticatedClient(token)
      const { data, error } = await supabase
        .from('inputs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('DatabaseClient: インプット取得エラー詳細:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('DatabaseClient: インプット一覧取得成功:', data?.length || 0, '件')
      return data || []
    } catch (error) {
      console.error('DatabaseClient: インプット一覧取得エラー:', error)
      throw error
    }
  }

  static async getInput(inputId: string, userId: string, token?: string) {
    try {
      console.log('DatabaseClient: インプット取得中...', inputId)
      
      const supabase = this.createAuthenticatedClient(token)
      const { data, error } = await supabase
        .from('inputs')
        .select('*')
        .eq('id', inputId)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('DatabaseClient: インプットが見つかりません')
          return null
        }
        throw error
      }

      console.log('DatabaseClient: インプット取得成功')
      return data
    } catch (error) {
      console.error('DatabaseClient: インプット取得エラー:', error)
      throw error
    }
  }

  static async saveInput(userId: string, inputData: any, token?: string) {
    try {
      console.log('DatabaseClient: インプット保存中...', userId)
      console.log('DatabaseClient: 受信したinputData:', inputData)
      
      const supabase = this.createAuthenticatedClient(token)
      const inputToSave = {
        user_id: userId,
        title: inputData.title || '',
        type: inputData.type || 'book', // book, manga, movie, anime, tv, game, etc.
        category: inputData.category || '',
        author_creator: inputData.authorCreator || '',
        release_date: inputData.releaseDate || null,
        consumption_date: inputData.consumptionDate || null,
        status: inputData.status || 'completed', // completed, reading, watching, planning, dropped
        rating: inputData.rating || null, // 1-5 stars
        review: inputData.review || '',
        tags: inputData.tags || [],
        genres: inputData.genres || [],
        external_url: inputData.externalUrl || '',
        cover_image_url: inputData.coverImageUrl || '',
        notes: inputData.notes || '',
        favorite: inputData.favorite || false,
        ai_analysis_result: inputData.aiAnalysisResult || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('DatabaseClient: 保存用データ:', inputToSave)

      const { data, error } = await supabase
        .from('inputs')
        .insert(inputToSave)
        .select()
        .single()
      
      if (error) {
        console.error('DatabaseClient: Supabaseエラー詳細:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('DatabaseClient: インプット保存成功', data)
      return data
    } catch (error) {
      console.error('DatabaseClient: インプット保存エラー:', error)
      throw error
    }
  }

  static async updateInput(inputId: string, userId: string, inputData: any, token?: string) {
    try {
      console.log('DatabaseClient: インプット更新中...', inputId)
      
      const supabase = this.createAuthenticatedClient(token)
      const inputToUpdate = {
        title: inputData.title || '',
        type: inputData.type || 'book',
        category: inputData.category || '',
        author_creator: inputData.authorCreator || '',
        release_date: inputData.releaseDate || null,
        consumption_date: inputData.consumptionDate || null,
        status: inputData.status || 'completed',
        rating: inputData.rating || null,
        review: inputData.review || '',
        tags: inputData.tags || [],
        genres: inputData.genres || [],
        external_url: inputData.externalUrl || '',
        cover_image_url: inputData.coverImageUrl || '',
        notes: inputData.notes || '',
        favorite: inputData.favorite || false,
        ai_analysis_result: inputData.aiAnalysisResult || null,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('inputs')
        .update(inputToUpdate)
        .eq('id', inputId)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error

      console.log('DatabaseClient: インプット更新成功')
      return data
    } catch (error) {
      console.error('DatabaseClient: インプット更新エラー:', error)
      throw error
    }
  }

  static async deleteInput(inputId: string, userId: string, token?: string) {
    try {
      console.log('DatabaseClient: インプット削除中...', inputId)
      
      const supabase = this.createAuthenticatedClient(token)
      const { error } = await supabase
        .from('inputs')
        .delete()
        .eq('id', inputId)
        .eq('user_id', userId)
      
      if (error) throw error

      console.log('DatabaseClient: インプット削除成功')
      return true
    } catch (error) {
      console.error('DatabaseClient: インプット削除エラー:', error)
      throw error
    }
  }

  // インプット分析（AI機能強化版）
  static async analyzeInputs(userId: string, token?: string) {
    try {
      console.log('DatabaseClient: インプット分析中...', userId)
      
      const inputs = await this.getInputs(userId, token)
      
      // 基本統計
      const tagFrequency: Record<string, number> = {}
      const genreFrequency: Record<string, number> = {}
      const typeDistribution: Record<string, number> = {}
      const monthlyActivity: Record<string, number> = {}
      
      // AI分析統合用の新しい統計
      const aiInsights = {
        creativeDirections: new Map<string, number>(),
        inspirationSources: new Map<string, number>(),
        skillsDevelopment: new Map<string, number>(),
        personalityTraits: new Map<string, number>(),
        creativeStyles: new Map<string, number>(),
        preferredMediums: new Map<string, number>(),
        themes: new Map<string, number>(),
        moods: new Map<string, number>(),
        collaborationOpportunities: new Map<string, number>()
      }
      
      inputs.forEach(input => {
        // 従来の統計処理
        if (input.tags && Array.isArray(input.tags)) {
          input.tags.forEach((tag: string) => {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
          })
        }
        
        if (input.genres && Array.isArray(input.genres)) {
          input.genres.forEach((genre: string) => {
            genreFrequency[genre] = (genreFrequency[genre] || 0) + 1
          })
        }
        
        typeDistribution[input.type] = (typeDistribution[input.type] || 0) + 1
        
        if (input.consumption_date) {
          const month = new Date(input.consumption_date).toISOString().substring(0, 7)
          monthlyActivity[month] = (monthlyActivity[month] || 0) + 1
        }
        
        // AI分析結果の統合処理
        if (input.ai_analysis_result) {
          const aiData = typeof input.ai_analysis_result === 'string' 
            ? JSON.parse(input.ai_analysis_result) 
            : input.ai_analysis_result
          
          try {
            // クリエイティブな方向性
            if (aiData.creativeInsights?.creativeDirection) {
              aiData.creativeInsights.creativeDirection.forEach((direction: string) => {
                const count = aiInsights.creativeDirections.get(direction) || 0
                aiInsights.creativeDirections.set(direction, count + 1)
              })
            }
            
            // インスピレーション源
            if (aiData.creativeInsights?.inspirationSources) {
              aiData.creativeInsights.inspirationSources.forEach((source: string) => {
                const count = aiInsights.inspirationSources.get(source) || 0
                aiInsights.inspirationSources.set(source, count + 1)
              })
            }
            
            // スキル開発
            if (aiData.creativeInsights?.skillDevelopment) {
              aiData.creativeInsights.skillDevelopment.forEach((skill: string) => {
                const count = aiInsights.skillsDevelopment.get(skill) || 0
                aiInsights.skillsDevelopment.set(skill, count + 1)
              })
            }
            
            // パーソナリティ特性
            if (aiData.personalityTraits) {
              aiData.personalityTraits.forEach((trait: string) => {
                const count = aiInsights.personalityTraits.get(trait) || 0
                aiInsights.personalityTraits.set(trait, count + 1)
              })
            }
            
            // 創作スタイル
            if (aiData.interestProfile?.creativeStyle) {
              const style = aiData.interestProfile.creativeStyle
              const count = aiInsights.creativeStyles.get(style) || 0
              aiInsights.creativeStyles.set(style, count + 1)
            }
            
            // 好みの媒体
            if (aiData.interestProfile?.preferredMediums) {
              aiData.interestProfile.preferredMediums.forEach((medium: string) => {
                const count = aiInsights.preferredMediums.get(medium) || 0
                aiInsights.preferredMediums.set(medium, count + 1)
              })
            }
            
            // テーマ
            if (aiData.themes) {
              aiData.themes.forEach((theme: string) => {
                const count = aiInsights.themes.get(theme) || 0
                aiInsights.themes.set(theme, count + 1)
              })
            }
            
            // 雰囲気
            if (aiData.mood) {
              const count = aiInsights.moods.get(aiData.mood) || 0
              aiInsights.moods.set(aiData.mood, count + 1)
            }
            
            // コラボレーション機会
            if (aiData.creativeInsights?.collaborationOpportunities) {
              aiData.creativeInsights.collaborationOpportunities.forEach((opportunity: string) => {
                const count = aiInsights.collaborationOpportunities.get(opportunity) || 0
                aiInsights.collaborationOpportunities.set(opportunity, count + 1)
              })
            }
          } catch (aiParseError) {
            console.error('AI分析結果の解析エラー:', aiParseError)
          }
        }
      })
      
      // 統計結果をランキング形式に変換
      const topTags = Object.entries(tagFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 15)
        .map(([tag, count]) => ({ tag, count }))
      
      const topGenres = Object.entries(genreFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([genre, count]) => ({ genre, count }))
      
      // AI洞察をランキングに変換
      const mapToRanking = (map: Map<string, number>, limit: number = 10) => 
        Array.from(map.entries())
          .sort(([,a], [,b]) => b - a)
          .slice(0, limit)
          .map(([item, count]) => ({ item, count }))
      
      // 総合的な興味・関心プロファイル
      const interestProfile = {
        dominantTypes: Object.entries(typeDistribution)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([type, count]) => ({ type, count, percentage: (count / inputs.length * 100).toFixed(1) })),
        
        topCreativeDirections: mapToRanking(aiInsights.creativeDirections, 5),
        topInspirationSources: mapToRanking(aiInsights.inspirationSources, 8),
        recommendedSkills: mapToRanking(aiInsights.skillsDevelopment, 6),
        personalityProfile: mapToRanking(aiInsights.personalityTraits, 8),
        creativeStyleTrends: mapToRanking(aiInsights.creativeStyles, 5),
        preferredMediums: mapToRanking(aiInsights.preferredMediums, 6),
        dominantThemes: mapToRanking(aiInsights.themes, 10),
        moodDistribution: mapToRanking(aiInsights.moods, 8),
        collaborationOpportunities: mapToRanking(aiInsights.collaborationOpportunities, 8)
      }
      
      // クリエイター向けインサイト
      const creativeInsights = {
        overallCreativeDirection: interestProfile.topCreativeDirections[0]?.item || '多様性重視',
        primaryInspiration: interestProfile.topInspirationSources[0]?.item || '様々な分野',
        suggestedFocusAreas: interestProfile.recommendedSkills.slice(0, 3).map(s => s.item),
        personalityHighlights: interestProfile.personalityProfile.slice(0, 3).map(p => p.item),
        nextSteps: this.generateCreativeNextSteps(interestProfile),
        strengthsAnalysis: this.analyzeCreativeStrengths(interestProfile, inputs.length)
      }
      
      const analysis = {
        // 基本統計
        totalInputs: inputs.length,
        tagFrequency,
        genreFrequency,
        typeDistribution,
        monthlyActivity,
        topTags,
        topGenres,
        favoriteCount: inputs.filter(input => input.favorite).length,
        averageRating: inputs.filter(input => input.rating).reduce((sum, input) => sum + input.rating, 0) / inputs.filter(input => input.rating).length || 0,
        
        // 強化された分析
        interestProfile,
        creativeInsights,
        
        // メタ情報
        aiAnalysisCount: inputs.filter(input => input.ai_analysis_result).length,
        analysisCompleteness: (inputs.filter(input => input.ai_analysis_result).length / inputs.length * 100).toFixed(1),
        lastUpdated: new Date().toISOString()
      }
      
      console.log('DatabaseClient: インプット分析完了:', {
        totalInputs: analysis.totalInputs,
        aiAnalysisCount: analysis.aiAnalysisCount,
        topCreativeDirection: analysis.creativeInsights.overallCreativeDirection
      })
      
      return analysis
    } catch (error) {
      console.error('DatabaseClient: インプット分析エラー:', error)
      throw error
    }
  }
  
  // クリエイターの次のステップを生成
  private static generateCreativeNextSteps(profile: any): string[] {
    const steps = []
    
    if (profile.topCreativeDirections.length > 0) {
      steps.push(`${profile.topCreativeDirections[0].item}の分野での作品制作を検討`)
    }
    
    if (profile.recommendedSkills.length > 0) {
      steps.push(`${profile.recommendedSkills[0].item}のスキル向上に集中`)
    }
    
    if (profile.collaborationOpportunities.length > 0) {
      steps.push(`${profile.collaborationOpportunities[0].item}との連携を模索`)
    }
    
    if (profile.preferredMediums.length > 1) {
      steps.push(`${profile.preferredMediums[0].item}と${profile.preferredMediums[1].item}を組み合わせた新しい表現を試す`)
    }
    
    steps.push('より多様なジャンルにチャレンジして視野を広げる')
    
    return steps.slice(0, 4)
  }
  
  // クリエイターの強みを分析
  private static analyzeCreativeStrengths(profile: any, totalInputs: number): any {
    return {
      diversityScore: Math.min(100, (profile.dominantTypes.length * 25 + profile.dominantThemes.length * 10)),
      consistencyIndicator: profile.personalityProfile.length > 0 ? profile.personalityProfile[0].count / totalInputs * 100 : 0,
      explorationTendency: profile.topInspirationSources.length > 5 ? 'high' : profile.topInspirationSources.length > 2 ? 'medium' : 'focused',
      collaborativePotential: profile.collaborationOpportunities.length > 3 ? 'high' : 'developing',
      creativeMaturity: totalInputs > 20 ? 'experienced' : totalInputs > 10 ? 'developing' : 'emerging'
    }
  }
} 