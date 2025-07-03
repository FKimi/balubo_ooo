// 既存のフック
export { useProfile } from './useProfile'
export { useWorkCategories } from './useWorkCategories'
export { useWorkStatistics } from './useWorkStatistics'

// スクロールアニメーション用フック
import { useEffect, useRef, useState } from 'react'
import { useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Variants } from 'framer-motion'

export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return { ref, isVisible }
}

// Framer Motionを使った汎用的なスクロールアニメーションフック
export function useFramerMotionAnimation() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      // Optional: Reset animation when out of view
      // controls.start("hidden")
    }
  }, [controls, inView])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1], // Smooth custom cubic-bezier
      },
    },
  }

  return { ref, controls, containerVariants, itemVariants }
}

// スクロール進行度フック
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollProgress
}

// ステップ順次表示フック
export function useStaggeredAnimation(itemsCount: number, delay = 200) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [isTriggered, setIsTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !isTriggered) {
          setIsTriggered(true)
          // アイテムを順次表示
          for (let i = 0; i < itemsCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, i])
            }, i * delay)
          }
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current)
      }
    }
  }, [itemsCount, delay, isTriggered])

  return { ref, visibleItems, isTriggered }
}