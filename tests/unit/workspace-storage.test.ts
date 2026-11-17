import { expect, it } from "vitest"
import {
  createWorkspaceStore,
  type DemoStorage,
} from "@/components/showcase/workspace-storage"
import {
  DEMO_STORAGE_KEY,
  parseWorkspace,
} from "@/components/showcase/workspace-schema"

const createStorage = () => {
  const values = new Map<string, string>()
  const storage: DemoStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value)
    },
    removeItem: (key) => {
      values.delete(key)
    },
  }
  return { storage, values }
}

it("restores all workspace records after a new store is mounted", () => {
  const { storage } = createStorage()
  const store = createWorkspaceStore(() => storage)
  expect(store.getSnapshot().persistence).toBe("loading")
  store.update((data) => ({
    ...data,
    contacts: data.contacts.map((contact, i) =>
      i ? contact : { ...contact, name: "Edited contact" },
    ),
    deals: data.deals.map((deal, i) => (i ? deal : { ...deal, stage: "Won" })),
  }))
  const next = createWorkspaceStore(() => storage)
  // Server rendering remains deterministic before browser restoration.
  expect(next.getServerSnapshot().data.contacts[0].name).toBe("Emma Laurent")
  next.restore()
  expect(next.getSnapshot().data.contacts[0].name).toBe("Edited contact")
  expect(next.getSnapshot().data.deals[0].stage).toBe("Won")
  expect(next.getSnapshot().persistence).toBe("local")
})

it("rejects corrupt, incompatible, duplicate and invalid record payloads", () => {
  const { storage } = createStorage()
  const store = createWorkspaceStore(() => storage)
  const data = store.getSnapshot().data
  for (const raw of [
    "{",
    JSON.stringify({ version: 2, data }),
    JSON.stringify({
      version: 1,
      data: { ...data, contacts: [data.contacts[0], data.contacts[0]] },
    }),
    JSON.stringify({
      version: 1,
      data: {
        ...data,
        appointments: [{ ...data.appointments[0], end: "2020-01-01T00:00" }],
      },
    }),
    JSON.stringify({
      version: 1,
      data: { ...data, deals: [{ ...data.deals[0], contactId: "missing" }] },
    }),
  ])
    expect(parseWorkspace(raw)).toBeNull()
  storage.setItem(DEMO_STORAGE_KEY, "corrupt")
  store.restore()
  expect(store.getSnapshot().persistence).toBe("session")
  expect(store.getSnapshot().data.contacts).toHaveLength(8)
  expect(storage.getItem(DEMO_STORAGE_KEY)).toBe("corrupt")
})

it("keeps interactions usable when storage is blocked or full", () => {
  const blocked = () => {
    throw new Error("Storage blocked")
  }
  const store = createWorkspaceStore(blocked)
  store.restore()
  store.update((data) => ({ ...data, contacts: [] }))
  expect(store.getSnapshot().data.contacts).toEqual([])
  expect(store.getSnapshot().persistence).toBe("session")
  expect(() => store.reset()).not.toThrow()
  const { storage } = createStorage()
  const full = createWorkspaceStore(() => ({ ...storage, setItem: blocked }))
  full.restore()
  full.update((data) => ({ ...data, appointments: [] }))
  expect(full.getSnapshot().data.appointments).toEqual([])
  expect(full.getSnapshot().persistence).toBe("session")
})

it("reset clears only the demo key and restores independent fixture copies", () => {
  const { storage, values } = createStorage()
  values.set("theme", "dark")
  const store = createWorkspaceStore(() => storage)
  store.update((data) => ({ ...data, appointments: [] }))
  store.reset()
  expect(values.has(DEMO_STORAGE_KEY)).toBe(false)
  expect(values.get("theme")).toBe("dark")
  expect(store.getSnapshot().data.appointments.length).toBeGreaterThan(0)
  expect(store.getSnapshot().data).not.toBe(store.getServerSnapshot().data)
})

it("notifies current subscribers and stops notifying after unsubscribe", () => {
  const { storage } = createStorage()
  const store = createWorkspaceStore(() => storage)
  let calls = 0
  const unsubscribe = store.subscribe(() => {
    calls++
  })
  store.restore()
  expect(calls).toBe(1)
  unsubscribe()
  store.reset()
  expect(calls).toBe(1)
})
