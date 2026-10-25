import {
  cancelDemoResetToken,
  consumeDemoResetToken,
  createDemoResetToken,
  formatRetryTime,
  getDemoResetTokenRemaining,
  getDemoResetTokenStatus,
  getResetRequestAvailability,
  recordResetRequest,
} from "../auth/reset-demo"

export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthFieldErrors = Partial<Record<"name" | "email" | "password" | "confirmation", string>>

export type LoginInput = {
  email: string
  password: string
}

export type SignupInput = LoginInput & {
  name: string
}

export type PasswordResetRequestResult = {
  accepted: true
  // A real backend sends the token by email and must never return it here.
  // This value exists only so the no-backend browser demo remains testable.
  demoToken?: string
  attemptsRemaining?: number
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public code = "UNKNOWN_ERROR",
    public fieldErrors: AuthFieldErrors = {},
    public status?: number,
  ) {
    super(message)
    this.name = "AuthApiError"
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")
const REQUEST_TIMEOUT_MS = 15_000
const DEMO_SESSION_KEY = "dsp-demo-auth-user"

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE"
  body?: unknown
  signal?: AbortSignal
}

/**
 * The backend handoff boundary.
 *
 * Keep cookies HttpOnly/Secure/SameSite on the server. Do not add access
 * tokens to localStorage. If the backend requires CSRF protection, add its
 * public CSRF header here so every mutating request receives it consistently.
 */
async function request<T>(
  path: string,
  { method = "GET", body, signal }: RequestOptions = {},
): Promise<T> {
  if (!navigator.onLine) {
    throw new AuthApiError(
      "Please check your connection and try again.",
      "NETWORK_OFFLINE",
    )
  }

  const timeoutController = new AbortController()
  const timeout = window.setTimeout(
    () => timeoutController.abort(),
    REQUEST_TIMEOUT_MS,
  )
  const abort = () => timeoutController.abort()
  signal?.addEventListener("abort", abort, { once: true })

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: timeoutController.signal,
    })
    const payload =
      response.status === 204 ? null : await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event("auth:unauthorized"))
      }
      throw new AuthApiError(
        payload?.message || "The request could not be completed.",
        payload?.code || "REQUEST_FAILED",
        payload?.fields || {},
        response.status,
      )
    }

    return payload as T
  } catch (error) {
    if (error instanceof AuthApiError) throw error
    if (timeoutController.signal.aborted && !signal?.aborted) {
      throw new AuthApiError(
        "The request timed out. Please try again.",
        "REQUEST_TIMEOUT",
      )
    }
    throw new AuthApiError(
      "Please check your connection and try again.",
      "NETWORK_ERROR",
    )
  } finally {
    window.clearTimeout(timeout)
    signal?.removeEventListener("abort", abort)
  }
}

function readDemoUser(): AuthUser | null {
  try {
    const value = window.sessionStorage.getItem(DEMO_SESSION_KEY)
    return value ? JSON.parse(value) as AuthUser : null
  } catch {
    return null
  }
}

function writeDemoUser(user: AuthUser | null) {
  try {
    if (user)
      window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user))
    else window.sessionStorage.removeItem(DEMO_SESSION_KEY)
  } catch {
    // Demo persistence is optional; production authentication uses a cookie.
  }
}

export async function login(input: LoginInput): Promise<AuthUser> {
  if (API_BASE_URL) {
    return request<AuthUser>("/auth/login", { method: "POST", body: input })
  }

  // Browser-only adapter. Delete this branch after VITE_API_BASE_URL is set.
  if (
    input.email.trim().toLowerCase() === "demo@example.com" &&
    input.password === "Password123!"
  ) {
    const user = {
      id: "demo-user",
      name: "Demo Student",
      email: "demo@example.com",
    }
    writeDemoUser(user)
    return user
  }

  throw new AuthApiError(
    "Email or password is incorrect.",
    "INVALID_CREDENTIALS",
    { password: "Check your email and password." },
    401,
  )
}

export async function signup(input: SignupInput): Promise<AuthUser> {
  if (API_BASE_URL) {
    return request<AuthUser>("/auth/signup", { method: "POST", body: input })
  }

  // Never persist the password in the browser. The returned record only lets
  // designers verify the post-signup transition before a database is attached.
  return {
    id: "pending-backend",
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!API_BASE_URL) return readDemoUser()
  try {
    return await request<AuthUser>("/auth/me")
  } catch (error) {
    if (error instanceof AuthApiError && error.status === 401) return null
    throw error
  }
}

export async function logout(): Promise<void> {
  if (API_BASE_URL) {
    await request<void>("/auth/logout", { method: "POST" })
  } else {
    writeDemoUser(null)
  }
}

export async function requestPasswordReset(
  email: string,
): Promise<PasswordResetRequestResult> {
  if (API_BASE_URL) {
    return request<PasswordResetRequestResult>("/auth/password/forgot", {
      method: "POST",
      body: { email },
    })
  }

  const availability = recordResetRequest()
  if (!availability.allowed) {
    const message =
      availability.reason === "limit"
        ? `No requests remaining. Try again in ${formatRetryTime(availability.retryAfter)}.`
        : `Please wait ${formatRetryTime(availability.retryAfter)}. ${availability.attemptsRemaining} requests remaining.`
    throw new AuthApiError(message, "RATE_LIMITED", {}, 429)
  }

  return {
    accepted: true,
    demoToken: createDemoResetToken(email),
    attemptsRemaining: availability.attemptsRemaining,
  }
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  if (API_BASE_URL) {
    await request<void>("/auth/password/reset", {
      method: "POST",
      body: { token, password },
    })
    return
  }
  if (!consumeDemoResetToken(token)) {
    throw new AuthApiError(
      "This reset link is invalid or has expired.",
      "RESET_TOKEN_INVALID",
      {},
      400,
    )
  }
}

export async function cancelPasswordReset(token: string): Promise<void> {
  if (API_BASE_URL) {
    await request<void>("/auth/password/reset-token", {
      method: "DELETE",
      body: { token },
    })
    return
  }
  cancelDemoResetToken(token)
}

// These selectors keep demo-only storage out of React screens. A backend email
// flow will not use them because the reset link is opened from the user's inbox.
export const getPasswordResetStatus = getDemoResetTokenStatus
export const getPasswordResetRemaining = getDemoResetTokenRemaining
export const getPasswordResetAvailability = getResetRequestAvailability
export { formatRetryTime }
