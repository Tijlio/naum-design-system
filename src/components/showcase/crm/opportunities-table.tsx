"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { DataTable } from "@/components/blocks/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { formatMoney } from "@/lib/money-format"
import { DEAL_STAGES, type Deal } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { useWorkspaceTable } from "../use-workspace-table"
import { WorkspaceSavedViews } from "../workspace-saved-views"
import { DealStageBadge } from "./deal-stage-badge"

export const OpportunitiesTable = ({
  onEdit,
}: {
  onEdit: (id: string) => void
}) => {
  const { contacts, deals, saveDeal } = useShowcase()
  const columns = useMemo<ColumnDef<Deal>[]>(
    () => [
      {
        id: "title",
        accessorFn: (deal) =>
          `${deal.title} ${contacts.find((contact) => contact.id === deal.contactId)?.name ?? ""} ${contacts.find((contact) => contact.id === deal.contactId)?.company ?? ""}`,
        header: "Opportunity",
        enableHiding: false,
        cell: ({ row }) => (
          <Button
            variant="link"
            className="h-auto p-0 text-left whitespace-normal"
            onClick={() => onEdit(row.original.id)}
          >
            {row.original.title}
          </Button>
        ),
      },
      {
        accessorKey: "stage",
        header: "Stage",
        enableGlobalFilter: false,
        filterFn: (row, _id, value) =>
          value === "Open"
            ? row.original.stage !== "Won"
            : row.original.stage === value,
        cell: ({ row }) => <DealStageBadge stage={row.original.stage} />,
      },
      {
        id: "owner",
        accessorFn: (deal) =>
          contacts.find((contact) => contact.id === deal.contactId)?.owner ??
          "",
        header: "Owner",
        filterFn: "equalsString",
        enableGlobalFilter: false,
      },
      {
        accessorKey: "value",
        header: "Value",
        enableGlobalFilter: false,
        cell: ({ row }) => formatMoney(row.original.value),
      },
    ],
    [contacts, onEdit],
  )
  const { table, view, update, apply, selectedView } = useWorkspaceTable({
    scope: "opportunities",
    data: deals,
    columns,
    getRowId: (deal) => deal.id,
  })
  const owners = [...new Set(contacts.map((contact) => contact.owner))]
  const filter = (key: string, value: string) =>
    update("filters", (current) => ({ ...current, [key]: value }))
  return (
    <div className="space-y-6">
      <WorkspaceSavedViews
        scope="opportunities"
        state={view}
        selected={selectedView}
        onApply={apply}
      />
      <DataTable
        table={table}
        label="Opportunities"
        selectable
        getRowLabel={(deal) => deal.title}
        mobileHiddenColumns={["owner"]}
        columnLabels={{ stage: "Stage", owner: "Owner", value: "Value" }}
        columnClassNames={{
          stage: "w-28",
          owner: "w-32",
          value: "w-28 text-right tabular-nums",
        }}
        toolbar={
          <>
            <Input
              className="max-w-sm"
              aria-label="Search opportunities"
              placeholder="Search opportunities…"
              value={view.query}
              onChange={(event) => update("query", event.target.value)}
            />
            <Label htmlFor="deal-stage-filter" className="sr-only">
              Filter by stage
            </Label>
            <SelectControl
              id="deal-stage-filter"
              value={view.filters.stage ?? ""}
              items={[
                { value: "", label: "All stages" },
                { value: "Open", label: "Open" },
                ...DEAL_STAGES.map((value) => ({ value, label: value })),
              ]}
              onValueChange={(value) =>
                value !== null && filter("stage", value)
              }
            />
            <Label htmlFor="deal-owner-filter" className="sr-only">
              Filter by owner
            </Label>
            <SelectControl
              id="deal-owner-filter"
              value={view.filters.owner ?? ""}
              items={[
                { value: "", label: "All owners" },
                ...owners.map((value) => ({ value, label: value })),
              ]}
              onValueChange={(value) =>
                value !== null && filter("owner", value)
              }
            />
          </>
        }
        bulkActions={(selected) => (
          <Button
            variant="outline"
            disabled={selected.every((deal) => deal.stage === "Won")}
            onClick={() => {
              const changed = selected.filter((deal) => deal.stage !== "Won")
              changed.forEach((deal) => saveDeal({ ...deal, stage: "Won" }))
              table.resetRowSelection()
              toast.success(`${changed.length} opportunities won`, {
                action: {
                  label: "Undo",
                  onClick: () => changed.forEach(saveDeal),
                },
              })
            }}
          >
            Mark won {selected.length}
          </Button>
        )}
      />
    </div>
  )
}
