"use client"

import { useEffect, useRef } from "react"

const HeroBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle system
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string

      constructor() {
        this.x = Math.random() * (canvas?.width || 800)
        this.y = Math.random() * (canvas?.height || 600)
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.3 + 0.1
        this.color = Math.random() > 0.5 ? "255,101,34" : "122,158,175" // orange or mistyblue
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Wrap around screen
        if (this.x < 0) this.x = canvas?.width || 800
        if (this.x > (canvas?.width || 800)) this.x = 0
        if (this.y < 0) this.y = canvas?.height || 600
        if (this.y > (canvas?.height || 600)) this.y = 0
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <>
      {/* Canvas for particle system */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-60"
        style={{ zIndex: 1 }}
      />
      
      {/* Static geometric elements */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange/5 via-transparent to-mistyblue/5 dark:from-orange/10 dark:via-transparent dark:to-orange/5"></div>
        
        {/* Floating geometric shapes with enhanced animations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange/20 to-orange/10 dark:from-orange/30 dark:to-orange/20 rounded-full animate-float-slow opacity-60"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-mistyblue/20 to-mistyblue/10 dark:from-orange/25 dark:to-orange/15 rounded-lg rotate-45 animate-float opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-orange/15 to-orange/5 dark:from-orange/20 dark:to-orange/10 rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 right-1/3 w-16 h-16 bg-gradient-to-br from-mistyblue/15 to-mistyblue/5 dark:from-orange/20 dark:to-orange/10 rounded-lg rotate-12 animate-float-slow opacity-30" style={{ animationDelay: '3s' }}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-32 right-10 w-6 h-6 bg-orange/30 dark:bg-orange/40 rounded-full animate-float opacity-50" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-8 h-8 bg-mistyblue/30 dark:bg-orange/35 rounded-lg rotate-45 animate-float-slow opacity-45" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Large glow orbs with enhanced animation */}
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange/20 dark:bg-orange/30 rounded-full filter blur-3xl animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-mistyblue/20 dark:bg-orange/25 rounded-full filter blur-3xl animate-pulse opacity-40" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Mesh gradient overlays for depth */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-orange/10 via-orange/5 to-transparent dark:from-orange/20 dark:via-orange/10 dark:to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-mistyblue/10 via-mistyblue/5 to-transparent dark:from-orange/15 dark:via-orange/8 dark:to-transparent opacity-50"></div>
      </div>
    </>
  )
}

export default HeroBackground
