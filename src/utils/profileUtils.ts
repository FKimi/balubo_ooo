import type { WorkData, WorkCategory } from '@/types/work'
import type { InputData } from '@/types/input'

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
    .slice(0, 7)
}

/**
 * インプットデータからよく使用するタグを計算する
 */
export function calculateInputTopTags(inputs: InputData[]): [string, number][] {
  const tagCount: { [key: string]: number } = {}
  
  inputs.forEach(input => {
    if (input.tags && Array.isArray(input.tags)) {
      input.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })
  
  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7)
}

/**
 * 作品とインプットの両方からタグを統合集計する
 */
export function calculateCombinedTopTags(works: WorkData[], inputs: InputData[]): [string, number][] {
  const tagCount: { [key: string]: number } = {}
  
  // 作品のタグを集計
  works.forEach(work => {
    if (work.tags && Array.isArray(work.tags)) {
      work.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })
  
  // インプットのタグを集計
  inputs.forEach(input => {
    if (input.tags && Array.isArray(input.tags)) {
      input.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })
  
  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7)
}

/**
 * インプットデータからジャンル分布を計算する
 */
export function calculateGenreDistribution(inputs: InputData[]): [string, number][] {
  const genreCount: { [key: string]: number } = {}
  
  inputs.forEach(input => {
    if (input.genres && Array.isArray(input.genres)) {
      input.genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      })
    }
  })
  
  return Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
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

export function summarizeTopTags(topTags: [string, number][]): string {
  if (!topTags || topTags.length === 0) return ''

  // 上位3件のタグ名を取得
  const tagNames = topTags.slice(0, 3).map(([tag]) => tag)

  if (tagNames.length === 1) {
    return `${tagNames[0]}に関する作品が多く、専門性を発揮しています。`
  }
  if (tagNames.length === 2) {
    return `${tagNames[0]}や${tagNames[1]}などの分野で多くの作品を制作しています。`
  }
  return `${tagNames[0]}、${tagNames[1]}、${tagNames[2]}などの分野で多くの作品を制作しています。`
} 

/**
 * 作品データ配列をカテゴリごとにグループ化する（UIでのカテゴリ表示用）
 * @param works WorkData[]
 * @returns WorkCategory[]
 */
export function groupWorksByCategory(works: WorkData[]): WorkCategory[] {
  const categorizedWorks: WorkCategory[] = []
  works.forEach(work => {
    if (work.categories && work.categories.length > 0) {
      work.categories.forEach(categoryName => {
        const existingCategory = categorizedWorks.find(cat => cat.name === categoryName)
        if (existingCategory) {
          existingCategory.works.push(work)
        } else {
          const newCategory: WorkCategory = {
            id: `category_${categoryName.replace(/\s+/g, '_').toLowerCase()}`,
            name: categoryName,
            color: '#F59E0B',
            works: [work]
          }
          categorizedWorks.push(newCategory)
        }
      })
    } else {
      let uncategorized = categorizedWorks.find(cat => cat.id === 'uncategorized')
      if (!uncategorized) {
        uncategorized = {
          id: 'uncategorized',
          name: '未分類',
          color: '#6B7280',
          works: []
        }
        categorizedWorks.push(uncategorized)
      }
      uncategorized.works.push(work)
    }
  })
  return categorizedWorks
} 