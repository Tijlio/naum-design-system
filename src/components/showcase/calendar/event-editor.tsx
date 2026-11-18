"use client"

import { useId, useState, type ComponentProps } from "react"
import { useRouter } from "next/navigation"
import {
  addDays,
  addHours,
  addMinutes,
  differenceInCalendarDays,
  differenceInMinutes,
  format,
  isValid,
  parseISO,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { Textarea } from "@/components/ui/textarea"
import { CALENDARS, type Appointment } from "../showcase-data"
import { useWorkspaceNotice } from "../workspace-notice"
import { useShowcase } from "../showcase-provider"
import { assertValid, validateAppointment } from "../workspace-validation"
import { useWorkspaceForm } from "../forms/use-workspace-form"
import { WorkspaceFieldError } from "../forms/workspace-field-error"
import { DiscardChangesDialog } from "../forms/discard-changes-dialog"
import { CustomerContext } from "../customer-context"

export type EventEditorProps = {
  appointment?: Appointment
  defaultStart: string
  contactId?: string
  dealId?: string
  taskId?: string
  defaultTitle?: string
  onClose: () => void
  onSaved?: (appointment: Appointment) => void
  finalFocus?: ComponentProps<typeof DialogContent>["finalFocus"]
}
export const EventEditor = ({
  appointment,
  defaultStart,
  contactId: initialContact,
  dealId: initialDeal,
  taskId: initialTask,
  defaultTitle,
  onClose,
  onSaved,
  finalFocus,
}: EventEditorProps) => {
  const notify = useWorkspaceNotice()
  const workspace = useShowcase()
  const { contacts, deals, tasks, saveAppointment, removeAppointment } =
    workspace
  const form = useWorkspaceForm(onClose)
  const id = useId()
  const router = useRouter()
  const navigate = (href: string) =>
    form.requestLeave(() => {
      onClose()
      router.push(href)
    })
  const [allDay, setAllDay] = useState(appointment?.allDay ?? false)
  const [start, setStart] = useState(appointment?.start ?? defaultStart)
  const [end, setEnd] = useState(
    appointment
      ? appointment.allDay
        ? format(addDays(parseISO(appointment.end), -1), "yyyy-MM-dd'T'HH:mm")
        : appointment.end
      : format(addHours(parseISO(defaultStart), 1), "yyyy-MM-dd'T'HH:mm"),
  )
  const [contactId, setContactId] = useState(
    appointment?.contactId ?? initialContact ?? "",
  )
  const [dealId, setDealId] = useState(appointment?.dealId ?? initialDeal ?? "")
  const [taskId, setTaskId] = useState(appointment?.taskId ?? initialTask ?? "")
  const [calendar, setCalendar] = useState<Appointment["calendar"]>(
    appointment?.calendar ?? "Sales",
  )
  const contactOptions = contacts.filter(
    (contact) =>
      contact.stage !== "Archived" || contact.id === appointment?.contactId,
  )
  const availableDeals = deals.filter((deal) => deal.contactId === contactId)
  const availableTasks = tasks.filter(
    (task) =>
      task.contactId === contactId && task.dealId === (dealId || undefined),
  )
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) form.requestClose()
      }}
    >
      <DialogContent
        coverParent
        finalFocus={finalFocus}
        className="workspace-dialog sm:max-w-xl"
      >
        <DialogHeader className="workspace-overlay-heading">
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
          {...form.formProps}
          className="naum-form"
          onSubmit={form.submit((data) => {
            const startValue = allDay ? `${start.slice(0, 10)}T00:00` : start
            const endDate = parseISO(end.slice(0, 10))
            const endValue =
              allDay && isValid(endDate)
                ? format(addDays(endDate, 1), "yyyy-MM-dd'T'HH:mm")
                : end
            const saved: Appointment = {
              id: appointment?.id ?? crypto.randomUUID(),
              title: String(data.get("title") ?? "").trim(),
              description: String(data.get("description") ?? "").trim(),
              start: startValue,
              end: endValue,
              allDay,
              calendar,
              contactId: contactId || undefined,
              dealId: dealId || undefined,
              taskId: taskId || undefined,
            }
            assertValid({
              ...validateAppointment(saved, workspace),
              ...(contactId &&
              !contactOptions.some((contact) => contact.id === contactId)
                ? { contact: "Choose an active contact." }
                : {}),
            })
            saveAppointment(saved)
            onSaved?.(saved)
            notify(appointment ? "Appointment updated" : "Appointment added", {
              action: {
                label: "View appointment",
                onClick: () =>
                  router.push(`/showcase/calendar?event=${saved.id}`),
              },
            })
          })}
        >
          <div className="naum-field">
            <Label htmlFor={`${id}-title`}>Title</Label>
            <Input
              id={`${id}-title`}
              name="title"
              required
              maxLength={120}
              defaultValue={appointment?.title ?? defaultTitle}
              autoFocus
              {...form.field("title")}
            />
            <WorkspaceFieldError {...form.error("title")} />
          </div>
          <div className="flex items-center gap-(--naum-space-inline)">
            <Checkbox
              id={`${id}-all-day`}
              checked={allDay}
              onCheckedChange={(checked) => {
                setAllDay(checked)
                form.markDirty("end")
              }}
            />
            <Label htmlFor={`${id}-all-day`}>All day</Label>
          </div>
          <div className="grid gap-(--naum-space-section) sm:grid-cols-2">
            <div className="naum-field">
              <Label htmlFor={`${id}-start`}>Start</Label>
              <DateTimePicker
                id={`${id}-start`}
                label="Start"
                value={start}
                dateOnly={allDay}
                onValueChange={(value) => {
                  const from = parseISO(start)
                  const to = parseISO(end)
                  const next = parseISO(value)
                  if ([from, to, next].every(isValid)) {
                    const duration = allDay
                      ? differenceInCalendarDays(to, from)
                      : differenceInMinutes(to, from)
                    if (allDay ? duration >= 0 : duration > 0) {
                      setEnd(
                        format(
                          allDay
                            ? addDays(next, duration)
                            : addMinutes(next, duration),
                          "yyyy-MM-dd'T'HH:mm",
                        ),
                      )
                    }
                  }
                  setStart(value)
                  form.markDirty("start", "end")
                }}
                {...form.field("start")}
              />
              <WorkspaceFieldError {...form.error("start")} />
            </div>
            <div className="naum-field">
              <Label htmlFor={`${id}-end`}>End</Label>
              <DateTimePicker
                id={`${id}-end`}
                label="End"
                value={end}
                dateOnly={allDay}
                onValueChange={(value) => {
                  setEnd(value)
                  form.markDirty("end")
                }}
                {...form.field("end")}
              />
              <WorkspaceFieldError {...form.error("end")} />
            </div>
          </div>
          <div className="grid gap-(--naum-space-section) sm:grid-cols-2">
            <div className="naum-field">
              <Label htmlFor={`${id}-calendar`}>Calendar</Label>
              <SelectControl
                id={`${id}-calendar`}
                className="w-full"
                value={calendar}
                onValueChange={(value) => {
                  if (value) setCalendar(value)
                  form.markDirty("calendar")
                }}
                items={CALENDARS.map((calendar) => ({
                  value: calendar,
                  label: calendar,
                }))}
                {...form.field("calendar")}
              />
              <WorkspaceFieldError {...form.error("calendar")} />
            </div>
            <div className="naum-field">
              <Label htmlFor={`${id}-contact`}>Contact</Label>
              <SelectControl
                id={`${id}-contact`}
                className="w-full"
                value={
                  !contactId ||
                  contactOptions.some((contact) => contact.id === contactId)
                    ? contactId
                    : null
                }
                placeholder="Choose a contact"
                onValueChange={(value) => {
                  setContactId(value ?? "")
                  setDealId("")
                  setTaskId("")
                  form.markDirty("contact")
                }}
                items={[
                  { value: "", label: "No contact" },
                  ...contactOptions.map((contact) => ({
                    value: contact.id,
                    label: contact.name,
                  })),
                ]}
                {...form.field("contact")}
              />
              <WorkspaceFieldError {...form.error("contact")} />
            </div>
          </div>
          {contactId && (
            <div className="grid gap-(--naum-space-section) sm:grid-cols-2">
              <div className="naum-field">
                <Label htmlFor={`${id}-deal`}>Opportunity</Label>
                <SelectControl
                  id={`${id}-deal`}
                  className="w-full"
                  value={
                    !dealId || availableDeals.some((deal) => deal.id === dealId)
                      ? dealId
                      : null
                  }
                  placeholder="Choose an opportunity"
                  onValueChange={(value) => {
                    setDealId(value ?? "")
                    setTaskId("")
                    form.markDirty("deal")
                  }}
                  items={[
                    { value: "", label: "No opportunity" },
                    ...availableDeals.map((deal) => ({
                      value: deal.id,
                      label: deal.title,
                    })),
                  ]}
                  {...form.field("deal")}
                />
                <WorkspaceFieldError {...form.error("deal")} />
              </div>
              <div className="naum-field">
                <Label htmlFor={`${id}-task`}>Task</Label>
                <SelectControl
                  id={`${id}-task`}
                  className="w-full"
                  value={
                    !taskId || availableTasks.some((task) => task.id === taskId)
                      ? taskId
                      : null
                  }
                  placeholder="Choose a task"
                  onValueChange={(value) => {
                    setTaskId(value ?? "")
                    form.markDirty("task")
                  }}
                  items={[
                    { value: "", label: "No task" },
                    ...availableTasks.map((task) => ({
                      value: task.id,
                      label: task.title,
                    })),
                  ]}
                  {...form.field("task")}
                />
                <WorkspaceFieldError {...form.error("task")} />
              </div>
            </div>
          )}
          <div className="naum-field">
            <Label htmlFor={`${id}-description`}>Description</Label>
            <Textarea
              id={`${id}-description`}
              name="description"
              maxLength={2000}
              defaultValue={appointment?.description}
              rows={2}
              {...form.field("description")}
            />
            <WorkspaceFieldError {...form.error("description")} />
          </div>
          <WorkspaceFieldError {...form.error("_form")} />
          <div className="flex flex-wrap items-center justify-between gap-(--naum-space-inline)">
            {appointment ? (
              <Button
                variant="destructive"
                type="button"
                disabled={form.saving}
                onClick={() => {
                  const undo = removeAppointment(appointment.id)
                  notify("Appointment deleted", {
                    action: {
                      label: "Undo",
                      confirmation: "Appointment restored",
                      onClick: undo,
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
            <div className="flex gap-(--naum-space-inline)">
              <Button
                type="button"
                variant="outline"
                disabled={form.saving}
                onClick={form.requestClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.saving}>
                Save appointment
              </Button>
            </div>
          </div>
        </form>
        <CustomerContext
          contactId={contactId}
          dealId={dealId}
          taskId={taskId}
          onNavigate={navigate}
        />
        <DiscardChangesDialog {...form.discardProps} />
      </DialogContent>
    </Dialog>
  )
}
