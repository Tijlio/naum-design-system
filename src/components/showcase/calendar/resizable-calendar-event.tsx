"use client"

import {
  useId,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
} from "react"
import { GripHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Appointment } from "../showcase-data"
import { AppointmentChip } from "./appointment-chip"
import {
  HOUR_HEIGHT,
  getEventDayBounds,
  resizeAppointment,
  type PlacedEvent,
  type ResizeEdge,
} from "./calendar-layout"

type Gesture = {
  original: Appointment
  edge: ResizeEdge
  y: number
  scroller: Element | null
  scrollTop: number
  pointerId: number
}

export const ResizableCalendarEvent = ({
  placement,
  day,
  onEdit,
  onResize,
}: {
  placement: PlacedEvent
  day: Date
  onEdit: (event: Appointment) => void
  onResize: (event: Appointment) => void
}) => {
  const hintId = useId()
  const gesture = useRef<Gesture | null>(null)
  const [preview, setPreview] = useState<Appointment | null>(null)
  const shown = preview ?? placement.event
  const { top, height } = preview ? getEventDayBounds(preview, day) : placement
  const proposal = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current
    if (!current) return null
    const pixels =
      event.clientY -
      current.y +
      (current.scroller?.scrollTop ?? 0) -
      current.scrollTop
    return resizeAppointment(
      current.original,
      current.edge,
      Math.round(((pixels / HOUR_HEIGHT) * 60) / 15) * 15,
    )
  }
  const start = (event: PointerEvent<HTMLElement>, edge: ResizeEdge) => {
    if (event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    const scroller = event.currentTarget.closest(".calendar-time-scroll")
    gesture.current = {
      original: placement.event,
      edge,
      y: event.clientY,
      scroller,
      scrollTop: scroller?.scrollTop ?? 0,
      pointerId: event.pointerId,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.focus()
  }
  const keyboard = (event: KeyboardEvent<HTMLElement>, edge: ResizeEdge) => {
    if (event.key === "Escape" && gesture.current) {
      event.preventDefault()
      event.stopPropagation()
      const { pointerId } = gesture.current
      gesture.current = null
      setPreview(null)
      if (event.currentTarget.hasPointerCapture(pointerId))
        event.currentTarget.releasePointerCapture(pointerId)
      return
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    event.stopPropagation()
    const next = resizeAppointment(
      placement.event,
      edge,
      event.key === "ArrowUp" ? -15 : 15,
    )
    if (next[edge] !== placement.event[edge]) onResize(next)
  }
  return (
    <div
      className="calendar-placed-event group/event"
      data-resizing={Boolean(preview)}
      style={{
        top,
        height,
        left: `calc(${(placement.column / placement.columns) * 100}% + 2px)`,
        width: `calc(${100 / placement.columns}% - 4px)`,
      }}
    >
      <AppointmentChip
        appointment={shown}
        className="h-full"
        draggable={!preview}
        onClick={() => onEdit(placement.event)}
      />
      <span id={hintId} className="sr-only">
        Use Up and Down arrows to adjust by 15 minutes, or press Enter to edit
        the appointment.
      </span>
      {(["start", "end"] as const).map((edge) => (
        <Button
          key={edge}
          variant="ghost"
          className={`calendar-resize-handle absolute inset-x-1 z-20 h-3 touch-none cursor-ns-resize rounded-sm p-0 hover:bg-foreground/10 ${edge === "start" ? "top-0.5" : "bottom-1"}`}
          aria-label={`Resize ${edge} ${placement.event.title}`}
          aria-describedby={hintId}
          aria-keyshortcuts="ArrowUp ArrowDown"
          onClick={(event) => {
            event.stopPropagation()
            if (event.detail === 0) onEdit(placement.event)
          }}
          onKeyDown={(event) => keyboard(event, edge)}
          onPointerDown={(event) => start(event, edge)}
          onPointerMove={(event) => {
            const next = proposal(event)
            if (next)
              setPreview((current) =>
                current?.start === next.start && current?.end === next.end
                  ? current
                  : next,
              )
          }}
          onPointerUp={(event) => {
            const next = proposal(event)
            if (!next) return
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId)
            gesture.current = null
            setPreview(null)
            if (
              next.start !== placement.event.start ||
              next.end !== placement.event.end
            )
              onResize(next)
          }}
          onPointerCancel={() => {
            gesture.current = null
            setPreview(null)
          }}
          onLostPointerCapture={() => {
            gesture.current = null
            setPreview(null)
          }}
        >
          <GripHorizontal className="size-3" />
        </Button>
      ))}
    </div>
  )
}
