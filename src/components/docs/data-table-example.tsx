"use client"

import { useState } from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { DataTable } from "@/components/blocks/data-table"
import { SearchInput } from "@/components/ui/search-input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { CodeSample } from "./code-sample"
const records = [
  { id: "1", name: "Emma Laurent", team: "Sales" },
  { id: "2", name: "Oliver Chen", team: "Design" },
  { id: "3", name: "Noor Janssens", team: "Sales" },
]
const columns: ColumnDef<(typeof records)[number]>[] = [
  { accessorKey: "name", header: "Name", enableHiding: false },
  { accessorKey: "team", header: "Team" },
]
export const DataTableExample = () => {
  "use no memo" // TanStack exposes a mutable table instance; read its current getters.
  const [query, setQuery] = useState("")
  const [state, setState] = useState("ready")
  const table = useReactTable({
    data: records,
    columns,
    getRowId: (row) => row.id,
    state: { globalFilter: query },
    onGlobalFilterChange: setQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  return (
    <div className="space-y-4">
      <Label htmlFor="table-example-state">Example state</Label>
      <SelectControl
        id="table-example-state"
        value={state}
        onValueChange={(value) => value && setState(value)}
        items={[
          { value: "ready", label: "Ready" },
          { value: "loading", label: "Loading" },
          { value: "error", label: "Error" },
        ]}
      />
      <DataTable
        table={table}
        label="Members"
        selectable
        getRowLabel={(row) => row.name}
        columnLabels={{ team: "Team" }}
        loading={state === "loading"}
        error={state === "error" ? "Members could not be loaded." : undefined}
        onRetry={() => setState("ready")}
        toolbar={
          <SearchInput
            label="Search members"
            placeholder="Search members…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="max-w-xs"
          />
        }
      />
      <CodeSample
        code={
          'import { DataTable } from "@/components/blocks/data-table"\n\n// Pass a TanStack v8 table with your columns, data and row models.\n<DataTable table={table} label="Members" selectable\n  getRowLabel={member => member.name}\n  toolbar={<Input label="Search members" value={query} onChange={onSearch} />}\n  bulkActions={members => <Button onClick={() => archive(members)}>Archive</Button>} />'
        }
      />
    </div>
  )
}
