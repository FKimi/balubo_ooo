/**
 * バリデーションユーティリティ
 * アプリケーション全体で使用するバリデーション関数を集約
 */

/**
 * メールアドレスの形式を検証
 * @param email 検証するメールアドレス
 * @returns 有効なメールアドレスの場合true
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * 文字列が空でないことを検証
 * @param value 検証する文字列
 * @returns 空でない場合true
 */
export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

/**
 * 文字列の長さを検証
 * @param value 検証する文字列
 * @param minLength 最小長（デフォルト: 0）
 * @param maxLength 最大長（オプション）
 * @returns 検証結果
 */
export function validateLength(
  value: string,
  minLength: number = 0,
  maxLength?: number,
): { isValid: boolean; error?: string } {
  const trimmed = value.trim();
  
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${minLength}文字以上で入力してください`,
    };
  }
  
  if (maxLength !== undefined && trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${maxLength}文字以内で入力してください`,
    };
  }
  
  return { isValid: true };
}

/**
 * パスワードの強度を検証
 * @param password 検証するパスワード
 * @param minLength 最小長（デフォルト: 8）
 * @returns 検証結果
 */
export function validatePassword(
  password: string,
  minLength: number = 8,
): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: "パスワードを入力してください" };
  }
  
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `パスワードは${minLength}文字以上で入力してください`,
    };
  }
  
  return { isValid: true };
}

/**
 * URLの形式を検証
 * @param url 検証するURL
 * @returns 有効なURLの場合true
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 数値の範囲を検証
 * @param value 検証する数値
 * @param min 最小値（オプション）
 * @param max 最大値（オプション）
 * @returns 検証結果
 */
export function validateNumberRange(
  value: number,
  min?: number,
  max?: number,
): { isValid: boolean; error?: string } {
  if (min !== undefined && value < min) {
    return {
      isValid: false,
      error: `${min}以上の値を入力してください`,
    };
  }
  
  if (max !== undefined && value > max) {
    return {
      isValid: false,
      error: `${max}以下の値を入力してください`,
    };
  }
  
  return { isValid: true };
}

/**
 * 日付の形式を検証（YYYY-MM-DD または YYYY-MM）
 * @param dateString 検証する日付文字列
 * @returns 有効な日付形式の場合true
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString || typeof dateString !== "string") return false;
  
  // YYYY-MM-DD または YYYY-MM 形式をチェック
  const dateRegex = /^\d{4}-\d{2}(-\d{2})?$/;
  if (!dateRegex.test(dateString)) return false;
  
  // 実際に有効な日付かチェック
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

