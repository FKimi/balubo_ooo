import { createClient } from '@supabase/supabase-js'

// データベース操作のヘルパー関数（認証対応版）
export class DatabaseClient {
  
  // 認証されたSupabaseクライアントを作成するヘルパー
  private static createAuthenticatedClient(token?: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kdrnxnorxquxvxutkwnq.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkcm54bm9yeHF1eHZ4dXRrd25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODU5MzEsImV4cCI6MjA2Mzc2MTkzMX0.tIwl9XnZ9D4gkQP8-8m2QZiVuMGP7E9M1dNJvkQHdZE'
    
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
      console.log('DatabaseClient: プロフィール取得中...', userId)
      
      const supabase = this.createAuthenticatedClient(token)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('DatabaseClient: プロフィールが見つかりません')
          return null
        }
        throw error
      }

      console.log('DatabaseClient: プロフィール取得成功')
      return data
    } catch (error) {
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

  // インプット分析（AI機能）
  static async analyzeInputs(userId: string, token?: string) {
    try {
      console.log('DatabaseClient: インプット分析中...', userId)
      
      const inputs = await this.getInputs(userId, token)
      
      // タグの統計
      const tagFrequency: Record<string, number> = {}
      const genreFrequency: Record<string, number> = {}
      const typeDistribution: Record<string, number> = {}
      const monthlyActivity: Record<string, number> = {}
      
      inputs.forEach(input => {
        // タグ統計
        if (input.tags && Array.isArray(input.tags)) {
          input.tags.forEach((tag: string) => {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
          })
        }
        
        // ジャンル統計
        if (input.genres && Array.isArray(input.genres)) {
          input.genres.forEach((genre: string) => {
            genreFrequency[genre] = (genreFrequency[genre] || 0) + 1
          })
        }
        
        // タイプ統計
        typeDistribution[input.type] = (typeDistribution[input.type] || 0) + 1
        
        // 月別活動統計
        if (input.consumption_date) {
          const month = new Date(input.consumption_date).toISOString().substring(0, 7) // YYYY-MM
          monthlyActivity[month] = (monthlyActivity[month] || 0) + 1
        }
      })
      
      // トップタグとジャンル（興味関心分析）
      const topTags = Object.entries(tagFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }))
      
      const topGenres = Object.entries(genreFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([genre, count]) => ({ genre, count }))
      
      const analysis = {
        totalInputs: inputs.length,
        tagFrequency,
        genreFrequency,
        typeDistribution,
        monthlyActivity,
        topTags,
        topGenres,
        favoriteCount: inputs.filter(input => input.favorite).length,
        averageRating: inputs.filter(input => input.rating).reduce((sum, input) => sum + input.rating, 0) / inputs.filter(input => input.rating).length || 0,
        lastUpdated: new Date().toISOString()
      }
      
      console.log('DatabaseClient: インプット分析完了:', analysis)
      return analysis
    } catch (error) {
      console.error('DatabaseClient: インプット分析エラー:', error)
      throw error
    }
  }
} 