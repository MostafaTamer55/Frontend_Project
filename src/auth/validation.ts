export type SignupErrors = Partial<Record<"name" | "email" | "password" | "confirmation", string>>

export function validateEmail(email: string) {
  if (!email.trim()) return "Enter your email address"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Enter a valid email address"
  return ""
}

export function isKnownDemoEmail(email: string) {
  return email.trim().toLowerCase() === "demo@example.com"
}

export function getPasswordStrength(password: string, email = "") {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
    { label: "Symbol", met: /[^A-Za-z0-9]/.test(password) },
    {
      label: "Different from email",
      met:
        !email.trim() || password.toLowerCase() !== email.trim().toLowerCase(),
    },
  ]
  const score = checks.filter((check) => check.met).length
  const label = score <= 2 ? "Weak" : score <= 4 ? "Fair" : "Strong"
  return { checks, score, label }
}

function validatePassword(password: string, email = "") {
  const firstMissing = getPasswordStrength(password, email).checks.find(
    (check) => !check.met,
  )
  return firstMissing ? `Add: ${firstMissing.label.toLowerCase()}` : ""
}

export function validateSignup(values: {
  name: string
  email: string
  password: string
  confirmation: string
}): SignupErrors {
  const errors: SignupErrors = {}
  if (!values.name.trim()) errors.name = "Enter your full name"
  const emailError = validateEmail(values.email)
  if (emailError) errors.email = emailError
  const passwordError = validatePassword(values.password, values.email)
  if (passwordError) errors.password = passwordError
  if (values.password !== values.confirmation)
    errors.confirmation = "Passwords don’t match"
  return errors
}

export function validateNewPassword(password: string, confirmation: string) {
  const passwordError = validatePassword(password)
  if (passwordError) return passwordError
  if (password !== confirmation) return "Passwords don’t match"
  return ""
}
