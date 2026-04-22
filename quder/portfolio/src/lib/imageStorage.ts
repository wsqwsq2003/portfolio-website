// 本地图片上传和管理工具
// 将图片转换为 Base64 并存储到 localStorage

const IMAGE_STORAGE_KEY = "portfolio_uploaded_images"

export interface UploadedImage {
  id: string
  name: string
  data: string // Base64 data URL
  size: number
  uploadedAt: string
}

// 获取所有已上传的图片
export function getUploadedImages(): UploadedImage[] {
  try {
    const stored = localStorage.getItem(IMAGE_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load uploaded images:', e)
  }
  return []
}

// 保存图片到 localStorage
export function saveImage(image: UploadedImage): UploadedImage {
  const images = getUploadedImages()
  images.push(image)
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images))
  return image
}

// 删除图片
export function deleteImage(id: string) {
  const images = getUploadedImages()
  const filtered = images.filter(img => img.id !== id)
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(filtered))
}

// 将 File 对象转换为 Base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// 生成唯一 ID
export function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 上传图片并返回 data URL
export async function uploadImage(file: File, name?: string): Promise<UploadedImage> {
  const base64 = await fileToBase64(file)
  const image: UploadedImage = {
    id: generateId(),
    name: name || file.name,
    data: base64,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  }
  return saveImage(image)
}

// 根据 ID 获取图片
export function getImageById(id: string): UploadedImage | null {
  const images = getUploadedImages()
  return images.find(img => img.id === id) || null
}

// 获取图片的 data URL（用于显示）
export function getImageDataUrl(idOrUrl: string): string {
  // 如果是 localStorage 上传的图片，ID 格式为 img_xxx
  if (idOrUrl.startsWith('img_')) {
    const image = getImageById(idOrUrl)
    return image?.data || ''
  }
  // 否则直接使用 URL
  return idOrUrl
}

// 清空所有上传的图片
export function clearAllImages() {
  localStorage.removeItem(IMAGE_STORAGE_KEY)
}

// 检查 localStorage 容量
export function getStorageUsage(): { used: string; total: string; percentage: number } {
  let total = 0
  let used = 0
  
  try {
    // 估算 localStorage 总容量（通常 5-10MB）
    total = 5 * 1024 * 1024 // 5MB
    
    // 计算图片存储使用量
    const images = getUploadedImages()
    used = images.reduce((sum, img) => sum + img.data.length * 2, 0) // UTF-16 每个字符 2 字节
  } catch (e) {
    console.error('Failed to calculate storage usage:', e)
  }
  
  return {
    used: formatBytes(used),
    total: formatBytes(total),
    percentage: Math.round((used / total) * 100),
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
