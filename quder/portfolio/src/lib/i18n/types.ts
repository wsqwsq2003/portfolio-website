export interface Translations {
  // Navbar
  nav: {
    about: string
    education: string
    internship: string
    work: string
    projects: string
    hobbies: string
    activities: string
    contact: string
    admin: string
  }
  // Hero
  hero: {
    greeting: string
    learnMore: string
    contactMe: string
    scrollDown: string
  }
  // About
  about: {
    title: string
    subtitle: string
    stats: {
      experience: string
      techStack: string
      openSource: string
      teamwork: string
    }
  }
  // Education
  education: {
    title: string
    subtitle: string
    degree: { master: string; bachelor: string; phd: string }
  }
  // Internship
  internship: {
    title: string
    subtitle: string
  }
  // Projects
  projects: {
    title: string
    subtitle: string
  }
  // Work
  work: {
    title: string
    subtitle: string
    present: string
  }
  // Hobbies
  hobbies: {
    title: string
    subtitle: string
  }
  // Activities
  activities: {
    title: string
    subtitle: string
  }
  // Contact
  contact: {
    title: string
    subtitle: string
    email: string
    phone: string
    location: string
    social: string
  }
  // Footer
  footer: {
    rights: string
  }
  // Admin
  admin: {
    title: string
    save: string
    saved: string
    reset: string
    back: string
    personal: string
    educationSection: string
    internshipSection: string
    workSection: string
    projectsSection: string
    hobbiesSection: string
    activitiesSection: string
    contactSection: string
    name: string
    jobTitle: string
    tagline: string
    aboutText: string
    school: string
    degree: string
    major: string
    period: string
    description: string
    gpa: string
    company: string
    role: string
    projectName: string
    projectRole: string
    projectPeriod: string
    projectDescription: string
    projectTechnologies: string
    projectImage: string
    projectLink: string
    projectDetail: string
    tags: string
    hobbyName: string
    hobbyImage: string
    hobbyDetail: string
    activityTitle: string
    activityRole: string
    emailAddr: string
    phoneNum: string
    locationText: string
    avatarUrl: string
    addItem: string
    removeItem: string
    addBullet: string
    editLanguage: string
  }
  // Auth
  auth: {
    loginTitle: string
    loginSubtitle: string
    passwordPlaceholder: string
    loginButton: string
    loginError: string
    logout: string
    changePassword: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
    passwordChanged: string
    passwordMismatch: string
    passwordWrong: string
    passwordTooShort: string
    changePasswordBanner: string
    securitySection: string
    backToSite: string
  }
}

export type Locale = "zh" | "en" | "ja" | "ko" | "fr" | "es"

export interface LocaleOption {
  code: Locale
  label: string
  flag: string
}

export const localeOptions: LocaleOption[] = [
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
]