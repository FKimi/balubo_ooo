/**
 * エラーメッセージユーティリティ
 * エラーハンドリングの共通処理を集約
 */

/**
 * エラーオブジェクトから人間が読みやすいメッセージを取得
 * @param error エラーオブジェクト（Error、文字列、その他）
 * @returns エラーメッセージ文字列
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }
  return "予期しないエラーが発生しました";
}

/**
 * エラーオブジェクトから詳細情報を取得
 * @param error エラーオブジェクト
 * @returns エラーの詳細情報
 */
export function getErrorDetails(error: unknown): {
  message: string;
  code?: string;
  status?: number;
} {
  const message = getErrorMessage(error);
  
  if (error && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;
    return {
      message,
      code: typeof errorObj.code === "string" ? errorObj.code : undefined,
      status: typeof errorObj.status === "number" ? errorObj.status : undefined,
    };
  }
  
  return { message };
}

