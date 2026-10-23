import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from "react"
import { useFrontendPreferences } from "../ui/FrontendExperience"

type IconName = "email" | "lock" | "user" | "eye" | "arrow-right" | "arrow-left" | "check" | "alert"

export function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    "arrow-right": (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    "arrow-left": (
      <>
        <path d="M19 12H5M10 7l-5 5 5 5" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 17h.01" />
      </>
    ),
  }
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: "email" | "lock" | "user"
  error?: string
  invalid?: boolean
  password?: boolean
  emphasized?: boolean
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, icon, error, invalid, password, emphasized, ...props },
  ref,
) {
  const { t } = useFrontendPreferences()
  const id = useId()
  const errorId = `${id}-error`
  const capsLockId = `${id}-caps-lock`
  const [visible, setVisible] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const describedBy = [
    error ? errorId : "",
    password && capsLock ? capsLockId : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="field-group">
      <label htmlFor={id}>{t(label)}</label>
      <div
        className={`field ${error || invalid ? "field--error" : ""} ${
          emphasized ? "field--focus" : ""
        }`}
      >
        <Icon name={icon} />
        <input
          {...props}
          ref={ref}
          id={id}
          type={password ? (visible ? "text" : "password") : props.type}
          placeholder={
            typeof props.placeholder === "string"
              ? t(props.placeholder)
              : props.placeholder
          }
          aria-invalid={Boolean(error || invalid)}
          aria-describedby={describedBy || undefined}
          onKeyDown={(event) => {
            if (password) setCapsLock(event.getModifierState("CapsLock"))
            props.onKeyDown?.(event)
          }}
          onKeyUp={(event) => {
            if (password) setCapsLock(event.getModifierState("CapsLock"))
            props.onKeyUp?.(event)
          }}
          onBlur={(event) => {
            setCapsLock(false)
            props.onBlur?.(event)
          }}
        />
        {password && (
          <button
            className="icon-button"
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={t(visible ? "Hide password" : "Show password")}
            aria-pressed={visible}
          >
            <Icon name="eye" />
          </button>
        )}
      </div>
      {error && (
        <p className="field-error" id={errorId} role="alert">
          <Icon name="alert" />
          {t(error)}
        </p>
      )}
      {password && capsLock && (
        <p className="field-hint field-hint--warning" id={capsLockId}>
          <Icon name="alert" />
          {t("Caps Lock is on")}
        </p>
      )}
    </div>
  )
})

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  direction?: "right" | "left"
  loading?: boolean
}

export function PrimaryButton({
  children,
  direction = "right",
  loading = false,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const { t, localizeChildren } = useFrontendPreferences()
  return (
    <button
      className="primary-button"
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="button-spinner" aria-hidden="true" />}
      {!loading && direction === "left" && <Icon name="arrow-left" />}
      <span>
        {typeof children === "string"
          ? t(children)
          : localizeChildren(children)}
      </span>
      {!loading && direction === "right" && <Icon name="arrow-right" />}
    </button>
  )
}

export function TextLink({
  children,
  to,
  arrow,
  onClick,
}: {
  children: ReactNode
  to: string
  arrow?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}) {
  const { t, localizeChildren } = useFrontendPreferences()
  return (
    <a className="text-link" href={`#${to}`} onClick={onClick}>
      {arrow && <Icon name="arrow-left" />}
      {typeof children === "string" ? t(children) : localizeChildren(children)}
    </a>
  )
}

export function Toast({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  const { t } = useFrontendPreferences()
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  useEffect(() => {
    const timer = window.setTimeout(() => dismissRef.current(), 3200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="toast" role="status" aria-live="polite">
      <Icon name="check" />
      <span>{t(message)}</span>
    </div>
  )
}

export function Notice({
  tone,
  title,
  children,
}: {
  tone: "error" | "warning"
  title: string
  children: ReactNode
}) {
  const { t, localizeChildren } = useFrontendPreferences()
  return (
    <div className={`notice notice--${tone}`} role="alert">
      <Icon name="alert" />
      <div>
        <strong>{t(title)}</strong>
        <p>
          {typeof children === "string"
            ? t(children)
            : localizeChildren(children)}
        </p>
      </div>
    </div>
  )
}

export function StatusIcon({
  tone = "success",
}: {
  tone?: "success" | "warning"
}) {
  return (
    <div className={`status-icon status-icon--${tone}`} aria-hidden="true">
      <Icon name={tone === "success" ? "check" : "alert"} />
    </div>
  )
}
