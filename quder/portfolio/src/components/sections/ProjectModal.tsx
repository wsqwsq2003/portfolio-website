import { ExternalLink } from "lucide-react"
import type { EditableProject } from "@/lib/content"
import { Modal } from "@/components/ui/Modal"
import { getImageDataUrl } from "@/lib/imageStorage"

interface ProjectModalProps {
  project: EditableProject | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null

  const hasImage = project.image && project.image.trim() !== ""
  const imageUrl = hasImage ? getImageDataUrl(project.image) : ""
  const hasValidImage = imageUrl && imageUrl.trim() !== ""
  const hasDetail = project.detail && project.detail.trim() !== ""
  const hasLink = project.link && project.link.trim() !== ""

  return (
    <Modal isOpen={!!project} onClose={onClose} title={project.name}>
      <div className="space-y-5">
        {/* 项目截图 */}
        {hasValidImage ? (
          <div className="rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt={project.name}
              className="w-full h-48 sm:h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 bg-gradient-to-br from-primary/10 to-rose-500/10 rounded-xl">
            <span className="text-4xl">🚀</span>
          </div>
        )}

        {/* 项目名称和角色 */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.role}</p>
          </div>
          {hasLink && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              查看项目
            </a>
          )}
        </div>

        {/* 项目时间 */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">时间：</span>
          {project.period}
        </div>

        {/* 项目描述 */}
        <div>
          <h4 className="text-sm font-medium text-foreground/80 mb-2">项目描述</h4>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>

        {/* 技术栈 */}
        <div>
          <h4 className="text-sm font-medium text-foreground/80 mb-2">技术栈</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 项目详情 */}
        {hasDetail && (
          <>
            <hr className="border-border/50" />
            <div>
              <h4 className="text-sm font-medium text-foreground/80 mb-2">详细信息</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{project.detail}</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
