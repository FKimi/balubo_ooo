// インプットデータの型定義

export type InputType = 'book' | 'manga' | 'movie' | 'anime' | 'tv' | 'game' | 'podcast' | 'youtube' | 'other'

export type InputStatus = 'completed' | 'reading' | 'watching' | 'playing' | 'listening' | 'planning' | 'paused' | 'dropped'

export interface InputData {
  id?: string
  userId: string
  title: string
  type: InputType
  description?: string
  releaseDate?: string
  consumptionDate?: string
  status: InputStatus
  review: string
  tags: string[]
  genres: string[]
  externalUrl: string
  coverImageUrl: string
  notes: string
  favorite: boolean
  aiAnalysisResult?: any
  createdAt?: string
  updatedAt?: string
}

export interface InputAnalysis {
  totalInputs: number
  tagFrequency: Record<string, number>
  genreFrequency: Record<string, number>
  typeDistribution: Record<string, number>
  monthlyActivity: Record<string, number>
  topTags: Array<{ tag: string; count: number }>
  topGenres: Array<{ genre: string; count: number }>
  favoriteCount: number
  averageRating: number
  lastUpdated: string
}

export const inputTypeLabels: Record<InputType, string> = {
  book: '本・書籍',
  manga: '漫画',
  movie: '映画',
  anime: 'アニメ',
  tv: 'TV番組',
  game: 'ゲーム',
  podcast: 'ポッドキャスト',
  youtube: 'YouTube',
  other: 'その他'
}

export const inputStatusLabels: Record<InputStatus, string> = {
  completed: '完了',
  reading: '読書中',
  watching: '視聴中',
  playing: 'プレイ中',
  listening: '聴取中',
  planning: '予定',
  paused: '一時停止',
  dropped: '中断'
}

export const defaultInputData: Partial<InputData> = {
  title: '',
  type: 'book',
  status: 'completed',
  review: '',
  tags: [],
  genres: [],
  externalUrl: '',
  coverImageUrl: '',
  notes: '',
  favorite: false
}

// サンプルデータ（開発・デモ用）
export const sampleInputs: InputData[] = [
  {
    id: '1',
    userId: 'sample',
    title: 'デザインの基本ルール',
    type: 'book',
    releaseDate: '2020-08-20',
    consumptionDate: '2024-01-15',
    status: 'completed',
    review: 'デザインの基礎を体系的に学べる良書。実例が豊富で理解しやすい。',
    tags: ['デザイン', 'UI/UX', 'レイアウト', '色彩'],
    genres: ['実用書', 'デザイン'],
    externalUrl: '',
    coverImageUrl: '',
    notes: '特に色彩理論の章が参考になった',
    favorite: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: 'sample',
    title: '君の名は。',
    type: 'anime',
    releaseDate: '2016-08-26',
    consumptionDate: '2024-02-10',
    status: 'completed',
    review: '美しい映像と音楽。ストーリーも感動的だった。',
    tags: ['恋愛', 'タイムリープ', '新海誠', '美麗作画'],
    genres: ['恋愛', 'ファンタジー', 'ドラマ'],
    externalUrl: '',
    coverImageUrl: '',
    notes: 'RADWIMPSの楽曲も印象的',
    favorite: true,
    createdAt: '2024-02-10T19:30:00Z',
    updatedAt: '2024-02-10T19:30:00Z'
  },
  {
    id: '3',
    userId: 'sample',
    title: 'ワンピース',
    type: 'manga',
    releaseDate: '1997-07-22',
    consumptionDate: '2024-03-01',
    status: 'reading',
    review: '冒険とバトル、仲間との絆が熱い。長編だが飽きない。',
    tags: ['冒険', 'バトル', '友情', '海賊'],
    genres: ['少年漫画', 'バトル', 'アドベンチャー'],
    externalUrl: '',
    coverImageUrl: '',
    notes: '現在105巻まで読了',
    favorite: true,
    createdAt: '2024-03-01T14:20:00Z',
    updatedAt: '2024-03-01T14:20:00Z'
  }
] 