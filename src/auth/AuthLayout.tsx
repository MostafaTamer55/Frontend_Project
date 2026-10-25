import type { ReactNode } from "react"
import { useFrontendPreferences } from "../ui/FrontendExperience"

type Props = {
  children: ReactNode
  compact?: boolean
}

export function AuthLayout({ children, compact = false }: Props) {
  const { locale } = useFrontendPreferences()
  const arabic = locale === "ar"

  return (
    <main className={`auth-page ${compact ? "auth-page--compact" : ""}`}>
      <div className="auth-grid">
        <section
          className="brand-panel"
          aria-label={arabic ? "معلومات المقرر" : "Course information"}
        >
          <img className="brand-panel__base" src="/assets/9ea97.svg" alt="" />
          <img
            className="brand-panel__texture"
            src="/assets/34654.svg"
            alt=""
          />
          <div className="brand-panel__content">
            <p className="brand-panel__eyebrow">
              {arabic
                ? "هندسة الإلكترونيات والاتصالات"
                : "Electronics and Communications Engineering"}
            </p>
            <div className="brand-panel__footer">
              <h1>
                {arabic ? "معالجة الإشارات" : "Digital Signal"}
                <br />
                {arabic ? "الرقمية" : "Processing"}
              </h1>
              <div className="course-tags">
                <span>DSP</span>
                <span>ECE 28</span>
              </div>
              <p className="instructor-label">
                {arabic ? "المحاضر" : "Instructor"}
              </p>
              <p className="instructor-name">
                {arabic ? "د. عبير توكل" : "Dr. Abeer Tawakol"}
              </p>
            </div>
          </div>
        </section>
        <section className="auth-card" id="auth-content" tabIndex={-1}>
          {children}
        </section>
      </div>
    </main>
  )
}
