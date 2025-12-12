/**
 * 環境に応じたロガー
 * 本番環境ではエラーと警告のみ、開発環境ではすべてのログを出力
 */

const isDevelopment = process.env.NODE_ENV === "development";
const isDebug = process.env.DEBUG === "true";

interface LogContext {
    [key: string]: unknown;
}

export const logger = {
    /**
     * デバッグログ（開発環境またはDEBUG=trueのときのみ出力）
     */
    debug: (message: string, context?: LogContext) => {
        if (isDevelopment || isDebug) {
            console.log(`[DEBUG] ${message}`, context || "");
        }
    },

    /**
     * 情報ログ（開発環境のみ出力）
     */
    info: (message: string, context?: LogContext) => {
        if (isDevelopment) {
            console.log(`[INFO] ${message}`, context || "");
        }
    },

    /**
     * 警告ログ（常に出力）
     */
    warn: (message: string, context?: LogContext) => {
        console.warn(`[WARN] ${message}`, context || "");
    },

    /**
     * エラーログ（常に出力）
     */
    error: (message: string, error?: unknown, context?: LogContext) => {
        console.error(`[ERROR] ${message}`, error || "", context || "");
    },
};
