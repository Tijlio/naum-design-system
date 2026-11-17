"use client"

import { useId, type ReactNode } from "react"
import { flexRender, type Table as TableInstance } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageToolbar } from "@/components/blocks/page-toolbar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export type DataTableProps<T> = {
  table: TableInstance<T>
  label: string
  toolbar?: ReactNode
  selectable?: boolean
  getRowLabel?: (record: T) => string
  bulkActions?: (records: T[]) => ReactNode
  columnLabels?: Record<string, string>
  columnClassNames?: Record<string, string>
  mobileHiddenColumns?: readonly string[]
  empty?: ReactNode
  loading?: boolean
  error?: string
  onRetry?: () => void
}

export const DataTable = <T,>({
  table,
  label,
  toolbar,
  selectable = false,
  getRowLabel,
  bulkActions,
  columnLabels = {},
  columnClassNames = {},
  mobileHiddenColumns = [],
  empty,
  loading,
  error,
  onRetry,
}: DataTableProps<T>) => {
  "use no memo" // TanStack exposes a mutable table instance; read its current getters.
  const pageSizeId = useId()
  const mobile = useIsMobile()
  const available = table
    .getAllLeafColumns()
    .filter((column) => !mobile || !mobileHiddenColumns.includes(column.id))
  const visible = available.filter((column) => column.getIsVisible())
  const visibleIds = new Set(visible.map((column) => column.id))
  const selected = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original)
  const rows = table.getRowModel().rows
  const total = table.getFilteredRowModel().rows.length
  const page = table.getState().pagination
  const pageCount = Math.max(1, table.getPageCount())
  const span = Math.max(1, visible.length + Number(selectable))
  return (
    <div className="min-w-0">
      <Card className="gap-0 pt-0" aria-busy={loading || undefined}>
        <PageToolbar
          variant="inset"
          aria-label={`${label} controls`}
          actions={
            <>
              {selected.length > 0 && bulkActions?.(selected)}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline">
                      <Columns3 />
                      Columns
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  {available
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        disabled={column.getIsVisible() && visible.length <= 1}
                        onCheckedChange={(checked) =>
                          column.toggleVisibility(checked)
                        }
                      >
                        {columnLabels[column.id] ?? column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          }
        >
          {toolbar}
        </PageToolbar>
        <CardContent className="px-0">
          <Table aria-label={label} className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((group, groupIndex) => (
                <TableRow key={group.id}>
                  {selectable && groupIndex === 0 && (
                    <TableHead
                      rowSpan={table.getHeaderGroups().length}
                      className="w-12 pl-6"
                    >
                      <Checkbox
                        aria-label={`Select ${label.toLowerCase()} on this page`}
                        disabled={!rows.length || loading || Boolean(error)}
                        checked={table.getIsAllPageRowsSelected()}
                        indeterminate={
                          table.getIsSomePageRowsSelected() &&
                          !table.getIsAllPageRowsSelected()
                        }
                        onCheckedChange={(checked) =>
                          table.toggleAllPageRowsSelected(checked)
                        }
                      />
                    </TableHead>
                  )}
                  {group.headers
                    .filter((header) =>
                      header.column
                        .getLeafColumns()
                        .some((column) => visibleIds.has(column.id)),
                    )
                    .map((header) => {
                      const sorted = header.column.getIsSorted()
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={
                            header.column
                              .getLeafColumns()
                              .filter((column) => visibleIds.has(column.id))
                              .length
                          }
                          className={cn(
                            !selectable && "first:pl-6",
                            "last:pr-6",
                            columnClassNames[header.column.id],
                          )}
                          aria-sort={
                            header.column.getCanSort()
                              ? sorted === "asc"
                                ? "ascending"
                                : sorted === "desc"
                                  ? "descending"
                                  : "none"
                              : undefined
                          }
                        >
                          {!header.isPlaceholder &&
                            (header.column.getCanSort() ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="-ml-3"
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {sorted === "asc" ? (
                                  <ArrowUp />
                                ) : sorted === "desc" ? (
                                  <ArrowDown />
                                ) : (
                                  <ArrowUpDown />
                                )}
                              </Button>
                            ) : (
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            ))}
                        </TableHead>
                      )
                    })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }, (_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={span} className="px-6 py-4">
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={span}>
                    <div role="alert" className="space-y-3 p-6 text-center">
                      <p>{error}</p>
                      {onRetry && (
                        <Button variant="outline" onClick={onRetry}>
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : rows.length ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    {selectable && (
                      <TableCell className="pl-6">
                        <Checkbox
                          aria-label={`Select ${getRowLabel?.(row.original) ?? row.id}`}
                          checked={row.getIsSelected()}
                          disabled={!row.getCanSelect()}
                          onCheckedChange={(checked) =>
                            row.toggleSelected(checked)
                          }
                        />
                      </TableCell>
                    )}
                    {row
                      .getVisibleCells()
                      .filter((cell) => visibleIds.has(cell.column.id))
                      .map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "whitespace-normal",
                            !selectable && "first:pl-6",
                            "last:pr-6",
                            columnClassNames[cell.column.id],
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={span}>
                    {empty ?? (
                      <Empty>
                        <EmptyHeader>
                          <EmptyTitle>No results found</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-3 border-t pt-4">
          <p role="status" className="text-xs text-muted-foreground">
            {total} {label.toLowerCase()}
            {selected.length ? ` · ${selected.length} selected` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Label className="sr-only" htmlFor={pageSizeId}>
              Rows per page
            </Label>
            <SelectControl
              id={pageSizeId}
              aria-label="Rows per page"
              value={String(page.pageSize)}
              items={[...new Set([6, 10, 20, 50, page.pageSize])]
                .sort((a, b) => a - b)
                .map((value) => ({
                  value: String(value),
                  label: String(value),
                }))}
              onValueChange={(value) => {
                if (value) table.setPageSize(Number(value))
              }}
            />
            <nav
              aria-label={`${label} pages`}
              className="flex items-center gap-3"
            >
              <Button
                size="sm"
                variant="outline"
                disabled={!table.getCanPreviousPage() || loading}
                onClick={() => table.previousPage()}
              >
                Previous
              </Button>
              <span className="text-xs tabular-nums">
                {Math.min(page.pageIndex + 1, pageCount)} / {pageCount}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={!table.getCanNextPage() || loading}
                onClick={() => table.nextPage()}
              >
                Next
              </Button>
            </nav>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
