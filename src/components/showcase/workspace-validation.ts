import { isValid, parseISO } from "date-fns"
import {
  CALENDARS,
  CONTACT_STAGES,
  DEAL_STAGES,
  type Appointment,
  type Contact,
  type Deal,
} from "./showcase-data"
import type { FollowUpTask } from "./tasks/task-data"
import type { DemoWorkspace } from "./workspace-schema"

export type WorkspaceFieldErrors = Record<string, string>
type Relations = Pick<DemoWorkspace, "contacts" | "deals" | "tasks">
export const isLocalDate = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  isValid(parseISO(value))
export const isLocalDateTime = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
  isValid(parseISO(value))
const text = (value: string, maximum: number) =>
  Boolean(value.trim()) && value.trim().length <= maximum

export const validateRelationships = (
  current: Relations,
  context: { contactId?: string; dealId?: string; taskId?: string },
): WorkspaceFieldErrors => {
  const errors: WorkspaceFieldErrors = {}
  if (
    context.contactId &&
    !current.contacts.some((contact) => contact.id === context.contactId)
  )
    errors.contact =
      "This contact is no longer available. Choose another contact."
  const deal = current.deals.find((deal) => deal.id === context.dealId)
  if (context.dealId && (!deal || deal.contactId !== context.contactId))
    errors.deal = "Choose an opportunity belonging to this contact."
  const task = current.tasks.find((task) => task.id === context.taskId)
  if (
    context.taskId &&
    (!task ||
      task.contactId !== context.contactId ||
      task.dealId !== context.dealId)
  )
    errors.task = "Choose a task belonging to this contact and opportunity."
  return errors
}
export const validateContact = (contact: Contact): WorkspaceFieldErrors => ({
  ...(!text(contact.name, 100) && {
    name: "Enter a name of up to 100 characters.",
  }),
  ...(!text(contact.company, 100) && {
    company: "Enter a company of up to 100 characters.",
  }),
  ...(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) && {
    email: "Enter a valid email address.",
  }),
  ...(!CONTACT_STAGES.includes(contact.stage) && {
    stage: "Choose a relationship.",
  }),
})
export const validateDeal = (
  deal: Deal,
  current: Relations,
): WorkspaceFieldErrors => ({
  ...validateRelationships(current, deal),
  ...(!text(deal.title, 160) && {
    title: "Enter a title of up to 160 characters.",
  }),
  ...(!Number.isFinite(deal.value) || deal.value < 0 || deal.value > 1000000000
    ? { value: "Enter a value between €0 and €1,000,000,000." }
    : {}),
  ...(!deal.contactId && { contact: "Choose a contact." }),
  ...(!DEAL_STAGES.includes(deal.stage) && { stage: "Choose a stage." }),
})
export const validateTask = (
  task: FollowUpTask,
  current: Relations,
): WorkspaceFieldErrors => ({
  ...validateRelationships(current, task),
  ...(!text(task.title, 160) && {
    title: "Enter a title of up to 160 characters.",
  }),
  ...(!isLocalDate(task.dueDate) && { due: "Choose a valid due date." }),
  ...(!task.contactId && { contact: "Choose a contact." }),
})
export const validateAppointment = (
  appointment: Appointment,
  current: Relations,
): WorkspaceFieldErrors => ({
  ...validateRelationships(current, appointment),
  ...(!text(appointment.title, 120) && {
    title: "Enter a title of up to 120 characters.",
  }),
  ...(appointment.description.length > 2000 && {
    description: "Use at most 2,000 characters.",
  }),
  ...(!isLocalDateTime(appointment.start) && {
    start: "Choose a valid start.",
  }),
  ...(!isLocalDateTime(appointment.end) || appointment.end <= appointment.start
    ? { end: "Choose an end after the start." }
    : {}),
  ...(!CALENDARS.includes(appointment.calendar) && {
    calendar: "Choose a calendar.",
  }),
})
export class WorkspaceValidationError extends Error {
  constructor(public readonly fields: WorkspaceFieldErrors) {
    super(Object.values(fields)[0] ?? "Check the entered details.")
    this.name = "WorkspaceValidationError"
  }
}
export const assertValid = (errors: WorkspaceFieldErrors) => {
  if (Object.keys(errors).length) throw new WorkspaceValidationError(errors)
}
