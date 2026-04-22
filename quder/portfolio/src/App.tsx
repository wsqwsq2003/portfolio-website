import { useState, useEffect } from "react"
import { useTheme } from "@/lib/hooks"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { useAuth } from "@/lib/auth"
import { I18nProvider } from "@/lib/i18n"
import { ContentProvider } from "@/lib/content"
import { AuthProvider } from "@/lib/auth"
import { Navbar } from "@/components/sections/Navbar"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Education } from "@/components/sections/Education"
import { ExperienceSection } from "@/components/sections/Experience"
import { Projects } from "@/components/sections/Projects"
import { Hobbies } from "@/components/sections/Hobbies"
import { Activities } from "@/components/sections/Activities"
import { Contact, Footer } from "@/components/sections/Contact"
import { AdminPanel } from "@/components/admin/AdminPanel"
import { LoginPage } from "@/components/admin/LoginPage"
import { StarIntro } from "@/components/ui/StarIntro"

function Portfolio() {
  const { isDark, toggle } = useTheme()
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar isDark={isDark} onToggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Education />
        <ExperienceSection
          id="internship"
          title={t.internship.title}
          subtitle={t.internship.subtitle}
          data={data.internships}
          colorScheme="intern"
        />
        <ExperienceSection
          id="work"
          title={t.work.title}
          subtitle={t.work.subtitle}
          data={data.work}
          altBg
          colorScheme="work"
        />
        <Projects />
        <Hobbies />
        <Activities />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function AppRouter() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [introFinished, setIntroFinished] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const checkHash = () => {
      setIsAdmin(window.location.hash === "#/admin")
    }
    checkHash()
    window.addEventListener("hashchange", checkHash)
    return () => window.removeEventListener("hashchange", checkHash)
  }, [])

  if (isAdmin) {
    return isAuthenticated ? <AdminPanel /> : <LoginPage />
  }

  if (!introFinished) {
    return <StarIntro onComplete={() => setIntroFinished(true)} duration={4000} />
  }

  return <Portfolio />
}

function App() {
  return (
    <I18nProvider>
      <ContentProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ContentProvider>
    </I18nProvider>
  )
}

export default App