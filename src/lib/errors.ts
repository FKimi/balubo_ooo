/**
 * 共通エラー型定義
 * API層とフロントエンドで統一的なエラーハンドリングを実現
 */

/**
 * APIエラーの種別
 */
export type ApiErrorCode =
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "VALIDATION_ERROR"
    | "RATE_LIMIT"
    | "DATABASE_ERROR"
    | "EXTERNAL_API_ERROR"
    | "INTERNAL_ERROR"
    | "UNKNOWN";

/**
 * APIエラーの詳細情報
 */
export interface ApiErrorDetails {
    code: ApiErrorCode;
    message: string;
    field?: string | undefined;
    details?: Record<string, unknown> | undefined;
}

/**
 * API応答の標準形式
 */
export interface ApiResponse<T = unknown> {
    data: T | null;
    error: string | null;
    errors?: ApiErrorDetails[] | undefined;
    message?: string | undefined;
}

/**
 * APIエラークラス
 * エラーを構造化して管理
 */
export class ApiError extends Error {
    public readonly code: ApiErrorCode;
    public readonly statusCode: number;
    public readonly details?: Record<string, unknown> | undefined;

    constructor(
        message: string,
        code: ApiErrorCode = "INTERNAL_ERROR",
        statusCode: number = 500,
        details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }

    /**
     * JSONレスポンス用のオブジェクトを生成
     */
    toJSON(): ApiErrorDetails {
        return {
            code: this.code,
            message: this.message,
            details: this.details,
        };
    }

    /**
     * HTTPステータスコードに対応するエラーを生成
     */
    static fromStatusCode(statusCode: number, message?: string): ApiError {
        const codeMap: Record<number, ApiErrorCode> = {
            400: "VALIDATION_ERROR",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            429: "RATE_LIMIT",
            500: "INTERNAL_ERROR",
        };

        const code = codeMap[statusCode] || "UNKNOWN";
        const defaultMessages: Record<ApiErrorCode, string> = {
            UNAUTHORIZED: "認証が必要です",
            FORBIDDEN: "アクセス権限がありません",
            NOT_FOUND: "リソースが見つかりません",
            VALIDATION_ERROR: "入力値が不正です",
            RATE_LIMIT: "リクエスト回数の制限に達しました",
            DATABASE_ERROR: "データベースエラーが発生しました",
            EXTERNAL_API_ERROR: "外部APIエラーが発生しました",
            INTERNAL_ERROR: "サーバーエラーが発生しました",
            UNKNOWN: "エラーが発生しました",
        };

        return new ApiError(
            message || defaultMessages[code],
            code,
            statusCode,
        );
    }
}

/**
 * エラーを安全に処理するユーティリティ
 */
export function handleError(error: unknown): ApiErrorDetails {
    if (error instanceof ApiError) {
        return error.toJSON();
    }

    if (error instanceof Error) {
        return {
            code: "INTERNAL_ERROR",
            message: error.message,
        };
    }

    return {
        code: "UNKNOWN",
        message: "予期しないエラーが発生しました",
    };
}

/**
 * APIレスポンスを生成するヘルパー
 */
export function createApiResponse<T>(
    data: T | null,
    error: string | null = null,
    message?: string,
): ApiResponse<T> {
    return {
        data,
        error,
        message,
    };
}

/**
 * 成功レスポンスを生成
 */
export function successResponse<T>(
    data: T,
    message?: string,
): ApiResponse<T> {
    return createApiResponse(data, null, message);
}

/**
 * エラーレスポンスを生成
 */
export function errorResponse(
    error: string,
    errors?: ApiErrorDetails[],
): ApiResponse<null> {
    return {
        data: null,
        error,
        errors,
    };
}
