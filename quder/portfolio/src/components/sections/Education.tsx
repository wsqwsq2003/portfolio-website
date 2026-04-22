import { GraduationCap } from "lucide-react"
import { useScrollAnimation } from "@/lib/hooks"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { SectionWrapper, SectionHeading } from "@/components/ui/section"
import { cn } from "@/lib/utils"

export function Education() {
  const { ref, isVisible } = useScrollAnimation()
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)
  const degreeMap = t.education.degree as Record<string, string>

  return (
    <SectionWrapper id="education" className="bg-gradient-surface">
      <SectionHeading title={t.education.title} subtitle={t.education.subtitle} />
      <div ref={ref} className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, hsl(199, 89%, 48%), hsl(243, 75%, 59%))' }} />
          {data.education.map((edu, i) => (
            <div
              key={edu.school + i}
              className={cn(
                "relative pl-16 sm:pl-20 pb-12 last:pb-0 opacity-0",
                isVisible && "animate-slide-in-left",
                i === 0 && "animate-delay-100",
                i === 1 && "animate-delay-300"
              )}
            >
              <div className="absolute left-3.5 sm:left-5.5 top-1 w-5 h-5 rounded-full bg-gradient-edu shadow-glow ring-4 ring-background flex items-center justify-center">
                <GraduationCap className="h-2.5 w-2.5 text-white" />
              </div>
              <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-card-hover hover:border-[hsl(var(--sky))]/30 transition-all duration-300">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{edu.school}</h3>
                    <p className="text-sm font-medium" style={{ color: 'hsl(199, 89%, 48%)' }}>
                      {degreeMap[edu.degree] || edu.degree} · {edu.major}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">{edu.period}</span>
                    {edu.gpa && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'hsl(199, 89%, 48%, 0.1)', color: 'hsl(199, 89%, 48%)' }}>GPA: {edu.gpa}</span>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}