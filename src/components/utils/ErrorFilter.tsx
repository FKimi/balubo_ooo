"use client";

import { useEffect } from "react";

/**
 * Chrome拡張機能関連のエラーをフィルタリングするコンポーネント
 * 開発時のコンソールノイズを軽減
 */
export function ErrorFilter() {
  useEffect(() => {
    // フィルタリング対象のエラーメッセージ
    const FILTERED_ERRORS = [
      "The message port closed before a response was received",
      "message port closed",
      "runtime.lastError",
      "Extension context invalidated",
      "Could not establish connection. Receiving end does not exist",
      "chrome-extension://",
      "moz-extension://",
      "Non-Error promise rejection captured",
      "Too many channels",
      "ERR_INSUFFICIENT_RESOURCES",
      "multi-tabs.js",
      "extension",
    ];

    // フィルタリング対象のソースファイル名
    const FILTERED_SOURCES = [
      "chrome-extension://",
      "moz-extension://",
      "multi-tabs.js",
      "extension",
    ];

    // エラーをフィルタリングする関数
    function shouldFilterError(message: string, source?: string): boolean {
      if (typeof message !== "string") return false;

      const lowerMessage = message.toLowerCase();

      // メッセージのチェック
      const messageMatches = FILTERED_ERRORS.some((filter) =>
        lowerMessage.includes(filter.toLowerCase()),
      );

      // ソースファイルのチェック
      const sourceMatches =
        source &&
        FILTERED_SOURCES.some((filter) =>
          source.toLowerCase().includes(filter.toLowerCase()),
        );

      return messageMatches || sourceMatches || false;
    }

    // 元のエラーハンドラを保存
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;

    // console.error をフィルタリング
    console.error = (...args: unknown[]) => {
      const message = args
        .map((arg) => {
          if (typeof arg === "string") return arg;
          if (arg instanceof Error) return arg.message;
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        })
        .join(" ");

      if (!shouldFilterError(message)) {
        originalConsoleError.apply(console, args);
      }
    };

    // console.warn をフィルタリング
    console.warn = (...args: unknown[]) => {
      const message = args
        .map((arg) => {
          if (typeof arg === "string") return arg;
          if (arg instanceof Error) return arg.message;
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        })
        .join(" ");

      if (!shouldFilterError(message)) {
        originalConsoleWarn.apply(console, args);
      }
    };

    // window.onerror イベントもフィルタリング
    const originalOnError = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      const messageStr =
        typeof message === "string"
          ? message
          : error?.message || String(message || "");

      if (shouldFilterError(messageStr, source || undefined)) {
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
      const reason = event.reason;
      let message = "";

      if (reason instanceof Error) {
        message = reason.message || reason.toString();
      } else if (typeof reason === "string") {
        message = reason;
      } else if (reason && typeof reason === "object") {
        try {
          message = JSON.stringify(reason);
        } catch {
          message = String(reason);
        }
      } else {
        message = String(reason || "");
      }

      // スタックトレースもチェック
      let source = "";
      if (reason instanceof Error && reason.stack) {
        source = reason.stack;
      }

      if (shouldFilterError(message, source)) {
        event.preventDefault(); // エラーを抑制
        event.stopPropagation(); // イベントの伝播を停止
        return;
      }
    };

    // イベントリスナーを追加（キャプチャフェーズで登録して確実にキャッチ）
    window.addEventListener(
      "unhandledrejection",
      handleUnhandledRejection,
      true,
    );

    // クリーンアップ関数
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;
      window.onerror = originalOnError;
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
        true,
      );
    };
  }, []);

  return null; // UIを持たないコンポーネント
}
