"use client"

import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import type { Appointment } from "../showcase-data"
import { cn } from "@/lib/utils"

export const AppointmentChip = ({
  appointment,
  onClick,
  compact = false,
  className,
  draggable = false,
}: {
  appointment: Appointment
  onClick: () => void
  compact?: boolean
  className?: string
  draggable?: boolean
}) => (
  <Button
    variant="ghost"
    data-calendar={appointment.calendar}
    className={cn(
      "calendar-event h-full w-full flex-col items-start justify-start gap-0.5 overflow-hidden rounded-lg bg-(--event-background) px-2 py-1.5 text-left whitespace-normal text-(--event-foreground) hover:bg-(--event-background)",
      compact && "calendar-event-compact h-auto",
      className,
    )}
    onClick={onClick}
    aria-label={`${appointment.title}, ${appointment.allDay ? "all day" : format(parseISO(appointment.start), "HH:mm")}`}
    draggable={draggable}
    onDragStart={(event) => {
      event.dataTransfer.setData("application/x-naum-event", appointment.id)
      event.dataTransfer.effectAllowed = "move"
    }}
  >
    <span className="calendar-event-title">{appointment.title}</span>
    {!compact && (
      <span className="calendar-event-time">
        {appointment.allDay
          ? "All day"
          : `${format(parseISO(appointment.start), "HH:mm")}–${format(parseISO(appointment.end), "HH:mm")}`}
      </span>
    )}
  </Button>
)
