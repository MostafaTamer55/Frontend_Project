import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  signup as signupRequest,
  type AuthUser,
  type LoginInput,
  type SignupInput,
} from "../api/auth"

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<AuthUser>
  signup: (input: SignupInput) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshUser: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch {
      // A failed session check must not trap the app on its loading screen.
      // Feature screens still surface errors for user-initiated API requests.
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
    // The API layer emits this event after a 401 so protected UI disappears
    // immediately. The backend remains the source of truth for the session.
    const clearExpiredSession = () => setUser(null)
    window.addEventListener("auth:unauthorized", clearExpiredSession)
    return () =>
      window.removeEventListener("auth:unauthorized", clearExpiredSession)
  }, [refreshUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      async login(input) {
        const authenticatedUser = await loginRequest(input)
        setUser(authenticatedUser)
        return authenticatedUser
      },
      signup: signupRequest,
      async logout() {
        try {
          await logoutRequest()
        } finally {
          setUser(null)
        }
      },
      refreshUser,
    }),
    [isLoading, refreshUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
