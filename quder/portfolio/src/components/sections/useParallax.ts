import { useRef, useEffect } from "react"

interface ParallaxOptions {
  intensity: number
  enabled?: boolean
}

export function useParallax(
  containerRef: React.RefObject<HTMLElement>,
  options: ParallaxOptions
): React.RefObject<HTMLDivElement> {
  const { intensity, enabled = true } = options
  const elementRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)
  const isTouchDevice = useRef(false)

  useEffect(() => {
    // 检测是否为触摸设备
    isTouchDevice.current = !window.matchMedia("(pointer: fine)").matches

    if (!enabled || isTouchDevice.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mousePos.current = {
        x: (e.clientX - centerX) / (rect.width / 2),
        y: (e.clientY - centerY) / (rect.height / 2),
      }
    }

    const loop = () => {
      if (!elementRef.current) return
      const { x, y } = mousePos.current
      const offsetX = x * intensity
      const offsetY = y * intensity
      elementRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
      rafId.current = requestAnimationFrame(loop)
    }

    window.addEventListener("mousemove", handleMouseMove)
    rafId.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [containerRef, intensity, enabled])

  return elementRef
}
