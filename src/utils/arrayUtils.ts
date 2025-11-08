/**
 * 配列操作ユーティリティ
 */

/**
 * 配列の先頭N個を取得
 * @param array 対象の配列
 * @param count 取得する個数
 * @returns 先頭N個の配列
 */
export function takeFirst<T>(array: T[], count: number): T[] {
  return array.slice(0, count);
}

/**
 * 配列をソートして先頭N個を取得
 * @param array 対象の配列
 * @param compareFn ソート用の比較関数
 * @param count 取得する個数
 * @returns ソート後の先頭N個の配列
 */
export function takeTop<T>(
  array: T[],
  compareFn: (a: T, b: T) => number,
  count: number,
): T[] {
  return [...array].sort(compareFn).slice(0, count);
}

