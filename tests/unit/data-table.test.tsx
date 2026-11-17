import { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table"
import { DataTable } from "@/components/blocks/data-table"
import { MotionProvider } from "@/components/ui/motion"

const records = [
  { id: "a", name: "Zoe" },
  { id: "b", name: "Ada" },
  { id: "c", name: "Noor" },
]
const columns: ColumnDef<(typeof records)[number]>[] = [
  { accessorKey: "name", header: "Name" },
]
const Example = ({
  loading,
  error,
  onRetry,
}: {
  loading?: boolean
  error?: string
  onRetry?: () => void
}) => {
  "use no memo" // TanStack exposes a mutable table instance; read its current getters.
  const [rowSelection, onRowSelectionChange] = useState<RowSelectionState>({})
  const table = useReactTable({
    data: records,
    columns,
    getRowId: (row) => row.id,
    state: { rowSelection },
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 2 } },
  })
  return (
    <MotionProvider reducedMotion="always">
      <DataTable
        table={table}
        label="Members"
        selectable
        getRowLabel={(row) => row.name}
        bulkActions={(rows) => (
          <span>{rows.map((row) => row.name).join(",")}</span>
        )}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />
    </MotionProvider>
  )
}
it("sorts, pages and keeps row selection attached to stable record IDs", () => {
  render(<Example />)
  fireEvent.click(screen.getByRole("checkbox", { name: "Select Zoe" }))
  fireEvent.click(screen.getByRole("button", { name: /^Name$/ }))
  expect(screen.getAllByRole("row")[1].textContent).toContain("Ada")
  fireEvent.click(screen.getByRole("button", { name: /^Next$/ }))
  expect(
    screen
      .getByRole("checkbox", { name: "Select Zoe" })
      .getAttribute("aria-checked"),
  ).toBe("true")
  expect(screen.getByRole("status").textContent).toContain("1 selected")
})
it("provides a retry action instead of stale records in its error state", () => {
  const onRetry = vi.fn()
  render(<Example error="Could not load members" onRetry={onRetry} />)
  expect(screen.queryByRole("checkbox", { name: "Select Zoe" })).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: "Retry" }))
  expect(onRetry).toHaveBeenCalledOnce()
})
