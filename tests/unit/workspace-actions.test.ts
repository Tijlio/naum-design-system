import { expect, it } from "vitest"
import { createWorkspaceStore } from "@/components/showcase/workspace-storage"
import {
  DEMO_STORAGE_VERSION,
  parseWorkspace,
} from "@/components/showcase/workspace-schema"
import {
  saveTaskRecord,
  saveDealRecord,
  removeDealRecord,
} from "@/components/showcase/workspace-actions"
import { getContactTimeline } from "@/components/showcase/crm/contact-timeline-data"
const initial = () =>
  createWorkspaceStore(() => {
    throw new Error("No storage")
  }).getSnapshot().data
it("records task transitions atomically, without mutating prior data or duplicating no-op edits", () => {
  const data = initial(),
    original = JSON.stringify(data)
  const task = {
    id: "new-task",
    title: "Call Emma",
    contactId: "c1",
    dueDate: "2026-11-18",
    completed: false,
  }
  const created = saveTaskRecord(data, task)
  const completed = saveTaskRecord(created, { ...task, completed: true })
  expect(completed.activities.slice(-2).map((event) => event.title)).toEqual([
    "Task added",
    "Task completed",
  ])
  expect(completed.tasks.find((entry) => entry.id === task.id)?.completed).toBe(
    true,
  )
  expect(
    saveTaskRecord(completed, { ...task, completed: true }).activities,
  ).toBe(completed.activities)
  expect(JSON.stringify(data)).toBe(original)
})
it("keeps linked tasks valid when an opportunity changes contact or is deleted", () => {
  const data = initial(),
    deal = data.deals[0]
  const moved = saveDealRecord(data, { ...deal, contactId: "c2", stage: "Won" })
  expect(moved.tasks.find((task) => task.dealId === deal.id)?.contactId).toBe(
    "c2",
  )
  expect(
    parseWorkspace(
      JSON.stringify({ version: DEMO_STORAGE_VERSION, data: moved }),
    ),
  ).not.toBeNull()
  const deleted = removeDealRecord(moved, deal.id)
  expect(deleted.tasks.find((task) => task.id === "t2")?.dealId).toBeUndefined()
  expect(
    parseWorkspace(
      JSON.stringify({ version: DEMO_STORAGE_VERSION, data: deleted }),
    ),
  ).not.toBeNull()
  const timeline = getContactTimeline(
    deleted.contacts[1],
    deleted.appointments,
    deleted.activities,
    deleted.tasks,
    deleted.deals,
  )
  expect(
    timeline.find((event) => event.title === "Opportunity deleted")?.href,
  ).toBeUndefined()
  expect(
    timeline.some((event) => event.title === "Opportunity moved to Won"),
  ).toBe(true)
})
it("merges notes, appointments and recorded activity in chronological order for one contact", () => {
  const data = initial()
  const entries = getContactTimeline(
    data.contacts[0],
    data.appointments,
    data.activities,
    data.tasks,
    data.deals,
  )
  expect(entries.some((entry) => entry.kind === "note")).toBe(true)
  expect(entries.some((entry) => entry.kind === "appointment")).toBe(true)
  expect(entries.some((entry) => entry.kind === "opportunity")).toBe(true)
  expect(entries.map((entry) => new Date(entry.timestamp).getTime())).toEqual(
    entries
      .map((entry) => new Date(entry.timestamp).getTime())
      .sort((a, b) => b - a),
  )
  expect(
    entries.some((entry) => entry.description === "Send Fieldwork recap"),
  ).toBe(false)
})
it("migrates version two views and rejects invalid task links in current payloads", () => {
  const data = initial()
  const legacy = parseWorkspace(JSON.stringify({ version: 2, data }))
  expect(legacy?.contacts).toEqual(data.contacts)
  expect(legacy?.savedViews).toEqual(data.savedViews)
  expect(legacy?.tasks).toEqual([])
  expect(
    parseWorkspace(
      JSON.stringify({
        version: DEMO_STORAGE_VERSION,
        data: { ...data, tasks: [{ ...data.tasks[0], dealId: "missing" }] },
      }),
    ),
  ).toBeNull()
})

it("keeps insertion order for events with equal timestamps instead of sorting random IDs", () => {
  const data = initial(),
    timestamp = "2026-11-17T10:00:00Z"
  const activities = [
    {
      id: "z",
      contactId: "c1",
      kind: "task" as const,
      title: "First",
      description: "",
      timestamp,
    },
    {
      id: "a",
      contactId: "c1",
      kind: "task" as const,
      title: "Second",
      description: "",
      timestamp,
    },
  ]
  expect(
    getContactTimeline(data.contacts[0], [], activities, [], [])
      .filter((entry) => entry.kind === "task")
      .map((entry) => entry.title),
  ).toEqual(["Second", "First"])
})
