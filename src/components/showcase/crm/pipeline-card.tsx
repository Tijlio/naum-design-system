"use client"

import { GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { DEAL_STAGES, type Contact, type Deal } from "../showcase-data"
import { formatMoney } from "@/lib/money-format"
import { ContactAvatar } from "./contact-avatar"

export const DEAL_DRAG_TYPE = "application/x-naum-deal"

export const PipelineCard = ({
  deal,
  contact,
  onEdit,
  onMove,
  onDragEnd,
}: {
  deal: Deal
  contact?: Contact
  onEdit: () => void
  onMove: (stage: Deal["stage"]) => void
  onDragEnd: () => void
}) => (
  <Card
    size="sm"
    role="group"
    aria-label={deal.title}
    draggable
    onDragStart={(event) => {
      event.stopPropagation()
      event.dataTransfer.setData(DEAL_DRAG_TYPE, deal.id)
      event.dataTransfer.effectAllowed = "move"
    }}
    onDragEnd={onDragEnd}
    className="naum-card-lift cursor-grab active:cursor-grabbing"
  >
    <CardHeader className="flex items-start gap-2">
      <CardTitle className="min-w-0 flex-1">
        <Button
          variant="ghost"
          onClick={onEdit}
          className="h-auto w-full justify-start rounded-lg p-0 text-left whitespace-normal"
          aria-label={`Edit ${deal.title}`}
        >
          {deal.title}
        </Button>
      </CardTitle>
      <GripVertical
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
      />
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-2xl font-normal tracking-tight tabular-nums">
        {formatMoney(deal.value)}
      </p>
      {contact && (
        <div className="flex min-w-0 items-center gap-2">
          <ContactAvatar name={contact.name} className="size-7" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">{contact.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {contact.company}
            </p>
          </div>
        </div>
      )}
    </CardContent>
    <CardFooter>
      <Label htmlFor={`move-${deal.id}`} className="sr-only">
        Move {deal.title} to
      </Label>
      <SelectControl
        id={`move-${deal.id}`}
        className="w-full"
        value={deal.stage}
        onValueChange={(value) => value && onMove(value)}
        items={DEAL_STAGES.map((value) => ({ value, label: value }))}
      />
    </CardFooter>
  </Card>
)
