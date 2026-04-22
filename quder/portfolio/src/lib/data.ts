import {
  GraduationCap,
  Briefcase,
  Building2,
  Heart,
  Users,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Calendar,
  Award,
  Code2,
  BookOpen,
  Camera,
  Music,
  Dumbbell,
  Plane,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
}

export interface Education {
  school: string
  degree: string
  major: string
  period: string
  description: string
  gpa?: string
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string[]
  tags: string[]
}

export interface Hobby {
  name: string
  icon: LucideIcon
  description: string
}

export interface Activity {
  title: string
  role: string
  period: string
  description: string
  icon: LucideIcon
}

export interface ContactInfo {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}

export interface SocialLink {
  icon: LucideIcon
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: "关于", href: "#about" },
  { label: "教育", href: "#education" },
  { label: "实习", href: "#internship" },
  { label: "工作", href: "#work" },
  { label: "爱好", href: "#hobbies" },
  { label: "活动", href: "#activities" },
  { label: "联系", href: "#contact" },
]

export const personalInfo = {
  name: "张明",
  title: "全栈开发工程师",
  tagline: "热爱技术，追求卓越，用代码创造价值",
  avatar: "/images/avatar.png",
  about:
    "我是一名充满热情的全栈开发工程师，拥有扎实的计算机科学基础和丰富的项目实践经验。擅长使用 React、Vue、Spring Boot 等主流技术栈进行开发，对分布式系统、微服务架构有深入理解。始终保持学习的热情，关注前沿技术动态，致力于构建高质量、可维护的软件产品。",
}

export const educationData: Education[] = [
  {
    school: "北京大学",
    degree: "硕士",
    major: "计算机科学与技术",
    period: "2020.09 - 2023.06",
    description:
      "研究方向为分布式系统与云计算，参与国家级科研项目2项，发表SCI论文1篇。获得研究生国家奖学金、优秀毕业生等荣誉。",
    gpa: "3.85/4.0",
  },
  {
    school: "武汉大学",
    degree: "学士",
    major: "软件工程",
    period: "2016.09 - 2020.06",
    description:
      "主修软件工程核心课程，包括数据结构、算法设计、操作系统、计算机网络等。连续三年获得校级奖学金，毕业设计获评优秀。",
    gpa: "3.78/4.0",
  },
]

export const internshipData: Experience[] = [
  {
    company: "字节跳动",
    role: "前端开发实习生",
    period: "2022.06 - 2022.09",
    description: [
      "参与抖音电商后台管理系统开发，负责商品管理模块的前端实现",
      "使用 React + TypeScript 重构旧版 jQuery 页面，提升页面性能 40%",
      "设计并实现通用组件库中的表格组件，支持虚拟滚动和动态列配置",
      "编写单元测试，测试覆盖率达到 85% 以上",
    ],
    tags: ["React", "TypeScript", "Ant Design", "Jest"],
  },
  {
    company: "腾讯",
    role: "后端开发实习生",
    period: "2021.07 - 2021.10",
    description: [
      "参与微信支付核心系统的性能优化项目",
      "使用 Go 语言开发微服务接口，处理日均千万级请求",
      "优化 Redis 缓存策略，将接口响应时间降低 30%",
      "参与代码审查，编写技术文档和接口文档",
    ],
    tags: ["Go", "Redis", "gRPC", "Docker"],
  },
]

export const workData: Experience[] = [
  {
    company: "阿里巴巴",
    role: "高级全栈开发工程师",
    period: "2023.07 - 至今",
    description: [
      "负责淘宝商家中台核心模块的架构设计与开发",
      "主导前端微前端架构升级，将单体应用拆分为10+独立子应用",
      "设计高可用分布式任务调度系统，支撑日均亿级数据处理",
      "指导初级工程师，组织团队技术分享，推动团队技术成长",
    ],
    tags: ["React", "Spring Boot", "Kubernetes", "微前端"],
  },
]

export const hobbiesData: Hobby[] = [
  {
    name: "编程",
    icon: Code2,
    description: "热衷于探索新技术，参与开源项目贡献",
  },
  {
    name: "阅读",
    icon: BookOpen,
    description: "喜欢阅读技术书籍和科幻小说",
  },
  {
    name: "摄影",
    icon: Camera,
    description: "用镜头记录生活中的美好瞬间",
  },
  {
    name: "音乐",
    icon: Music,
    description: "吉他爱好者，偶尔创作原创音乐",
  },
  {
    name: "健身",
    icon: Dumbbell,
    description: "坚持每周运动，保持健康体魄",
  },
  {
    name: "旅行",
    icon: Plane,
    description: "探索不同城市的文化与风景",
  },
]

export const activitiesData: Activity[] = [
  {
    title: "ACM 程序设计竞赛",
    role: "队长",
    period: "2018.03 - 2019.11",
    description:
      "带领三人团队参加 ACM-ICPC 亚洲区域赛，获得银牌。负责算法策略制定和团队训练计划安排。",
    icon: Award,
  },
  {
    title: "计算机学院学生会",
    role: "技术部部长",
    period: "2017.09 - 2019.06",
    description:
      "组织校园编程马拉松、技术讲座等活动10余场，参与人数累计超过2000人。搭建学院线上活动平台。",
    icon: Users,
  },
  {
    title: "开源社区贡献",
    role: "核心贡献者",
    period: "2019.01 - 至今",
    description:
      "在 GitHub 上积极参与开源项目，累计获得 500+ Star。主要贡献于前端工具链和 UI 组件库项目。",
    icon: Github,
  },
  {
    title: "校园科技创新大赛",
    role: "项目负责人",
    period: "2019.03 - 2019.12",
    description:
      "带领团队开发智慧校园 App，集成课程管理、校园导航、失物招领等功能。获全国二等奖。",
    icon: Calendar,
  },
]

export const contactData: ContactInfo[] = [
  {
    icon: Mail,
    label: "邮箱",
    value: "zhangming@example.com",
    href: "mailto:zhangming@example.com",
  },
  { icon: Phone, label: "电话", value: "+86 138-0000-0000" },
  { icon: MapPin, label: "位置", value: "杭州市, 浙江省" },
]

export const socialLinks: SocialLink[] = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
]

// Re-export icons used in sections for convenience
export {
  GraduationCap,
  Briefcase,
  Building2,
  Heart,
  Users as UsersIcon,
  Mail as MailIcon,
}
