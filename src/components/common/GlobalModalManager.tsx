'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLayout } from '@/contexts/LayoutContext'
import { ContentTypeSelector } from '@/features/work/components/ContentTypeSelector'

export function GlobalModalManager() {
  const [mounted, setMounted] = useState(false)
  const { isContentTypeSelectorOpen, closeContentTypeSelector } = useLayout()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const modalContent = (
    <ContentTypeSelector
      isOpen={isContentTypeSelectorOpen}
      onClose={closeContentTypeSelector}
    />
  )

  // 確実に最前面に表示するため、bodyの末尾に配置
  const portalTarget = document.body
  portalTarget.style.position = 'relative' // 必要に応じてpositionを設定
  
  return createPortal(modalContent, portalTarget)
}
