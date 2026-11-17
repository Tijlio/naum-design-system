import { INITIAL_ACTIVITIES, INITIAL_TASKS } from "./tasks/task-data"
import { DEALS, INITIAL_APPOINTMENTS, INITIAL_CONTACTS } from "./showcase-data"
import {
  DEMO_STORAGE_KEY,
  DEMO_STORAGE_VERSION,
  parseWorkspace,
  type DemoWorkspace,
} from "./workspace-schema"

export type DemoStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">
export type Persistence = "loading" | "local" | "session"
type Snapshot = { data: DemoWorkspace; persistence: Persistence }
const createDemoData = (): DemoWorkspace =>
  structuredClone({
    contacts: INITIAL_CONTACTS,
    appointments: INITIAL_APPOINTMENTS,
    deals: DEALS,
    savedViews: [],
    tasks: INITIAL_TASKS,
    activities: INITIAL_ACTIVITIES,
  })

// One store per mounted provider. Browser storage is only read after hydration.
export const createWorkspaceStore = (getStorage: () => DemoStorage) => {
  const initial: Snapshot = { data: createDemoData(), persistence: "loading" }
  let snapshot = initial
  let restored = false
  const listeners = new Set<() => void>()
  const emit = (next: Snapshot) => {
    snapshot = next
    listeners.forEach((listener) => listener())
  }
  const restore = () => {
    if (restored) return
    restored = true
    try {
      const raw = getStorage().getItem(DEMO_STORAGE_KEY)
      const stored = raw ? parseWorkspace(raw) : null
      // Invalid/future payloads remain untouched until an explicit update/reset.
      emit({
        data: stored ?? initial.data,
        persistence: raw && !stored ? "session" : "local",
      })
    } catch {
      emit({ data: initial.data, persistence: "session" })
    }
  }
  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
    restore,
    sync: (raw: string | null) => {
      restored = true
      if (raw === null) {
        emit({ data: createDemoData(), persistence: "local" })
        return
      }
      const data = parseWorkspace(raw)
      emit({
        data: data ?? snapshot.data,
        persistence: data ? "local" : "session",
      })
    },
    update: (update: (data: DemoWorkspace) => DemoWorkspace) => {
      restore()
      const data = update(snapshot.data)
      let persistence: Persistence = "local"
      try {
        getStorage().setItem(
          DEMO_STORAGE_KEY,
          JSON.stringify({ version: DEMO_STORAGE_VERSION, data }),
        )
      } catch {
        persistence = "session"
      }
      emit({ data, persistence })
    },
    reset: () => {
      restored = true
      let persistence: Persistence = "local"
      try {
        getStorage().removeItem(DEMO_STORAGE_KEY)
      } catch {
        persistence = "session"
      }
      emit({ data: createDemoData(), persistence })
    },
  }
}
