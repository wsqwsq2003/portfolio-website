import { useRef, useEffect, useState, useCallback } from "react"

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  color: string
  speed: number
  delay: number
  opacity: number
}

interface ParticleIntroProps {
  onComplete: () => void
  duration?: number
}

export function ParticleIntro({ onComplete, duration = 3500 }: ParticleIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFading, setIsFading] = useState(false)
  const animationRef = useRef<number>(0)

  const createParticles = useCallback((width: number, height: number): Particle[] => {
    const colors = [
      "hsl(243, 75%, 59%)",
      "hsl(280, 75%, 52%)",
      "hsl(340, 80%, 55%)",
      "hsl(35, 92%, 55%)",
      "hsl(199, 89%, 48%)",
      "hsl(172, 66%, 45%)",
      "hsl(160, 84%, 39%)",
      "hsl(263, 70%, 58%)",
    ]

    const particleCount = Math.min(200, Math.floor((width * height) / 5000))
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      const centerX = width / 2
      const centerY = height / 2
      const angle = (Math.PI * 2 * i) / particleCount
      const radius = Math.random() * 100 + 50

      particles.push({
        x: centerX,
        y: centerY,
        targetX: centerX + Math.cos(angle) * radius,
        targetY: centerY + Math.sin(angle) * radius,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.02 + 0.015,
        delay: Math.random() * 800,
        opacity: 0,
      })
    }

    return particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const particles = createParticles(canvas.width, canvas.height)
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        const particleElapsed = Math.max(0, elapsed - particle.delay)
        const particleProgress = Math.min(particleElapsed / (duration * 0.7), 1)

        const easeOut = 1 - Math.pow(1 - particleProgress, 3)

        particle.x = particle.x + (particle.targetX - particle.x) * particle.speed * (1 + easeOut * 2)
        particle.y = particle.y + (particle.targetY - particle.y) * particle.speed * (1 + easeOut * 2)

        particle.opacity = Math.sin(particleProgress * Math.PI) * 0.8

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * (1 - particleProgress * 0.3), 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(")", `, ${particle.opacity})`).replace("hsl", "hsla")
        ctx.fill()

        const distanceToTarget = Math.sqrt(
          Math.pow(particle.targetX - particle.x, 2) + Math.pow(particle.targetY - particle.y, 2)
        )

        if (distanceToTarget > 5) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(
            particle.x + (particle.targetX - particle.x) * 0.1,
            particle.y + (particle.targetY - particle.y) * 0.1
          )
          ctx.strokeStyle = particle.color.replace(")", `, ${particle.opacity * 0.3})`).replace("hsl", "hsla")
          ctx.lineWidth = particle.size * 0.5
          ctx.stroke()
        }
      })

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsFading(true)
        setTimeout(() => {
          onComplete()
        }, 500)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [createParticles, duration, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 bg-gradient-hero ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" style={{ mixBlendMode: "screen" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-4 animate-pulse">
            Welcome
          </h1>
          <p className="text-lg sm:text-xl text-white/80 animate-fade-in">
            Loading amazing content...
          </p>
        </div>
      </div>
    </div>
  )
}
