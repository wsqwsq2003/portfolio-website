import { useState } from "react"
import { useScrollAnimation } from "@/lib/hooks"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { getIcon } from "@/lib/icons"
import { SectionWrapper, SectionHeading } from "@/components/ui/section"
import { HobbyModal } from "./HobbyModal"
import { cn } from "@/lib/utils"
import { getImageDataUrl } from "@/lib/imageStorage"

export function Hobbies() {
  const { ref, isVisible } = useScrollAnimation()
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)
  const [selectedHobby, setSelectedHobby] = useState<typeof data.hobbies[0] | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const delays = ["", "animate-delay-100", "animate-delay-200", "animate-delay-300", "animate-delay-400", "animate-delay-500"]

  return (
    <SectionWrapper id="hobbies" className="bg-gradient-surface">
      <SectionHeading title={t.hobbies.title} subtitle={t.hobbies.subtitle} />
      <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {data.hobbies.map((hobby, i) => {
          const Icon = getIcon(hobby.iconKey)
          const hasImage = hobby.image && hobby.image.trim() !== ""
          const imageError = imageErrors[i]
          // 获取图片 URL（支持 Base64 和普通 URL）
          const imageUrl = hasImage ? getImageDataUrl(hobby.image) : ""
          const hasValidImage = imageUrl && imageUrl.trim() !== ""

          return (
            <div
              key={hobby.name + i}
              onClick={() => setSelectedHobby(hobby)}
              className={cn(
                "group glass-card overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 opacity-0",
                isVisible && "animate-scale-in",
                isVisible && delays[i]
              )}
            >
              {/* 照片区域 */}
              <div className="relative w-full h-40 sm:h-48 bg-gradient-card">
                {hasValidImage && !imageError ? (
                  <img
                    src={imageUrl}
                    alt={hobby.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [i]: true }))
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-hobby/20">
                    <Icon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                {/* 悬浮遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* 文字区域 */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{hobby.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{hobby.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      <HobbyModal hobby={selectedHobby} onClose={() => setSelectedHobby(null)} />
    </SectionWrapper>
  )
}
