import type { WorkData, InputData } from '@/types'

/**
 * 作品データからよく使用するタグを計算する
 */
export function calculateTopTags(works: WorkData[]): [string, number][] {
  const tagCount: { [key: string]: number } = {}
  
  works.forEach(work => {
    if (work.tags && Array.isArray(work.tags)) {
      work.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })
  
  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
}

/**
 * メディアタイプに対応するアイコンを取得する
 */
export function getMediaTypeIcon(type: string): string {
  const iconMap: { [key: string]: string } = {
    book: '本',
    manga: '漫画',
    movie: '映画',
    anime: '映像',
    tv: 'TV',
    youtube: '動画',
    game: 'ゲーム',
    podcast: '音声',
    other: 'その他'
  }
  return iconMap[type] || 'その他'
}

/**
 * メディアタイプの日本語名を取得する
 */
export function getMediaTypeLabel(type: string): string {
  const labelMap: { [key: string]: string } = {
    book: '書籍',
    manga: '漫画',
    movie: '映画',
    anime: 'アニメ',
    tv: 'TV番組',
    game: 'ゲーム',
    podcast: 'ポッドキャスト',
    other: 'その他'
  }
  return labelMap[type] || 'その他'
}

/**
 * インプット分析の統計情報を計算する
 */
export function calculateInputStats(inputs: InputData[]) {
  const totalInputs = inputs.length
  const favoriteCount = inputs.filter(input => input.favorite).length
  const averageRating = totalInputs > 0
    ? inputs.reduce((sum, input) => sum + (input.rating || 0), 0) / totalInputs
    : 0

  const typeDistribution = inputs.reduce((acc, input) => {
    const type = input.type || '未分類'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalInputs,
    favoriteCount,
    averageRating,
    typeDistribution
  }
} 