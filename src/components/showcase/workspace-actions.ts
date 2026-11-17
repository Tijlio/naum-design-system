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
    activities: changed
      ? appendActivity(current, {
          contactId: contact.id,
          entityId: contact.id,
          kind: "contact",
          title: "Relationship changed",
          description: `${previous.stage} → ${contact.stage}`,
        })
      : current.activities,
  }
}
export const saveDealRecord = (
  current: DemoWorkspace,
  deal: Deal,
): DemoWorkspace => {
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
  const previous = current.tasks.find((entry) => entry.id === task.id)
  const changed =
    !previous ||
    (["title", "contactId", "dealId", "dueDate", "completed"] as const).some(
      (key) => previous[key] !== task[key],
    )
  return {
    ...current,
    tasks: upsertRecord(current.tasks, task),
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
    activities: appendActivity(current, {
      contactId: task.contactId,
      entityId: id,
      kind: "task",
      title: "Task deleted",
      description: task.title,
    }),
  }
}
