import type { InputAnalysis } from '@/types/input'

interface InsightData {
  topGenres: Array<string | { genre: string; count: number }>
  topTags: Array<string | { tag: string; count: number }>
}

interface InterestAnalysis {
  interestedIn: string[]
  notInterestedIn: string[]
  reasoning: string
}

export function generateInsightSummary(inputAnalysis: InputAnalysis | null): string {
  if (!inputAnalysis) {
    return 'インプットデータが不足しているため、詳細な分析ができません。'
  }

  const { topGenres, topTags } = inputAnalysis

  // データが不足している場合
  if ((!topGenres || topGenres.length === 0) && (!topTags || topTags.length === 0)) {
    return 'インプットデータが不足しているため、詳細な分析ができません。より多くのインプットを記録して、あなたの興味・関心を分析しましょう。'
  }

  // 主要なジャンルとタグを抽出
  const primaryGenre = topGenres && topGenres.length > 0 
    ? (typeof topGenres[0] === 'string' ? topGenres[0] : topGenres[0].genre)
    : null

  const secondaryGenre = topGenres && topGenres.length > 1
    ? (typeof topGenres[1] === 'string' ? topGenres[1] : topGenres[1].genre)
    : null

  const primaryTag = topTags && topTags.length > 0
    ? (typeof topTags[0] === 'string' ? topTags[0] : topTags[0].tag)
    : null

  const secondaryTag = topTags && topTags.length > 1
    ? (typeof topTags[1] === 'string' ? topTags[1] : topTags[1].tag)
    : null

  // インサイトサマリーの生成
  let insight = ''

  if (primaryGenre && primaryTag) {
    // ジャンルとタグの両方がある場合
    insight = `あなたは【${primaryGenre}】のような${getGenreDescription(primaryGenre)}に強い関心があり、特に【${primaryTag}】に関連する情報を頻繁にインプットしています。`
    
    if (secondaryGenre && secondaryTag) {
      insight += `また、【${secondaryGenre}】や【${secondaryTag}】といった分野にも興味を示しており、`
    } else if (secondaryGenre) {
      insight += `また、【${secondaryGenre}】といった分野にも興味を示しており、`
    } else if (secondaryTag) {
      insight += `また、【${secondaryTag}】といったキーワードにも関心があり、`
    }
    
    insight += `これらの傾向は、あなたの制作活動における創造性と専門性の両方を支える重要な要素となっています。`
  } else if (primaryGenre) {
    // ジャンルのみがある場合
    insight = `あなたは【${primaryGenre}】のような${getGenreDescription(primaryGenre)}に強い関心を示しています。`
    
    if (secondaryGenre) {
      insight += `また、【${secondaryGenre}】といった分野にも興味があり、`
    }
    
    insight += `これらのジャンルは、あなたの創作活動における重要なインスピレーション源となっていると考えられます。`
  } else if (primaryTag) {
    // タグのみがある場合
    insight = `あなたは【${primaryTag}】に関連する情報を頻繁にインプットしており、`
    
    if (secondaryTag) {
      insight += `【${secondaryTag}】といったキーワードにも関心があります。`
    }
    
    insight += `これらの関心キーワードは、あなたの創作活動における重要なテーマやモチーフとなっている可能性があります。`
  }

  // 追加の分析
  if (topGenres && topGenres.length >= 3) {
    const thirdGenre = typeof topGenres[2] === 'string' ? topGenres[2] : topGenres[2].genre
    insight += `さらに、【${thirdGenre}】といった多様なジャンルに触れることで、幅広い視点と豊かな表現力を身につけているようです。`
  }

  if (topTags && topTags.length >= 3) {
    const thirdTag = typeof topTags[2] === 'string' ? topTags[2] : topTags[2].tag
    insight += `【${thirdTag}】などのキーワードも含めて、あなたの関心事は多岐にわたっており、これらが組み合わさることで独自の創作スタイルを形成していると考えられます。`
  }

  return insight
}

export function analyzeInterestTendencies(inputAnalysis: InputAnalysis | null): InterestAnalysis {
  if (!inputAnalysis) {
    return {
      interestedIn: [],
      notInterestedIn: [],
      reasoning: 'データが不足しているため分析できません'
    }
  }

  const { topGenres, topTags } = inputAnalysis
  const interestedIn: string[] = []
  const notInterestedIn: string[] = []

  // ジャンルベースの分析
  if (topGenres && topGenres.length > 0) {
    const primaryGenre = typeof topGenres[0] === 'string' ? topGenres[0] : topGenres[0].genre
    
    // 興味がありそうな分野を推測
    const relatedInterests = getRelatedInterests(primaryGenre)
    interestedIn.push(...relatedInterests)

    // 興味がなさそうな分野を推測
    const oppositeInterests = getOppositeInterests(primaryGenre)
    notInterestedIn.push(...oppositeInterests)
  }

  // タグベースの分析
  if (topTags && topTags.length > 0) {
    const primaryTag = typeof topTags[0] === 'string' ? topTags[0] : topTags[0].tag
    
    // タグに関連する興味分野を追加
    const tagRelatedInterests = getTagRelatedInterests(primaryTag)
    interestedIn.push(...tagRelatedInterests.filter(item => !interestedIn.includes(item)))
  }

  // 重複を除去
  const uniqueInterestedIn = [...new Set(interestedIn)]
  const uniqueNotInterestedIn = [...new Set(notInterestedIn)]

  // 推論の生成
  let reasoning = ''
  if (uniqueInterestedIn.length > 0) {
    reasoning += `あなたのインプット傾向から、【${uniqueInterestedIn.slice(0, 3).join('】、【')}】などの分野に興味があると推測されます。`
  }
  if (uniqueNotInterestedIn.length > 0) {
    reasoning += `一方で、【${uniqueNotInterestedIn.slice(0, 2).join('】、【')}】などの分野は、現在のインプットパターンからはあまり関心が示されていません。`
  }

  return {
    interestedIn: uniqueInterestedIn.slice(0, 5), // 最大5個まで
    notInterestedIn: uniqueNotInterestedIn.slice(0, 3), // 最大3個まで
    reasoning: reasoning || 'インプットデータから興味傾向を分析しました'
  }
}

function getRelatedInterests(genre: string): string[] {
  const interestMap: Record<string, string[]> = {
    'テクノロジー解説': ['AI・機械学習', 'プログラミング', 'デジタルマーケティング', 'ブロックチェーン', 'IoT'],
    '社会評論': ['政治・経済', '環境問題', '社会問題', '哲学・思想', '歴史'],
    'インタビュー記事': ['人物伝記', '成功哲学', 'リーダーシップ', 'キャリア開発', '人間関係'],
    'ミステリードラマ': ['推理小説', 'サスペンス', '犯罪心理', '法医学', '探偵物'],
    'サスペンススリラー': ['ホラー', 'アクション', '犯罪映画', '心理戦', 'スパイ物'],
    'コメディ': ['お笑い', 'ユーモア', 'コミュニケーション', 'エンターテイメント', 'ライフスタイル'],
    'ドキュメンタリー': ['社会問題', '環境保護', '動物・自然', '歴史', '科学'],
    'アニメ': ['漫画', 'ゲーム', '声優', 'アニメーション制作', '日本文化'],
    '映画': ['映像制作', 'シナリオ', '演技', '映画史', '監督論'],
    '小説': ['文学', '創作', '物語', '詩', 'エッセイ'],
    '漫画': ['アニメ', 'イラスト', 'ストーリー', 'キャラクター', 'デザイン'],
    'ゲーム': ['eスポーツ', 'ゲーム開発', 'ストーリー', 'キャラクター', 'テクノロジー'],
    '音楽': ['楽器演奏', '作曲', '音楽理論', '音楽史', 'ライブ'],
    '料理': ['食文化', '栄養学', '食材', 'レストラン', '食の安全'],
    '旅行': ['異文化', '地理', '歴史', '写真', '冒険'],
    'スポーツ': ['健康', 'フィットネス', 'チームワーク', '戦略', '記録'],
    'ビジネス': ['起業', 'マーケティング', 'マネジメント', '投資', '経済'],
    '教育': ['学習法', '心理学', '子育て', 'スキル開発', '知識共有'],
    '健康': ['ウェルネス', '栄養', '運動', 'メンタルヘルス', '予防医学'],
    'ファッション': ['デザイン', 'トレンド', 'スタイリング', 'ブランド', 'アート']
  }

  return interestMap[genre] || ['クリエイティブ', '自己表現', '学習', 'エンターテイメント']
}

function getOppositeInterests(genre: string): string[] {
  const oppositeMap: Record<string, string[]> = {
    'テクノロジー解説': ['伝統工芸', 'アナログ', '手作業', '自然体験'],
    '社会評論': ['エンターテイメント', 'ファンタジー', '軽い話題', '個人の趣味'],
    'インタビュー記事': ['技術解説', 'データ分析', '抽象的な概念', '非人間的な話題'],
    'ミステリードラマ': ['日常的な話題', '明るい話題', '現実的な問題', '軽いエンターテイメント'],
    'サスペンススリラー': ['癒し系', '日常', '明るい話題', '現実的な問題'],
    'コメディ': ['深刻な話題', '技術解説', '専門的な内容', '暗い話題'],
    'ドキュメンタリー': ['フィクション', 'エンターテイメント', '軽い話題', 'ファンタジー'],
    'アニメ': ['現実的な話題', 'ビジネス', '政治', '技術解説'],
    '映画': ['技術解説', 'ビジネス', '現実的な問題', '専門的な内容'],
    '小説': ['技術解説', 'データ分析', '実用的な内容', 'ビジネス'],
    '漫画': ['現実的な話題', 'ビジネス', '政治', '技術解説'],
    'ゲーム': ['現実的な話題', 'ビジネス', '政治', '技術解説'],
    '音楽': ['技術解説', 'ビジネス', '政治', '現実的な問題'],
    '料理': ['技術解説', '抽象的な概念', '非日常的な話題', '専門的な内容'],
    '旅行': ['日常的な話題', '技術解説', 'ビジネス', '現実的な問題'],
    'スポーツ': ['技術解説', '抽象的な概念', '非身体的な話題', '専門的な内容'],
    'ビジネス': ['エンターテイメント', 'ファンタジー', '軽い話題', '非現実的な話題'],
    '教育': ['エンターテイメント', '軽い話題', '非教育的な内容', '娯楽'],
    '健康': ['不健康な話題', 'エンターテイメント', '軽い話題', '非健康的な内容'],
    'ファッション': ['技術解説', '実用的な内容', '非美的な話題', '機能的な内容']
  }

  return oppositeMap[genre] || ['技術解説', '専門的な内容', '抽象的な概念']
}

function getTagRelatedInterests(tag: string): string[] {
  const tagInterestMap: Record<string, string[]> = {
    'Netflix': ['ストリーミング', 'エンターテイメント', '映画', 'ドラマ', '海外作品'],
    'ストリーミング': ['デジタルエンターテイメント', 'オンラインコンテンツ', 'テクノロジー', 'メディア'],
    '大阪万博': ['イベント', '文化', '国際交流', '未来技術', '都市計画'],
    'テクノロジー': ['AI', 'プログラミング', 'デジタル', 'イノベーション', '未来'],
    '関西万博': ['イベント', '文化', '国際交流', '未来技術', '都市計画'],
    'AI': ['機械学習', 'プログラミング', 'テクノロジー', '未来', 'イノベーション'],
    'プログラミング': ['テクノロジー', '開発', 'ロジック', '問題解決', 'クリエイティブ'],
    'デザイン': ['アート', 'クリエイティブ', 'ビジュアル', '美学', '表現'],
    '音楽': ['アート', '表現', 'エンターテイメント', '文化', '感情'],
    '映画': ['ストーリー', '映像', 'エンターテイメント', 'アート', '表現'],
    '本': ['知識', '学習', 'ストーリー', '文化', '思考'],
    'ゲーム': ['エンターテイメント', 'インタラクティブ', 'ストーリー', 'テクノロジー', '競争'],
    '旅行': ['文化', '体験', '冒険', '地理', '歴史'],
    '料理': ['文化', '体験', '健康', '美学', '生活'],
    'スポーツ': ['健康', '競争', 'チームワーク', '身体', '達成感']
  }

  // タグの部分一致で検索
  for (const [key, interests] of Object.entries(tagInterestMap)) {
    if (tag.includes(key) || key.includes(tag)) {
      return interests
    }
  }

  // デフォルトの興味分野
  return ['クリエイティブ', '学習', '体験', '表現', '文化']
}

function getGenreDescription(genre: string): string {
  const genreDescriptions: Record<string, string> = {
    'テクノロジー解説': '最先端のトピック',
    '社会評論': '社会的なテーマ',
    'インタビュー記事': '人物や経験談',
    'ミステリードラマ': '推理やサスペンス',
    'サスペンススリラー': '緊張感のあるストーリー',
    'コメディ': '笑いやユーモア',
    'ドキュメンタリー': '現実的なテーマ',
    'アニメ': 'アニメーション作品',
    '映画': '映像作品',
    '小説': '文学作品',
    '漫画': 'グラフィックノベル',
    'ゲーム': 'インタラクティブな体験',
    '音楽': '音響作品',
    '料理': '食文化',
    '旅行': '異文化体験',
    'スポーツ': '身体活動',
    'ビジネス': '経済活動',
    '教育': '学習・成長',
    '健康': 'ウェルネス',
    'ファッション': 'スタイル・デザイン'
  }

  return genreDescriptions[genre] || '興味深いテーマ'
} 