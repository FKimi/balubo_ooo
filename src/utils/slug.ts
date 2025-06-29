export function slugify(text: string): string {
  return text
    .normalize('NFKD') // ひらがな→カタカナ なども分解
    .replace(/\p{Diacritic}/gu, '') // ダイアクリティカルマーク削除
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // 英数字以外→-
    .replace(/^-+|-+$/g, '') // 先頭末尾の-除去
    .replace(/-{2,}/g, '-') // 連続-→1つ
} 