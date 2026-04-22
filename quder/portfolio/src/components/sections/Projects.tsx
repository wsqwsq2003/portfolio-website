import { useState } from "react"
import { useScrollAnimation } from "@/lib/hooks"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { SectionWrapper, SectionHeading } from "@/components/ui/section"
import { ProjectModal } from "./ProjectModal"
import { cn } from "@/lib/utils"
import { getImageDataUrl } from "@/lib/imageStorage"

export function Projects() {
  const { ref, isVisible } = useScrollAnimation()
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)
  const [selectedProject, setSelectedProject] = useState<typeof data.projects[0] | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const delays = ["", "animate-delay-100", "animate-delay-200", "animate-delay-300", "animate-delay-400", "animate-delay-500"]

  return (
    <SectionWrapper id="projects" className="bg-gradient-surface">
      <SectionHeading title={t.projects.title} subtitle={t.projects.subtitle} />
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map((project, i) => {
          const hasImage = project.image && project.image.trim() !== ""
          const imageError = imageErrors[i]
          const imageUrl = hasImage ? getImageDataUrl(project.image) : ""
          const hasValidImage = imageUrl && imageUrl.trim() !== ""

          return (
            <div
              key={project.name + i}
              onClick={() => setSelectedProject(project)}
              className={cn(
                "group glass-card overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 opacity-0",
                isVisible && "animate-scale-in",
                isVisible && delays[i]
              )}
            >
              {/* 项目截图区域 */}
              <div className="relative w-full h-48 bg-gradient-card">
                {hasValidImage && !imageError ? (
                  <img
                    src={imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [i]: true }))
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-rose-500/20">
                    <svg className="h-16 w-16 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                {/* 悬浮遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* 项目信息 */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-foreground mb-2">{project.name}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                
                {/* 技术栈标签 */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-muted-foreground">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </SectionWrapper>
  )
}
