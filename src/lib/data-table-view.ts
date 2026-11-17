import type { SortingState, VisibilityState } from "@tanstack/react-table"

export type DataTableViewState = {
  query: string
  filters: Record<string, string>
  sorting: SortingState
  visibility: VisibilityState
  pageSize: number
}
export const DEFAULT_TABLE_VIEW: DataTableViewState = {
  query: "",
  filters: {},
  sorting: [],
  visibility: {},
  pageSize: 6,
}
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
export const isDataTableView = (value: unknown): value is DataTableViewState =>
  isRecord(value) &&
  typeof value.query === "string" &&
  value.query.length <= 500 &&
  isRecord(value.filters) &&
  Object.entries(value.filters).every(
    ([key, value]) =>
      key.length <= 80 && typeof value === "string" && value.length <= 160,
  ) &&
  Array.isArray(value.sorting) &&
  value.sorting.length <= 10 &&
  value.sorting.every(
    (sort) =>
      isRecord(sort) &&
      typeof sort.id === "string" &&
      typeof sort.desc === "boolean",
  ) &&
  isRecord(value.visibility) &&
  Object.values(value.visibility).every(
    (value) => typeof value === "boolean",
  ) &&
  typeof value.pageSize === "number" &&
  Number.isInteger(value.pageSize) &&
  value.pageSize > 0 &&
  value.pageSize <= 100
