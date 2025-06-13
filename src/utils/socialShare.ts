import type { WorkData } from '@/types/work'
import type { InputData } from '@/types/input'

// X（Twitter）共有用のデータ型
interface ShareData {
  text: string
  url?: string
  hashtags?: string[]
}

// 作品共有用メッセージ生成
export function generateWorkShareMessage(work: WorkData, userDisplayName: string = 'クリエイター'): ShareData {
  const contentTypeMap = {
    'article': '記事',
    'design': 'デザイン',
    'photo': '写真',
    'video': '動画',
    'podcast': 'ポッドキャスト',
    'event': 'イベント'
  }

  const contentTypeText = contentTypeMap[work.content_type as keyof typeof contentTypeMap] || '作品'
  
  // 基本メッセージ
  let message = `新しい${contentTypeText}作品を公開しました！\n\n📝 ${work.title}`
  
  // 説明文があれば追加（140文字制限を考慮）
  if (work.description && work.description.length > 0) {
    const maxDescLength = 50
    const desc = work.description.length > maxDescLength 
      ? work.description.substring(0, maxDescLength) + '...' 
      : work.description
    message += `\n\n${desc}`
  }

  // 文字数統計があれば追加
  if (work.content_type === 'article' && work.article_word_count && work.article_word_count > 0) {
    message += `\n\n📊 ${work.article_word_count.toLocaleString()}文字`
  }

  // 役割があれば追加
  if (work.roles && work.roles.length > 0) {
    const rolesText = work.roles.slice(0, 3).join('・')
    message += `\n🎯 ${rolesText}`
  }

  message += '\n\n#ポートフォリオ #クリエイター'

  // ハッシュタグ生成
  const hashtags = ['ポートフォリオ', 'クリエイター']
  
  // コンテンツタイプ別ハッシュタグ
  switch (work.content_type) {
    case 'article':
      hashtags.push('記事', 'ライター', 'ライティング')
      break
    case 'design':
      hashtags.push('デザイン', 'デザイナー', 'クリエイティブ')
      break
    case 'photo':
      hashtags.push('写真', 'フォトグラファー', '撮影')
      break
    case 'video':
      hashtags.push('動画', '映像制作', 'ビデオ')
      break
    case 'podcast':
      hashtags.push('ポッドキャスト', '音声配信', 'ラジオ')
      break
    case 'event':
      hashtags.push('イベント', '企画', 'イベント制作')
      break
  }

  // 作品タグを追加（最大3つまで）
  if (work.tags && work.tags.length > 0) {
    work.tags.slice(0, 3).forEach(tag => {
      if (tag.length <= 10) { // 長すぎるタグは除外
        hashtags.push(tag)
      }
    })
  }

  const result: ShareData = {
    text: message,
    hashtags: hashtags.slice(0, 10) // 最大10個まで
  }

  if (work.external_url) {
    result.url = work.external_url
  }

  return result
}

// インプット共有用メッセージ生成
export function generateInputShareMessage(input: InputData, userDisplayName: string = 'クリエイター'): ShareData {
  const typeMap = {
    'book': '本',
    'movie': '映画',
    'anime': 'アニメ',
    'manga': '漫画',
    'tv': 'TV番組',
    'game': 'ゲーム',
    'podcast': 'ポッドキャスト',
    'youtube': 'YouTube',
    'other': 'コンテンツ'
  }

  const typeText = typeMap[input.type as keyof typeof typeMap] || 'コンテンツ'
  
  // 基本メッセージ
  let message = `新しい${typeText}をインプットしました！\n\n📚 ${input.title}`
  
  // 作者がいれば追加
  if (input.authorCreator) {
    message += `\n👤 ${input.authorCreator}`
  }

  // 評価があれば追加
  if (input.rating && input.rating > 0) {
    const stars = '⭐'.repeat(input.rating)
    message += `\n⭐ ${stars} (${input.rating}/5)`
  }

  // メモ・感想があれば追加（抜粋）
  if (input.notes && input.notes.length > 0) {
    const maxNoteLength = 60
    const note = input.notes.length > maxNoteLength 
      ? input.notes.substring(0, maxNoteLength) + '...' 
      : input.notes
    message += `\n\n💭 ${note}`
  }

  message += '\n\n#インプット #学習記録'

  // ハッシュタグ生成
  const hashtags = ['インプット', '学習記録']
  
  // タイプ別ハッシュタグ
  switch (input.type) {
    case 'book':
      hashtags.push('読書', '本', '読書記録')
      break
    case 'movie':
      hashtags.push('映画', '映画鑑賞', 'シネマ')
      break
    case 'anime':
      hashtags.push('アニメ', 'アニメ鑑賞')
      break
    case 'manga':
      hashtags.push('漫画', 'マンガ', 'コミック')
      break
    case 'game':
      hashtags.push('ゲーム', 'ゲーム体験')
      break
    case 'podcast':
      hashtags.push('ポッドキャスト', '音声学習')
      break
    case 'youtube':
      hashtags.push('YouTube', '動画学習')
      break
    case 'tv':
      hashtags.push('TV番組', 'テレビ', '視聴記録')
      break
    case 'other':
      hashtags.push('その他', 'コンテンツ')
      break
  }

  // ジャンルタグを追加（最大3つまで）
  if (input.genres && input.genres.length > 0) {
    input.genres.slice(0, 3).forEach(genre => {
      if (genre.length <= 10) { // 長すぎるタグは除外
        hashtags.push(genre)
      }
    })
  }

  // カテゴリがあれば追加
  if (input.category && input.category.length <= 10) {
    hashtags.push(input.category)
  }

  const result: ShareData = {
    text: message,
    hashtags: hashtags.slice(0, 10) // 最大10個まで
  }

  if (input.externalUrl) {
    result.url = input.externalUrl
  }

  return result
}

// X共有URL生成
export function generateTwitterShareUrl(shareData: ShareData): string {
  const baseUrl = 'https://twitter.com/intent/tweet'
  const params = new URLSearchParams()

  // テキスト設定
  params.append('text', shareData.text)

  // URL設定
  if (shareData.url) {
    params.append('url', shareData.url)
  }

  // ハッシュタグ設定
  if (shareData.hashtags && shareData.hashtags.length > 0) {
    params.append('hashtags', shareData.hashtags.join(','))
  }

  return `${baseUrl}?${params.toString()}`
}

// 共有モーダル用コンポーネント用のデータ生成
export function generateShareModalData(type: 'work' | 'input', data: WorkData | InputData, userDisplayName?: string) {
  let shareData: ShareData
  
  if (type === 'work') {
    shareData = generateWorkShareMessage(data as WorkData, userDisplayName)
  } else {
    shareData = generateInputShareMessage(data as InputData, userDisplayName)
  }

  return {
    ...shareData,
    twitterUrl: generateTwitterShareUrl(shareData),
    preview: {
      type: type === 'work' ? '作品' : 'インプット',
      title: data.title,
      message: shareData.text
    }
  }
}

// 簡単共有（直接X画面を開く）
export function shareToTwitter(type: 'work' | 'input', data: WorkData | InputData, userDisplayName?: string) {
  try {
    const shareData = type === 'work' 
      ? generateWorkShareMessage(data as WorkData, userDisplayName)
      : generateInputShareMessage(data as InputData, userDisplayName)
    
    const twitterUrl = generateTwitterShareUrl(shareData)
    
    // 新しいタブでX共有画面を開く
    window.open(twitterUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes')
  } catch (error) {
    console.error('X共有エラー:', error)
  }
} 