import { useEffect, useRef, useState, type FormEvent } from "react"
import { useFrontendPreferences } from "../ui/FrontendExperience"
import {
  AuthApiError,
  cancelPasswordReset,
  formatRetryTime,
  getPasswordResetAvailability,
  getPasswordResetRemaining,
  requestPasswordReset,
  resetPassword,
} from "../api/auth"
import { AuthLayout } from "./AuthLayout"
import { useAuth } from "./AuthProvider"
import {
  Field,
  Notice,
  PrimaryButton,
  StatusIcon,
  TextLink,
  Toast,
} from "./FormControls"
import { navigate } from "./hash-router"
import {
  getPasswordStrength,
  validateEmail,
  validateNewPassword,
  validateSignup,
  type SignupErrors,
} from "./validation"

const LOGIN_EMAIL_KEY = "dsp-login-email"
const SIGNUP_DRAFT_KEY = "dsp-signup-draft"
const FORGOT_EMAIL_KEY = "dsp-forgot-email"
const ACCOUNT_CREATED_KEY = "dsp-account-created"

type SignupDraft = {
  name?: string
  email?: string
}

function rememberedLoginEmail() {
  try {
    return window.sessionStorage.getItem(LOGIN_EMAIL_KEY) || ""
  } catch {
    return ""
  }
}

function rememberLoginEmail(email: string) {
  try {
    window.sessionStorage.setItem(LOGIN_EMAIL_KEY, email)
  } catch {
    // Remembering the email is an optional convenience.
  }
}

function readSessionValue(key: string) {
  try {
    return window.sessionStorage.getItem(key) || ""
  } catch {
    return ""
  }
}

function writeSessionValue(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Draft persistence is an optional convenience.
  }
}

function removeSessionValue(key: string) {
  try {
    window.sessionStorage.removeItem(key)
  } catch {
    // Draft persistence is an optional convenience.
  }
}

function readSignupDraft() {
  try {
    const value = window.sessionStorage.getItem(SIGNUP_DRAFT_KEY)
    return value ? JSON.parse(value) as SignupDraft : {}
  } catch {
    return {}
  }
}

function ScreenHeading({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const { t, localizeChildren } = useFrontendPreferences()
  return (
    <header className="screen-heading">
      <h2 tabIndex={-1}>{t(title)}</h2>
      <p>{localizeChildren(children)}</p>
    </header>
  )
}

function PasswordStrength({
  password,
  email = "",
}: {
  password: string
  email?: string
}) {
  const { t } = useFrontendPreferences()
  if (!password) return null
  const strength = getPasswordStrength(password, email)
  return (
    <div
      className={`password-strength password-strength--${strength.label.toLowerCase()}`}
      aria-live="polite"
    >
      <div className="password-strength__heading">
        <span>{t("Password strength")}</span>
        <strong>{t(strength.label)}</strong>
      </div>
      <div className="password-strength__meter" aria-hidden="true">
        {strength.checks.map((check) => (
          <span className={check.met ? "is-met" : ""} key={check.label} />
        ))}
      </div>
      <ul>
        {strength.checks.map((check) => (
          <li className={check.met ? "is-met" : ""} key={check.label}>
            <span aria-hidden="true" />
            {t(check.label)}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LoginScreen({
  invalid,
  sessionExpired,
  redirect,
}: {
  invalid: boolean
  sessionExpired: boolean
  redirect?: string | null
}) {
  const { t } = useFrontendPreferences()
  const { login } = useAuth()
  const [email, setEmail] = useState(
    sessionExpired
      ? rememberedLoginEmail() || "name@example.com"
      : invalid
        ? "name@example.com"
        : rememberedLoginEmail(),
  )
  const [password, setPassword] = useState(invalid ? "incorrect" : "")
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [serverInvalid, setServerInvalid] = useState(invalid)
  const [showSessionExpired, setShowSessionExpired] = useState(sessionExpired)
  const [submitting, setSubmitting] = useState(false)
  const [serverMessage, setServerMessage] = useState("")
  const [toast, setToast] = useState(() => {
    if (readSessionValue(ACCOUNT_CREATED_KEY) !== "true") return ""
    removeSessionValue(ACCOUNT_CREATED_KEY)
    return "Account created successfully. Log in to continue."
  })
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const showNotice = serverInvalid || showSessionExpired

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    const nextErrors: typeof errors = {}
    const emailError = validateEmail(email)
    if (emailError) nextErrors.email = emailError
    if (!password) nextErrors.password = "Enter your password"
    setErrors(nextErrors)
    setShowSessionExpired(false)
    setServerMessage("")

    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      await login({ email, password })
      // Accept only internal destinations produced by the protected-route guard.
      navigate(redirect?.startsWith("/") ? redirect : "/welcome?source=login")
    } catch (error) {
      setServerInvalid(true)
      if (error instanceof AuthApiError) {
        setErrors((current) => ({ ...current, ...error.fieldErrors }))
      }
      setServerMessage(
        error instanceof AuthApiError
          ? error.message
          : "Please check your connection and try again.",
      )
      passwordRef.current?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form
        className={`auth-form login-form ${
          showNotice ? "auth-form--notice" : ""
        }`}
        onSubmit={submit}
        noValidate
      >
        <ScreenHeading title="Log in">
          Use your account to open the DSP lectures,
          <br />
          sections, and Exam Bank.
        </ScreenHeading>
        {serverInvalid && !showSessionExpired && (
          <Notice tone="error" title="Unable to log in.">
            {serverMessage || "Check your details and try again."}
          </Notice>
        )}
        {showSessionExpired && (
          <Notice tone="warning" title="Your session has expired.">
            Log in again to continue.
          </Notice>
        )}
        <div className="fields">
          <Field
            ref={emailRef}
            label="Email"
            icon="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              rememberLoginEmail(e.target.value)
              setErrors((current) => ({ ...current, email: undefined }))
              setServerInvalid(false)
            }}
            error={errors.email}
            invalid={serverInvalid}
            required
          />
          <Field
            ref={passwordRef}
            label="Password"
            icon="lock"
            password
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((current) => ({ ...current, password: undefined }))
              setServerInvalid(false)
            }}
            error={errors.password}
            invalid={serverInvalid}
            required
          />
        </div>
        <div className="align-right">
          <TextLink to="/forgot-password">Forgot password?</TextLink>
        </div>
        <PrimaryButton type="submit" loading={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </PrimaryButton>
        <p className="form-switch">
          {t("New to the course?")}{" "}
          <TextLink to="/signup">Create an account</TextLink>
        </p>
        {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
      </form>
    </AuthLayout>
  )
}

export function SignupScreen() {
  const { t } = useFrontendPreferences()
  const { signup } = useAuth()
  const [values, setValues] = useState(() => {
    const draft = readSignupDraft()
    return {
      name: draft.name || "",
      email: draft.email || "",
      password: "",
      confirmation: "",
    }
  })
  const [errors, setErrors] = useState<SignupErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmationRef = useRef<HTMLInputElement>(null)
  const isDirty = Object.values(values).some(Boolean)

  useEffect(() => {
    if (!isDirty) return
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warnBeforeLeaving)
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving)
  }, [isDirty])

  const update =
    (key: keyof typeof values) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValues = { ...values, [key]: event.target.value }
      setValues(nextValues)
      if (key === "name" || key === "email") {
        writeSessionValue(
          SIGNUP_DRAFT_KEY,
          JSON.stringify({
            name: nextValues.name,
            email: nextValues.email,
          }),
        )
      }
      setErrors((current) => ({ ...current, [key]: undefined }))
      setServerError("")
    }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    const nextErrors = validateSignup(values)
    setErrors(nextErrors)
    setServerError("")
    if (Object.keys(nextErrors).length) {
      const firstInvalid = ([
        ["name", nameRef],
        ["email", emailRef],
        ["password", passwordRef],
        ["confirmation", confirmationRef],
      ] as const).find(([key]) => nextErrors[key])
      firstInvalid?.[1].current?.focus()
      return
    }

    setSubmitting(true)
    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      // نحفظ البريد فقط لتسهيل تسجيل الدخول، ولا نخزن كلمة المرور مطلقًا.
      rememberLoginEmail(values.email)
      removeSessionValue(SIGNUP_DRAFT_KEY)
      writeSessionValue(ACCOUNT_CREATED_KEY, "true")
      navigate("/login")
    } catch (error) {
      if (error instanceof AuthApiError) {
        setErrors((current) => ({ ...current, ...error.fieldErrors }))
        setServerError(error.message)
        if (error.fieldErrors.email) emailRef.current?.focus()
        else if (error.fieldErrors.name) nameRef.current?.focus()
        else if (error.fieldErrors.password) passwordRef.current?.focus()
        else if (error.fieldErrors.confirmation) {
          confirmationRef.current?.focus()
        }
      } else {
        setServerError("Please check your connection and try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout compact>
      <form className="auth-form signup-form" onSubmit={submit} noValidate>
        <ScreenHeading title="Create account">
          Create your account to access the
          <br />
          course materials.
        </ScreenHeading>
        {serverError && (
          <Notice tone="error" title="Unable to create your account.">
            {serverError}
          </Notice>
        )}
        <div className="fields fields--signup">
          <Field
            ref={nameRef}
            label="Full name"
            icon="user"
            autoComplete="name"
            placeholder="Enter your full name"
            value={values.name}
            onChange={update("name")}
            error={errors.name}
            required
          />
          <Field
            ref={emailRef}
            label="Email"
            icon="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={values.email}
            onChange={update("email")}
            error={errors.email}
            required
          />
          <Field
            ref={passwordRef}
            label="Password"
            icon="lock"
            password
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={update("password")}
            error={errors.password}
            required
          />
          <PasswordStrength password={values.password} email={values.email} />
          <Field
            ref={confirmationRef}
            label="Confirm password"
            icon="lock"
            password
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={values.confirmation}
            onChange={update("confirmation")}
            error={errors.confirmation}
            required
          />
        </div>
        <PrimaryButton type="submit" loading={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </PrimaryButton>
        <p className="form-switch">
          {t("Already have an account?")}{" "}
          <TextLink
            to="/login"
            onClick={(event) => {
              if (
                isDirty &&
                !window.confirm(
                  "Leave this page? Your password fields will be cleared.",
                )
              ) {
                event.preventDefault()
              }
            }}
          >
            Log in
          </TextLink>
        </p>
      </form>
    </AuthLayout>
  )
}

export function ForgotPasswordScreen({
  sent,
  email: routeEmail,
  token: routeToken,
  notice,
}: {
  sent: boolean
  email: string | null
  token: string | null
  notice: string | null
}) {
  const [email, setEmail] = useState(
    routeEmail || readSessionValue(FORGOT_EMAIL_KEY),
  )
  const [error, setError] = useState("")
  const [requestError, setRequestError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [tokenSecondsRemaining, setTokenSecondsRemaining] = useState(() =>
    getPasswordResetRemaining(routeToken),
  )
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)
  const [linkCancelled, setLinkCancelled] = useState(false)
  const [toast, setToast] = useState(
    notice === "resent" ? "A new reset link is ready." : "",
  )
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!sent) return
    const updateCountdown = () => {
      const availability = getPasswordResetAvailability()
      setSecondsRemaining(availability.allowed ? 0 : availability.retryAfter)
      setAttemptsRemaining(availability.attemptsRemaining)
      setTokenSecondsRemaining(getPasswordResetRemaining(routeToken))
    }
    updateCountdown()
    const interval = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(interval)
  }, [routeToken, sent])

  async function resend() {
    const targetEmail = routeEmail || ""
    if (isLoading) return
    setIsLoading(true)
    setRequestError("")
    try {
      const result = await requestPasswordReset(targetEmail)
      const tokenQuery = result.demoToken
        ? `&token=${encodeURIComponent(result.demoToken)}`
        : ""
      navigate(
        `/forgot-password/sent?email=${encodeURIComponent(targetEmail)}${tokenQuery}&notice=resent`,
      )
    } catch (error) {
      setRequestError(
        error instanceof AuthApiError
          ? error.message
          : "Please check your connection and try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function cancelLink() {
    if (!routeToken || isLoading) return
    setIsLoading(true)
    try {
      await cancelPasswordReset(routeToken)
      setLinkCancelled(true)
      setTokenSecondsRemaining(0)
      setToast("The reset link has been cancelled.")
    } catch (error) {
      setRequestError(
        error instanceof AuthApiError
          ? error.message
          : "The link could not be cancelled.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="auth-form centered-state">
          <StatusIcon />
          <ScreenHeading title="Check your email">
            If an account exists for {routeEmail || "name@example.com"},<br />
            reset instructions are on their way.
          </ScreenHeading>
          {/* Production users open the server-generated link from their inbox.
              This shortcut is rendered only for the local no-backend demo. */}
          {routeToken && (
            <PrimaryButton
              type="button"
              disabled={tokenSecondsRemaining <= 0 || linkCancelled}
              onClick={() =>
                navigate(
                  `/reset-password/new?token=${encodeURIComponent(routeToken)}`,
                )
              }
            >
              Open demo reset link
            </PrimaryButton>
          )}
          <div className="resend-controls" aria-live="polite">
            <div className="resend-actions">
              <button
                type="button"
                onClick={resend}
                disabled={isLoading || secondsRemaining > 0}
              >
                {isLoading
                  ? "Sending..."
                  : secondsRemaining > 0
                    ? `Resend in ${formatRetryTime(secondsRemaining)}`
                    : "Resend reset link"}
              </button>
              {routeToken && (
                <button
                  type="button"
                  onClick={cancelLink}
                  disabled={tokenSecondsRemaining <= 0 || linkCancelled}
                >
                  Cancel link
                </button>
              )}
            </div>
            {requestError && <p role="alert">{requestError}</p>}
            {!requestError && linkCancelled && (
              <p role="status">This reset link has been cancelled.</p>
            )}
            {!requestError && !linkCancelled && tokenSecondsRemaining > 0 && (
              <p>
                Link expires in {formatRetryTime(tokenSecondsRemaining)} and
                works once. {attemptsRemaining} requests remaining.
              </p>
            )}
            {!requestError && !linkCancelled && tokenSecondsRemaining <= 0 && (
              <p role="status">
                {routeToken
                  ? "This reset link has expired."
                  : "Use the secure link in your email to continue."}
              </p>
            )}
          </div>
          <TextLink to="/login" arrow>
            Back to login
          </TextLink>
          {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
        </div>
      </AuthLayout>
    )
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (isLoading) return
    const nextError = validateEmail(email)
    setError(nextError)
    if (nextError) {
      emailRef.current?.focus()
      return
    }

    setIsLoading(true)
    try {
      const result = await requestPasswordReset(email.trim())
      writeSessionValue(FORGOT_EMAIL_KEY, email.trim())
      const tokenQuery = result.demoToken
        ? `&token=${encodeURIComponent(result.demoToken)}`
        : ""
      navigate(
        `/forgot-password/sent?email=${encodeURIComponent(email.trim())}${tokenQuery}`,
      )
    } catch (requestError) {
      setError(
        requestError instanceof AuthApiError
          ? requestError.message
          : "Please check your connection and try again.",
      )
      emailRef.current?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <form className="auth-form forgot-form" onSubmit={submit} noValidate>
        <ScreenHeading title="Forgot password?">
          Enter the email for your account and we
          <br />
          will send you reset instructions.
        </ScreenHeading>
        <Field
          ref={emailRef}
          label="Email"
          icon="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            writeSessionValue(FORGOT_EMAIL_KEY, e.target.value)
            setError("")
          }}
          error={error}
          emphasized
        />
        <p className="request-limit-hint">
          Up to 3 reset links every 15 minutes.
        </p>
        <PrimaryButton type="submit" loading={isLoading}>
          {isLoading ? "Sending reset link" : "Send reset link"}
        </PrimaryButton>
        <TextLink to="/login" arrow>
          Back to login
        </TextLink>
      </form>
    </AuthLayout>
  )
}

export function ResetPasswordScreen({
  state,
  token,
  expiredReason,
}: {
  state: "expired" | "form" | "success"
  token?: string | null
  expiredReason?: "valid" | "invalid" | "used" | "expired"
}) {
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [error, setError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmationRef = useRef<HTMLInputElement>(null)

  if (state === "expired") {
    const wasUsed = expiredReason === "used"
    return (
      <AuthLayout>
        <div className="auth-form centered-state">
          <StatusIcon tone="warning" />
          <ScreenHeading
            title={
              wasUsed
                ? "This link has already been used"
                : "This link is no longer valid"
            }
          >
            {wasUsed
              ? "Request a new link if you need to reset your password again."
              : "Reset links expire. Request a new one to continue."}
          </ScreenHeading>
          <PrimaryButton
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            Request a new link
          </PrimaryButton>
          <TextLink to="/login" arrow>
            Back to login
          </TextLink>
        </div>
      </AuthLayout>
    )
  }

  if (state === "success") {
    return (
      <AuthLayout>
        <div className="auth-form centered-state">
          <StatusIcon />
          <ScreenHeading title="Password updated">
            You can now log in with your new password.
          </ScreenHeading>
          <PrimaryButton type="button" onClick={() => navigate("/login")}>
            Log in
          </PrimaryButton>
        </div>
      </AuthLayout>
    )
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (isUpdating) return
    const message = validateNewPassword(password, confirmation)
    setError(message)
    if (!message) {
      setIsUpdating(true)
      try {
        if (!token) {
          navigate("/reset-password/expired")
          return
        }
        await resetPassword(token, password)
        navigate("/reset-password/success")
      } catch (requestError) {
        if (
          requestError instanceof AuthApiError &&
          requestError.code === "RESET_TOKEN_INVALID"
        ) {
          navigate("/reset-password/expired")
          return
        }
        setError(
          requestError instanceof AuthApiError
            ? requestError.message
            : "Please check your connection and try again.",
        )
      } finally {
        setIsUpdating(false)
      }
      return
    }
    if (message === "Passwords don’t match") confirmationRef.current?.focus()
    else passwordRef.current?.focus()
  }

  return (
    <AuthLayout>
      <form className="auth-form reset-form" onSubmit={submit} noValidate>
        <ScreenHeading title="Set a new password">
          Choose a new password for your account.
        </ScreenHeading>
        <div className="fields">
          <Field
            ref={passwordRef}
            label="New password"
            icon="lock"
            password
            autoComplete="new-password"
            placeholder="Enter a new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            error={
              error && error !== "Passwords don’t match" ? error : undefined
            }
            emphasized
            required
          />
          <PasswordStrength password={password} />
          <Field
            ref={confirmationRef}
            label="Confirm new password"
            icon="lock"
            password
            autoComplete="new-password"
            placeholder="Repeat the new password"
            value={confirmation}
            onChange={(e) => {
              setConfirmation(e.target.value)
              setError("")
            }}
            error={error === "Passwords don’t match" ? error : undefined}
            required
          />
        </div>
        <PrimaryButton type="submit" loading={isUpdating}>
          {isUpdating ? "Updating password" : "Update password"}
        </PrimaryButton>
      </form>
    </AuthLayout>
  )
}

export function WelcomeScreen({ source }: { source: string | null }) {
  return (
    <AuthLayout>
      <div className="auth-form centered-state">
        <StatusIcon />
        <ScreenHeading title="Welcome to DSP">
          {source === "signup"
            ? "Your account is ready."
            : "You are now logged in."}
          <br />
          Your course materials are ready to explore.
        </ScreenHeading>
        <PrimaryButton type="button" onClick={() => navigate("/dashboard")}>
          Open dashboard
        </PrimaryButton>
      </div>
    </AuthLayout>
  )
}
