"use client"

import { useEffect, useRef } from "react"
import { format, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import type { Appointment } from "../showcase-data"
import { ResizableCalendarEvent } from "./resizable-calendar-event"
import { AppointmentChip } from "./appointment-chip"
import { HOUR_HEIGHT, layoutDayEvents, occursOnDay } from "./calendar-layout"

const HOURS = Array.from({ length: 24 }, (_, index) => index)

export const CalendarTimeGrid = ({
  days,
  today,
  appointments,
  onEdit,
  onCreate,
  onMove,
  onResize,
}: {
  days: Date[]
  today: Date
  appointments: Appointment[]
  onEdit: (event: Appointment) => void
  onCreate: (date: Date, hour: number) => void
  onMove: (id: string, date: Date, minutes: number) => void
  onResize: (event: Appointment) => void
}) => {
  const scroller = useRef<HTMLDivElement>(null)
  const firstDay = days[0]?.getTime()
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 8 * HOUR_HEIGHT
  }, [firstDay, days.length])
  return (
    <div
      className="calendar-time-scroll"
      ref={scroller}
      tabIndex={0}
      role="region"
      aria-label="Calendar time grid"
    >
      <div
        className="calendar-time-canvas"
        style={{
          gridTemplateColumns: `3.5rem repeat(${days.length}, minmax(0, 1fr))`,
          minWidth: days.length > 1 ? 720 : undefined,
        }}
      >
        <div className="calendar-day-heading calendar-timezone">
          Local
          <br />
          time
        </div>
        {days.map((day) => (
          <div className="calendar-day-heading" key={day.toISOString()}>
            <span className="text-xs text-muted-foreground">
              {format(day, "EEE")}
            </span>
            <span className={cnToday(isSameDay(day, today))}>
              {format(day, "d")}
            </span>
          </div>
        ))}
        <div className="calendar-all-day-label">All day</div>
        {days.map((day) => (
          <div className="calendar-all-day" key={day.toISOString()}>
            {appointments
              .filter((event) => event.allDay && occursOnDay(event, day))
              .map((event) => (
                <AppointmentChip
                  key={event.id}
                  appointment={event}
                  compact
                  onClick={() => onEdit(event)}
                />
              ))}
          </div>
        ))}
        <div className="calendar-hours" style={{ height: 24 * HOUR_HEIGHT }}>
          {HOURS.map((hour) => (
            <div
              className="calendar-hour-label"
              key={hour}
              style={{ top: hour * HOUR_HEIGHT }}
            >
              {hour ? `${String(hour).padStart(2, "0")}:00` : ""}
            </div>
          ))}
        </div>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="calendar-day-column"
            data-today={isSameDay(day, today)}
            style={{ height: 24 * HOUR_HEIGHT }}
            onDragOver={(event) => {
              if (event.dataTransfer.types.includes("application/x-naum-event"))
                event.preventDefault()
            }}
            onDrop={(event) => {
              const id = event.dataTransfer.getData("application/x-naum-event")
              if (!id) return
              event.preventDefault()
              const minutes =
                Math.round(
                  (((event.clientY -
                    event.currentTarget.getBoundingClientRect().top) /
                    HOUR_HEIGHT) *
                    60) /
                    15,
                ) * 15
              onMove(id, day, Math.min(1425, Math.max(0, minutes)))
            }}
          >
            {isSameDay(day, today) && (
              <div
                aria-hidden="true"
                className="calendar-now-line"
                style={{
                  top:
                    (today.getHours() + today.getMinutes() / 60) * HOUR_HEIGHT,
                }}
              />
            )}
            {HOURS.map((hour) => (
              <Button
                key={hour}
                variant="ghost"
                className="calendar-slot rounded-none p-0"
                tabIndex={-1}
                style={{ top: hour * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                aria-label={`New appointment ${format(day, "EEEE d MMMM")} at ${String(hour).padStart(2, "0")}:00`}
                onClick={() => onCreate(day, hour)}
              />
            ))}
            {layoutDayEvents(appointments, day).map((placement) => (
              <ResizableCalendarEvent
                key={placement.event.id}
                placement={placement}
                day={day}
                onEdit={onEdit}
                onResize={onResize}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const cnToday = (today: boolean) =>
  today ? "calendar-date-number calendar-date-today" : "calendar-date-number"
