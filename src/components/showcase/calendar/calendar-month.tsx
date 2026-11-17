"use client"

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Appointment } from "../showcase-data"
import { AppointmentChip } from "./appointment-chip"
import { occursOnDay } from "./calendar-layout"

export const CalendarMonth = ({
  date,
  today,
  appointments,
  onEdit,
  onCreate,
  onDay,
}: {
  date: Date
  today: Date
  appointments: Appointment[]
  onEdit: (event: Appointment) => void
  onCreate: (day: Date, hour: number) => void
  onDay: (day: Date) => void
}) => {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 1 }),
  })
  return (
    <div className="calendar-month" role="region" aria-label="Month calendar">
      <div className="calendar-month-headings">
        {days.slice(0, 7).map((day) => (
          <span key={day.toISOString()}>{format(day, "EEE")}</span>
        ))}
      </div>
      <div className="calendar-month-days">
        {days.map((day) => {
          const events = appointments
            .filter((event) => occursOnDay(event, day))
            .sort(
              (a, b) =>
                Number(b.allDay) - Number(a.allDay) ||
                a.start.localeCompare(b.start),
            )
          return (
            <div
              key={day.toISOString()}
              className="calendar-month-cell"
              data-outside={!isSameMonth(day, date)}
            >
              <div className="flex items-center justify-between">
                <Button
                  variant={isSameDay(day, today) ? "default" : "ghost"}
                  size="icon-sm"
                  aria-label={`Open ${format(day, "EEEE d MMMM yyyy")}`}
                  onClick={() => onDay(day)}
                >
                  {format(day, "d")}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="calendar-add"
                  aria-label={`Add appointment ${format(day, "d MMMM")}`}
                  onClick={() => onCreate(day, 9)}
                >
                  <Plus />
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                {events.slice(0, 3).map((event) => (
                  <AppointmentChip
                    key={event.id}
                    appointment={event}
                    compact
                    onClick={() => onEdit(event)}
                  />
                ))}
                {events.length > 3 && (
                  <Button variant="ghost" size="xs" onClick={() => onDay(day)}>
                    +{events.length - 3} more
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
