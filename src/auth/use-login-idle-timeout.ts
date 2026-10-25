import { useEffect, useRef, useState } from "react"
import { navigate } from "./hash-router"

const LOGIN_IDLE_TIMEOUT_MS = 10 * 60 * 1000
const WARNING_DURATION_MS = 45 * 1000
const LAST_ACTIVITY_KEY = "dsp-auth-last-activity"
const SESSION_CHANNEL = "dsp-auth-session"

export function useLoginIdleTimeout(
  enabled: boolean,
  onExpire?: () => void | Promise<void>,
) {
  const [warningSeconds, setWarningSeconds] = useState<number | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!enabled) {
      setWarningSeconds(null)
      return
    }

    let deadline = Date.now() + LOGIN_IDLE_TIMEOUT_MS
    let warningTimer = 0
    let expiryTimer = 0
    let countdownTimer = 0
    let lastBroadcastAt = 0
    const channel =
      "BroadcastChannel" in window
        ? new BroadcastChannel(SESSION_CHANNEL)
        : null

    const clearTimers = () => {
      window.clearTimeout(warningTimer)
      window.clearTimeout(expiryTimer)
      window.clearInterval(countdownTimer)
    }

    const expire = (broadcast = true) => {
      clearTimers()
      setWarningSeconds(null)
      // Clear the frontend/backend session before exposing a guest route.
      void Promise.resolve(onExpireRef.current?.())
        .catch(() => undefined)
        .finally(() => navigate("/login/session-expired"))
      if (broadcast) {
        window.localStorage.setItem(
          `${SESSION_CHANNEL}-expired`,
          String(Date.now()),
        )
        channel?.postMessage({ type: "expired" })
      }
    }

    const updateWarning = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setWarningSeconds(remaining)
      if (remaining <= 0) expire()
    }

    const scheduleFrom = (lastActivity: number) => {
      clearTimers()
      deadline = lastActivity + LOGIN_IDLE_TIMEOUT_MS
      const now = Date.now()
      const warningAt = deadline - WARNING_DURATION_MS

      if (deadline <= now) {
        expire()
        return
      }

      expiryTimer = window.setTimeout(expire, deadline - now)
      if (warningAt <= now) {
        updateWarning()
        countdownTimer = window.setInterval(updateWarning, 1000)
      } else {
        warningTimer = window.setTimeout(() => {
          updateWarning()
          countdownTimer = window.setInterval(updateWarning, 1000)
        }, warningAt - now)
      }
    }

    const registerActivity = () => {
      const now = Date.now()
      setWarningSeconds(null)
      scheduleFrom(now)
      if (now - lastBroadcastAt >= 1000) {
        lastBroadcastAt = now
        window.localStorage.setItem(LAST_ACTIVITY_KEY, String(now))
        channel?.postMessage({ type: "activity", at: now })
      }
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === LAST_ACTIVITY_KEY && event.newValue) {
        scheduleFrom(Number(event.newValue))
      }
      if (event.key === `${SESSION_CHANNEL}-expired` && event.newValue) {
        expire(false)
      }
    }

    const onChannelMessage = (event: MessageEvent) => {
      if (event.data?.type === "activity") scheduleFrom(event.data.at)
      if (event.data?.type === "expired") expire(false)
    }

    const checkAfterVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const storedActivity = Number(
          window.localStorage.getItem(LAST_ACTIVITY_KEY),
        )
        scheduleFrom(storedActivity || deadline - LOGIN_IDLE_TIMEOUT_MS)
      }
    }

    const activityEvents = [
      "keydown",
      "input",
      "pointerdown",
      "scroll",
      "touchstart",
    ] as const

    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, registerActivity, { passive: true }),
    )
    window.addEventListener("storage", onStorage)
    document.addEventListener("visibilitychange", checkAfterVisibilityChange)
    channel?.addEventListener("message", onChannelMessage)
    registerActivity()

    return () => {
      clearTimers()
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, registerActivity),
      )
      window.removeEventListener("storage", onStorage)
      document.removeEventListener(
        "visibilitychange",
        checkAfterVisibilityChange,
      )
      channel?.removeEventListener("message", onChannelMessage)
      channel?.close()
    }
  }, [enabled])

  return {
    warningSeconds,
    stayActive() {
      window.localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: LAST_ACTIVITY_KEY,
          newValue: String(Date.now()),
        }),
      )
    },
  }
}
