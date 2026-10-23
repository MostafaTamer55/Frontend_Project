import { Component, type ErrorInfo, type ReactNode } from "react"

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Application render failed", error, info)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const arabic = document.documentElement.lang === "ar"
    return (
      <main className="fatal-error">
        <section className="fatal-error__card" role="alert">
          <p className="fatal-error__eyebrow">
            {arabic ? "خطأ غير متوقع" : "Unexpected error"}
          </p>
          <h1>
            {arabic
              ? "تعذر عرض الصفحة بشكل صحيح"
              : "The page couldn’t be displayed"}
          </h1>
          <p>
            {arabic
              ? "أعد تحميل الصفحة. لن يتم حفظ أو إرسال أي كلمة مرور."
              : "Reload the page to try again. No password has been saved or sent."}
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            {arabic ? "إعادة تحميل الصفحة" : "Reload page"}
          </button>
        </section>
      </main>
    )
  }
}
