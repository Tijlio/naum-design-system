"use client"

import { useCallback, useRef } from "react"

// URL-driven editors may outlive or delete their launcher. Use the page action as fallback.
export const useRecordFocus = () => {
  const launcher = useRef<HTMLElement | null>(null)
  const captureFocus = useCallback(() => {
    launcher.current =
      document.activeElement instanceof HTMLElement &&
      document.activeElement.tabIndex >= 0
        ? document.activeElement
        : null
  }, [])
  const restoreFocus = useCallback(
    (): HTMLElement | false =>
      launcher.current?.isConnected
        ? launcher.current
        : (document.querySelector<HTMLElement>(
            '[data-slot="page-header-actions"] button',
          ) ?? false),
    [],
  )
  return { captureFocus, restoreFocus }
}
