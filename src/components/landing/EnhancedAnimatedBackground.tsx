'use client'

import React, { useRef, useEffect, useCallback, Suspense } from 'react'

class Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string

  constructor(
    // eslint-disable-next-line unused-imports/no-unused-vars
    public mouse: { x: number; y: number },
    public canvas: HTMLCanvasElement,
    // eslint-disable-next-line unused-imports/no-unused-vars
    public ctx: CanvasRenderingContext2D
  ) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 1.5 + 0.5
    this.speedX = Math.random() * 2 - 1
    this.speedY = Math.random() * 2 - 1
    this.color = `rgba(0, 123, 255, ${Math.random() * 0.5 + 0.2})`
  }

  update() {
    // Interaction with mouse
    const dx = this.mouse.x - this.x
    const dy = this.mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < 100) {
      this.x += dx / 20
      this.y += dy / 20
    } else {
      this.x += this.speedX
      this.y += this.speedY
    }

    // Wall collision
    if (this.x > this.canvas.width || this.x < 0) this.speedX *= -1
    if (this.y > this.canvas.height || this.y < 0) this.speedY *= -1
  }

  draw() {
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
  }
}

const EnhancedAnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    window.addEventListener('mousemove', handleMouseMove)

    let animationFrameId: number
    let particlesArray: Particle[] = []

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesArray = []
      const numberOfParticles = (canvas.width * canvas.height) / 9000
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle(mouseRef.current, canvas, ctx))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i]
        if (!p) continue
        p.update()
        p.draw()
      }
      connect()
      animationFrameId = requestAnimationFrame(animate)
    }
    
    const connect = () => {
      let opacityValue = 1
      for (let a = 0; a < particlesArray.length; a++) {
        const pa = particlesArray[a]
        if (!pa) continue
        for (let b = a; b < particlesArray.length; b++) {
          const pb = particlesArray[b]
          if (!pb) continue
          const dx = pa.x - pb.x
          const dy = pa.y - pb.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            opacityValue = 1 - (distance / 120)
            ctx.strokeStyle = `rgba(138, 43, 226, ${opacityValue * 0.3})` // accent-vibrant with opacity
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(pa.x, pa.y)
            ctx.lineTo(pb.x, pb.y)
            ctx.stroke()
          }
        }
      }
    }

    init()
    animate()

    window.addEventListener('resize', init)

    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [handleMouseMove])

  return (
    <Suspense fallback={<div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-blue-50 to-indigo-100" />}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
    </Suspense>
  )
}

export default EnhancedAnimatedBackground