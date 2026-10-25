import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type Theme = "light" | "dark"

type FrontendPreferencesValue = {
  locale: "en" | "ar"
  theme: Theme
  setTheme: (theme: Theme) => void
  t: (value: string) => string
  localizeChildren: (children: ReactNode) => ReactNode
}

const THEME_KEY = "dsp-theme"

function readTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(THEME_KEY)
    if (saved === "dark" || saved === "light") return saved
  } catch {
    // Fall back to the operating-system preference when storage is blocked.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function savePreference(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // A saved preference is optional and must never block the application.
  }
}

const FrontendPreferencesContext =
  createContext<FrontendPreferencesValue | null>(null)

export function FrontendPreferencesProvider({
  children,
}: {
  children: ReactNode
}) {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    themeColor?.setAttribute(
      "content",
      theme === "dark" ? "#0c1c23" : "#ffffff",
    )
    savePreference(THEME_KEY, theme)
  }, [theme])

  const value = useMemo<FrontendPreferencesValue>(
    () => ({
      locale: "en",
      theme,
      setTheme,
      t: (text) => text,
      localizeChildren: (childrenToTranslate) => childrenToTranslate,
    }),
    [theme],
  )

  return (
    <FrontendPreferencesContext.Provider value={value}>
      {children}
    </FrontendPreferencesContext.Provider>
  )
}

export function useFrontendPreferences() {
  const context = useContext(FrontendPreferencesContext)
  if (!context) {
    throw new Error(
      "useFrontendPreferences must be used inside FrontendPreferencesProvider",
    )
  }
  return context
}

function PreferencesToolbar() {
  const { theme, setTheme, t } = useFrontendPreferences()

  return (
    <nav className="preferences-toolbar" aria-label="Display preferences">
      <button
        type="button"
        className="preference-button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-pressed={theme === "dark"}
        aria-label={
          theme === "dark"
            ? t("Use light appearance")
            : t("Use dark appearance")
        }
      >
        <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
          {theme === "dark" ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41" />
            </>
          ) : (
            <path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.5 8.5 0 1 0 20.5 14.1Z" />
          )}
        </svg>
        <span className="preference-button__label">
          {theme === "dark" ? "Light" : "Dark"}
        </span>
      </button>
    </nav>
  )
}

function ConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (online) return null

  return (
    <aside className="connection-banner" role="status" aria-live="polite">
      <span className="connection-banner__dot" aria-hidden="true" />
      <span>You’re offline. Try again when your connection returns.</span>
    </aside>
  )
}

function SkipLink() {
  const { t } = useFrontendPreferences()
  return (
    <a className="skip-link" href="#auth-content">
      {t("Skip to form")}
    </a>
  )
}

export function FrontendExperience({ children }: { children: ReactNode }) {
  return (
    <FrontendPreferencesProvider>
      <SkipLink />
      <PreferencesToolbar />
      <ConnectionStatus />
      {children}
    </FrontendPreferencesProvider>
  )
}
