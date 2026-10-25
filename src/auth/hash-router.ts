import { useEffect, useState } from "react"

export type HashRoute = {
  path: string
  params: URLSearchParams
}

function readHash(): HashRoute {
  const raw = window.location.hash.slice(1) || "/login"
  const [path, query = ""] = raw.split("?")
  return {
    path: path.startsWith("/") ? path : `/${path}`,
    params: new URLSearchParams(query),
  }
}

export function navigate(path: string) {
  window.location.hash = path
}

export function useHashRoute() {
  const [route, setRoute] = useState(readHash)

  useEffect(() => {
    const onChange = () => setRoute(readHash())
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  return route
}
