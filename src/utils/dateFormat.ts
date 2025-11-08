/**
 * 日付フォーマットユーティリティ
 * アプリケーション全体で使用する日付フォーマット関数を集約
 */

/**
 * 日付を「YYYY年MM月」形式にフォーマット
 * @param dateString 日付文字列（ISO形式など）
 * @returns フォーマットされた日付文字列（例: "2024年3月"）
 */
export function formatDateToYearMonth(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    // Invalid Dateの場合を考慮
    if (isNaN(date.getTime())) return "";
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  } catch {
    return "";
  }
}

/**
 * 相対時間を表示（例: "3時間前", "2日前"）
 * @param dateString 日付文字列
 * @returns 相対時間の文字列
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "今";
  if (diffInMinutes < 60) return `${diffInMinutes}分前`;
  if (diffInHours < 24) return `${diffInHours}時間前`;
  if (diffInDays < 7) return `${diffInDays}日前`;
  return date.toLocaleDateString("ja-JP");
}

/**
 * 日時をフォーマット（例: "3月15日 14:30"）
 * @param timestamp タイムスタンプ（ミリ秒）または日付文字列
 * @returns フォーマットされた日時文字列
 */
export function formatDateTime(timestamp?: number | string | null): string {
  if (!timestamp) return "";
  try {
    const date = typeof timestamp === "number" ? new Date(timestamp) : new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/**
 * 日付をローカライズされた形式でフォーマット
 * @param dateString 日付文字列
 * @returns フォーマットされた日付文字列
 */
export function formatLocalizedDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("ja-JP");
  } catch {
    return "";
  }
}

/**
 * 日付をISO形式（YYYY-MM-DD）に変換
 * @param dateString 日付文字列
 * @returns ISO形式の日付文字列
 */
export function formatToISO(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0] || "";
  } catch {
    return "";
  }
}

