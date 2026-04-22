import { useMemo, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { useScrollAnimation } from "@/lib/hooks"
import { useParallax } from "./useParallax"
import { cn } from "@/lib/utils"

// 星星配置
const STAR_COUNT_DESKTOP = 60

interface StarConfig {
  top: string
  left: string
  size: string
  duration: string
  delay: string
}

// 生成随机星星位置
function generateStars(count: number): StarConfig[] {
  return Array.from({ length: count }, () => ({
    top: `${Math.random() * 65}%`,
    left: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2.5}px`,
    duration: `${2 + Math.random() * 3}s`,
    delay: `${Math.random() * 5}s`,
  }))
}

// 云朵 SVG 组件
function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={className}
      style={style}
      fill="currentColor"
    >
      <ellipse cx="60" cy="40" rx="50" ry="15" />
      <ellipse cx="35" cy="32" rx="28" ry="20" />
      <ellipse cx="75" cy="28" rx="32" ry="18" />
      <ellipse cx="55" cy="22" rx="22" ry="16" />
    </svg>
  )
}

// 画架 SVG
function Easel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {/* 支架 */}
      <line x1="20" y1="120" x2="40" y2="30" />
      <line x1="60" y1="120" x2="40" y2="30" />
      <line x1="40" y1="120" x2="40" y2="20" />
      {/* 画布 */}
      <rect x="25" y="25" width="30" height="40" rx="2" fill="currentColor" fillOpacity="0.1" />
      {/* 横杆 */}
      <line x1="30" y1="50" x2="50" y2="50" />
    </svg>
  )
}

// 遮阳伞 SVG
function Parasol({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={className} fill="none">
      {/* 伞杆 */}
      <line x1="30" y1="100" x2="30" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* 伞面 */}
      <path
        d="M5 35 Q30 5 55 35 Q30 25 5 35Z"
        fill="currentColor"
        fillOpacity="0.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* 伞骨 */}
      <line x1="30" y1="30" x2="15" y2="40" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="30" x2="30" y2="42" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="30" x2="45" y2="40" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function LandscapeScene() {
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref: scrollRef, isVisible } = useScrollAnimation(0.1)

  // 视差 refs
  const starsRef = useParallax(containerRef, { intensity: 8, enabled: true })
  const farCloudsRef = useParallax(containerRef, { intensity: 15, enabled: true })
  const nearCloudsRef = useParallax(containerRef, { intensity: 25, enabled: true })
  const decorRef = useParallax(containerRef, { intensity: 12, enabled: true })

  // 生成星星（使用 useMemo 避免重渲染时位置变化）
  const stars = useMemo(() => generateStars(STAR_COUNT_DESKTOP), [])

  // 云朵配置
  const clouds = [
    { id: 1, top: "8%", scale: 0.6, duration: "55s", delay: "0s", layer: "far" as const },
    { id: 2, top: "15%", scale: 0.8, duration: "45s", delay: "-15s", layer: "far" as const },
    { id: 3, top: "25%", scale: 1, duration: "35s", delay: "-8s", layer: "near" as const },
    { id: 4, top: "12%", scale: 0.7, duration: "50s", delay: "-25s", layer: "far" as const },
    { id: 5, top: "20%", scale: 0.9, duration: "40s", delay: "-20s", layer: "near" as const },
  ]

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Layer 0: 天空背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-800" />

      {/* Layer 1: 星星层 */}
      <div ref={starsRef} className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white dark:bg-white animate-star-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              "--twinkle-duration": star.duration,
              animationDelay: star.delay,
              opacity: 0.3,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Layer 2-3: 云朵层 */}
      <div ref={farCloudsRef} className="absolute inset-0">
        {clouds.filter(c => c.layer === "far").map(cloud => (
          <Cloud
            key={cloud.id}
            className="absolute text-white/70 dark:text-slate-600/40 animate-cloud-drift"
            style={{
              top: cloud.top,
              width: `${120 * cloud.scale}px`,
              "--cloud-duration": cloud.duration,
              animationDelay: cloud.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div ref={nearCloudsRef} className="absolute inset-0">
        {clouds.filter(c => c.layer === "near").map(cloud => (
          <Cloud
            key={cloud.id}
            className="absolute text-white/90 dark:text-slate-500/50 animate-cloud-drift"
            style={{
              top: cloud.top,
              width: `${120 * cloud.scale}px`,
              "--cloud-duration": cloud.duration,
              animationDelay: cloud.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Layer 4-6: 草地层 */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* 远景草地 */}
        <svg
          viewBox="0 0 1440 320"
          className="w-full animate-grass-wave"
          style={{ "--wave-duration": "10s" } as React.CSSProperties}
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 Q180,160 360,190 Q540,220 720,180 Q900,140 1080,190 Q1260,240 1440,200 L1440,320 L0,320 Z"
            className="fill-emerald-600 dark:fill-emerald-900"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        {/* 中景草地 */}
        <svg
          viewBox="0 0 1440 240"
          className="w-full animate-grass-wave"
          style={{ "--wave-duration": "8s", animationDelay: "-2s" } as React.CSSProperties}
          preserveAspectRatio="none"
        >
          <path
            d="M0,160 Q240,140 480,170 Q720,200 960,155 Q1200,110 1440,165 L1440,240 L0,240 Z"
            className="fill-green-500 dark:fill-green-800"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        {/* 近景草地 */}
        <svg
          viewBox="0 0 1440 160"
          className="w-full animate-grass-wave"
          style={{ "--wave-duration": "6s", animationDelay: "-4s" } as React.CSSProperties}
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 Q180,85 360,105 Q540,125 720,95 Q900,65 1080,100 Q1260,135 1440,105 L1440,160 L0,160 Z"
            className="fill-lime-400 dark:fill-green-700"
          />
        </svg>
      </div>

      {/* Layer 7: 装饰元素 */}
      <div ref={decorRef} className="absolute bottom-16 left-0 right-0 hidden lg:block">
        {/* 画架 */}
        <div className="absolute left-[15%] bottom-8 w-16 h-24 text-amber-800 dark:text-amber-900 animate-float-slow">
          <Easel className="w-full h-full" />
        </div>
        {/* 遮阳伞 */}
        <div className="absolute right-[20%] bottom-12 w-14 h-28 text-sky-600 dark:text-sky-800 animate-float-slow" style={{ animationDelay: "-3s" } as React.CSSProperties}>
          <Parasol className="w-full h-full" />
        </div>
      </div>

      {/* Layer 8: 内容层 */}
      <div
        ref={scrollRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8"
      >
        <div className={cn(
          "text-center max-w-3xl backdrop-blur-sm bg-white/10 dark:bg-black/20 rounded-3xl p-8 sm:p-12 lg:p-16",
          "opacity-0",
          isVisible && "animate-fade-up"
        )}>
          {/* 头像 */}
          <div className={cn(
            "mb-6 sm:mb-8",
            "opacity-0",
            isVisible && "animate-scale-in animate-delay-100"
          )}>
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-lime-400 rounded-full blur-lg opacity-60 animate-glow-pulse" />
              <img
                src="/images/avatar.png"
                alt={data.personal.name}
                className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white/80 dark:border-slate-300/80 shadow-xl"
              />
            </div>
          </div>

          {/* 欢迎语 + 姓名 */}
          <div className={cn(
            "mb-3 sm:mb-4",
            "opacity-0",
            isVisible && "animate-fade-up animate-delay-200"
          )}>
            <p className="text-sm sm:text-base text-sky-700 dark:text-sky-300 font-medium mb-1">
              {t.hero.greeting}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              {data.personal.name}
            </h1>
          </div>

          {/* 职位 */}
          <div className={cn(
            "mb-3 sm:mb-4",
            "opacity-0",
            isVisible && "animate-fade-up animate-delay-300"
          )}>
            <p className="text-lg sm:text-xl lg:text-2xl text-gradient from-sky-600 to-emerald-600 dark:from-sky-400 dark:to-emerald-400 font-semibold">
              {data.personal.title}
            </p>
          </div>

          {/* 标语 */}
          <div className={cn(
            "mb-6 sm:mb-8 max-w-xl mx-auto",
            "opacity-0",
            isVisible && "animate-fade-up animate-delay-400"
          )}>
            <p className="text-sm sm:text-base lg:text-lg text-foreground/80 dark:text-foreground/70 leading-relaxed">
              {data.personal.tagline}
            </p>
          </div>

          {/* CTA 按钮 */}
          <div className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4",
            "opacity-0",
            isVisible && "animate-fade-up animate-delay-500"
          )}>
            <a
              href="#about"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-full text-sm sm:text-base font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {t.hero.learnMore}
            </a>
            <a
              href="#contact"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/20 dark:bg-white/10 text-foreground rounded-full text-sm sm:text-base font-medium border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm"
            >
              {t.hero.contactMe}
            </a>
          </div>
        </div>
      </div>

      {/* Layer 9: 滚动箭头 */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#about"
          className="flex flex-col items-center gap-1 text-foreground/60 hover:text-foreground transition-colors animate-float"
        >
          <span className="text-xs">{t.hero.scrollDown}</span>
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </div>
  )
}
