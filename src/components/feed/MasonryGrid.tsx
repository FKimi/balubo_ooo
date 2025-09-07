'use client'

import { useEffect, useRef, useState } from 'react'

interface MasonryGridProps {
  children: React.ReactNode[]
  columns?: {
    default: number
    768: number
    1024: number
    1280: number
    1536: number
  }
  gap?: number
}

export function MasonryGrid({ 
  children, 
  columns = {
    default: 1,
    768: 2,
    1024: 3, 
    1280: 4,
    1536: 5
  },
  gap = 24 
}: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [_columnCount, setColumnCount] = useState(columns.default)

  useEffect(() => {
    const updateLayout = () => {
      if (!gridRef.current) return

      const width = window.innerWidth
      let cols = columns.default

      if (width >= 1536) cols = columns[1536]
      else if (width >= 1280) cols = columns[1280]
      else if (width >= 1024) cols = columns[1024]
      else if (width >= 768) cols = columns[768]

      setColumnCount(cols)

      // Masonryレイアウトの計算
      const grid = gridRef.current
      const items = grid.children
      const columnHeights = new Array(cols).fill(0)

      Array.from(items).forEach((item, _index) => {
        const element = item as HTMLElement
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))
        
        element.style.position = 'absolute'
        element.style.left = `${(shortestColumnIndex * (100 / cols))}%`
        element.style.top = `${columnHeights[shortestColumnIndex]}px`
        element.style.width = `calc(${100 / cols}% - ${gap * (cols - 1) / cols}px)`
        
        // 要素の高さを取得して列の高さを更新
        const itemHeight = element.offsetHeight
        columnHeights[shortestColumnIndex] += itemHeight + gap
      })

      // グリッドの高さを最も高い列に合わせる
      grid.style.height = `${Math.max(...columnHeights)}px`
    }

    // 初回レイアウト
    const timer = setTimeout(updateLayout, 100)

    // リサイズ時のレイアウト更新
    window.addEventListener('resize', updateLayout)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateLayout)
    }
  }, [children.length, columns, gap])

  return (
    <div 
      ref={gridRef} 
      className="relative"
      style={{ position: 'relative' }}
    >
      {children}
    </div>
  )
}
