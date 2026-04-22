import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from "lucide-react"
import { useScrollAnimation } from "@/lib/hooks"
import { useI18n } from "@/lib/i18n"
import { useContent } from "@/lib/content"
import { SectionWrapper, SectionHeading } from "@/components/ui/section"
import { cn } from "@/lib/utils"

export function Contact() {
  const { ref, isVisible } = useScrollAnimation()
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)

  const contactItems = [
    { icon: Mail, label: t.contact.email, value: data.contact.email, href: `mailto:${data.contact.email}` },
    { icon: Phone, label: t.contact.phone, value: data.contact.phone },
    { icon: MapPin, label: t.contact.location, value: data.contact.location },
  ]

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  ]

  return (
    <SectionWrapper id="contact" className="bg-gradient-surface">
      <SectionHeading title={t.contact.title} subtitle={t.contact.subtitle} />
      <div ref={ref} className={cn("max-w-2xl mx-auto opacity-0", isVisible && "animate-fade-up")}>
        <div className="bg-gradient-card rounded-2xl p-8 sm:p-10 shadow-card border border-border/50">
          <div className="space-y-4 mb-8">
            {contactItems.map((item) => {
              const Icon = item.icon
              const content = (
                <div className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-contact flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              )
              return item.href ? (
                <a key={item.label} href={item.href} className="block hover:bg-secondary/50 rounded-lg p-2 -m-2 transition-colors">{content}</a>
              ) : (
                <div key={item.label} className="p-2 -m-2">{content}</div>
              )
            })}
          </div>
          <div className="border-t border-border my-6" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{t.contact.social}</span>
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-secondary rounded-lg hover:text-foreground hover:bg-secondary/80 transition-colors">
                  <Icon className="h-4 w-4" />
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}

export function Footer() {
  const { locale, t } = useI18n()
  const { getContent } = useContent()
  const data = getContent(locale)

  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {data.personal.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}