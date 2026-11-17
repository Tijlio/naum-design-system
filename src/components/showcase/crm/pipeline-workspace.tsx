"use client"

import { useId, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  MotionFadeUp,
  MotionLayout,
  MotionPresence,
} from "@/components/ui/motion"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/money-format"
import type { Deal } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { DealEditor } from "./deal-editor"
import { getPipelineColumns } from "./pipeline-data"
import { PipelineCard, DEAL_DRAG_TYPE } from "./pipeline-card"

const TONES = {
  Discovery: "mint",
  Proposal: "amber",
  Negotiation: "lavender",
  Won: "mint",
} as const

export const PipelineWorkspace = () => {
  const { contacts, deals, saveDeal } = useShowcase()
  const [query, setQuery] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const params = useSearchParams()
  const router = useRouter()
  const selectedDeal = deals.find((deal) => deal.id === params.get("deal"))
  const closeEditor = () => {
    setCreateOpen(false)
    if (params.has("deal"))
      router.replace("/showcase/crm/pipeline", { scroll: false })
  }
  const [dropStage, setDropStage] = useState<Deal["stage"] | null>(null)
  const boardId = useId()
  const columns = getPipelineColumns(deals, contacts, query)
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
    <div className="workspace-stack">
      <MotionFadeUp>
        <div className="workspace-heading">
          <div>
            <p className="workspace-eyebrow">Opportunities</p>
            <h1 className="naum-page-title">Pipeline</h1>
          </div>
          <Button onClick={() => setCreateOpen(true)} disabled={!canCreate}>
            <Plus />
            New opportunity
          </Button>
        </div>
      </MotionFadeUp>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <InputGroup className="max-w-sm">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search opportunities"
            placeholder="Search opportunities…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
        <Badge variant="outline">
          {count} {count === 1 ? "opportunity" : "opportunities"}
        </Badge>
      </div>
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
        Drag opportunities between stages, or use the Move to selector on each
        card.
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
            data-tone={TONES[column.stage]}
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
                <Badge
                  variant="secondary"
                  className="crm-accent"
                  data-tone={TONES[column.stage]}
                >
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
                      onEdit={() =>
                        router.push(`/showcase/crm/pipeline?deal=${deal.id}`, {
                          scroll: false,
                        })
                      }
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
                      {query ? "No matching opportunities" : "No opportunities"}
                    </EmptyTitle>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {(createOpen || selectedDeal) && (
        <DealEditor
          key={selectedDeal?.id ?? "new"}
          deal={selectedDeal ?? null}
          onClose={closeEditor}
        />
      )}
    </div>
  )
}
