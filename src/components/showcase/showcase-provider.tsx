"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  INITIAL_CONTACTS,
  INITIAL_APPOINTMENTS,
  type Contact,
  type Appointment,
} from "./showcase-data"

type Workspace = {
  contacts: Contact[]
  saveContact: (contact: Contact) => void
  archiveContacts: (ids: string[]) => void
  appointments: Appointment[]
  saveAppointment: (appointment: Appointment) => void
  removeAppointment: (id: string) => void
}
const WorkspaceContext = createContext<Workspace | null>(null)

export const ShowcaseProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const saveContact = (contact: Contact) =>
    setContacts((current) =>
      current.some((entry) => entry.id === contact.id)
        ? current.map((entry) => (entry.id === contact.id ? contact : entry))
        : [contact, ...current],
    )
  const archiveContacts = (ids: string[]) =>
    setContacts((current) =>
      current.map((contact) =>
        ids.includes(contact.id) ? { ...contact, stage: "Archived" } : contact,
      ),
    )
  const saveAppointment = (appointment: Appointment) =>
    setAppointments((current) =>
      current.some((entry) => entry.id === appointment.id)
        ? current.map((entry) =>
            entry.id === appointment.id ? appointment : entry,
          )
        : [...current, appointment],
    )
  const removeAppointment = (id: string) =>
    setAppointments((current) =>
      current.filter((appointment) => appointment.id !== id),
    )
  return (
    <WorkspaceContext.Provider
      value={{
        contacts,
        saveContact,
        archiveContacts,
        appointments,
        saveAppointment,
        removeAppointment,
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
