'use client'

import React, { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export default function MagneticButton({ 
  children, 
  className = '', 
  strength = 0.3 
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY

      x.set(distanceX * strength)
      y.set(distanceY * strength)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [x, y, strength])

  return (
    <motion.div
      ref={ref}
      style={{
        x: xSpring,
        y: ySpring,
        rotateX,
        rotateY,
        z: 0,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}