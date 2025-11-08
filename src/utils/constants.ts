/**
 * アプリケーション全体で使用する定数
 */

// カテゴリのデフォルトカラー
export const CATEGORY_COLORS = {
  /** 新規カテゴリのデフォルトカラー */
  DEFAULT: "#F59E0B",
  /** 未分類カテゴリのカラー */
  UNCATEGORIZED: "#6B7280",
  /** 追加カテゴリのカラー */
  ADD_NEW: "#6366F1",
} as const;

// 数値フォーマット用の定数
export const NUMBER_FORMAT = {
  /** 100万を表す数値 */
  MILLION: 1000000,
  /** 1000を表す数値 */
  THOUSAND: 1000,
} as const;

