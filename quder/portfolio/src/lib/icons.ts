import {
  Code2, BookOpen, Camera, Music, Dumbbell, Plane,
  Award, Users, Github, Calendar, Star, Heart,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Code2, BookOpen, Camera, Music, Dumbbell, Plane,
  Award, Users, Github, Calendar, Star, Heart,
}

export function getIcon(key: string): LucideIcon {
  return iconMap[key] || Star
}