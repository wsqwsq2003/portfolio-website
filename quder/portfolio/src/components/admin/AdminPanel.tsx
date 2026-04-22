import { useState } from "react"
import { ArrowLeft, Save, Check, RotateCcw, ChevronDown, LogOut, Lock, Eye, EyeOff, Shield, Download } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useContent, defaultContent, type SiteContent, type EditableExperience, type EditableEducation, type EditableHobby, type EditableActivity, type EditableProject } from "@/lib/content"
import { useAuth } from "@/lib/auth"
import { localeOptions } from "@/lib/i18n/types"
import type { Locale } from "@/lib/i18n/types"
import { cn } from "@/lib/utils"
import { ImageUploader } from "@/components/ui/ImageUploader"

function Input({ label, value, onChange, multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
  const cls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={cls} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  )
}

type Section = "personal" | "education" | "internship" | "work" | "projects" | "hobbies" | "activities" | "contact" | "security"

export function AdminPanel() {
  const { locale: displayLocale, t } = useI18n()
  const { content, getContent, updateContent, resetContent } = useContent()
  const { logout, needsPasswordChange, changePassword } = useAuth()
  const [editLocale, setEditLocale] = useState<Locale>(displayLocale)
  const [activeSection, setActiveSection] = useState<Section>("personal")
  const [saved, setSaved] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  // Password change state
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwdError, setPwdError] = useState("")
  const [pwdSuccess, setPwdSuccess] = useState(false)

  const data = getContent(editLocale)

  const update = (fn: (draft: SiteContent) => void) => {
    const clone = JSON.parse(JSON.stringify(data)) as SiteContent
    fn(clone)
    updateContent(editLocale, clone)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    resetContent()
  }

  const handleResetCurrentLocale = () => {
    if (window.confirm(`确定要重置"${localeOptions.find(l => l.code === editLocale)?.label}"的所有数据吗？此操作不可撤销。`)) {
      const clone = JSON.parse(JSON.stringify(defaultContent[editLocale])) as SiteContent
      updateContent(editLocale, clone)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.hash = "#"
    window.location.reload()
  }

  const handlePwdChange = async () => {
    setPwdError("")
    setPwdSuccess(false)
    if (newPwd.length < 6) {
      setPwdError(t.auth.passwordTooShort)
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdError(t.auth.passwordMismatch)
      return
    }
    const ok = await changePassword(currentPwd, newPwd)
    if (ok) {
      setPwdSuccess(true)
      setCurrentPwd("")
      setNewPwd("")
      setConfirmPwd("")
      setTimeout(() => setPwdSuccess(false), 3000)
    } else {
      setPwdError(t.auth.passwordWrong)
    }
  }

  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      content: content,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `portfolio-content-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const sections: { key: Section; label: string }[] = [
    { key: "personal", label: t.admin.personal },
    { key: "education", label: t.admin.educationSection },
    { key: "internship", label: t.admin.internshipSection },
    { key: "work", label: t.admin.workSection },
    { key: "projects", label: t.admin.projectsSection || "项目经历" },
    { key: "hobbies", label: t.admin.hobbiesSection },
    { key: "activities", label: t.admin.activitiesSection },
    { key: "contact", label: t.admin.contactSection },
    { key: "security", label: t.auth.securitySection },
  ]

  const currentEditFlag = localeOptions.find((l) => l.code === editLocale)?.flag || ""
  const currentEditLabel = localeOptions.find((l) => l.code === editLocale)?.label || ""

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.location.reload() }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.admin.back}
            </a>
            <span className="text-border">|</span>
            <h1 className="text-sm font-semibold text-foreground">{t.admin.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Export button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground rounded-md border border-border hover:bg-secondary transition-colors"
              title="导出所有内容为 JSON 文件"
            >
              <Download className="h-3 w-3" />
              导出 JSON
            </button>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground rounded-md border border-border hover:bg-secondary transition-colors"
            >
              <LogOut className="h-3 w-3" />
              {t.auth.logout}
            </button>
            {/* Language selector for editing */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-card hover:bg-secondary transition-colors"
              >
                <span>{currentEditFlag}</span>
                <span>{currentEditLabel}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", langDropdownOpen && "rotate-180")} />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-elegant overflow-hidden z-50">
                  {localeOptions.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => { setEditLocale(opt.code); setLangDropdownOpen(false) }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors",
                        editLocale === opt.code ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"
                      )}
                    >
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleResetCurrentLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 rounded-md border border-amber-600/30 hover:bg-amber-600/10 transition-colors"
              title="重置当前语言的数据为默认值"
            >
              <RotateCcw className="h-3 w-3" />
              重置当前语言
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground rounded-md border border-border hover:bg-secondary transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              {t.admin.reset}
            </button>
            <button
              onClick={handleSave}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                saved
                  ? "bg-green-500/10 text-green-600 border border-green-500/30"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {saved ? <Check className="h-3 w-3" /> : <Save className="h-3 w-3" />}
              {saved ? t.admin.saved : t.admin.save}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex gap-6 px-4 sm:px-6 py-6">
        {/* Sidebar */}
        <nav className="w-48 flex-shrink-0 hidden sm:block">
          <div className="sticky top-20 space-y-1">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                  activeSection === s.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile section tabs */}
        <div className="sm:hidden w-full">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value as Section)}
            className="w-full mb-4 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {sections.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {/* Password change banner */}
          {needsPasswordChange && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span>{t.auth.changePasswordBanner}</span>
              </div>
              <button
                onClick={() => setActiveSection("security")}
                className="text-xs font-medium underline hover:no-underline whitespace-nowrap"
              >
                {t.auth.changePassword}
              </button>
            </div>
          )}

          {activeSection === "personal" && (
            <EditorCard title={t.admin.personal}>
              <ImageUploader
                label={t.admin.avatarUrl}
                value={data.personal.avatarUrl}
                onChange={(v) => update((d) => { d.personal.avatarUrl = v })}
                maxSize={2}
              />
              <Input label={t.admin.name} value={data.personal.name} onChange={(v) => update((d) => { d.personal.name = v })} />
              <Input label={t.admin.jobTitle} value={data.personal.title} onChange={(v) => update((d) => { d.personal.title = v })} />
              <Input label={t.admin.tagline} value={data.personal.tagline} onChange={(v) => update((d) => { d.personal.tagline = v })} />
              <Input label={t.admin.aboutText} value={data.personal.about} onChange={(v) => update((d) => { d.personal.about = v })} multiline />
              
              {/* Stats Editor */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-3">统计数据</h3>
                <div className="space-y-3">
                  {data.personal.stats.map((stat, i) => (
                    <div key={i} className="bg-secondary/50 rounded-lg p-3 border border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                        <button
                          onClick={() => update((d) => { d.personal.stats.splice(i, 1) })}
                          className="text-xs text-red-500 hover:text-red-400 transition-colors"
                        >
                          {t.admin.removeItem}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="数值"
                          value={stat.value}
                          onChange={(v) => update((d) => { d.personal.stats[i].value = v })}
                          placeholder="3+"
                        />
                        <Input
                          label="标签"
                          value={stat.label}
                          onChange={(v) => update((d) => { d.personal.stats[i].label = v })}
                          placeholder="工作经验"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => update((d) => { d.personal.stats.push({ value: "", label: "" }) })}
                    className="w-full py-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors border border-dashed border-primary/30 rounded-lg"
                  >
                    + 添加统计数据
                  </button>
                </div>
              </div>
            </EditorCard>
          )}

          {activeSection === "education" && (
            <ListEditor
              title={t.admin.educationSection}
              items={data.education}
              onAdd={() => update((d) => { d.education.push({ school: "", degree: "bachelor", major: "", period: "", description: "", gpa: "" }) })}
              onRemove={(i) => update((d) => { d.education.splice(i, 1) })}
              addLabel={t.admin.addItem}
              removeLabel={t.admin.removeItem}
              renderItem={(item: EditableEducation, i: number) => (
                <>
                  <Input label={t.admin.school} value={item.school} onChange={(v) => update((d) => { d.education[i].school = v })} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label={t.admin.degree} value={item.degree} onChange={(v) => update((d) => { d.education[i].degree = v })} />
                    <Input label={t.admin.major} value={item.major} onChange={(v) => update((d) => { d.education[i].major = v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label={t.admin.period} value={item.period} onChange={(v) => update((d) => { d.education[i].period = v })} />
                    <Input label={t.admin.gpa} value={item.gpa} onChange={(v) => update((d) => { d.education[i].gpa = v })} />
                  </div>
                  <Input label={t.admin.description} value={item.description} onChange={(v) => update((d) => { d.education[i].description = v })} multiline />
                </>
              )}
            />
          )}

          {activeSection === "internship" && (
            <ExperienceEditor
              title={t.admin.internshipSection}
              items={data.internships}
              onAdd={() => update((d) => { d.internships.push({ company: "", role: "", period: "", description: [""], tags: [] }) })}
              onRemove={(i) => update((d) => { d.internships.splice(i, 1) })}
              onChange={(i, item) => update((d) => { d.internships[i] = item })}
              t={t}
            />
          )}

          {activeSection === "work" && (
            <ExperienceEditor
              title={t.admin.workSection}
              items={data.work}
              onAdd={() => update((d) => { d.work.push({ company: "", role: "", period: "", description: [""], tags: [] }) })}
              onRemove={(i) => update((d) => { d.work.splice(i, 1) })}
              onChange={(i, item) => update((d) => { d.work[i] = item })}
              t={t}
            />
          )}

          {activeSection === "projects" && (
            <ListEditor
              title={t.admin.projectsSection || "项目经历"}
              items={data.projects}
              onAdd={() => update((d) => { d.projects.push({ name: "", role: "", period: "", description: "", technologies: [], image: "", link: "", detail: "" }) })}
              onRemove={(i) => update((d) => { d.projects.splice(i, 1) })}
              addLabel={t.admin.addItem}
              removeLabel={t.admin.removeItem}
              renderItem={(item: EditableProject, i: number) => (
                <>
                  <Input label={t.admin.projectName || "项目名称"} value={item.name} onChange={(v) => update((d) => { d.projects[i].name = v })} />
                  <ImageUploader
                    label={t.admin.projectImage || "项目截图"}
                    value={item.image}
                    onChange={(v) => update((d) => { d.projects[i].image = v })}
                    maxSize={2}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label={t.admin.projectRole || "担任角色"} value={item.role} onChange={(v) => update((d) => { d.projects[i].role = v })} />
                    <Input label={t.admin.projectPeriod || "项目时间"} value={item.period} onChange={(v) => update((d) => { d.projects[i].period = v })} />
                  </div>
                  <Input label={t.admin.projectDescription || "项目描述"} value={item.description} onChange={(v) => update((d) => { d.projects[i].description = v })} multiline />
                  <Input label={t.admin.projectTechnologies || "技术栈（逗号分隔）"} value={item.technologies.join(", ")} onChange={(v) => update((d) => { d.projects[i].technologies = v.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  <Input label={t.admin.projectLink || "项目链接"} value={item.link} onChange={(v) => update((d) => { d.projects[i].link = v })} placeholder="https://github.com/..." />
                  <Input label={t.admin.projectDetail || "项目详情"} value={item.detail} onChange={(v) => update((d) => { d.projects[i].detail = v })} multiline />
                </>
              )}
            />
          )}

          {activeSection === "hobbies" && (
            <ListEditor
              title={t.admin.hobbiesSection}
              items={data.hobbies}
              onAdd={() => update((d) => { d.hobbies.push({ name: "", description: "", iconKey: "Star", image: "", detail: "" }) })}
              onRemove={(i) => update((d) => { d.hobbies.splice(i, 1) })}
              addLabel={t.admin.addItem}
              removeLabel={t.admin.removeItem}
              renderItem={(item: EditableHobby, i: number) => (
                <>
                  <Input label={t.admin.hobbyName} value={item.name} onChange={(v) => update((d) => { d.hobbies[i].name = v })} />
                  <ImageUploader
                    label={t.admin.hobbyImage}
                    value={item.image}
                    onChange={(v) => update((d) => { d.hobbies[i].image = v })}
                    maxSize={2}
                  />
                  <Input label={t.admin.description} value={item.description} onChange={(v) => update((d) => { d.hobbies[i].description = v })} />
                  <Input label={t.admin.hobbyDetail} value={item.detail} onChange={(v) => update((d) => { d.hobbies[i].detail = v })} multiline />
                </>
              )}
            />
          )}

          {activeSection === "activities" && (
            <ListEditor
              title={t.admin.activitiesSection}
              items={data.activities}
              onAdd={() => update((d) => { d.activities.push({ title: "", role: "", period: "", description: "", iconKey: "Star" }) })}
              onRemove={(i) => update((d) => { d.activities.splice(i, 1) })}
              addLabel={t.admin.addItem}
              removeLabel={t.admin.removeItem}
              renderItem={(item: EditableActivity, i: number) => (
                <>
                  <Input label={t.admin.activityTitle} value={item.title} onChange={(v) => update((d) => { d.activities[i].title = v })} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label={t.admin.activityRole} value={item.role} onChange={(v) => update((d) => { d.activities[i].role = v })} />
                    <Input label={t.admin.period} value={item.period} onChange={(v) => update((d) => { d.activities[i].period = v })} />
                  </div>
                  <Input label={t.admin.description} value={item.description} onChange={(v) => update((d) => { d.activities[i].description = v })} multiline />
                </>
              )}
            />
          )}

          {activeSection === "contact" && (
            <EditorCard title={t.admin.contactSection}>
              <Input label={t.admin.emailAddr} value={data.contact.email} onChange={(v) => update((d) => { d.contact.email = v })} />
              <Input label={t.admin.phoneNum} value={data.contact.phone} onChange={(v) => update((d) => { d.contact.phone = v })} />
              <Input label={t.admin.locationText} value={data.contact.location} onChange={(v) => update((d) => { d.contact.location = v })} />
            </EditorCard>
          )}

          {activeSection === "security" && (
            <EditorCard title={t.auth.securitySection}>
              {/* Current password */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t.auth.currentPassword}</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPwd}
                    onChange={(e) => { setCurrentPwd(e.target.value); setPwdError("") }}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* New password */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t.auth.newPassword}</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPwd}
                    onChange={(e) => { setNewPwd(e.target.value); setPwdError("") }}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* Confirm password */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">{t.auth.confirmPassword}</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPwd}
                    onChange={(e) => { setConfirmPwd(e.target.value); setPwdError("") }}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* Error/Success */}
              {pwdError && <p className="text-sm text-rose-500">{pwdError}</p>}
              {pwdSuccess && <p className="text-sm text-green-600">{t.auth.passwordChanged}</p>}
              {/* Submit */}
              <button
                onClick={handlePwdChange}
                disabled={!currentPwd || !newPwd || !confirmPwd}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  (!currentPwd || !newPwd || !confirmPwd) && "opacity-60 cursor-not-allowed",
                )}
              >
                <Lock className="h-3 w-3" />
                {t.auth.changePassword}
              </button>
            </EditorCard>
          )}
        </div>
      </div>
    </div>
  )
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gradient-card rounded-xl border border-border/50 p-6 shadow-card">
      <h2 className="text-lg font-semibold text-foreground mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

interface ListEditorProps<T> {
  title: string
  items: T[]
  onAdd: () => void
  onRemove: (i: number) => void
  renderItem: (item: T, i: number) => React.ReactNode
  addLabel: string
  removeLabel: string
}

function ListEditor<T>({ title, items, onAdd, onRemove, renderItem, addLabel, removeLabel }: ListEditorProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <button onClick={onAdd} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">+ {addLabel}</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="bg-gradient-card rounded-xl border border-border/50 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
            <button onClick={() => onRemove(i)} className="text-xs text-red-500 hover:text-red-400 transition-colors">{removeLabel}</button>
          </div>
          <div className="space-y-3">{renderItem(item, i)}</div>
        </div>
      ))}
    </div>
  )
}

interface ExperienceEditorProps {
  title: string
  items: EditableExperience[]
  onAdd: () => void
  onRemove: (i: number) => void
  onChange: (i: number, item: EditableExperience) => void
  t: ReturnType<typeof useI18n>["t"]
}

function ExperienceEditor({ title, items, onAdd, onRemove, onChange, t: tr }: ExperienceEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <button onClick={onAdd} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">+ {tr.admin.addItem}</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="bg-gradient-card rounded-xl border border-border/50 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
            <button onClick={() => onRemove(i)} className="text-xs text-red-500 hover:text-red-400 transition-colors">{tr.admin.removeItem}</button>
          </div>
          <div className="space-y-3">
            <Input label={tr.admin.company} value={item.company} onChange={(v) => onChange(i, { ...item, company: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label={tr.admin.role} value={item.role} onChange={(v) => onChange(i, { ...item, role: v })} />
              <Input label={tr.admin.period} value={item.period} onChange={(v) => onChange(i, { ...item, period: v })} />
            </div>
            <Input label={tr.admin.tags} value={item.tags.join(", ")} onChange={(v) => onChange(i, { ...item, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground">{tr.admin.description}</label>
                <button
                  onClick={() => onChange(i, { ...item, description: [...item.description, ""] })}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  + {tr.admin.addBullet}
                </button>
              </div>
              <div className="space-y-2">
                {item.description.map((bullet, bi) => (
                  <div key={bi} className="flex gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => {
                        const newDesc = [...item.description]
                        newDesc[bi] = e.target.value
                        onChange(i, { ...item, description: newDesc })
                      }}
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                    />
                    <button
                      onClick={() => {
                        const newDesc = item.description.filter((_, idx) => idx !== bi)
                        onChange(i, { ...item, description: newDesc })
                      }}
                      className="px-2 text-xs text-red-500 hover:text-red-400"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}