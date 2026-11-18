import { type FollowUpTask, type WorkspaceActivity } from "./tasks/task-data"
import { isWorkspaceSavedView, type WorkspaceSavedView } from "./table-views"
import {
  isLocalDate,
  isLocalDateTime,
  validateRelationships,
} from "./workspace-validation"
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
  savedViews: WorkspaceSavedView[]
  tasks: FollowUpTask[]
  activities: WorkspaceActivity[]
}
export const DEMO_STORAGE_KEY = "naum-demo-workspace"
export const DEMO_STORAGE_VERSION = 4
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
const hasStrings = (value: Record<string, unknown>, keys: string[]) =>
  keys.every((key) => typeof value[key] === "string")
const isAmount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
const includes = (values: readonly string[], value: unknown): value is string =>
  typeof value === "string" && values.includes(value)
const isContact = (value: unknown): value is Contact =>
  isRecord(value) &&
  hasStrings(value, ["id", "name", "company", "role", "email", "owner"]) &&
  includes(CONTACT_STAGES, value.stage) &&
  isAmount(value.value) &&
  isLocalDate(value.lastContact) &&
  Array.isArray(value.notes) &&
  value.notes.every(
    (note) =>
      isRecord(note) &&
      hasStrings(note, ["id", "text"]) &&
      isLocalDate(note.date),
  )
const isAppointment = (value: unknown): value is Appointment =>
  isRecord(value) &&
  hasStrings(value, ["id", "title", "description"]) &&
  includes(CALENDARS, value.calendar) &&
  typeof value.allDay === "boolean" &&
  (value.contactId === undefined || typeof value.contactId === "string") &&
  (value.dealId === undefined || typeof value.dealId === "string") &&
  (value.taskId === undefined || typeof value.taskId === "string") &&
  isLocalDateTime(value.start) &&
  isLocalDateTime(value.end) &&
  value.end > value.start
const isDeal = (value: unknown): value is Deal =>
  isRecord(value) &&
  hasStrings(value, ["id", "title", "contactId"]) &&
  isAmount(value.value) &&
  includes(DEAL_STAGES, value.stage)
const isTask = (value: unknown): value is FollowUpTask =>
  isRecord(value) &&
  hasStrings(value, ["id", "title", "contactId"]) &&
  typeof value.title === "string" &&
  value.title.trim().length > 0 &&
  isLocalDate(value.dueDate) &&
  typeof value.completed === "boolean" &&
  (value.dealId === undefined || typeof value.dealId === "string")
const isActivity = (value: unknown): value is WorkspaceActivity =>
  isRecord(value) &&
  hasStrings(value, ["id", "contactId", "title", "description"]) &&
  includes(["contact", "opportunity", "appointment", "task"], value.kind) &&
  typeof value.timestamp === "string" &&
  isValid(parseISO(value.timestamp)) &&
  (value.entityId === undefined || typeof value.entityId === "string")
const uniqueIds = (records: { id: string }[]) =>
  records.every((record) => record.id.length > 0) &&
  new Set(records.map((record) => record.id)).size === records.length

export const parseWorkspace = (raw: string): DemoWorkspace | null => {
  try {
    const value: unknown = JSON.parse(raw)
    if (
      !isRecord(value) ||
      (value.version !== 1 &&
        value.version !== 2 &&
        value.version !== 3 &&
        value.version !== DEMO_STORAGE_VERSION) ||
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
    const savedViews = value.version === 1 ? [] : data.savedViews
    if (
      !Array.isArray(savedViews) ||
      !savedViews.every(isWorkspaceSavedView) ||
      !uniqueIds(savedViews)
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
    const deals = new Map(data.deals.map((deal) => [deal.id, deal]))
    const legacy = value.version === 1 || value.version === 2
    const tasks = legacy ? [] : data.tasks
    const activities = legacy ? [] : data.activities
    if (
      !Array.isArray(tasks) ||
      !tasks.every(isTask) ||
      !uniqueIds(tasks) ||
      tasks.some(
        (task) =>
          !contacts.has(task.contactId) ||
          (task.dealId && deals.get(task.dealId)?.contactId !== task.contactId),
      ) ||
      !Array.isArray(activities) ||
      !activities.every(isActivity) ||
      !uniqueIds(activities) ||
      activities.some((event) => !contacts.has(event.contactId))
    )
      return null
    const relations = { contacts: data.contacts, deals: data.deals, tasks }
    if (
      data.appointments.some(
        (appointment) =>
          Object.keys(validateRelationships(relations, appointment)).length,
      )
    )
      return null
    return {
      contacts: data.contacts,
      appointments: data.appointments,
      deals: data.deals,
      savedViews,
      tasks,
      activities,
    }
  } catch {
    return null
  }
}
