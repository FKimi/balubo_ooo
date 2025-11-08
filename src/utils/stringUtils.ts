/**
 * 文字列操作ユーティリティ
 */

/**
 * テキストを自然な区切りで切り詰める関数（日本語の助詞や句読点で区切る）
 * @param text 切り詰めるテキスト
 * @param maxLength 最大文字数
 * @returns 切り詰められたテキスト
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  // まず最大長で切り取る
  const truncated = text.substring(0, maxLength);

  // 句点（。）で区切れる場合は、その位置で切る
  const lastPeriod = truncated.lastIndexOf("。");
  if (lastPeriod > maxLength * 0.6) {
    return truncated.substring(0, lastPeriod + 1);
  }

  // 読点（、）で区切れる場合は、その位置で切る
  const lastComma = truncated.lastIndexOf("、");
  if (lastComma > maxLength * 0.6) {
    return truncated.substring(0, lastComma);
  }

  // 日本語の助詞で区切る（自然な区切り）
  const particles = [
    "は",
    "が",
    "を",
    "に",
    "で",
    "と",
    "から",
    "まで",
    "より",
    "の",
    "も",
    "へ",
  ];
  for (const particle of particles) {
    const lastParticle = truncated.lastIndexOf(particle);
    if (
      lastParticle > maxLength * 0.6 &&
      lastParticle < maxLength - 1
    ) {
      // 助詞の後で切る（助詞を含める）
      return truncated.substring(0, lastParticle + particle.length);
    }
  }

  // スペースで区切れる場合は、その位置で切る
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.6) {
    return truncated.substring(0, lastSpace);
  }

  // それでも切れない場合は、少し短めに切る（単語の途中を避ける）
  // 最後の数文字を削除して、より自然な長さにする
  const safeLength = Math.max(maxLength - 5, maxLength * 0.85);
  return text.substring(0, Math.floor(safeLength));
}

/**
 * シンプルな文字列切り詰め（末尾に...を追加）
 * @param text 切り詰めるテキスト
 * @param maxLength 最大文字数
 * @param suffix 末尾に追加する文字列（デフォルト: "..."）
 * @returns 切り詰められたテキスト
 */
export function truncateSimple(
  text: string,
  maxLength: number,
  suffix: string = "...",
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 数値を読みやすい形式にフォーマット（K, M表記）
 * @param num フォーマットする数値
 * @returns フォーマットされた文字列
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return "0";
  }
  
  // 循環参照を避けるため、定数を直接使用
  const MILLION = 1000000;
  const THOUSAND = 1000;
  
  if (num >= MILLION) {
    return `${(num / MILLION).toFixed(1)}M`;
  } else if (num >= THOUSAND) {
    return `${(num / THOUSAND).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * 数値をカンマ区切りでフォーマット
 * @param num フォーマットする数値
 * @returns カンマ区切りの文字列
 */
export function formatNumberWithCommas(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) {
    return "0";
  }
  return num.toLocaleString();
}

