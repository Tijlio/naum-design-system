import { expect, it } from "vitest"
import { isDataTableView } from "@/lib/data-table-view"
import {
  defaultTableView,
  normalizeTableView,
  readTableView,
} from "@/components/showcase/table-views"
import { parseWorkspace } from "@/components/showcase/workspace-schema"
import {
  DEALS,
  INITIAL_CONTACTS,
  INITIAL_APPOINTMENTS,
} from "@/components/showcase/showcase-data"
it("normalizes shared URL views to known columns and filters without hiding identity", () => {
  const state = {
    ...defaultTableView("contacts"),
    query: "Ada",
    filters: { relationship: "Lead", owner: "Alex Morgan", unknown: "x" },
    sorting: [
      { id: "missing", desc: false },
      { id: "name", desc: true },
    ],
    visibility: { name: false, owner: false, unknown: false },
  }
  const params = new URLSearchParams({ table: JSON.stringify(state) })
  expect(readTableView(params, "contacts")).toEqual({
    ...state,
    filters: { owner: "Alex Morgan", relationship: "Lead" },
    sorting: [{ id: "name", desc: true }],
    visibility: { owner: false },
  })
  expect(
    readTableView(new URLSearchParams({ table: "{" }), "contacts"),
  ).toEqual(defaultTableView("contacts"))
  expect(
    normalizeTableView(
      { ...state, filters: { relationship: "Invalid" } },
      "contacts",
    ).filters.relationship,
  ).toBeUndefined()
})
it("rejects invalid serialized pagination and sorting", () => {
  for (const patch of [
    { pageSize: 0 },
    { pageSize: 1000 },
    { pageSize: 1.5 },
    { sorting: [{ id: "name", desc: "yes" }] },
    { visibility: { owner: "hidden" } },
  ])
    expect(isDataTableView({ ...defaultTableView("contacts"), ...patch })).toBe(
      false,
    )
})
it("migrates legacy workspaces while preserving records and validates named views", () => {
  const data = {
    contacts: INITIAL_CONTACTS,
    appointments: INITIAL_APPOINTMENTS,
    deals: DEALS,
  }
  expect(
    parseWorkspace(JSON.stringify({ version: 1, data }))?.contacts,
  ).toEqual(INITIAL_CONTACTS)
  expect(
    parseWorkspace(JSON.stringify({ version: 1, data }))?.savedViews,
  ).toEqual([])
  const view = {
    id: "v1",
    name: "My leads",
    scope: "contacts",
    state: defaultTableView("contacts"),
  }
  expect(
    parseWorkspace(
      JSON.stringify({ version: 2, data: { ...data, savedViews: [view] } }),
    )?.savedViews,
  ).toEqual([view])
  expect(
    parseWorkspace(
      JSON.stringify({
        version: 2,
        data: { ...data, savedViews: [{ ...view, state: { pageSize: -1 } }] },
      }),
    ),
  ).toBeNull()
})
