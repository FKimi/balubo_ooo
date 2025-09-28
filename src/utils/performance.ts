/**
 * パフォーマンス最適化ユーティリティ
 * メインスレッドのブロッキングを防ぐためのヘルパー関数
 */

/**
 * 重い処理をrequestIdleCallbackで実行し、メインスレッドをブロックしないようにする
 */
export function runInIdle<T extends (..._args: any[]) => any>(
  callback: T,
  timeout = 5000,
): Promise<ReturnType<T>> {
  return new Promise((resolve, reject) => {
    const wrappedCallback = () => {
      try {
        const result = callback();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(wrappedCallback, { timeout });
    } else {
      // requestIdleCallbackがサポートされていない場合はsetTimeoutで代替
      setTimeout(wrappedCallback, 0);
    }
  });
}

/**
 * 重い処理をチャンクに分割して実行
 */
export async function runInChunks<T>(
  items: T[],
  processor: (_item: T) => void,
  chunkSize = 10,
  delay = 0,
): Promise<void> {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    // チャンク内のアイテムを処理
    chunk.forEach(processor);

    // 次のチャンクの前に少し待機してメインスレッドを解放
    if (delay > 0 && i + chunkSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * デバウンス関数 - 連続する呼び出しを制限
 */
export function debounce<T extends (..._args: any[]) => any>(
  func: T,
  wait: number,
): (..._args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * スロットル関数 - 一定間隔でのみ実行
 */
export function throttle<T extends (..._args: any[]) => any>(
  func: T,
  limit: number,
): (..._args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 重い計算処理をWeb Workerで実行（将来的な拡張用）
 */
export class PerformanceWorker {
  private worker: Worker | null = null;

  constructor() {
    // Web Workerの実装は必要に応じて追加
    // 現在はブラウザサポートの制約により、requestIdleCallbackを使用
  }

  async processHeavyTask<T>(task: () => T): Promise<T> {
    return runInIdle(task);
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

/**
 * メモリ使用量を監視するユーティリティ
 */
export function getMemoryUsage(): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null {
  if ("memory" in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}

/**
 * パフォーマンス測定用のマーカー
 */
export class PerformanceMarker {
  private markers: Map<string, number> = new Map();

  start(name: string): void {
    this.markers.set(name, performance.now());
  }

  end(name: string): number {
    const startTime = this.markers.get(name);
    if (!startTime) {
      console.warn(`Marker "${name}" was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.markers.delete(name);

    if (process.env.NODE_ENV === "development") {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure<T>(name: string, fn: () => T): T {
    this.start(name);
    const result = fn();
    this.end(name);
    return result;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    const result = await fn();
    this.end(name);
    return result;
  }
}

// グローバルインスタンス
export const performanceMarker = new PerformanceMarker();
