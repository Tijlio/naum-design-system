"use client"

import { useState } from "react"
import { addDays, addHours, format, isValid, parseISO } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { CALENDARS, type Appointment } from "../showcase-data"
import { useShowcase } from "../showcase-provider"

export const EventEditor = ({
  appointment,
  defaultStart,
  onClose,
  onSaved,
}: {
  appointment?: Appointment
  defaultStart: string
  onClose: () => void
  onSaved: (appointment: Appointment) => void
}) => {
  const { contacts, saveAppointment, removeAppointment } = useShowcase()
  const [allDay, setAllDay] = useState(appointment?.allDay ?? false)
  const [start, setStart] = useState(appointment?.start ?? defaultStart)
  const [end, setEnd] = useState(
    appointment
      ? appointment.allDay
        ? format(addDays(parseISO(appointment.end), -1), "yyyy-MM-dd'T'HH:mm")
        : appointment.end
      : format(addHours(parseISO(defaultStart), 1), "yyyy-MM-dd'T'HH:mm"),
  )
  const [error, setError] = useState("")
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit appointment" : "New appointment"}
          </DialogTitle>
          <DialogDescription>
            {appointment
              ? "Update the details of this appointment."
              : "Plan your next conversation."}
          </DialogDescription>
        </DialogHeader>
        <form
          className="workspace-form"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            const title = data.get("title"),
              description = data.get("description"),
              contactId = data.get("contact"),
              calendar = CALENDARS.find(
                (calendar) => calendar === data.get("calendar"),
              )
            if (
              typeof title !== "string" ||
              !title.trim() ||
              typeof description !== "string" ||
              typeof contactId !== "string" ||
              !calendar
            )
              return
            const startValue = allDay ? `${start.slice(0, 10)}T00:00` : start
            const endValue = allDay
              ? format(
                  addDays(parseISO(end.slice(0, 10)), 1),
                  "yyyy-MM-dd'T'HH:mm",
                )
              : end
            if (
              !isValid(parseISO(startValue)) ||
              !isValid(parseISO(endValue)) ||
              parseISO(endValue) <= parseISO(startValue)
            ) {
              setError("Choose an end after the start.")
              return
            }
            const saved: Appointment = {
              id: appointment?.id ?? crypto.randomUUID(),
              title: title.trim(),
              description: description.trim(),
              start: startValue,
              end: endValue,
              allDay,
              calendar,
              ...(contactId ? { contactId } : {}),
            }
            saveAppointment(saved)
            onSaved(saved)
            toast.success(
              appointment ? "Appointment updated" : "Appointment added",
            )
            onClose()
          }}
        >
          <div className="workspace-field">
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              name="title"
              required
              maxLength={120}
              defaultValue={appointment?.title}
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="event-all-day"
              checked={allDay}
              onCheckedChange={(checked) => {
                setAllDay(checked)
                setError("")
              }}
            />
            <Label htmlFor="event-all-day">All day</Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="workspace-field">
              <Label htmlFor="event-start">Start</Label>
              <Input
                id="event-start"
                type={allDay ? "date" : "datetime-local"}
                value={allDay ? start.slice(0, 10) : start}
                required
                onChange={(event) => {
                  setStart(
                    allDay ? `${event.target.value}T00:00` : event.target.value,
                  )
                  setError("")
                }}
              />
            </div>
            <div className="workspace-field">
              <Label htmlFor="event-end">End</Label>
              <Input
                id="event-end"
                type={allDay ? "date" : "datetime-local"}
                value={allDay ? end.slice(0, 10) : end}
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "event-time-error" : undefined}
                onChange={(event) => {
                  setEnd(
                    allDay ? `${event.target.value}T00:00` : event.target.value,
                  )
                  setError("")
                }}
              />
            </div>
          </div>
          {error && (
            <p
              id="event-time-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="workspace-field">
              <Label htmlFor="event-calendar">Calendar</Label>
              <NativeSelect
                id="event-calendar"
                name="calendar"
                defaultValue={appointment?.calendar ?? "Sales"}
              >
                {CALENDARS.map((calendar) => (
                  <NativeSelectOption key={calendar}>
                    {calendar}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="workspace-field">
              <Label htmlFor="event-contact">Contact</Label>
              <NativeSelect
                id="event-contact"
                name="contact"
                defaultValue={appointment?.contactId ?? ""}
              >
                <NativeSelectOption value="">No contact</NativeSelectOption>
                {contacts
                  .filter(
                    (contact) =>
                      contact.stage !== "Archived" ||
                      contact.id === appointment?.contactId,
                  )
                  .map((contact) => (
                    <NativeSelectOption key={contact.id} value={contact.id}>
                      {contact.name}
                    </NativeSelectOption>
                  ))}
              </NativeSelect>
            </div>
          </div>
          <div className="workspace-field">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              name="description"
              maxLength={2000}
              defaultValue={appointment?.description}
              rows={2}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {appointment ? (
              <Button
                variant="destructive"
                type="button"
                onClick={() => {
                  removeAppointment(appointment.id)
                  toast.success("Appointment deleted", {
                    action: {
                      label: "Undo",
                      onClick: () => saveAppointment(appointment),
                    },
                  })
                  onClose()
                }}
              >
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save appointment</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
