import { Building2, Briefcase } from "lucide-react"
import { useScrollAnimation } from "@/lib/hooks"
import type { EditableExperience } from "@/lib/content"
import { SectionWrapper, SectionHeading } from "@/components/ui/section"
import { cn } from "@/lib/utils"

interface ExperienceCardProps {
  data: EditableExperience
  index: number
  isVisible: boolean
  colorScheme: 'intern' | 'work'
}

const colorSchemes = {
  intern: {
    gradient: 'bg-gradient-intern',
    accent: 'hsl(172, 66%, 45%)',
    accentLight: 'hsl(172, 66%, 45%, 0.1)',
    tagBg: 'hsl(172, 66%, 45%, 0.1)',
    tagText: 'hsl(172, 66%, 45%)',
    bulletBg: 'hsl(172, 66%, 45%)',
    lineGradient: 'linear-gradient(to bottom, hsl(172, 66%, 45%), hsl(199, 89%, 48%))',
    icon: Building2,
  },
  work: {
    gradient: 'bg-gradient-work',
    accent: 'hsl(263, 70%, 58%)',
    accentLight: 'hsl(263, 70%, 58%, 0.1)',
    tagBg: 'hsl(263, 70%, 58%, 0.1)',
    tagText: 'hsl(263, 70%, 58%)',
    bulletBg: 'hsl(340, 82%, 55%)',
    lineGradient: 'linear-gradient(to bottom, hsl(263, 70%, 58%), hsl(340, 82%, 55%))',
    icon: Briefcase,
  },
}

function ExperienceCard({ data, index, isVisible, colorScheme }: ExperienceCardProps) {
  const scheme = colorSchemes[colorScheme]
  const Icon = scheme.icon
  return (
    <div
      className={cn(
        "relative pl-16 sm:pl-20 pb-12 last:pb-0 opacity-0",
        isVisible && "animate-slide-in-left",
        index === 0 && "animate-delay-100",
        index === 1 && "animate-delay-300"
      )}
    >
      <div className={cn("absolute left-3.5 sm:left-5.5 top-1 w-5 h-5 rounded-full shadow-glow ring-4 ring-background flex items-center justify-center", scheme.gradient)}>
        <Icon className="h-2.5 w-2.5 text-white" />
      </div>
      <div className="bg-gradient-card rounded-xl p-6 shadow-card border border-border/50 hover:shadow-card-hover transition-all duration-300 group">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{data.company}</h3>
            <p className="text-sm font-medium" style={{ color: scheme.accent }}>{data.role}</p>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">{data.period}</span>
        </div>
        <ul className="space-y-2 mb-4">
          {data.description.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-muted-foreground flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: scheme.bulletBg }} />
              {item}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md" style={{ background: scheme.tagBg, color: scheme.tagText }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ExperienceSectionProps {
  id: string
  title: string
  subtitle: string
  data: EditableExperience[]
  altBg?: boolean
  colorScheme?: 'intern' | 'work'
}

export function ExperienceSection({ id, title, subtitle, data, altBg, colorScheme = 'intern' }: ExperienceSectionProps) {
  const { ref, isVisible } = useScrollAnimation()
  const scheme = colorSchemes[colorScheme]

  return (
    <SectionWrapper id={id} className={altBg ? "bg-gradient-surface" : ""}>
      <SectionHeading title={title} subtitle={subtitle} />
      <div ref={ref} className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px" style={{ background: scheme.lineGradient }} />
          {data.map((item, i) => (
            <ExperienceCard key={item.company + item.period} data={item} index={i} isVisible={isVisible} colorScheme={colorScheme} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}