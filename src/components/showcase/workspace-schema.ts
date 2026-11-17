import { isValid, parseISO } from "date-fns"
import {
  CALENDARS,
  DEAL_STAGES,
  CONTACT_STAGES,
  type Appointment,
  type Contact,
  type Deal,
} from "./showcase-data"

export type DemoWorkspace = {
  contacts: Contact[]
  appointments: Appointment[]
  deals: Deal[]
}
export const DEMO_STORAGE_KEY = "naum-demo-workspace"
export const DEMO_STORAGE_VERSION = 1
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
const hasStrings = (value: Record<string, unknown>, keys: string[]) =>
  keys.every((key) => typeof value[key] === "string")
const isAmount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
const isDate = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  isValid(parseISO(value))
const isDateTime = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
  isValid(parseISO(value))
const includes = (values: readonly string[], value: unknown): value is string =>
  typeof value === "string" && values.includes(value)
const isContact = (value: unknown): value is Contact =>
  isRecord(value) &&
  hasStrings(value, ["id", "name", "company", "role", "email", "owner"]) &&
  includes(CONTACT_STAGES, value.stage) &&
  isAmount(value.value) &&
  isDate(value.lastContact) &&
  Array.isArray(value.notes) &&
  value.notes.every(
    (note) =>
      isRecord(note) && hasStrings(note, ["id", "text"]) && isDate(note.date),
  )
const isAppointment = (value: unknown): value is Appointment =>
  isRecord(value) &&
  hasStrings(value, ["id", "title", "description"]) &&
  includes(CALENDARS, value.calendar) &&
  typeof value.allDay === "boolean" &&
  (value.contactId === undefined || typeof value.contactId === "string") &&
  isDateTime(value.start) &&
  isDateTime(value.end) &&
  value.end > value.start
const isDeal = (value: unknown): value is Deal =>
  isRecord(value) &&
  hasStrings(value, ["id", "title", "contactId"]) &&
  isAmount(value.value) &&
  includes(DEAL_STAGES, value.stage)
const uniqueIds = (records: { id: string }[]) =>
  records.every((record) => record.id.length > 0) &&
  new Set(records.map((record) => record.id)).size === records.length

export const parseWorkspace = (raw: string): DemoWorkspace | null => {
  try {
    const value: unknown = JSON.parse(raw)
    if (
      !isRecord(value) ||
      value.version !== DEMO_STORAGE_VERSION ||
      !isRecord(value.data)
    )
      return null
    const data = value.data
    if (
      !Array.isArray(data.contacts) ||
      !data.contacts.every(isContact) ||
      !uniqueIds(data.contacts) ||
      !Array.isArray(data.appointments) ||
      !data.appointments.every(isAppointment) ||
      !uniqueIds(data.appointments) ||
      !Array.isArray(data.deals) ||
      !data.deals.every(isDeal) ||
      !uniqueIds(data.deals)
    )
      return null
    const contacts = new Set(data.contacts.map((contact) => contact.id))
    if (
      data.deals.some((deal) => !contacts.has(deal.contactId)) ||
      data.appointments.some(
        (event) => event.contactId && !contacts.has(event.contactId),
      )
    )
      return null
    return {
      contacts: data.contacts,
      appointments: data.appointments,
      deals: data.deals,
    }
  } catch {
    return null
  }
}
