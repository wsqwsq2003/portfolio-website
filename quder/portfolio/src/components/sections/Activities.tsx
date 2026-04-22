import { useScrollAnimation } from "@/lib/hooks"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { getIcon } from "@/lib/icons"
import { SectionWrapper, SectionHeading } from "@/components/ui/section"
import { cn } from "@/lib/utils"

export function Activities() {
  const { ref, isVisible } = useScrollAnimation()
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)

  const delays = ["animate-delay-100", "animate-delay-200", "animate-delay-300", "animate-delay-400"]

  return (
    <SectionWrapper id="activities">
      <SectionHeading title={t.activities.title} subtitle={t.activities.subtitle} />
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {data.activities.map((activity, i) => {
          const Icon = getIcon(activity.iconKey)
          return (
            <div
              key={activity.title + i}
              className={cn(
                "group bg-gradient-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 opacity-0",
                isVisible && "animate-fade-up",
                isVisible && delays[i]
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-activity flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-foreground">{activity.title}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'hsl(160, 84%, 39%, 0.1)', color: 'hsl(160, 84%, 39%)' }}>{activity.role}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{activity.period}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}