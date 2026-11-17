import type { ReactNode } from "react"
import { MotionStagger, MotionStaggerItem } from "@/components/ui/motion"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

export type TimelineEntry = {
  id: string
  title: string
  description?: string
  dateLabel: string
  dateTime: string
  icon?: ReactNode
  action?: ReactNode
}
export const ActivityTimeline = ({
  entries,
  label = "Activity timeline",
  emptyLabel = "No activity yet",
}: {
  entries: readonly TimelineEntry[]
  label?: string
  emptyLabel?: string
}) =>
  entries.length ? (
    <MotionStagger role="list" aria-label={label} className="space-y-5">
      {entries.map((entry) => (
        <MotionStaggerItem
          key={entry.id}
          role="listitem"
          className="flex gap-3"
        >
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&>svg]:size-4"
          >
            {entry.icon ?? (
              <span className="size-1.5 rounded-full bg-current" />
            )}
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <time
              dateTime={entry.dateTime}
              className="text-xs text-muted-foreground"
            >
              {entry.dateLabel}
            </time>
            <p className="text-sm font-medium">{entry.title}</p>
            {entry.description && (
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {entry.description}
              </p>
            )}
            {entry.action}
          </div>
        </MotionStaggerItem>
      ))}
    </MotionStagger>
  ) : (
    <Empty>
      <EmptyHeader>
        <EmptyTitle className="text-sm font-normal text-muted-foreground">
          {emptyLabel}
        </EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
