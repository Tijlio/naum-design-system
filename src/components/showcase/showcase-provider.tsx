"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
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
  resetDemo: () => void
  persistence: Persistence
}
const WorkspaceContext = createContext<Workspace | null>(null)
const upsert = <T extends { id: string }>(records: T[], record: T): T[] =>
  records.some((entry) => entry.id === record.id)
    ? records.map((entry) => (entry.id === record.id ? record : entry))
    : [...records, record]

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
          store.update((current) => ({
            ...current,
            contacts: upsert(current.contacts, contact),
          })),
        archiveContacts: (ids) =>
          store.update((current) => ({
            ...current,
            contacts: current.contacts.map((contact) =>
              ids.includes(contact.id)
                ? { ...contact, stage: "Archived" }
                : contact,
            ),
          })),
        saveAppointment: (appointment) =>
          store.update((current) => ({
            ...current,
            appointments: upsert(current.appointments, appointment),
          })),
        removeAppointment: (id) =>
          store.update((current) => ({
            ...current,
            appointments: current.appointments.filter(
              (appointment) => appointment.id !== id,
            ),
          })),
        saveDeal: (deal) =>
          store.update((current) => ({
            ...current,
            deals: upsert(current.deals, deal),
          })),
        removeDeal: (id) =>
          store.update((current) => ({
            ...current,
            deals: current.deals.filter((deal) => deal.id !== id),
          })),
        saveView: (view) =>
          store.update((current) => ({
            ...current,
            savedViews: upsert(current.savedViews, view),
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
