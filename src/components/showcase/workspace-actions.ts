import {
  assertValid,
  validateDeal,
  validateTask,
  validateAppointment,
} from "./workspace-validation"
import type { Appointment, Contact, Deal } from "./showcase-data"
import type { DemoWorkspace } from "./workspace-schema"
import type { FollowUpTask, WorkspaceActivity } from "./tasks/task-data"
export const upsertRecord = <T extends { id: string }>(
  records: T[],
  record: T,
): T[] =>
  records.some((entry) => entry.id === record.id)
    ? records.map((entry) => (entry.id === record.id ? record : entry))
    : [...records, record]
const activity = (
  record: Omit<WorkspaceActivity, "id" | "timestamp">,
): WorkspaceActivity => ({
  ...record,
  id: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
})
const appendActivity = (
  current: DemoWorkspace,
  event: Omit<WorkspaceActivity, "id" | "timestamp">,
) => [...current.activities, activity(event)]
export const saveContactRecord = (
  current: DemoWorkspace,
  contact: Contact,
): DemoWorkspace => {
  const previous = current.contacts.find((entry) => entry.id === contact.id)
  const changed = previous && previous.stage !== contact.stage
  return {
    ...current,
    contacts: upsertRecord(current.contacts, contact),
    activities:
      !previous || changed
        ? appendActivity(current, {
            contactId: contact.id,
            entityId: contact.id,
            kind: "contact",
            title: previous ? "Relationship changed" : "Contact added",
            description: previous
              ? `${previous.stage} → ${contact.stage}`
              : contact.name,
          })
        : current.activities,
  }
}
export const saveDealRecord = (
  current: DemoWorkspace,
  deal: Deal,
): DemoWorkspace => {
  assertValid(validateDeal(deal, current))
  const previous = current.deals.find((entry) => entry.id === deal.id)
  const changed =
    !previous ||
    previous.stage !== deal.stage ||
    previous.title !== deal.title ||
    previous.value !== deal.value ||
    previous.contactId !== deal.contactId
  return {
    ...current,
    deals: upsertRecord(current.deals, deal),
    tasks: current.tasks.map((task) =>
      task.dealId === deal.id ? { ...task, contactId: deal.contactId } : task,
    ),
    appointments: current.appointments.map((appointment) =>
      appointment.dealId === deal.id
        ? { ...appointment, contactId: deal.contactId }
        : appointment,
    ),
    activities: changed
      ? appendActivity(current, {
          contactId: deal.contactId,
          entityId: deal.id,
          kind: "opportunity",
          title: !previous
            ? "Opportunity added"
            : previous.stage !== deal.stage
              ? `Opportunity moved to ${deal.stage}`
              : "Opportunity updated",
          description: `${deal.title}${previous && previous.stage !== deal.stage ? ` · ${previous.stage} → ${deal.stage}` : ""}`,
        })
      : current.activities,
  }
}
export const removeDealRecord = (
  current: DemoWorkspace,
  id: string,
): DemoWorkspace => {
  const deal = current.deals.find((entry) => entry.id === id)
  if (!deal) return current
  return {
    ...current,
    deals: current.deals.filter((entry) => entry.id !== id),
    tasks: current.tasks.map((task) =>
      task.dealId === id ? { ...task, dealId: undefined } : task,
    ),
    appointments: current.appointments.map((appointment) =>
      appointment.dealId === id
        ? { ...appointment, dealId: undefined }
        : appointment,
    ),
    activities: appendActivity(current, {
      contactId: deal.contactId,
      entityId: id,
      kind: "opportunity",
      title: "Opportunity deleted",
      description: deal.title,
    }),
  }
}
export const saveAppointmentRecord = (
  current: DemoWorkspace,
  appointment: Appointment,
): DemoWorkspace => {
  assertValid(validateAppointment(appointment, current))
  const previous = current.appointments.find(
    (entry) => entry.id === appointment.id,
  )
  const changed =
    !previous ||
    (
      [
        "title",
        "start",
        "end",
        "allDay",
        "calendar",
        "contactId",
        "dealId",
        "taskId",
        "description",
      ] as const
    ).some((key) => previous[key] !== appointment[key])
  return {
    ...current,
    appointments: upsertRecord(current.appointments, appointment),
    activities:
      appointment.contactId && changed
        ? appendActivity(current, {
            contactId: appointment.contactId,
            entityId: appointment.id,
            kind: "appointment",
            title: previous ? "Appointment updated" : "Appointment added",
            description: appointment.title,
          })
        : current.activities,
  }
}
export const removeAppointmentRecord = (
  current: DemoWorkspace,
  id: string,
): DemoWorkspace => {
  const event = current.appointments.find((entry) => entry.id === id)
  return {
    ...current,
    appointments: current.appointments.filter((entry) => entry.id !== id),
    activities: event?.contactId
      ? appendActivity(current, {
          contactId: event.contactId,
          entityId: id,
          kind: "appointment",
          title: "Appointment deleted",
          description: event.title,
        })
      : current.activities,
  }
}
export const saveTaskRecord = (
  current: DemoWorkspace,
  task: FollowUpTask,
): DemoWorkspace => {
  assertValid(validateTask(task, current))
  const previous = current.tasks.find((entry) => entry.id === task.id)
  const changed =
    !previous ||
    (["title", "contactId", "dealId", "dueDate", "completed"] as const).some(
      (key) => previous[key] !== task[key],
    )
  return {
    ...current,
    tasks: upsertRecord(current.tasks, task),
    appointments: current.appointments.map((appointment) =>
      appointment.taskId === task.id
        ? { ...appointment, contactId: task.contactId, dealId: task.dealId }
        : appointment,
    ),
    activities: changed
      ? appendActivity(current, {
          contactId: task.contactId,
          entityId: task.id,
          kind: "task",
          title: !previous
            ? "Task added"
            : previous.completed !== task.completed
              ? task.completed
                ? "Task completed"
                : "Task reopened"
              : "Task updated",
          description: task.title,
        })
      : current.activities,
  }
}
export const removeTaskRecord = (
  current: DemoWorkspace,
  id: string,
): DemoWorkspace => {
  const task = current.tasks.find((entry) => entry.id === id)
  if (!task) return current
  return {
    ...current,
    tasks: current.tasks.filter((entry) => entry.id !== id),
    appointments: current.appointments.map((appointment) =>
      appointment.taskId === id
        ? { ...appointment, taskId: undefined }
        : appointment,
    ),
    activities: appendActivity(current, {
      contactId: task.contactId,
      entityId: id,
      kind: "task",
      title: "Task deleted",
      description: task.title,
    }),
  }
}

// Restore only links that are still detached; never overwrite intervening edits.
export const restoreDealRecord = (
  current: DemoWorkspace,
  before: DemoWorkspace,
  id: string,
): DemoWorkspace => {
  const deal = before.deals.find((entry) => entry.id === id)
  if (!deal || current.deals.some((entry) => entry.id === id)) return current
  const restored = saveDealRecord(current, deal)
  return {
    ...restored,
    tasks: restored.tasks.map((task) =>
      !task.dealId &&
      task.contactId === deal.contactId &&
      before.tasks.some((entry) => entry.id === task.id && entry.dealId === id)
        ? { ...task, dealId: id }
        : task,
    ),
    appointments: restored.appointments.map((appointment) =>
      !appointment.dealId &&
      appointment.contactId === deal.contactId &&
      before.appointments.some(
        (entry) => entry.id === appointment.id && entry.dealId === id,
      )
        ? { ...appointment, dealId: id }
        : appointment,
    ),
  }
}
export const restoreTaskRecord = (
  current: DemoWorkspace,
  before: DemoWorkspace,
  id: string,
): DemoWorkspace => {
  const task = before.tasks.find((entry) => entry.id === id)
  if (!task || current.tasks.some((entry) => entry.id === id)) return current
  const restoredTask = {
    ...task,
    dealId: current.deals.some(
      (deal) => deal.id === task.dealId && deal.contactId === task.contactId,
    )
      ? task.dealId
      : undefined,
  }
  const restored = saveTaskRecord(current, restoredTask)
  return {
    ...restored,
    appointments: restored.appointments.map((appointment) =>
      !appointment.taskId &&
      appointment.contactId === restoredTask.contactId &&
      appointment.dealId === restoredTask.dealId &&
      before.appointments.some(
        (entry) => entry.id === appointment.id && entry.taskId === id,
      )
        ? { ...appointment, taskId: id }
        : appointment,
    ),
  }
}
export const restoreAppointmentRecord = (
  current: DemoWorkspace,
  appointment: Appointment,
): DemoWorkspace => {
  if (current.appointments.some((entry) => entry.id === appointment.id))
    return current
  const task = current.tasks.find(
    (task) =>
      task.id === appointment.taskId &&
      task.contactId === appointment.contactId,
  )
  const dealId =
    task?.dealId ??
    (current.deals.some(
      (deal) =>
        deal.id === appointment.dealId &&
        deal.contactId === appointment.contactId,
    )
      ? appointment.dealId
      : undefined)
  return saveAppointmentRecord(current, {
    ...appointment,
    dealId,
    taskId: task?.id,
  })
}
