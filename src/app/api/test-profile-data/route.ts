import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { DatabaseClient } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // 認証ヘッダーを取得
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    // ユーザー認証
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      )
    }

    // プロフィールデータを取得
    const profile = await DatabaseClient.getProfile(user.id, token)
    
    // テスト結果を整理
    const testResults = {
      userId: user.id,
      userEmail: user.email,
      profileExists: !!profile,
      profileData: profile,
      keyFields: {
        displayName: profile?.display_name || null,
        bio: profile?.bio || null,
        introduction: profile?.introduction || null,
        avatarImageUrl: profile?.avatar_image_url || null,
        backgroundImageUrl: profile?.background_image_url || null,
        portfolioVisibility: profile?.portfolio_visibility || null,
        skills: profile?.skills || [],
        professions: profile?.professions || [],
        location: profile?.location || null,
        websiteUrl: profile?.website_url || null
      },
      timestamps: {
        createdAt: profile?.created_at || null,
        updatedAt: profile?.updated_at || null
      }
    }
    
    return NextResponse.json(testResults)
    
  } catch (error) {
    console.error('プロフィールデータテストエラー:', error)
    return NextResponse.json(
      { error: 'テスト実行中にエラーが発生しました', details: error },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 認証ヘッダーを取得
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    // ユーザー認証
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '認証に失敗しました' },
        { status: 401 }
      )
    }

    // テスト用のプロフィールデータを作成
    const testProfileData = {
      displayName: 'テストユーザー',
      bio: 'これはテスト用のプロフィールです',
      introduction: 'これは詳細な自己紹介のテストです。この機能が正しく動作しているかを確認しています。',
      professions: ['Web開発者', 'デザイナー'],
      skills: ['React', 'Next.js', 'TypeScript'],
      location: '東京都',
      websiteUrl: 'https://example.com',
      portfolioVisibility: 'public',
      avatarImageUrl: 'https://example.com/avatar.jpg',
      backgroundImageUrl: 'https://example.com/background.jpg'
    }
    
    // プロフィールを保存
    const savedProfile = await DatabaseClient.saveProfile(user.id, testProfileData, token)
    
    // 保存後にデータを再取得して確認
    const retrievedProfile = await DatabaseClient.getProfile(user.id, token)
    
    const testResults = {
      success: true,
      message: 'テスト用プロフィールデータを保存・取得しました',
      userId: user.id,
      savedProfile: savedProfile,
      retrievedProfile: retrievedProfile,
      fieldComparison: {
        displayName: {
          sent: testProfileData.displayName,
          saved: retrievedProfile?.display_name,
          matched: testProfileData.displayName === retrievedProfile?.display_name
        },
        bio: {
          sent: testProfileData.bio,
          saved: retrievedProfile?.bio,
          matched: testProfileData.bio === retrievedProfile?.bio
        },
        introduction: {
          sent: testProfileData.introduction,
          saved: retrievedProfile?.introduction,
          matched: testProfileData.introduction === retrievedProfile?.introduction
        },
        avatarImageUrl: {
          sent: testProfileData.avatarImageUrl,
          saved: retrievedProfile?.avatar_image_url,
          matched: testProfileData.avatarImageUrl === retrievedProfile?.avatar_image_url
        },
        backgroundImageUrl: {
          sent: testProfileData.backgroundImageUrl,
          saved: retrievedProfile?.background_image_url,
          matched: testProfileData.backgroundImageUrl === retrievedProfile?.background_image_url
        }
      }
    }
    
    return NextResponse.json(testResults)
    
  } catch (error) {
    console.error('プロフィールデータ保存テストエラー:', error)
    return NextResponse.json(
      { error: 'テスト実行中にエラーが発生しました', details: error },
      { status: 500 }
    )
  }
} 