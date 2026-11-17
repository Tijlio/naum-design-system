"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import {
  saveContactRecord,
  saveDealRecord,
  removeDealRecord,
  saveAppointmentRecord,
  removeAppointmentRecord,
  saveTaskRecord,
  removeTaskRecord,
  upsertRecord,
} from "./workspace-actions"
import type { FollowUpTask } from "./tasks/task-data"
import type { WorkspaceSavedView } from "./table-views"
import type { Appointment, Contact, Deal } from "./showcase-data"
import { createWorkspaceStore, type Persistence } from "./workspace-storage"
import { DEMO_STORAGE_KEY, type DemoWorkspace } from "./workspace-schema"

type Workspace = DemoWorkspace & {
  saveContact: (contact: Contact) => void
  archiveContacts: (ids: string[]) => void
  saveAppointment: (appointment: Appointment) => void
  removeAppointment: (id: string) => void
  saveDeal: (deal: Deal) => void
  removeDeal: (id: string) => void
  saveView: (view: WorkspaceSavedView) => void
  removeView: (id: string) => void
  saveTask: (task: FollowUpTask) => void
  removeTask: (id: string) => void
  resetDemo: () => void
  persistence: Persistence
}
const WorkspaceContext = createContext<Workspace | null>(null)
export const ShowcaseProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() =>
    createWorkspaceStore(() => window.localStorage),
  )
  const { data, persistence } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  )
  useEffect(() => {
    store.restore()
    const synchronize = (event: StorageEvent) => {
      try {
        if (
          (event.key === DEMO_STORAGE_KEY || event.key === null) &&
          event.storageArea === window.localStorage
        )
          store.sync(event.newValue)
      } catch {
        /* A blocked storage getter must not disable the workspace. */
      }
    }
    window.addEventListener("storage", synchronize)
    return () => window.removeEventListener("storage", synchronize)
  }, [store])
  return (
    <WorkspaceContext.Provider
      value={{
        ...data,
        persistence,
        saveContact: (contact) =>
          store.update((current) => saveContactRecord(current, contact)),
        archiveContacts: (ids) =>
          store.update((current) =>
            ids.reduce((next, id) => {
              const contact = next.contacts.find((contact) => contact.id === id)
              return contact
                ? saveContactRecord(next, { ...contact, stage: "Archived" })
                : next
            }, current),
          ),
        saveAppointment: (appointment) =>
          store.update((current) =>
            saveAppointmentRecord(current, appointment),
          ),
        removeAppointment: (id) =>
          store.update((current) => removeAppointmentRecord(current, id)),
        saveDeal: (deal) =>
          store.update((current) => saveDealRecord(current, deal)),
        removeDeal: (id) =>
          store.update((current) => removeDealRecord(current, id)),
        saveTask: (task) =>
          store.update((current) => saveTaskRecord(current, task)),
        removeTask: (id) =>
          store.update((current) => removeTaskRecord(current, id)),
        saveView: (view) =>
          store.update((current) => ({
            ...current,
            savedViews: upsertRecord(current.savedViews, view),
          })),
        removeView: (id) =>
          store.update((current) => ({
            ...current,
            savedViews: current.savedViews.filter((view) => view.id !== id),
          })),
        resetDemo: store.reset,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useShowcase = () => {
  const workspace = useContext(WorkspaceContext)
  if (!workspace)
    throw new Error("Showcase components require ShowcaseProvider")
  return workspace
}
