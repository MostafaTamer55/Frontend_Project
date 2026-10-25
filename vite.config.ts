import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
  },
  server: {
    host: "0.0.0.0",
    // Use Vite's conventional default and fall back to the next free port
    // instead of failing when another process already owns this port.
    port: Number(process.env.PORT || 5173),
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT || 4173),
  },
})
