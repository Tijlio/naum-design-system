"use client"

import { AppPage } from "@/components/blocks/app-page"
import { PageHeader } from "@/components/blocks/page-header"
import { useCallback, useId, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OpportunitiesTable } from "./opportunities-table"
import { readTableView } from "../table-views"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SearchInput } from "@/components/ui/search-input"
import { PageToolbar } from "@/components/blocks/page-toolbar"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { MotionLayout, MotionPresence } from "@/components/ui/motion"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/money-format"
import type { Deal } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { DealEditor } from "./deal-editor"
import { DEAL_TONES } from "./deal-tones"
import { getPipelineColumns } from "./pipeline-data"
import { PipelineCard, DEAL_DRAG_TYPE } from "./pipeline-card"

export const PipelineWorkspace = () => {
  const { contacts, deals, saveDeal } = useShowcase()
  const [createOpen, setCreateOpen] = useState(false)
  const params = useSearchParams()
  const router = useRouter()
  const view = readTableView(
    new URLSearchParams(params.toString()),
    "opportunities",
  )
  const layout = params.get("layout") === "table" ? "table" : "board"
  const query = view.query
  const setQuery = (query: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(
      "table",
      JSON.stringify({
        ...readTableView(url.searchParams, "opportunities"),
        query,
      }),
    )
    url.searchParams.delete("view")
    window.history.replaceState(null, "", `${url.pathname}${url.search}`)
  }
  const editDeal = useCallback(
    (id: string) => {
      const url = new URL(window.location.href)
      url.searchParams.set("deal", id)
      router.push(`${url.pathname}${url.search}`, { scroll: false })
    },
    [router],
  )

  const selectedDeal = deals.find((deal) => deal.id === params.get("deal"))
  const closeEditor = () => {
    setCreateOpen(false)
    if (params.has("deal")) {
      const url = new URL(window.location.href)
      url.searchParams.delete("deal")
      router.replace(`${url.pathname}${url.search}`, { scroll: false })
    }
  }
  const [dropStage, setDropStage] = useState<Deal["stage"] | null>(null)
  const boardId = useId()
  const columns = getPipelineColumns(
    deals.filter(
      (deal) =>
        (!view.filters.stage ||
          (view.filters.stage === "Open"
            ? deal.stage !== "Won"
            : deal.stage === view.filters.stage)) &&
        (!view.filters.owner ||
          contacts.find((contact) => contact.id === deal.contactId)?.owner ===
            view.filters.owner),
    ),
    contacts,
    query,
  )
  const count = columns.reduce((sum, column) => sum + column.deals.length, 0)
  const move = (id: string, stage: Deal["stage"]) => {
    const deal = deals.find((entry) => entry.id === id)
    if (!deal || deal.stage === stage) return
    saveDeal({ ...deal, stage })
    toast.success(`Moved to ${stage}`, {
      description: deal.title,
      action: { label: "Undo", onClick: () => saveDeal(deal) },
    })
  }
  const canCreate = contacts.some((contact) => contact.stage !== "Archived")
  return (
    <AppPage>
      <PageHeader
        eyebrow="Opportunities"
        title="Pipeline"
        count={deals.length}
        actions={
          <Button onClick={() => setCreateOpen(true)} disabled={!canCreate}>
            <Plus />
            New opportunity
          </Button>
        }
      />
      <Tabs
        value={layout}
        className="gap-6"
        onValueChange={(layout) => {
          const url = new URL(window.location.href)
          if (layout === "table") url.searchParams.set("layout", "table")
          else url.searchParams.delete("layout")
          window.history.replaceState(null, "", `${url.pathname}${url.search}`)
        }}
      >
        <PageToolbar aria-label="Pipeline view controls">
          <TabsList aria-label="Pipeline view">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          {layout === "board" && (
            <div className="flex min-w-0 flex-1 basis-full items-center gap-3 sm:basis-auto">
              <SearchInput
                label="Search opportunities"
                placeholder="Search opportunities…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {count !== deals.length && (
                <Badge variant="outline">{count} matching</Badge>
              )}
            </div>
          )}
        </PageToolbar>
        <TabsContent value="table">
          <OpportunitiesTable onEdit={editDeal} />
        </TabsContent>
        <TabsContent value="board" className="space-y-6">
          {Object.keys(view.filters).length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(view.filters).map(([key, value]) => (
                <Badge key={key} variant="secondary">
                  {key}: {value}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = new URL(window.location.href)
                  url.searchParams.set(
                    "table",
                    JSON.stringify({ ...view, filters: {} }),
                  )
                  url.searchParams.delete("view")
                  window.history.replaceState(
                    null,
                    "",
                    `${url.pathname}${url.search}`,
                  )
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
          {!canCreate && (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/showcase/crm/contacts" />}
            >
              Add a contact to create an opportunity
            </Button>
          )}
          <p id={`${boardId}-help`} className="sr-only">
            Drag opportunities between stages, or use the Move to selector on
            each card.
          </p>
          <div
            className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4"
            role="region"
            aria-label="Opportunity pipeline"
            aria-describedby={`${boardId}-help`}
          >
            {columns.map((column) => (
              <Card
                key={column.stage}
                variant="frosted"
                tone={DEAL_TONES[column.stage]}
                className={cn(
                  "pipeline-column min-w-0 transition-shadow",
                  dropStage === column.stage && "ring-2 ring-ring",
                )}
                role="region"
                aria-label={`${column.stage} opportunities`}
                onDragOver={(event) => {
                  if (event.dataTransfer.types.includes(DEAL_DRAG_TYPE)) {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = "move"
                    setDropStage(column.stage)
                  }
                }}
                onDragLeave={(event) => {
                  if (
                    !(event.relatedTarget instanceof Node) ||
                    !event.currentTarget.contains(event.relatedTarget)
                  )
                    setDropStage(null)
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  const id = event.dataTransfer.getData(DEAL_DRAG_TYPE)
                  setDropStage(null)
                  if (id) move(id, column.stage)
                }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>
                      <h2 className="text-base font-medium">{column.stage}</h2>
                    </CardTitle>
                    <Badge variant="soft" tone={DEAL_TONES[column.stage]}>
                      {column.deals.length}
                    </Badge>
                  </div>
                  <CardDescription>{formatMoney(column.value)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-3">
                  <MotionPresence initial={false}>
                    {column.deals.map((deal) => (
                      <MotionLayout
                        key={deal.id}
                        layoutId={`${boardId}-${deal.id}`}
                      >
                        <PipelineCard
                          deal={deal}
                          contact={contacts.find(
                            (contact) => contact.id === deal.contactId,
                          )}
                          onEdit={() => editDeal(deal.id)}
                          onMove={(stage) => move(deal.id, stage)}
                          onDragEnd={() => setDropStage(null)}
                        />
                      </MotionLayout>
                    ))}
                  </MotionPresence>
                  {!column.deals.length && (
                    <Empty className="min-h-32 p-4">
                      <EmptyHeader>
                        <EmptyTitle className="text-sm font-normal text-muted-foreground">
                          {query
                            ? "No matching opportunities"
                            : "No opportunities"}
                        </EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      {(createOpen || selectedDeal) && (
        <DealEditor
          key={selectedDeal?.id ?? "new"}
          deal={selectedDeal ?? null}
          onClose={closeEditor}
        />
      )}
    </AppPage>
  )
}
