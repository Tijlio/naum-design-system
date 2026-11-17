"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  addDays,
  addMinutes,
  addMonths,
  differenceInMinutes,
  eachDayOfInterval,
  format,
  parseISO,
  setHours,
  startOfDay,
  startOfWeek,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { MotionFadeUp, MotionPresence } from "@/components/ui/motion"
import { SelectControl } from "@/components/ui/select-control"
import { CALENDARS, DEMO_DATE, type Appointment } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { CalendarTimeGrid } from "./calendar-time-grid"
import { CalendarMonth } from "./calendar-month"
import { CalendarAgenda } from "./calendar-agenda"
import { EventEditor } from "./event-editor"
import { useCalendarClock } from "./use-calendar-clock"

const VIEWS = ["Week", "Day", "Month", "Agenda"] as const
type View = (typeof VIEWS)[number]
type Editor = { appointment?: Appointment; start: string }

export const CalendarWorkspace = () => {
  const { appointments, saveAppointment } = useShowcase()
  const params = useSearchParams()
  const router = useRouter()
  const mobile = useIsMobile()
  const selectedEvent = appointments.find(
    (event) => event.id === params.get("event"),
  )
  const [date, setDate] = useState(() =>
    parseISO(selectedEvent?.start ?? DEMO_DATE),
  )
  const [chosenView, setChosenView] = useState<View | null>(null)
  const [enabledCalendars, setEnabledCalendars] = useState<string[]>([
    ...CALENDARS,
  ])
  const [editor, setEditor] = useState<Editor | null>(null)
  const view = chosenView ?? (mobile ? "Agenda" : "Week")
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const days =
    view === "Day"
      ? [date]
      : eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) })
  const visible = appointments.filter((event) =>
    enabledCalendars.includes(event.calendar),
  )
  const activeEditor =
    editor ??
    (selectedEvent
      ? { appointment: selectedEvent, start: selectedEvent.start }
      : null)
  const today = useCalendarClock()
  const navigate = (direction: number) =>
    setDate((current) =>
      view === "Month"
        ? addMonths(current, direction)
        : addDays(current, direction * (view === "Day" ? 1 : 7)),
    )
  const create = (day: Date, hour: number) =>
    setEditor({
      start: format(setHours(startOfDay(day), hour), "yyyy-MM-dd'T'HH:mm"),
    })
  const edit = (appointment: Appointment) =>
    setEditor({ appointment, start: appointment.start })
  const close = () => {
    setEditor(null)
    if (params.has("event"))
      router.replace("/showcase/calendar", { scroll: false })
  }
  return (
    <div className="workspace-stack calendar-workspace">
      <MotionFadeUp>
        <div className="workspace-heading">
          <div>
            <p className="workspace-eyebrow">Your week, at a glance</p>
            <h1 className="naum-page-title">Calendar</h1>
          </div>
          <Button onClick={() => create(date, 9)}>
            <Plus />
            New appointment
          </Button>
        </div>
      </MotionFadeUp>
      <div className="calendar-workspace-layout">
        <aside className="calendar-sidebar" aria-label="Calendar controls">
          <Card variant="frosted" size="sm">
            <CardContent className="calendar-sidebar-content">
              <Calendar
                today={today}
                mode="single"
                selected={date}
                month={date}
                onMonthChange={setDate}
                onSelect={(value) => {
                  if (value) setDate(value)
                }}
                weekStartsOn={1}
                className="w-full bg-transparent p-0"
              />
              <fieldset className="mt-6 space-y-4">
                <legend className="mb-4 text-sm font-medium">
                  My calendars
                </legend>
                {CALENDARS.map((calendar) => (
                  <div className="flex items-center gap-3" key={calendar}>
                    <Checkbox
                      id={`calendar-${calendar}`}
                      checked={enabledCalendars.includes(calendar)}
                      onCheckedChange={(checked) =>
                        setEnabledCalendars((current) =>
                          checked
                            ? [...current, calendar]
                            : current.filter((value) => value !== calendar),
                        )
                      }
                    />
                    <Label
                      htmlFor={`calendar-${calendar}`}
                      className="text-sm font-normal"
                    >
                      <span
                        className="calendar-color-dot"
                        data-calendar={calendar}
                      />
                      {calendar}
                    </Label>
                  </div>
                ))}
              </fieldset>
            </CardContent>
          </Card>
        </aside>
        <Card className="calendar-board gap-0 py-0">
          <div className="calendar-toolbar">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDate(new Date())}
              >
                Today
              </Button>
              <ButtonGroup>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Previous period"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Next period"
                  onClick={() => navigate(1)}
                >
                  <ChevronRight />
                </Button>
              </ButtonGroup>
              <h2 className="font-medium" aria-live="polite">
                {format(date, "MMMM yyyy")}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="calendar-view" className="sr-only">
                Calendar view
              </Label>
              <SelectControl
                id="calendar-view"
                value={view}
                items={VIEWS.map((view) => ({ value: view, label: view }))}
                onValueChange={(view) => {
                  if (view) setChosenView(view)
                }}
              />
            </div>
          </div>
          <CardContent className="px-0">
            <MotionPresence mode="wait" initial={false}>
              <MotionFadeUp key={view} exit={{ opacity: 0 }}>
                {view === "Month" ? (
                  <CalendarMonth
                    date={date}
                    today={today}
                    appointments={visible}
                    onEdit={edit}
                    onCreate={create}
                    onDay={(day) => {
                      setDate(day)
                      setChosenView("Day")
                    }}
                  />
                ) : view === "Agenda" ? (
                  <CalendarAgenda
                    days={days}
                    appointments={visible}
                    onEdit={edit}
                    onCreate={create}
                  />
                ) : (
                  <CalendarTimeGrid
                    days={days}
                    today={today}
                    appointments={visible}
                    onEdit={edit}
                    onCreate={create}
                    onResize={(next) => {
                      const original = appointments.find(
                        (event) => event.id === next.id,
                      )
                      saveAppointment(next)
                      toast.success("Appointment resized", {
                        action: {
                          label: "Undo",
                          onClick: () => {
                            if (original) saveAppointment(original)
                          },
                        },
                      })
                    }}
                    onMove={(id, day, minutes) => {
                      const appointment = appointments.find(
                        (appointment) => appointment.id === id,
                      )
                      if (!appointment || appointment.allDay) return
                      const duration = differenceInMinutes(
                        parseISO(appointment.end),
                        parseISO(appointment.start),
                      )
                      const start = addMinutes(startOfDay(day), minutes)
                      saveAppointment({
                        ...appointment,
                        start: format(start, "yyyy-MM-dd'T'HH:mm"),
                        end: format(
                          addMinutes(start, duration),
                          "yyyy-MM-dd'T'HH:mm",
                        ),
                      })
                      toast.success("Appointment moved", {
                        action: {
                          label: "Undo",
                          onClick: () => saveAppointment(appointment),
                        },
                      })
                    }}
                  />
                )}
              </MotionFadeUp>
            </MotionPresence>
          </CardContent>
        </Card>
      </div>
      {activeEditor && (
        <EventEditor
          key={activeEditor.appointment?.id ?? activeEditor.start}
          appointment={activeEditor.appointment}
          defaultStart={activeEditor.start}
          onClose={close}
          onSaved={(appointment) => setDate(parseISO(appointment.start))}
        />
      )}
    </div>
  )
}
