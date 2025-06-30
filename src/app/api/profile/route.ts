import { NextRequest } from 'next/server'
import { DatabaseClient } from '@/lib/database'
import { withAuth, withOptionalAuth } from '@/lib/api-utils'

// レスポンスキャッシュを追加
export const revalidate = 30 // 30秒間キャッシュ

// プロフィール取得 (GET)
export async function GET(request: NextRequest) {
  return withOptionalAuth(request, async (userId, token) => {
    const searchParams = request.nextUrl.searchParams
    const targetUserId = searchParams.get('userId')
    
    // 自分のプロフィール取得の場合は認証が必要
    if (!targetUserId) {
      if (!userId) {
        throw new Error('認証が必要です')
      }
      const profile = await DatabaseClient.getProfile(userId, token)
      return { profile: profile || null }
    }
    
    // 他のユーザーのプロフィール取得
    const profile = await DatabaseClient.getProfile(targetUserId, token)
    return { profile: profile || null }
  })
}

// プロフィール保存・更新 (POST)
export async function POST(request: NextRequest) {
  return withAuth(request, async (userId, token) => {
      const profileData = await request.json()
    const result = await DatabaseClient.saveProfile(userId, profileData, token)

    return {
        success: true,
        profile: result,
        message: 'プロフィールを保存しました'
    }
  })
}

// プロフィール部分更新 (PUT)
export async function PUT(request: NextRequest) {
  return withAuth(request, async (userId, token) => {
    const profileData = await request.json()

    // 既存プロフィールを取得
    const existingProfile = await DatabaseClient.getProfile(userId, token)
      
    // 部分更新のデータをマージ
    const mergedData = { ...existingProfile, ...profileData }

    // 更新を実行
    const result = await DatabaseClient.saveProfile(userId, mergedData, token)

    return {
        success: true,
        profile: result,
        message: 'プロフィールを更新しました'
    }
  })
} 