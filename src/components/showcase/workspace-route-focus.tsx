"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export const WorkspaceRouteFocus = () => {
  const pathname = usePathname()
  const previousPath = useRef(pathname)
  const previousHeading = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const changed = previousPath.current !== pathname
    previousPath.current = pathname
    const oldHeading = previousHeading.current
    const update = () => {
      const heading = document.querySelector<HTMLElement>(
        '[data-slot="app-page"] [data-slot="page-header"] h1',
      )
      if (!heading || (changed && heading === oldHeading)) return false
      previousHeading.current = heading
      // Record links hand focus to their editor after local data loads.
      const params = new URLSearchParams(window.location.search)
      if (
        changed &&
        !["contact", "deal", "task", "event"].some((key) => params.has(key))
      ) {
        heading.tabIndex = -1
        heading.focus()
      }
      return true
    }
    if (update()) return
    const observer = new MutationObserver(() => {
      if (update()) observer.disconnect()
    })
    observer.observe(document.body, { subtree: true, childList: true })
    return () => observer.disconnect()
  }, [pathname])

  return null
}
