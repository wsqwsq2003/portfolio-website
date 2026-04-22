import { useState, useCallback, useEffect, createContext, useContext } from "react"

// Constants
const DEFAULT_PASSWORD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9" // SHA-256 of "admin123"
const STORAGE_KEY_HASH = "admin_password_hash"
const STORAGE_KEY_SESSION = "admin_session"
const STORAGE_KEY_INIT = "admin_initialized"
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

// Auth Context Type
interface AuthContextType {
  isAuthenticated: boolean
  needsPasswordChange: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Utility: SHA-256 hash
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

// Utility: Generate random session token
function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("")
}

// Utility: Validate session
function isValidSession(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION)
    if (!raw) return false
    const session = JSON.parse(raw)
    return session.expiresAt > Date.now()
  } catch {
    return false
  }
}

// Utility: Create session
function createSession(): void {
  const session = {
    token: generateToken(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session))
}

// Utility: Clear session
function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY_SESSION)
}

// Utility: Get stored password hash
function getStoredHash(): string | null {
  return localStorage.getItem(STORAGE_KEY_HASH)
}

// Utility: Set password hash
function setPasswordHash(hash: string): void {
  localStorage.setItem(STORAGE_KEY_HASH, hash)
}

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isValidSession())
  const [needsPasswordChange, setNeedsPasswordChange] = useState(() => {
    // Initialize default password on first visit
    const initialized = localStorage.getItem(STORAGE_KEY_INIT) === "true"
    if (!initialized) {
      setPasswordHash(DEFAULT_PASSWORD_HASH)
      localStorage.setItem(STORAGE_KEY_INIT, "true")
    }
    // Check if current stored hash matches default
    const stored = getStoredHash()
    return stored === DEFAULT_PASSWORD_HASH
  })

  // Re-validate session on tab visibility change
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        if (!isValidSession() && isAuthenticated) {
          setIsAuthenticated(false)
        }
      }
    }
    document.addEventListener("visibilitychange", handler)
    return () => document.removeEventListener("visibilitychange", handler)
  }, [isAuthenticated])

  // Cross-tab sync: listen for session changes
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_SESSION) {
        if (!isValidSession() && isAuthenticated) {
          setIsAuthenticated(false)
        }
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [isAuthenticated])

  const login = useCallback(async (password: string): Promise<boolean> => {
    const hash = await hashPassword(password)
    const stored = getStoredHash()
    if (hash === stored) {
      createSession()
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setIsAuthenticated(false)
  }, [])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const currentHash = await hashPassword(currentPassword)
    const stored = getStoredHash()
    if (currentHash !== stored) {
      return false // Wrong current password
    }
    const newHash = await hashPassword(newPassword)
    setPasswordHash(newHash)
    setNeedsPasswordChange(false)
    return true
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, needsPasswordChange, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}
