import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react"
import { uploadImage, getStorageUsage } from "@/lib/imageStorage"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  value: string
  onChange: (imageUrl: string) => void
  label?: string
  maxSize?: number // MB
}

export function ImageUploader({ value, onChange, label = "图片", maxSize = 2 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [showGallery, setShowGallery] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const storageUsage = getStorageUsage()

  const handleFileSelect = async (file: File) => {
    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`图片大小不能超过 ${maxSize}MB`)
      return
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件')
      return
    }
    
    setUploading(true)
    setError("")
    
    try {
      const uploaded = await uploadImage(file)
      onChange(uploaded.id)
    } catch (e) {
      setError('图片上传失败')
      console.error('Upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    onChange("")
    setError("")
  }

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      
      {/* 当前图片预览 */}
      {value && (
        <div className="mb-3 relative rounded-lg overflow-hidden border border-border/30">
          <img
            src={value.startsWith('img_') ? value : value}
            alt="当前图片"
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23ddd' width='400' height='200'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E图片加载失败%3C/text%3E%3C/svg%3E"
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* 上传区域 */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border border-dashed border-primary/30 transition-colors",
            uploading 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-primary/5 hover:border-primary/50"
          )}
        >
          <Upload className="h-4 w-4" />
          {uploading ? "上传中..." : "选择图片"}
        </button>
        <button
          type="button"
          onClick={() => setShowGallery(!showGallery)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors"
        >
          <ImageIcon className="h-4 w-4" />
          图库
        </button>
      </div>
      
      {/* 存储使用信息 */}
      <div className="mt-2 text-xs text-muted-foreground">
        存储: {storageUsage.used} / {storageUsage.total} ({storageUsage.percentage}%)
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-rose-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      
      {/* 图库选择器 */}
      {showGallery && (
        <ImageGallery
          onSelect={(id) => {
            onChange(id)
            setShowGallery(false)
          }}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  )
}

// 图库组件
function ImageGallery({ onClose }: { onSelect: (id: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-xl border border-border p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">选择图片</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-muted-foreground">
          图库功能开发中...
        </div>
      </div>
    </div>
  )
}
