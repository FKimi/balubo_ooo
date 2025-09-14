export function slugify(text: string): string {
  return text
    .normalize('NFKD') // ひらがな→カタカナ なども分解
    .replace(/\p{Diacritic}/gu, '') // ダイアクリティカルマーク削除
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, '-') // 英数字と日本語文字以外→-
    .replace(/^-+|-+$/g, '') // 先頭末尾の-除去
    .replace(/-{2,}/g, '-') // 連続-→1つ
}

// 日本語名からユーザーフレンドリーなスラッグを生成（ローマ字ベース）
export function generateUserSlug(displayName: string): string {
  if (!displayName) return ''
  
  // ローマ字変換を使用
  const { generateRomajiSlug } = require('./romaji')
  let slug = generateRomajiSlug(displayName)
  
  // 空の場合は、フォールバックとして通常のslugifyを使用
  if (!slug) {
    slug = slugify(displayName)
  }
  
  // それでも空の場合は、英数字のみを抽出
  if (!slug) {
    slug = displayName
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase()
  }
  
  // 長すぎる場合は切り詰める
  if (slug.length > 50) {
    slug = slug.substring(0, 50)
  }
  
  return slug
} 