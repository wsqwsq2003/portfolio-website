import { useRef, useEffect, useState } from "react"

interface Planet {
  x: number
  y: number
  radius: number
  color1: string
  color2: string
  speed: number
  delay: number
  opacity: number
  scale: number
}

interface Rocket {
  x: number
  y: number
  targetX: number
  targetY: number
  speed: number
  delay: number
  opacity: number
  trail: { x: number; y: number; opacity: number }[]
}

interface SmokeParticle {
  x: number
  y: number
  radius: number
  opacity: number
  color: string
  speedX: number
  speedY: number
}

interface StarIntroProps {
  onComplete: () => void
  duration?: number
}

export function StarIntro({ onComplete, duration = 4000 }: StarIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFading, setIsFading] = useState(false)

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

    // Create planets
    const planets: Planet[] = [
      {
        x: canvas.width * 0.15,
        y: canvas.height * 0.25,
        radius: 60,
        color1: "#3B82F6",
        color2: "#1E40AF",
        speed: 0,
        delay: 500,
        opacity: 0,
        scale: 0,
      },
      {
        x: canvas.width * 0.85,
        y: canvas.height * 0.6,
        radius: 45,
        color1: "#3B82F6",
        color2: "#1E40AF",
        speed: 0,
        delay: 800,
        opacity: 0,
        scale: 0,
      },
      {
        x: canvas.width * 0.3,
        y: canvas.height * 0.75,
        radius: 35,
        color1: "#A78BFA",
        color2: "#7C3AED",
        speed: 0,
        delay: 1000,
        opacity: 0,
        scale: 0,
      },
    ]

    // Create rocket
    const rocket: Rocket = {
      x: -100,
      y: canvas.height / 2,
      targetX: canvas.width * 0.75,
      targetY: canvas.height * 0.45,
      speed: 0,
      delay: 1500,
      opacity: 0,
      trail: [],
    }

    // Smoke particles
    const smokeParticles: SmokeParticle[] = []

    const startTime = Date.now()

    const drawPlanet = (planet: Planet) => {
      const gradient = ctx.createRadialGradient(
        planet.x - planet.radius * 0.3,
        planet.y - planet.radius * 0.3,
        0,
        planet.x,
        planet.y,
        planet.radius * planet.scale
      )
      gradient.addColorStop(0, planet.color1)
      gradient.addColorStop(1, planet.color2)

      ctx.save()
      ctx.globalAlpha = planet.opacity
      ctx.beginPath()
      ctx.arc(planet.x, planet.y, planet.radius * planet.scale, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Highlight
      const highlight = ctx.createRadialGradient(
        planet.x - planet.radius * 0.3 * planet.scale,
        planet.y - planet.radius * 0.3 * planet.scale,
        0,
        planet.x - planet.radius * 0.3 * planet.scale,
        planet.y - planet.radius * 0.3 * planet.scale,
        planet.radius * planet.scale * 0.5
      )
      highlight.addColorStop(0, "rgba(255, 255, 255, 0.3)")
      highlight.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = highlight
      ctx.fill()
      ctx.restore()
    }

    const drawRocket = (rocket: Rocket) => {
      ctx.save()
      ctx.globalAlpha = rocket.opacity
      ctx.translate(rocket.x, rocket.y)

      // Rocket body
      const bodyGradient = ctx.createLinearGradient(-15, 0, 15, 0)
      bodyGradient.addColorStop(0, "#E5E7EB")
      bodyGradient.addColorStop(0.5, "#F9FAFB")
      bodyGradient.addColorStop(1, "#D1D5DB")

      ctx.fillStyle = bodyGradient
      ctx.beginPath()
      ctx.ellipse(0, 0, 12, 25, 0, 0, Math.PI * 2)
      ctx.fill()

      // Rocket nose
      const noseGradient = ctx.createLinearGradient(0, -30, 0, -15)
      noseGradient.addColorStop(0, "#EF4444")
      noseGradient.addColorStop(1, "#DC2626")
      ctx.fillStyle = noseGradient
      ctx.beginPath()
      ctx.moveTo(-10, -15)
      ctx.lineTo(0, -30)
      ctx.lineTo(10, -15)
      ctx.closePath()
      ctx.fill()

      // Window
      ctx.fillStyle = "#60A5FA"
      ctx.beginPath()
      ctx.arc(0, -5, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Fins
      ctx.fillStyle = "#EF4444"
      ctx.beginPath()
      ctx.moveTo(-12, 15)
      ctx.lineTo(-18, 25)
      ctx.lineTo(-8, 20)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(12, 15)
      ctx.lineTo(18, 25)
      ctx.lineTo(8, 20)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
    }

    const drawSmoke = (particle: SmokeParticle) => {
      ctx.save()
      ctx.globalAlpha = particle.opacity
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius
      )
      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(1, "rgba(147, 197, 253, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Draw gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bgGradient.addColorStop(0, "#3B82F6")
      bgGradient.addColorStop(0.5, "#6366F1")
      bgGradient.addColorStop(1, "#7C3AED")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Animate planets
      planets.forEach((planet) => {
        const planetElapsed = Math.max(0, elapsed - planet.delay)
        const planetProgress = Math.min(planetElapsed / 1500, 1)

        const easeOut = 1 - Math.pow(1 - planetProgress, 4)
        planet.scale = easeOut
        planet.opacity = Math.min(planetProgress * 1.5, 1)

        // Floating animation
        const floatOffset = Math.sin(elapsed * 0.001 + planet.delay) * 10
        planet.y += floatOffset * 0.01

        drawPlanet(planet)
      })

      // Animate rocket
      if (elapsed > rocket.delay) {
        const rocketElapsed = elapsed - rocket.delay
        const rocketProgress = Math.min(rocketElapsed / 2000, 1)

        const easeOut = 1 - Math.pow(1 - rocketProgress, 3)
        rocket.x = -100 + (rocket.targetX + 100) * easeOut
        rocket.y = canvas.height / 2 + (rocket.targetY - canvas.height / 2) * easeOut
        rocket.opacity = rocketProgress < 0.1 ? rocketProgress * 10 : rocketProgress > 0.8 ? (1 - rocketProgress) * 5 : 1

        // Add smoke particles
        if (rocket.opacity > 0.5 && Math.random() > 0.3) {
          smokeParticles.push({
            x: rocket.x - 15,
            y: rocket.y + 20,
            radius: Math.random() * 15 + 8,
            opacity: 0.8,
            color: `hsl(${210 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%)`,
            speedX: -Math.random() * 3 - 1,
            speedY: (Math.random() - 0.5) * 2,
          })
        }

        drawRocket(rocket)
      }

      // Update and draw smoke
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const particle = smokeParticles[i]
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.radius += 0.3
        particle.opacity -= 0.015

        if (particle.opacity <= 0) {
          smokeParticles.splice(i, 1)
        } else {
          drawSmoke(particle)
        }
      }

      // Draw title text
      if (progress > 0.3) {
        const textProgress = Math.min((progress - 0.3) / 0.5, 1)
        const textOpacity = textProgress

        ctx.save()
        ctx.globalAlpha = textOpacity
        ctx.fillStyle = "#FFFFFF"
        ctx.font = `bold ${Math.min(canvas.width * 0.06, 60)}px Inter, system-ui, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("JOIN THE STARS", canvas.width / 2, canvas.height * 0.35)

        ctx.font = `${Math.min(canvas.width * 0.02, 18)}px Inter, system-ui, sans-serif`
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
        ctx.fillText("探索无限可能", canvas.width / 2, canvas.height * 0.42)
        ctx.restore()
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsFading(true)
        setTimeout(() => {
          onComplete()
        }, 500)
      }
    }

    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [duration, onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
