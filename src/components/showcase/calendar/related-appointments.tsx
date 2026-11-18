"use client"

import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MotionLayout } from "@/components/ui/motion"
import { useShowcase } from "../showcase-provider"
import { EventFormTrigger } from "./event-form-trigger"

export const RelatedAppointments = ({
  contactId,
  dealId,
  taskId,
  disabled = false,
  onNavigate,
}: {
  contactId: string
  dealId?: string
  taskId?: string
  disabled?: boolean
  onNavigate?: (href: string) => void
}) => {
  const { appointments } = useShowcase()
  const matching = appointments
    .filter(
      (event) =>
        event.contactId === contactId &&
        (!dealId || event.dealId === dealId) &&
        (!taskId || event.taskId === taskId),
    )
    .sort((a, b) => a.start.localeCompare(b.start))
  return (
    <section aria-label="Related appointments" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-(--naum-space-inline)">
        <h3 className="font-medium">Appointments</h3>
        <EventFormTrigger
          contactId={contactId}
          dealId={dealId}
          taskId={taskId}
          disabled={disabled}
        />
      </div>
      {disabled && (
        <p className="text-xs text-muted-foreground">
          Save changes before scheduling.
        </p>
      )}
      {matching.map((event) => {
        const href = `/showcase/calendar?event=${encodeURIComponent(event.id)}`
        return (
          <MotionLayout key={event.id}>
            <Card size="sm">
              <CardContent className="space-y-1">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto max-w-full p-0 text-left whitespace-normal"
                  role="link"
                  nativeButton={false}
                  render={
                    <Link
                      href={href}
                      onClick={(click) => {
                        if (
                          onNavigate &&
                          !click.metaKey &&
                          !click.ctrlKey &&
                          !click.shiftKey &&
                          !click.altKey
                        ) {
                          click.preventDefault()
                          onNavigate(href)
                        }
                      }}
                    />
                  }
                >
                  {event.title}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(event.start), "d MMM yyyy")}
                  {event.allDay
                    ? " · All day"
                    : ` · ${format(parseISO(event.start), "HH:mm")}–${format(parseISO(event.end), "HH:mm")}`}
                </p>
              </CardContent>
            </Card>
          </MotionLayout>
        )
      })}
      {!matching.length && (
        <p className="text-sm text-muted-foreground">No appointments yet.</p>
      )}
    </section>
  )
}
