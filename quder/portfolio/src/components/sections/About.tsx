import { useScrollAnimation } from "@/lib/hooks"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { SectionWrapper, SectionHeading } from "@/components/ui/section"
import { cn } from "@/lib/utils"

// 彩色统计卡片颜色轮换
const statColors = [
  'hsl(199, 70%, 55%)',  // 蓝色
  'hsl(263, 60%, 60%)',  // 紫色
  'hsl(160, 70%, 45%)',  // 绿色
  'hsl(340, 70%, 60%)',  // 粉色
  'hsl(45, 85%, 55%)',   // 橙色
  'hsl(210, 75%, 55%)',  // 天蓝
]

export function About() {
  const { ref, isVisible } = useScrollAnimation()
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)

  // 从后台数据读取统计信息
  const stats = data.personal.stats.length > 0 
    ? data.personal.stats.map((stat, i) => ({
        ...stat,
        color: statColors[i % statColors.length],
      }))
    : []

  return (
    <SectionWrapper id="about">
      <SectionHeading title={t.about.title} subtitle={t.about.subtitle} />
      <div ref={ref} className={cn("max-w-3xl mx-auto opacity-0", isVisible && "animate-fade-up")}>
        <div className="bg-gradient-card rounded-2xl p-8 sm:p-10 shadow-card border border-border/50">
          <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
            {data.personal.about}
          </p>
          {stats.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={cn(
                    "opacity-0",
                    isVisible && "animate-fade-up",
                    i === 0 && "animate-delay-100",
                    i === 1 && "animate-delay-200",
                    i === 2 && "animate-delay-300",
                    i === 3 && "animate-delay-400"
                  )}
                >
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}