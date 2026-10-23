import { useEffect } from "react"
import { useFrontendPreferences } from "./ui/FrontendExperience"
import { AuthLayout } from "./auth/AuthLayout"
import { useAuth } from "./auth/AuthProvider"
import { PrimaryButton } from "./auth/FormControls"
import { navigate, useHashRoute } from "./auth/hash-router"
import { useLoginIdleTimeout } from "./auth/use-login-idle-timeout"
import {
  ForgotPasswordScreen,
  LoginScreen,
  ResetPasswordScreen,
  SignupScreen,
  WelcomeScreen,
} from "./auth/screens"

const ROUTE_TITLES: Record<string, string> = {
  "/login": "Log in",
  "/login/session-expired": "Session expired",
  "/signup": "Create account",
  "/forgot-password": "Forgot password",
  "/forgot-password/sent": "Check your email",
  "/reset-password": "Reset password",
  "/reset-password/expired": "Reset link expired",
  "/reset-password/new": "Set a new password",
  "/reset-password/success": "Password updated",
  "/welcome": "Welcome",
  "/dashboard": "Dashboard",
}

const PROTECTED_ROUTES = new Set(["/welcome", "/dashboard"])
const GUEST_ONLY_ROUTES = new Set([
  "/login",
  "/login/session-expired",
  "/signup",
])

function SessionTimeoutWarning({
  seconds,
  onContinue,
}: {
  seconds: number
  onContinue: () => void
}) {
  const { locale, t } = useFrontendPreferences()
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    document
      .querySelector<HTMLButtonElement>(".session-warning .primary-button")
      ?.focus()
    return () => previousFocus?.focus()
  }, [])

  return (
    <div className="session-warning-backdrop" role="presentation">
      <section
        className="session-warning"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-warning-title"
        aria-describedby="session-warning-description"
      >
        <span className="session-warning__timer" aria-hidden="true">
          {seconds}s
        </span>
        <div>
          <h2 id="session-warning-title">{t("Are you still there?")}</h2>
          <p id="session-warning-description">
            {locale === "ar"
              ? `ستنتهي جلستك خلال ${seconds} ثانية بسبب عدم النشاط.`
              : `Your session will expire in ${seconds} seconds due to inactivity.`}
          </p>
        </div>
        <PrimaryButton type="button" onClick={onContinue}>
          Stay signed in
        </PrimaryButton>
      </section>
    </div>
  )
}

function DashboardBridge() {
  const { locale } = useFrontendPreferences()
  const { user, logout } = useAuth()

  async function signOut() {
    await logout()
    navigate("/login")
  }

  return (
    <AuthLayout>
      <div className="auth-form dashboard-bridge">
        <span className="dashboard-bridge__label">
          {locale === "ar" ? "مساحتك التعليمية" : "YOUR LEARNING SPACE"}
        </span>
        <h2 tabIndex={-1}>
          {locale === "ar" ? "أنت جاهز للمتابعة" : "You’re ready to continue"}
        </h2>
        <p>
          {locale === "ar"
            ? `تم تسجيل الدخول باسم ${user?.email}. يمكن ربط لوحة DSP الكاملة هنا دون تغيير نظام المصادقة.`
            : `Signed in as ${user?.email}. The full DSP dashboard can replace this bridge without changing the authentication boundary.`}
        </p>
        <PrimaryButton type="button" onClick={signOut}>
          Log out
        </PrimaryButton>
      </div>
    </AuthLayout>
  )
}

function AuthLoadingScreen() {
  const { t } = useFrontendPreferences()
  return (
    <AuthLayout>
      <div
        className="auth-form centered-state"
        role="status"
        aria-live="polite"
      >
        <p>{t("Checking your session...")}</p>
      </div>
    </AuthLayout>
  )
}

export default function App() {
  const { t } = useFrontendPreferences()
  const route = useHashRoute()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const routeKey = `${route.path}?${route.params.toString()}`
  const isKnownRoute = route.path in ROUTE_TITLES
  const sessionRoute = route.path === "/dashboard" || route.path === "/welcome"
  const { warningSeconds, stayActive } = useLoginIdleTimeout(
    isAuthenticated && sessionRoute,
    logout,
  )
  const timeoutWarning =
    warningSeconds === null ? null : (
      <SessionTimeoutWarning seconds={warningSeconds} onContinue={stayActive} />
    )

  useEffect(() => {
    if (!isKnownRoute) {
      navigate("/login")
      return
    }
    if (isLoading) return

    // Frontend guards improve UX, but the backend must still authorize every
    // protected API endpoint because browser routing is not a security barrier.
    if (PROTECTED_ROUTES.has(route.path) && !isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(routeKey)}`)
      return
    }
    if (GUEST_ONLY_ROUTES.has(route.path) && isAuthenticated) {
      navigate("/dashboard")
      return
    }

    document.title = `${t(ROUTE_TITLES[route.path])} · ${t("Digital Signal Processing")}`
    const frame = requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(".screen-heading h2, .dashboard-bridge h2")
        ?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [isAuthenticated, isKnownRoute, isLoading, route.path, routeKey, t])

  if (!isKnownRoute) return null
  if (isLoading) return <AuthLoadingScreen />
  if (PROTECTED_ROUTES.has(route.path) && !isAuthenticated) return null
  if (GUEST_ONLY_ROUTES.has(route.path) && isAuthenticated) return null

  if (route.path === "/dashboard") {
    return (
      <>
        <DashboardBridge key={routeKey} />
        {timeoutWarning}
      </>
    )
  }
  if (route.path === "/signup") return <SignupScreen key={routeKey} />
  if (
    route.path === "/forgot-password" ||
    route.path === "/forgot-password/sent"
  ) {
    return (
      <ForgotPasswordScreen
        key={routeKey}
        sent={route.path.endsWith("/sent")}
        email={route.params.get("email")}
        token={route.params.get("token")}
        notice={route.params.get("notice")}
      />
    )
  }
  if (route.path === "/reset-password/success") {
    return <ResetPasswordScreen key={routeKey} state="success" />
  }
  if (
    route.path === "/reset-password" ||
    route.path === "/reset-password/expired" ||
    route.path === "/reset-password/new"
  ) {
    const token = route.params.get("token")
    return (
      <ResetPasswordScreen
        key={routeKey}
        state={
          route.path === "/reset-password/new" && token ? "form" : "expired"
        }
        token={token}
        expiredReason="invalid"
      />
    )
  }
  if (route.path === "/welcome") {
    return (
      <>
        <WelcomeScreen key={routeKey} source={route.params.get("source")} />
        {timeoutWarning}
      </>
    )
  }

  return (
    <LoginScreen
      key={routeKey}
      invalid={route.params.get("error") === "credentials"}
      sessionExpired={
        route.path === "/login/session-expired" ||
        route.params.get("reason") === "session-expired"
      }
      redirect={route.params.get("redirect")}
    />
  )
}
