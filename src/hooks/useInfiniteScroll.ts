'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  threshold?: number
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold: _threshold = 300, // スクロールが底から300px以内になったらロード
}: UseInfiniteScrollOptions) {
  const [isFetching, setIsFetching] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isLoading || isFetching) return
    
    setIsFetching(true)
    onLoadMore()
  }, [hasMore, isLoading, isFetching, onLoadMore])

  // Intersection Observer を使用した無限スクロール
  useEffect(() => {
    if (!sentinelRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          handleLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(sentinelRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleLoadMore])

  // ロード完了時にフェッチ状態をリセット
  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false)
    }
  }, [isLoading])

  return {
    sentinelRef,
    isFetching: isFetching || isLoading,
  }
}

// スクロール位置監視版（フォールバック）
export function useScrollInfiniteLoad({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 300,
}: UseInfiniteScrollOptions) {
  const [isFetching, setIsFetching] = useState(false)

  const handleScroll = useCallback(() => {
    if (!hasMore || isLoading || isFetching) return

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold

    if (isNearBottom) {
      setIsFetching(true)
      onLoadMore()
    }
  }, [hasMore, isLoading, isFetching, onLoadMore, threshold])

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 200)
    window.addEventListener('scroll', throttledHandleScroll)
    return () => window.removeEventListener('scroll', throttledHandleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false)
    }
  }, [isLoading])

  return { isFetching: isFetching || isLoading }
}

// スロットリング関数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (..._args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (this: any, ..._args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, _args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
