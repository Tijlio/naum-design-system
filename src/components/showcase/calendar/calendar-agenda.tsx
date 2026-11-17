"use client"

import { format } from "date-fns"
import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { Appointment } from "../showcase-data"
import { AppointmentChip } from "./appointment-chip"
import { occursOnDay } from "./calendar-layout"

export const CalendarAgenda = ({
  days,
  appointments,
  onEdit,
  onCreate,
}: {
  days: Date[]
  appointments: Appointment[]
  onEdit: (event: Appointment) => void
  onCreate: (date: Date, hour: number) => void
}) => {
  const busyDays = days.filter((day) =>
    appointments.some((event) => occursOnDay(event, day)),
  )
  if (!busyDays.length)
    return (
      <Empty className="min-h-80">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarDays />
          </EmptyMedia>
          <EmptyTitle>No appointments</EmptyTitle>
          <EmptyDescription>No appointments in this period.</EmptyDescription>
        </EmptyHeader>
        <Button onClick={() => onCreate(days[0], 9)}>New appointment</Button>
      </Empty>
    )
  return (
    <div className="calendar-agenda">
      {busyDays.map((day) => (
        <section
          key={day.toISOString()}
          className="calendar-agenda-day"
          aria-label={format(day, "EEEE d MMMM")}
        >
          <h2>
            <span className="block text-xs text-muted-foreground">
              {format(day, "EEE")}
            </span>
            <span className="text-2xl tabular-nums">{format(day, "d")}</span>
            <span className="block text-xs text-muted-foreground">
              {format(day, "MMM")}
            </span>
          </h2>
          <div className="min-w-0 space-y-2">
            {appointments
              .filter((event) => occursOnDay(event, day))
              .sort(
                (a, b) =>
                  Number(b.allDay) - Number(a.allDay) ||
                  a.start.localeCompare(b.start),
              )
              .map((event) => (
                <AppointmentChip
                  key={event.id}
                  appointment={event}
                  onClick={() => onEdit(event)}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
