"use client"

import { useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type Updater,
  type PaginationState,
} from "@tanstack/react-table"
import type { DataTableViewState } from "@/lib/data-table-view"
import {
  normalizeTableView,
  readTableView,
  type ViewScope,
} from "./table-views"

export const useWorkspaceTable = <T>({
  scope,
  data,
  columns,
  getRowId,
}: {
  scope: ViewScope
  data: T[]
  columns: ColumnDef<T>[]
  getRowId: (record: T) => string
}) => {
  "use no memo" // TanStack exposes a mutable table instance; read its current getters.
  const path = usePathname()
  const params = useSearchParams()
  const serializedView = params.get("table")
  const view = useMemo(
    () =>
      readTableView(
        new URLSearchParams(serializedView ? { table: serializedView } : {}),
        scope,
      ),
    [serializedView, scope],
  )
  const columnFilters = useMemo(
    () => Object.entries(view.filters).map(([id, value]) => ({ id, value })),
    [view.filters],
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pageIndex, setPageIndex] = useState(0)
  const change = (
    update: (current: DataTableViewState) => DataTableViewState,
    selected?: string,
    push = false,
  ) => {
    const url = new URL(window.location.href)
    const next = normalizeTableView(
      update(readTableView(url.searchParams, scope)),
      scope,
    )
    url.searchParams.set("table", JSON.stringify(next))
    if (selected) url.searchParams.set("view", selected)
    window.history[push ? "pushState" : "replaceState"](
      null,
      "",
      `${path}${url.search}${url.hash}`,
    )
    setPageIndex(0)
    setRowSelection({})
  }
  const update = <K extends keyof DataTableViewState>(
    key: K,
    value: Updater<DataTableViewState[K]>,
  ) =>
    change((current) => ({
      ...current,
      [key]: typeof value === "function" ? value(current[key]) : value,
    }))
  const pagination: PaginationState = { pageIndex, pageSize: view.pageSize }
  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      globalFilter: view.query,
      columnFilters,
      sorting: view.sorting,
      columnVisibility: view.visibility,
      rowSelection,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: (sorting) => update("sorting", sorting),
    onColumnVisibilityChange: (visibility) => update("visibility", visibility),
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater
      if (next.pageSize !== view.pageSize) update("pageSize", next.pageSize)
      else setPageIndex(next.pageIndex)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    autoResetPageIndex: true,
  })
  return {
    table,
    view,
    update,
    apply: (state: DataTableViewState, id: string) =>
      change(() => state, id, true),
    selectedView:
      params.get("view") ?? (params.has("table") ? undefined : "preset:all"),
  }
}
