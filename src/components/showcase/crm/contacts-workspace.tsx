"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { Archive, Users } from "lucide-react"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import { DataTable } from "@/components/blocks/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { MotionFadeUp } from "@/components/ui/motion"
import { formatMoney } from "@/lib/money-format"
import { CONTACT_STAGES, type Contact } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { useWorkspaceTable } from "../use-workspace-table"
import { WorkspaceSavedViews } from "../workspace-saved-views"
import { defaultTableView } from "../table-views"
import { ContactAvatar } from "./contact-avatar"
import { ContactDetail } from "./contact-detail"
import { ContactForm } from "./contact-form"

export const ContactsWorkspace = () => {
  const { contacts, archiveContacts } = useShowcase()
  const params = useSearchParams()
  const router = useRouter()
  const openContact = useCallback(
    (id?: string) => {
      const url = new URL(window.location.href)
      if (id) url.searchParams.set("contact", id)
      else url.searchParams.delete("contact")
      router[id ? "push" : "replace"](`/showcase/crm/contacts${url.search}`, {
        scroll: false,
      })
    },
    [router],
  )
  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        id: "name",
        accessorFn: (contact) =>
          `${contact.name} ${contact.company} ${contact.email}`,
        header: "Name",
        enableHiding: false,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-3 rounded-xl px-0 py-2 text-left"
            onClick={() => openContact(row.original.id)}
          >
            <ContactAvatar name={row.original.name} />
            <span className="min-w-0">
              <span className="block truncate font-medium">
                {row.original.name}
              </span>
              <span className="block truncate text-xs font-normal text-muted-foreground">
                {row.original.company}
              </span>
            </span>
          </Button>
        ),
      },
      {
        id: "relationship",
        accessorKey: "stage",
        header: "Relationship",
        enableGlobalFilter: false,
        enableSorting: false,
        filterFn: (row, _id, value) =>
          value === "Active"
            ? row.original.stage !== "Archived"
            : row.original.stage === value,
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.stage === "Customer" ? "secondary" : "outline"
            }
          >
            {row.original.stage}
          </Badge>
        ),
      },
      {
        accessorKey: "owner",
        header: "Owner",
        enableGlobalFilter: false,
        filterFn: "equalsString",
      },
      {
        accessorKey: "lastContact",
        header: "Last contacted",
        enableGlobalFilter: false,
        cell: ({ row }) =>
          format(parseISO(row.original.lastContact), "d MMM yyyy"),
      },
      {
        accessorKey: "value",
        header: "Value",
        enableGlobalFilter: false,
        cell: ({ row }) => formatMoney(row.original.value),
      },
    ],
    [openContact],
  )
  const { table, view, update, apply, selectedView } = useWorkspaceTable({
    scope: "contacts",
    data: contacts,
    columns,
    getRowId: (contact) => contact.id,
  })
  const owners = [...new Set(contacts.map((contact) => contact.owner))]
  const filter = (key: string, value: string) =>
    update("filters", (current) => ({ ...current, [key]: value }))
  return (
    <div className="workspace-stack">
      <MotionFadeUp>
        <div className="workspace-heading">
          <div>
            <p className="workspace-eyebrow">Relationships</p>
            <h1 className="naum-page-title flex items-center gap-3">
              Contacts
              <Badge
                variant="secondary"
                className="crm-accent"
                data-tone="lavender"
              >
                {
                  contacts.filter((contact) => contact.stage !== "Archived")
                    .length
                }
              </Badge>
            </h1>
          </div>
          <ContactForm />
        </div>
      </MotionFadeUp>
      <WorkspaceSavedViews
        scope="contacts"
        state={view}
        selected={selectedView}
        onApply={apply}
      />
      <DataTable
        table={table}
        label="Contacts"
        selectable
        getRowLabel={(contact) => contact.name}
        mobileHiddenColumns={["owner", "lastContact", "value"]}
        columnLabels={{
          relationship: "Relationship",
          owner: "Owner",
          lastContact: "Last contacted",
          value: "Value",
        }}
        columnClassNames={{
          relationship: "w-28 md:w-36",
          owner: "w-32",
          lastContact: "w-40 text-muted-foreground",
          value: "w-28 text-right tabular-nums",
        }}
        toolbar={
          <>
            <Input
              className="max-w-sm"
              aria-label="Search contacts"
              placeholder="Search contacts…"
              value={view.query}
              onChange={(event) => update("query", event.target.value)}
            />
            <Label htmlFor="relationship-filter" className="sr-only">
              Filter by relationship
            </Label>
            <SelectControl
              id="relationship-filter"
              value={view.filters.relationship ?? "Active"}
              items={[
                { value: "Active", label: "All relationships" },
                ...CONTACT_STAGES.map((value) => ({ value, label: value })),
              ]}
              onValueChange={(value) => value && filter("relationship", value)}
            />
            <Label htmlFor="owner-filter" className="sr-only">
              Filter by owner
            </Label>
            <SelectControl
              id="owner-filter"
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
            onClick={() => {
              archiveContacts(selected.map((contact) => contact.id))
              table.resetRowSelection()
              toast.success(`${selected.length} contacts archived`)
            }}
          >
            <Archive />
            Archive {selected.length}
          </Button>
        )}
        empty={
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>No contacts found</EmptyTitle>
              <EmptyDescription>
                Try another name or relationship.
              </EmptyDescription>
            </EmptyHeader>
            <Button
              variant="outline"
              onClick={() => apply(defaultTableView("contacts"), "preset:all")}
            >
              Clear filters
            </Button>
          </Empty>
        }
      />
      <ContactDetail
        contact={contacts.find(
          (contact) => contact.id === params.get("contact"),
        )}
        onClose={() => openContact()}
      />
    </div>
  )
}
