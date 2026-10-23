const REQUEST_STATE_KEY = "dsp-reset-request-state"
const TOKEN_STATE_KEY = "dsp-reset-token-state"

const MAX_REQUESTS = 3
const REQUEST_WINDOW_MS = 15 * 60 * 1000
const REQUEST_COOLDOWN_MS = 60 * 1000
const TOKEN_LIFETIME_MS = 10 * 60 * 1000

type RequestState = {
  attempts: number
  windowStartedAt: number
  lastRequestedAt: number
}

type TokenState = {
  token: string
  email: string
  expiresAt: number
  used: boolean
  cancelled: boolean
}

type AvailableRequest = {
  allowed: true
  attemptsRemaining: number
}

type BlockedRequest = {
  allowed: false
  reason: "cooldown" | "limit"
  retryAfter: number
  attemptsRemaining: number
}

type RequestAvailability = AvailableRequest | BlockedRequest

function readStorage<T>(key: string): T | null {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) as T : null
  } catch {
    return null
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // The demo continues in-memory when storage is unavailable.
  }
}

function currentRequestState(now = Date.now()): RequestState {
  const stored = readStorage<RequestState>(REQUEST_STATE_KEY)
  if (!stored || now - stored.windowStartedAt >= REQUEST_WINDOW_MS) {
    return {
      attempts: 0,
      windowStartedAt: now,
      lastRequestedAt: 0,
    }
  }
  return stored
}

export function getResetRequestAvailability(
  now = Date.now(),
): RequestAvailability {
  const state = currentRequestState(now)
  const windowRemaining = REQUEST_WINDOW_MS - (now - state.windowStartedAt)

  if (state.attempts >= MAX_REQUESTS) {
    return {
      allowed: false,
      reason: "limit",
      retryAfter: Math.max(1, Math.ceil(windowRemaining / 1000)),
      attemptsRemaining: 0,
    }
  }

  const cooldownRemaining = REQUEST_COOLDOWN_MS - (now - state.lastRequestedAt)
  if (state.lastRequestedAt && cooldownRemaining > 0) {
    return {
      allowed: false,
      reason: "cooldown",
      retryAfter: Math.max(1, Math.ceil(cooldownRemaining / 1000)),
      attemptsRemaining: MAX_REQUESTS - state.attempts,
    }
  }

  return {
    allowed: true,
    attemptsRemaining: MAX_REQUESTS - state.attempts,
  }
}

export function recordResetRequest() {
  const now = Date.now()
  const availability = getResetRequestAvailability(now)
  if (!availability.allowed) return availability

  const state = currentRequestState(now)
  writeStorage<RequestState>(REQUEST_STATE_KEY, {
    attempts: state.attempts + 1,
    windowStartedAt: state.windowStartedAt,
    lastRequestedAt: now,
  })
  return {
    allowed: true,
    attemptsRemaining: MAX_REQUESTS - (state.attempts + 1),
  } as const
}

export function createDemoResetToken(email: string) {
  const state: TokenState = {
    token: crypto.randomUUID(),
    email: email.trim().toLowerCase(),
    expiresAt: Date.now() + TOKEN_LIFETIME_MS,
    used: false,
    cancelled: false,
  }
  writeStorage(TOKEN_STATE_KEY, state)
  return state.token
}

export function getDemoResetTokenStatus(token: string | null) {
  const stored = readStorage<TokenState>(TOKEN_STATE_KEY)
  if (!token || !stored || stored.token !== token) return "invalid" as const
  if (stored.cancelled) return "invalid" as const
  if (stored.used) return "used" as const
  if (stored.expiresAt <= Date.now()) return "expired" as const
  return "valid" as const
}

export function getDemoResetTokenRemaining(token: string | null) {
  const stored = readStorage<TokenState>(TOKEN_STATE_KEY)
  if (
    !token ||
    !stored ||
    stored.token !== token ||
    stored.used ||
    stored.cancelled
  ) {
    return 0
  }
  return Math.max(0, Math.ceil((stored.expiresAt - Date.now()) / 1000))
}

export function cancelDemoResetToken(token: string) {
  const stored = readStorage<TokenState>(TOKEN_STATE_KEY)
  if (!stored || stored.token !== token || stored.used) return false
  writeStorage<TokenState>(TOKEN_STATE_KEY, { ...stored, cancelled: true })
  return true
}

export function consumeDemoResetToken(token: string) {
  const stored = readStorage<TokenState>(TOKEN_STATE_KEY)
  if (
    !stored ||
    stored.token !== token ||
    stored.used ||
    stored.cancelled ||
    stored.expiresAt <= Date.now()
  ) {
    return false
  }
  writeStorage<TokenState>(TOKEN_STATE_KEY, { ...stored, used: true })
  return true
}

export function formatRetryTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return minutes
    ? `${minutes}:${String(remainder).padStart(2, "0")}`
    : `${remainder}s`
}
