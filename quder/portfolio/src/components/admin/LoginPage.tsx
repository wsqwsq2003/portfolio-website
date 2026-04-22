import { useState, useCallback } from "react"
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { useI18n } from "@/lib/i18n"

export function LoginPage() {
  const { login } = useAuth()
  const { t } = useI18n()

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError("")

    const success = await login(password)
    if (!success) {
      setError(t.auth.loginError)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    setLoading(false)
  }, [password, login, t.auth.loginError])

  const handleBack = () => {
    window.location.hash = "#"
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-hero opacity-10 blur-[120px]" />

      {/* Login card */}
      <div className={cn(
        "relative z-10 w-full max-w-sm mx-4",
        "bg-gradient-card rounded-xl border border-border/50 shadow-elegant backdrop-blur-xl p-8",
        shake && "animate-[shake_0.4s_ease-in-out]"
      )}>
        {/* Lock icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Lock className="h-6 w-6 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-center text-foreground mb-1">{t.auth.loginTitle}</h1>
        <p className="text-sm text-center text-muted-foreground mb-8">{t.auth.loginSubtitle}</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Password input */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("") }}
              placeholder={t.auth.passwordPlaceholder}
              className={cn(
                "w-full rounded-lg border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors",
                error && "border-rose-400/60 focus:ring-rose-400/30"
              )}
              autoComplete="current-password"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-rose-500 mb-4 text-center">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !password.trim()}
            className={cn(
              "w-full rounded-lg py-3 text-sm font-medium transition-all duration-200",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              (loading || !password.trim()) && "opacity-60 cursor-not-allowed",
            )}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              t.auth.loginButton
            )}
          </button>
        </form>

        {/* Back to site */}
        <button
          onClick={handleBack}
          className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.auth.backToSite}
        </button>
      </div>

      {/* Shake animation keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
