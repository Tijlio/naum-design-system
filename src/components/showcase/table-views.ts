import {
  DEFAULT_TABLE_VIEW,
  isDataTableView,
  type DataTableViewState,
} from "@/lib/data-table-view"
import { CONTACT_STAGES, DEAL_STAGES } from "./showcase-data"

export const VIEW_SCOPES = ["contacts", "opportunities", "tasks"] as const
export type ViewScope = (typeof VIEW_SCOPES)[number]
export type WorkspaceSavedView = {
  id: string
  name: string
  scope: ViewScope
  state: DataTableViewState
}
const COLUMNS = {
  contacts: ["name", "relationship", "owner", "lastContact", "value"],
  opportunities: ["title", "stage", "owner", "value"],
  tasks: ["title", "contact", "dueDate", "completed"],
} as const
export const defaultTableView = (scope: ViewScope): DataTableViewState => ({
  ...DEFAULT_TABLE_VIEW,
  filters:
    scope === "tasks"
      ? { completed: "Open" }
      : scope === "contacts"
        ? { relationship: "Active" }
        : {},
  sorting: [{ id: COLUMNS[scope][0], desc: false }],
})
export const normalizeTableView = (
  state: DataTableViewState,
  scope: ViewScope,
): DataTableViewState => {
  const columns: readonly string[] = COLUMNS[scope]
  const filters = Object.fromEntries(
    Object.entries({ ...defaultTableView(scope).filters, ...state.filters })
      .filter(([key, value]) => {
        if (key === "owner") return scope !== "tasks" && Boolean(value)
        if (key === "relationship")
          return (
            scope === "contacts" &&
            ["Active", ...CONTACT_STAGES].some((stage) => stage === value)
          )
        if (key === "stage")
          return (
            scope === "opportunities" &&
            ["Open", ...DEAL_STAGES].some((stage) => stage === value)
          )
        return (
          scope === "tasks" &&
          key === "completed" &&
          ["Open", "Completed", "Overdue"].includes(value)
        )
      })
      .sort(([a], [b]) => a.localeCompare(b)),
  )
  return {
    ...state,
    filters,
    sorting: state.sorting.filter((sort) => columns.includes(sort.id)),
    visibility: Object.fromEntries(
      columns
        .slice(1)
        .filter((id) => state.visibility[id] === false)
        .map((id) => [id, false]),
    ),
  }
}
export const readTableView = (
  params: URLSearchParams,
  scope: ViewScope,
): DataTableViewState => {
  try {
    const value: unknown = JSON.parse(params.get("table") ?? "null")
    return isDataTableView(value)
      ? normalizeTableView(value, scope)
      : defaultTableView(scope)
  } catch {
    return defaultTableView(scope)
  }
}
export const isWorkspaceSavedView = (
  value: unknown,
): value is WorkspaceSavedView => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("name" in value) ||
    !("scope" in value) ||
    !("state" in value)
  )
    return false
  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    value.name.length <= 60 &&
    VIEW_SCOPES.some((scope) => scope === value.scope) &&
    isDataTableView(value.state)
  )
}
export const presetTableViews = (scope: ViewScope) => {
  const all = defaultTableView(scope)
  return scope === "contacts"
    ? [
        { id: "preset:all", name: "All contacts", state: all },
        {
          id: "preset:mine",
          name: "My leads",
          state: {
            ...all,
            filters: { relationship: "Lead", owner: "Alex Morgan" },
          },
        },
      ]
    : scope === "opportunities"
      ? [
          { id: "preset:all", name: "All opportunities", state: all },
          {
            id: "preset:mine",
            name: "My open opportunities",
            state: { ...all, filters: { stage: "Open", owner: "Alex Morgan" } },
          },
        ]
      : [
          { id: "preset:all", name: "Open tasks", state: all },
          {
            id: "preset:overdue",
            name: "Overdue tasks",
            state: { ...all, filters: { completed: "Overdue" } },
          },
          {
            id: "preset:done",
            name: "Completed tasks",
            state: { ...all, filters: { completed: "Completed" } },
          },
        ]
}
