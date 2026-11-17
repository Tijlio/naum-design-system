"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowDownUp, Archive, Search, Users } from "lucide-react"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MotionFadeUp } from "@/components/ui/motion"
import { CONTACT_STAGES, formatMoney } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { ContactDetail } from "./contact-detail"
import { ContactForm } from "./contact-form"

const PAGE_SIZE = 6

export const ContactsWorkspace = () => {
  const { contacts, archiveContacts } = useShowcase()
  const params = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [stage, setStage] = useState("All")
  const [descending, setDescending] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const filtered = useMemo(
    () =>
      contacts
        .filter(
          (contact) =>
            (stage === "All"
              ? contact.stage !== "Archived"
              : contact.stage === stage) &&
            `${contact.name} ${contact.company} ${contact.email}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) => a.name.localeCompare(b.name) * (descending ? -1 : 1)),
    [contacts, stage, query, descending],
  )
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const activePage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(
    activePage * PAGE_SIZE,
    (activePage + 1) * PAGE_SIZE,
  )
  const currentContact = contacts.find(
    (contact) => contact.id === params.get("contact"),
  )
  const allSelected =
    visible.length > 0 &&
    visible.every((contact) => selected.includes(contact.id))
  return (
    <div className="workspace-stack">
      <MotionFadeUp>
        <div className="workspace-heading">
          <div>
            <p className="workspace-eyebrow">Relationships</p>
            <h1 className="workspace-title flex items-center gap-3">
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
      <Card variant="default" className="gap-0">
        <div className="workspace-table-toolbar">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search contacts"
              placeholder="Search contacts…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(0)
              }}
            />
          </InputGroup>
          <div className="flex items-center gap-2">
            <Label htmlFor="relationship-filter" className="sr-only">
              Filter by relationship
            </Label>
            <SelectControl
              id="relationship-filter"
              value={stage}
              items={[
                { value: "All", label: "All relationships" },
                ...CONTACT_STAGES.map((stage) => ({
                  value: stage,
                  label: stage,
                })),
              ]}
              onValueChange={(stage) => {
                if (stage) {
                  setStage(stage)
                  setPage(0)
                }
              }}
            />
            {selected.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  archiveContacts(selected)
                  toast.success(`${selected.length} contacts archived`)
                  setSelected([])
                }}
              >
                <Archive />
                Archive {selected.length}
              </Button>
            )}
          </div>
        </div>
        <CardContent className="px-0">
          <Table aria-label="Workspace contacts">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">
                  <Checkbox
                    aria-label="Select contacts on this page"
                    checked={allSelected}
                    indeterminate={
                      !allSelected &&
                      visible.some((contact) => selected.includes(contact.id))
                    }
                    onCheckedChange={(checked) =>
                      setSelected((current) =>
                        checked
                          ? [
                              ...new Set([
                                ...current,
                                ...visible.map((contact) => contact.id),
                              ]),
                            ]
                          : current.filter(
                              (id) =>
                                !visible.some((contact) => contact.id === id),
                            ),
                      )
                    }
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => setDescending((value) => !value)}
                  >
                    Name
                    <ArrowDownUp />
                  </Button>
                </TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last contacted</TableHead>
                <TableHead className="pr-6 text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((contact) => (
                <TableRow
                  key={contact.id}
                  data-state={
                    selected.includes(contact.id) ? "selected" : undefined
                  }
                >
                  <TableCell className="pl-6">
                    <Checkbox
                      aria-label={`Select ${contact.name}`}
                      checked={selected.includes(contact.id)}
                      onCheckedChange={(checked) =>
                        setSelected((current) =>
                          checked
                            ? [...current, contact.id]
                            : current.filter((id) => id !== contact.id),
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="h-auto w-full justify-start gap-3 rounded-xl px-0 py-2 text-left"
                      onClick={() =>
                        router.push(
                          `/showcase/crm/contacts?contact=${contact.id}`,
                        )
                      }
                    >
                      <Avatar>
                        <AvatarFallback>
                          {contact.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        <span className="block font-medium">
                          {contact.name}
                        </span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          {contact.company}
                        </span>
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        contact.stage === "Customer" ? "secondary" : "outline"
                      }
                    >
                      {contact.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.owner}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(parseISO(contact.lastContact), "d MMM yyyy")}
                  </TableCell>
                  <TableCell className="pr-6 text-right tabular-nums">
                    {formatMoney(contact.value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {visible.length === 0 && (
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
                onClick={() => {
                  setQuery("")
                  setStage("All")
                  setPage(0)
                }}
              >
                Clear filters
              </Button>
            </Empty>
          )}
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-3 border-t pt-4">
          <p className="text-xs text-muted-foreground" role="status">
            {filtered.length} contacts
            {selected.length ? ` · ${selected.length} selected` : ""}
          </p>
          <nav aria-label="Contact pages" className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={activePage === 0}
              onClick={() => setPage(activePage - 1)}
            >
              Previous
            </Button>
            <span className="text-xs tabular-nums">
              {activePage + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={activePage >= pageCount - 1}
              onClick={() => setPage(activePage + 1)}
            >
              Next
            </Button>
          </nav>
        </CardFooter>
      </Card>
      <ContactDetail
        contact={currentContact}
        onClose={() =>
          router.replace("/showcase/crm/contacts", { scroll: false })
        }
      />
    </div>
  )
}
