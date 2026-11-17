import type { Appointment, Contact, Deal } from "../showcase-data"
import type { FollowUpTask, WorkspaceActivity } from "../tasks/task-data"
type ContactTimelineEntry = {
  id: string
  timestamp: string
  kind: WorkspaceActivity["kind"] | "note"
  title: string
  description?: string
  href?: string
}
export const getContactTimeline = (
  contact: Contact,
  appointments: Appointment[],
  activities: WorkspaceActivity[],
  tasks: FollowUpTask[],
  deals: Deal[],
): ContactTimelineEntry[] =>
  [
    ...contact.notes.map((note, index) => ({
      sequence: -index,
      id: `note-${note.id}`,
      timestamp: note.date,
      kind: "note" as const,
      title: "Note added",
      description: note.text,
    })),
    ...appointments
      .filter((event) => event.contactId === contact.id)
      .map((event) => ({
        sequence: 0,
        id: `scheduled-${event.id}`,
        timestamp: event.start,
        kind: "appointment" as const,
        title: event.title,
        description: event.allDay
          ? "All-day appointment"
          : "Scheduled appointment",
        href: `/showcase/calendar?event=${event.id}`,
      })),
    ...activities
      .filter((event) => event.contactId === contact.id)
      .map((event, index) => ({
        ...event,
        sequence: index + 1,
        href:
          event.entityId &&
          event.kind === "task" &&
          tasks.some((task) => task.id === event.entityId)
            ? `/showcase/crm/tasks?task=${event.entityId}`
            : event.entityId &&
                event.kind === "opportunity" &&
                deals.some((deal) => deal.id === event.entityId)
              ? `/showcase/crm/pipeline?deal=${event.entityId}`
              : event.entityId &&
                  event.kind === "appointment" &&
                  appointments.some(
                    (appointment) => appointment.id === event.entityId,
                  )
                ? `/showcase/calendar?event=${event.entityId}`
                : undefined,
      })),
  ].sort(
    (a, b) =>
      parseTime(b.timestamp) - parseTime(a.timestamp) ||
      b.sequence - a.sequence,
  )
const parseTime = (value: string) => new Date(value).getTime()
