import { ChevronDown } from "lucide-react"
import { useScrollAnimation } from "@/lib/hooks"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { FloatingNavBubbles } from "@/components/ui/FloatingBubbles"
import { cn } from "@/lib/utils"
import { getImageDataUrl } from "@/lib/imageStorage"

export function Hero() {
  const { ref, isVisible } = useScrollAnimation(0.1)
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)
  // 获取头像 URL（支持 Base64 和普通 URL）
  const avatarUrl = data.personal.avatarUrl ? getImageDataUrl(data.personal.avatarUrl) : "/images/avatar.png"

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-background">
      {/* Floating Navigation Bubbles */}
      <FloatingNavBubbles />

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-rose-500/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-40 left-1/3 w-56 sm:w-72 h-56 sm:h-72 bg-teal-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "-5s" } as React.CSSProperties} />
        <div className="absolute bottom-20 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-amber-500/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "-2s" } as React.CSSProperties} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      {/* Content */}
      <div className="relative z-[5] flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-3xl glass-card p-8 sm:p-12 lg:p-16",
            "opacity-0",
            isVisible && "animate-fade-up"
          )}
        >
          {/* Avatar */}
          <div className={cn(
            "mb-6 sm:mb-8",
            "opacity-0",
            isVisible && "animate-scale-in animate-delay-100"
          )}>
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-lime-400 rounded-full blur-lg opacity-50 animate-glow-pulse" />
              <img
                src={avatarUrl}
                alt={data.personal.name}
                className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full object-cover border-4 border-white/30 dark:border-white/20 shadow-xl"
              />
            </div>
          </div>

          {/* Greeting + Name */}
          <div className={cn(
            "mb-3 sm:mb-4",
            "opacity-0",
            isVisible && "animate-fade-up animate-delay-200"
          )}>
            <p className="text-sm sm:text-base text-primary/80 dark:text-primary/60 font-medium mb-1">
              {t.hero.greeting}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              {data.personal.name}
            </h1>
          </div>

          {/* Title */}
          <div className={cn(
            "mb-3 sm:mb-4",
            "opacity-0",
            isVisible && "animate-fade-up animate-delay-300"
          )}>
            <p className="text-lg sm:text-xl lg:text-2xl text-gradient font-semibold">
              {data.personal.title}
            </p>
          </div>

          {/* Tagline */}
          <div className={cn(
            "mb-6 sm:mb-8 max-w-xl mx-auto",
            "opacity-0",
            isVisible && "animate-fade-up animate-delay-400"
          )}>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              {data.personal.tagline}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4",
            "opacity-0",
            isVisible && "animate-fade-up animate-delay-500"
          )}>
            <a
              href="#about"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-full text-sm sm:text-base font-medium hover:bg-primary/90 transition-all hover:shadow-colored hover:-translate-y-0.5"
            >
              {t.hero.learnMore}
            </a>
            <a
              href="#contact"
              className="px-6 sm:px-8 py-2.5 sm:py-3 glass rounded-full text-sm sm:text-base font-medium text-foreground hover:bg-white/20 dark:hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              {t.hero.contactMe}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#about"
          className="flex flex-col items-center gap-1 text-muted-foreground/60 hover:text-foreground transition-colors animate-float"
        >
          <span className="text-xs">{t.hero.scrollDown}</span>
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  )
}
