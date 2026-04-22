import { getIcon } from "@/lib/icons"
import type { EditableHobby } from "@/lib/content"
import { Modal } from "@/components/ui/Modal"
import { getImageDataUrl } from "@/lib/imageStorage"

interface HobbyModalProps {
  hobby: EditableHobby | null
  onClose: () => void
}

export function HobbyModal({ hobby, onClose }: HobbyModalProps) {
  if (!hobby) return null

  const Icon = getIcon(hobby.iconKey)
  const hasImage = hobby.image && hobby.image.trim() !== ""
  const hasDetail = hobby.detail && hobby.detail.trim() !== ""
  // 获取图片 URL（支持 Base64 和普通 URL）
  const imageUrl = hasImage ? getImageDataUrl(hobby.image) : ""
  const hasValidImage = imageUrl && imageUrl.trim() !== ""

  return (
    <Modal isOpen={!!hobby} onClose={onClose} title={hobby.name}>
      <div className="space-y-5">
        {/* Image */}
        {hasValidImage ? (
          <div className="rounded-xl overflow-hidden">
            <img
              src={imageUrl}
              alt={hobby.name}
              className="w-full h-48 sm:h-64 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 bg-white/5 rounded-xl">
            <Icon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Name + Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{hobby.name}</h3>
        </div>

        {/* Short description */}
        <p className="text-muted-foreground">{hobby.description}</p>

        {/* Detailed description */}
        {hasDetail && (
          <>
            <hr className="border-white/10" />
            <div>
              <h4 className="text-sm font-medium text-foreground/80 mb-2">详细描述</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{hobby.detail}</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
