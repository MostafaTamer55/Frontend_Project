import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { AuthProvider } from "./auth/AuthProvider"
import { AppErrorBoundary } from "./ui/AppErrorBoundary"
import { FrontendExperience } from "./ui/FrontendExperience"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <FrontendExperience>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FrontendExperience>
    </AppErrorBoundary>
  </React.StrictMode>,
)
