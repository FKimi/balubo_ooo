import { supabase } from './supabase'
import { Users, Heart, MessageSquare, User } from 'lucide-react'
import { ReactNode } from 'react'
import React from 'react'

export type NotificationType = 
  | 'connection_request'
  | 'connection_approved'
  | 'connection_declined'
  | 'new_review'
  | 'new_like'
  | 'new_comment'
  | 'work_featured'

export type RelatedEntityType = 'user' | 'work' | 'review' | 'comment' | 'like'

export interface CreateNotificationParams {
  userId: string
  type: NotificationType
  message: string
  relatedEntityId?: string
  relatedEntityType?: RelatedEntityType
}

/**
 * 通知を作成する
 */
export async function createNotification({
  userId,
  type,
  message,
  relatedEntityId,
  relatedEntityType
}: CreateNotificationParams): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        related_entity_id: relatedEntityId,
        related_entity_type: relatedEntityType
      })
      .select('id')
      .single()

    if (error) {
      console.error('通知作成エラー:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('通知作成エラー:', error)
    return null
  }
}

/**
 * つながり申請通知を作成
 */
export async function createConnectionRequestNotification(
  requesterId: string,
  requesteeId: string,
  requesterName: string
): Promise<string | null> {
  return createNotification({
    userId: requesteeId,
    type: 'connection_request',
    message: `${requesterName}さんからつながり申請が届きました`,
    relatedEntityId: requesterId,
    relatedEntityType: 'user'
  })
}

/**
 * つながり承認通知を作成
 */
export async function createConnectionApprovedNotification(
  requesteeId: string,
  requesterId: string,
  requesteeName: string
): Promise<string | null> {
  return createNotification({
    userId: requesterId,
    type: 'connection_approved',
    message: `${requesteeName}さんがあなたのつながり申請を承認しました`,
    relatedEntityId: requesteeId,
    relatedEntityType: 'user'
  })
}

/**
 * つながり拒否通知を作成
 */
export async function createConnectionDeclinedNotification(
  requesteeId: string,
  requesterId: string,
  requesteeName: string
): Promise<string | null> {
  return createNotification({
    userId: requesterId,
    type: 'connection_declined',
    message: `${requesteeName}さんがあなたのつながり申請を拒否しました`,
    relatedEntityId: requesteeId,
    relatedEntityType: 'user'
  })
}

/**
 * レビュー通知を作成
 */
export async function createReviewNotification(
  reviewerId: string,
  revieweeId: string,
  workId: string,
  reviewerName: string,
  workTitle: string
): Promise<string | null> {
  return createNotification({
    userId: revieweeId,
    type: 'new_review',
    message: `${reviewerName}さんが「${workTitle}」にレビューを投稿しました`,
    relatedEntityId: workId,
    relatedEntityType: 'work'
  })
}

/**
 * いいね通知を作成
 */
export async function createLikeNotification(
  likerId: string,
  workOwnerId: string,
  workId: string,
  likerName: string,
  workTitle: string
): Promise<string | null> {
  // 自分自身の作品へのいいねは通知しない
  if (likerId === workOwnerId) {
    return null
  }

  return createNotification({
    userId: workOwnerId,
    type: 'new_like',
    message: `${likerName}さんが「${workTitle}」にいいねしました`,
    relatedEntityId: workId,
    relatedEntityType: 'work'
  })
}

/**
 * コメント通知を作成
 */
export async function createCommentNotification(
  commenterId: string,
  workOwnerId: string,
  workId: string,
  commenterName: string,
  workTitle: string
): Promise<string | null> {
  // 自分自身の作品へのコメントは通知しない
  if (commenterId === workOwnerId) {
    return null
  }

  return createNotification({
    userId: workOwnerId,
    type: 'new_comment',
    message: `${commenterName}さんが「${workTitle}」にコメントしました`,
    relatedEntityId: workId,
    relatedEntityType: 'work'
  })
} 

/**
 * 通知タイプに応じたアイコン名を返す
 */
export function getNotificationIconName(type: string): string {
  switch (type) {
    case 'connection_request':
    case 'connection_approved':
    case 'connection_declined':
      return 'Users'
    case 'new_like':
      return 'Heart'
    case 'new_comment':
      return 'MessageSquare'
    case 'new_review':
      return 'User'
    default:
      return 'User'
  }
}

/**
 * 通知タイプに応じた色クラスを返す
 */
export function getNotificationColor(type: string): string {
  switch (type) {
    case 'connection_request':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'connection_approved':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'connection_declined':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'new_like':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'new_comment':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'new_review':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
} 