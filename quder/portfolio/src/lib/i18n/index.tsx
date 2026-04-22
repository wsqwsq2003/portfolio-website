import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Translations, Locale } from "./types"
import { zh } from "./zh"
import { en } from "./en"
import { ja } from "./ja"
import { ko } from "./ko"
import { fr } from "./fr"
import { es } from "./es"

const translationsMap: Record<Locale, Translations> = { zh, en, ja, ko, fr, es }

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | null>(null)

function getInitialLocale(): Locale {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("locale") as Locale | null
    if (stored && translationsMap[stored]) return stored
    const browserLang = navigator.language.split("-")[0] as Locale
    if (translationsMap[browserLang]) return browserLang
  }
  return "zh"
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
    document.documentElement.lang = newLocale === "zh" ? "zh-CN" : newLocale
  }, [])

  const t = translationsMap[locale]

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

export { translationsMap }