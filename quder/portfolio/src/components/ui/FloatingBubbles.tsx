import { useEffect, useRef, useState } from "react"
import { useI18n } from "@/lib/i18n"
import { User, GraduationCap, Building2, Briefcase, FolderGit2, Heart, Users, Mail } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface NavBubble {
  label: string
  href: string
  icon: LucideIcon
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  delay: number
  phase: number
}

interface FloatingNavBubblesProps {
  onNavigate?: (href: string) => void
}

export function FloatingNavBubbles({ onNavigate }: FloatingNavBubblesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { locale, t } = useI18n()
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null)

  const navItems = [
    { label: t.nav.about, href: "#about", icon: User },
    { label: t.nav.education, href: "#education", icon: GraduationCap },
    { label: t.nav.internship, href: "#internship", icon: Building2 },
    { label: t.nav.work, href: "#work", icon: Briefcase },
    { label: t.nav.projects, href: "#projects", icon: FolderGit2 },
    { label: t.nav.hobbies, href: "#hobbies", icon: Heart },
    { label: t.nav.activities, href: "#activities", icon: Users },
    { label: t.nav.contact, href: "#contact", icon: Mail },
  ]

  const bubblesRef = useRef<NavBubble[]>([])

  useEffect(() => {
    // 根据屏幕尺寸动态调整泡泡大小
    const isMobile = window.innerWidth < 640
    const bubbleSizeRange = isMobile ? [50, 70] : [90, 130]
    const sizeRange = bubbleSizeRange[1] - bubbleSizeRange[0]

    bubblesRef.current = navItems.map((item, index) => {
      const angle = (Math.PI * 2 * index) / navItems.length + Math.random() * 0.5
      const radius = 30 + Math.random() * 20

      return {
        label: item.label,
        href: item.href,
        icon: item.icon,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius * 0.8,
        size: bubbleSizeRange[0] + Math.random() * sizeRange,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        delay: Math.random() * 3000,
        phase: Math.random() * Math.PI * 2,
      }
    })
  }, [locale, navItems])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId: number
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime

      bubblesRef.current.forEach((bubble, index) => {
        const bubbleEl = container.children[index] as HTMLElement
        if (!bubbleEl) return

        const bubbleElapsed = elapsed - bubble.delay
        const floatX = Math.sin(bubbleElapsed * 0.0006 + bubble.phase) * 15
        const floatY = Math.cos(bubbleElapsed * 0.0005 + bubble.phase * 0.7) * 20

        bubble.x += bubble.speedX
        bubble.y += bubble.speedY

        if (bubble.x < 5 || bubble.x > 95) bubble.speedX *= -1
        if (bubble.y < 5 || bubble.y > 95) bubble.speedY *= -1

        bubble.x = Math.max(5, Math.min(95, bubble.x))
        bubble.y = Math.max(5, Math.min(95, bubble.y))

        bubbleEl.style.left = `${bubble.x}%`
        bubbleEl.style.top = `${bubble.y}%`
        bubbleEl.style.transform = `translate(-50%, -50%) translate(${floatX}px, ${floatY}px)`
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleBubbleClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href)
    } else {
      window.location.hash = href
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bubblesRef.current.map((bubble, index) => {
        const Icon = bubble.icon
        const isHovered = hoveredBubble === bubble.href

        return (
          <a
            key={bubble.href}
            href={bubble.href}
            className="absolute pointer-events-auto cursor-pointer group"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
            }}
            onClick={(e) => {
              e.preventDefault()
              handleBubbleClick(bubble.href)
            }}
            onMouseEnter={() => setHoveredBubble(bubble.href)}
            onMouseLeave={() => setHoveredBubble(null)}
          >
            <div
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{
                background: `radial-gradient(circle at 35% 35%, 
                  hsl(${243 + index * 25}, 45%, ${isHovered ? 78 : 72}%), 
                  hsl(${280 + index * 20}, 40%, ${isHovered ? 72 : 65}%))`,
                opacity: isHovered ? 0.35 : 0.2,
                boxShadow: isHovered 
                  ? `0 0 40px hsl(${243 + index * 25}, 45%, 70%, 0.3), inset 0 0 20px hsl(${243 + index * 25}, 45%, 80%, 0.2)`
                  : `0 0 30px hsl(${243 + index * 25}, 45%, 70%, 0.15), inset 0 0 15px hsl(${243 + index * 25}, 45%, 80%, 0.1)`,
                border: `1px solid hsl(${243 + index * 25}, 40%, 75%, ${isHovered ? 0.5 : 0.3})`,
              }}
            />

            <div
              className="absolute rounded-full"
              style={{
                top: "15%",
                left: "20%",
                width: "30%",
                height: "20%",
                background: "radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)",
              }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <Icon 
                className="transition-all duration-300"
                style={{
                  width: `${bubble.size * 0.25}px`,
                  height: `${bubble.size * 0.25}px`,
                  color: isHovered ? "hsl(0, 0%, 95%)" : "hsl(0, 0%, 85%)",
                  strokeWidth: 1.5,
                }}
              />
              <span
                className="text-xs font-medium transition-all duration-300 whitespace-nowrap"
                style={{
                  color: isHovered ? "hsl(0, 0%, 98%)" : "hsl(0, 0%, 80%)",
                  fontSize: `${Math.max(10, bubble.size * 0.1)}px`,
                  textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                {bubble.label}
              </span>
            </div>
          </a>
        )
      })}
    </div>
  )
}
