import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Sun, Moon, Settings, Globe, X, Menu, User, GraduationCap, Building2, Briefcase, FolderGit2, Heart, Users, Mail } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { localeOptions } from "@/lib/i18n/types"
import type { Locale } from "@/lib/i18n/types"

interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
}

interface NavLink {
  label: string
  href: string
  icon: LucideIcon
  keywords?: string[]
}

export function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { locale, setLocale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)

  const navLinks: NavLink[] = [
    { label: t.nav.about, href: "#about", icon: User, keywords: [] },
    { label: t.nav.education, href: "#education", icon: GraduationCap, keywords: [] },
    { label: t.nav.internship, href: "#internship", icon: Building2, keywords: [] },
    { label: t.nav.work, href: "#work", icon: Briefcase, keywords: [] },
    { label: t.nav.projects, href: "#projects", icon: FolderGit2, keywords: [] },
    { label: t.nav.hobbies, href: "#hobbies", icon: Heart, keywords: [] },
    { label: t.nav.activities, href: "#activities", icon: Users, keywords: [] },
    { label: t.nav.contact, href: "#contact", icon: Mail, keywords: [] },
  ]

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null)
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null)
        setSearchOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const handleMouseEnter = useCallback((href: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(href)
    setSearchOpen(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 200)
  }, [])

  const handleMenuPanelEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const handleNavClick = useCallback((_href: string) => {
    setActiveMenu(null)
    setMobileOpen(false)
    setSearchOpen(false)
  }, [])

  const isOverlayActive = activeMenu !== null || searchOpen

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          "backdrop-blur-[20px] backdrop-saturate-[1.8]",
          isOverlayActive
            ? "bg-background/95"
            : "bg-background/70"
        )}
        style={{ height: "auto" }}
      >
        {/* Main bar */}
        <div className="max-w-[1024px] mx-auto h-11 flex items-center justify-between px-4 lg:px-0">
          {/* Logo */}
          <a
            href="#"
            className="flex-shrink-0 text-foreground/90 hover:text-foreground transition-opacity duration-300"
            onMouseEnter={() => { setActiveMenu(null); setSearchOpen(false) }}
          >
            <span className="text-sm font-semibold tracking-tight">{data.personal.name}</span>
          </a>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center">
            {navLinks.map((link) => {
              const NavIcon = link.icon
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-normal tracking-[.01em] transition-opacity duration-300 inline-flex items-center gap-1",
                    activeMenu === link.href
                      ? "text-foreground opacity-100"
                      : "text-foreground/80 hover:text-foreground/100 opacity-80 hover:opacity-100"
                  )}
                  onMouseEnter={() => handleMouseEnter(link.href)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleNavClick(link.href)}
                >
                  <NavIcon className="h-3 w-3" strokeWidth={1.5} />
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Right icons */}
          <div className="hidden lg:flex items-center gap-0">
            {/* Search */}
            <button
              onClick={() => { setSearchOpen(!searchOpen); setActiveMenu(null) }}
              className="p-2 text-foreground/80 hover:text-foreground transition-opacity duration-300"
              aria-label="Search"
            >
              <Search className="h-[14px] w-[14px]" strokeWidth={1.5} />
            </button>

            {/* Language */}
            <button
              onMouseEnter={() => handleMouseEnter("__lang__")}
              onMouseLeave={handleMouseLeave}
              className="p-2 text-foreground/80 hover:text-foreground transition-opacity duration-300"
              aria-label="Language"
            >
              <Globe className="h-[14px] w-[14px]" strokeWidth={1.5} />
            </button>

            {/* Theme */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-foreground/80 hover:text-foreground transition-opacity duration-300"
              aria-label="Theme"
            >
              {isDark ? (
                <Sun className="h-[14px] w-[14px]" strokeWidth={1.5} />
              ) : (
                <Moon className="h-[14px] w-[14px]" strokeWidth={1.5} />
              )}
            </button>

            {/* Admin */}
            <a
              href="#/admin"
              onClick={(e) => {
                e.preventDefault()
                window.location.hash = "/admin"
                window.location.reload()
              }}
              className="p-2 text-foreground/80 hover:text-foreground transition-opacity duration-300"
              aria-label="Admin"
            >
              <Settings className="h-[14px] w-[14px]" strokeWidth={1.5} />
            </a>
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-0">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false) }}
              className="p-2 text-foreground/80 hover:text-foreground transition-opacity"
            >
              <Search className="h-[15px] w-[15px]" strokeWidth={1.5} />
            </button>
            <button
              onClick={onToggleTheme}
              className="p-2 text-foreground/80 hover:text-foreground transition-opacity"
            >
              {isDark ? <Sun className="h-[15px] w-[15px]" strokeWidth={1.5} /> : <Moon className="h-[15px] w-[15px]" strokeWidth={1.5} />}
            </button>
            <button
              onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false) }}
              className="p-2 text-foreground/80 hover:text-foreground transition-opacity"
            >
              {mobileOpen ? <X className="h-[17px] w-[17px]" strokeWidth={1.5} /> : <Menu className="h-[17px] w-[17px]" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-foreground/10" />

        {/* Search panel */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            searchOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="max-w-[680px] mx-auto py-5 px-4">
            <div className="flex items-center gap-3 bg-foreground/5 rounded-lg px-4 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "zh" ? "搜索" : locale === "ja" ? "検索" : locale === "ko" ? "검색" : locale === "fr" ? "Rechercher" : locale === "es" ? "Buscar" : "Search"}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-3 space-y-1">
                {navLinks
                  .filter((link) => link.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((link) => {
                    const SIcon = link.icon
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors"
                      >
                        <SIcon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                        {link.label}
                      </a>
                    )
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Language mega panel */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            activeMenu === "__lang__" ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          )}
          onMouseEnter={handleMenuPanelEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[680px] mx-auto py-5 px-4">
            <div className="grid grid-cols-3 gap-1">
              {localeOptions.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => {
                    setLocale(opt.code as Locale)
                    setActiveMenu(null)
                  }}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm transition-colors duration-200",
                    locale === opt.code
                      ? "bg-foreground/10 text-foreground font-medium"
                      : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  <span className="text-base">{opt.flag}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section mega menu panel - shows quick jump for hovered section */}
        {navLinks.map((link) => {
          const PanelIcon = link.icon
          return (
            <div
              key={link.href + "_panel"}
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                activeMenu === link.href ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0"
              )}
              onMouseEnter={handleMenuPanelEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[680px] mx-auto py-4 px-4">
                <a
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="inline-flex items-center gap-3 text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  <PanelIcon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <span className="text-xl font-semibold text-foreground">{link.label}</span>
                </a>
                <p className="mt-1 ml-8 text-xs text-foreground/40">
                  {locale === "zh" ? "点击跳转至该区域" : locale === "ja" ? "クリックしてセクションへ" : locale === "ko" ? "섹션으로 이동" : locale === "fr" ? "Cliquez pour accéder" : locale === "es" ? "Haga clic para ir" : "Click to navigate"}
                </p>
              </div>
            </div>
          )
        })}

        {/* Mobile mega menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-400 ease-in-out",
            mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-6 py-4 space-y-0">
            {navLinks.map((link, i) => {
              const MobileIcon = link.icon
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-3 border-b border-foreground/5 last:border-0"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <MobileIcon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  <span className="text-xl sm:text-2xl font-semibold text-foreground/90 hover:text-foreground transition-colors">
                    {link.label}
                  </span>
                </a>
              )
            })}

            {/* Mobile language & admin */}
            <div className="pt-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {localeOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => { setLocale(opt.code as Locale); setMobileOpen(false) }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors",
                      locale === opt.code
                        ? "bg-foreground/10 text-foreground font-medium"
                        : "text-foreground/50 hover:text-foreground/80"
                    )}
                  >
                    <span>{opt.flag}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              <a
                href="#/admin"
                onClick={(e) => {
                  e.preventDefault()
                  window.location.hash = "/admin"
                  window.location.reload()
                }}
                className="flex items-center gap-2 py-2 text-xs text-foreground/50 hover:text-foreground transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                {t.nav.admin}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/40 backdrop-blur-sm transition-opacity duration-300",
          (isOverlayActive || mobileOpen) ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => { setActiveMenu(null); setSearchOpen(false); setMobileOpen(false) }}
      />
    </>
  )
}