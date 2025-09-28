"use client";

import { useEffect } from "react";

/**
 * Chrome拡張機能関連のエラーをフィルタリングするコンポーネント
 * 開発時のコンソールノイズを軽減
 */
export function ErrorFilter() {
  useEffect(() => {
    // 開発環境でのみ動作
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // フィルタリング対象のエラーメッセージ
    const FILTERED_ERRORS = [
      "The message port closed before a response was received",
      "runtime.lastError",
      "Extension context invalidated",
      "Could not establish connection. Receiving end does not exist",
      "chrome-extension://",
      "moz-extension://",
      "Non-Error promise rejection captured",
      "Too many channels",
      "ERR_INSUFFICIENT_RESOURCES",
    ];

    // エラーをフィルタリングする関数
    function shouldFilterError(message: string): boolean {
      if (typeof message !== "string") return false;

      return FILTERED_ERRORS.some((filter) =>
        message.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    // 元のエラーハンドラを保存
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    // console.error をフィルタリング
    console.error = (...args: any[]) => {
      const message = args.join(" ");

      if (!shouldFilterError(message)) {
        originalConsoleError.apply(console, args);
      }
    };

    // console.warn をフィルタリング
    console.warn = (...args: any[]) => {
      const message = args.join(" ");

      if (!shouldFilterError(message)) {
        originalConsoleWarn.apply(console, args);
      }
    };

    // window.onerror イベントもフィルタリング
    const originalOnError = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      if (typeof message === "string" && shouldFilterError(message)) {
        return true; // エラーを抑制
      }

      if (originalOnError) {
        return originalOnError.call(
          window,
          message,
          source,
          lineno,
          colno,
          error,
        );
      }

      return false;
    };

    // unhandledrejection イベントもフィルタリング
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason?.message || event.reason?.toString() || "";

      if (shouldFilterError(message)) {
        event.preventDefault(); // エラーを抑制
        return;
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // クリーンアップ関数
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.onerror = originalOnError;
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return null; // UIを持たないコンポーネント
}
