"use client"

import { useSyncExternalStore } from "react"
import { format, parseISO } from "date-fns"
import { DEMO_DATE } from "../showcase-data"

const subscribe = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 60_000)
  return () => window.clearInterval(timer)
}
const getSnapshot = () => format(new Date(), "yyyy-MM-dd'T'HH:mm")
const getServerSnapshot = () => `${DEMO_DATE}T00:00`

// Minute precision provides a cached snapshot and keeps server markup stable
// across time zones. The local clock takes over after hydration.
export const useCalendarClock = () =>
  parseISO(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot))
