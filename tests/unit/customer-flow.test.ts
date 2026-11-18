import { expect, it } from "vitest"
import { createWorkspaceStore } from "@/components/showcase/workspace-storage"
import {
  DEMO_STORAGE_VERSION,
  parseWorkspace,
} from "@/components/showcase/workspace-schema"
import {
  removeDealRecord,
  removeAppointmentRecord,
  restoreAppointmentRecord,
  removeTaskRecord,
  restoreDealRecord,
  restoreTaskRecord,
  saveAppointmentRecord,
  saveDealRecord,
  saveTaskRecord,
} from "@/components/showcase/workspace-actions"
const initial = () =>
  createWorkspaceStore(() => {
    throw new Error("No storage")
  }).getSnapshot().data
const chain = () => {
  const data = initial()
  return saveAppointmentRecord(data, {
    id: "linked-event",
    title: "Confirm rollout",
    description: "",
    calendar: "Sales",
    allDay: false,
    start: "2026-11-18T09:00",
    end: "2026-11-18T10:00",
    contactId: "c1",
    dealId: "d1",
    taskId: "t2",
  })
}
const roundTrip = (data: ReturnType<typeof initial>) =>
  parseWorkspace(JSON.stringify({ version: DEMO_STORAGE_VERSION, data }))
it("persists a complete chain and keeps its contact consistent when the opportunity moves", () => {
  const data = chain()
  const deal = data.deals.find((deal) => deal.id === "d1")
  if (!deal) throw new Error("Missing fixture")
  const moved = saveDealRecord(data, { ...deal, contactId: "c2" })
  expect(moved.tasks.find((task) => task.id === "t2")?.contactId).toBe("c2")
  expect(
    moved.appointments.find((event) => event.id === "linked-event"),
  ).toMatchObject({ contactId: "c2", taskId: "t2", dealId: "d1" })
  expect(roundTrip(moved)).toEqual(moved)
})
it("rejects stale and cross-contact relationships without modifying records", () => {
  const data = chain(),
    original = JSON.stringify(data)
  const event = data.appointments.find((event) => event.id === "linked-event")
  if (!event) throw new Error("Missing fixture")
  expect(() =>
    saveAppointmentRecord(data, { ...event, contactId: "c2" }),
  ).toThrow("Choose an opportunity")
  expect(() =>
    saveTaskRecord(data, { ...data.tasks[0], dealId: "deleted" }),
  ).toThrow("Choose an opportunity")
  expect(JSON.stringify(data)).toBe(original)
  expect(
    roundTrip({ ...data, appointments: [{ ...event, taskId: "missing" }] }),
  ).toBeNull()
})
it("undo restores detached relationships, including task-to-appointment links", () => {
  const before = chain()
  const deleted = removeDealRecord(before, "d1")
  expect(
    deleted.appointments.find((event) => event.id === "linked-event")?.dealId,
  ).toBeUndefined()
  const restored = restoreDealRecord(deleted, before, "d1")
  expect(restored.tasks.find((task) => task.id === "t2")?.dealId).toBe("d1")
  expect(
    restored.appointments.find((event) => event.id === "linked-event")?.dealId,
  ).toBe("d1")
  expect(roundTrip(restored)).not.toBeNull()
  const withoutTask = removeTaskRecord(restored, "t2")
  expect(
    withoutTask.appointments.find((event) => event.id === "linked-event")
      ?.taskId,
  ).toBeUndefined()
  const restoredTask = restoreTaskRecord(withoutTask, restored, "t2")
  expect(
    restoredTask.appointments.find((event) => event.id === "linked-event")
      ?.taskId,
  ).toBe("t2")
  expect(roundTrip(restoredTask)).not.toBeNull()
})
it("undo preserves edits made after deletion rather than replacing the workspace", () => {
  const before = chain()
  const deleted = removeDealRecord(before, "d1")
  const task = deleted.tasks.find((task) => task.id === "t2")
  if (!task) throw new Error("Missing fixture")
  const edited = saveTaskRecord(deleted, {
    ...task,
    contactId: "c2",
    dealId: "d2",
    title: "New follow-up",
  })
  const restored = restoreDealRecord(edited, before, "d1")
  expect(restored.tasks.find((task) => task.id === "t2")).toMatchObject({
    title: "New follow-up",
    dealId: "d2",
  })
  expect(
    restored.appointments.find((event) => event.id === "linked-event")?.dealId,
  ).toBe("d2")
  expect(roundTrip(restored)).not.toBeNull()
})
it("migrates version-three demo data without losing tasks or history", () => {
  const data = initial()
  const restored = parseWorkspace(JSON.stringify({ version: 3, data }))
  expect(restored?.tasks).toEqual(data.tasks)
  expect(restored?.activities).toEqual(data.activities)
})

it("restores an appointment against a task's current optional opportunity", () => {
  const before = chain()
  const event = before.appointments.find((event) => event.id === "linked-event")
  const task = before.tasks.find((task) => task.id === "t2")
  if (!event || !task) throw new Error("Missing fixture")
  const deleted = removeAppointmentRecord(before, event.id)
  const changed = saveTaskRecord(deleted, { ...task, dealId: undefined })
  const restored = restoreAppointmentRecord(changed, event)
  expect(
    restored.appointments.find((entry) => entry.id === event.id),
  ).toMatchObject({ taskId: task.id, dealId: undefined })
  expect(restored.activities.at(-1)?.title).toBe("Appointment restored")
  expect(roundTrip(restored)).not.toBeNull()
})
