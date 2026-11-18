"use client"

import { useRef, useState } from "react"
import { CalendarPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEMO_DATE } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { EventEditor } from "./event-editor"

export const EventFormTrigger = ({
  contactId,
  dealId,
  taskId,
  disabled = false,
}: {
  contactId: string
  dealId?: string
  taskId?: string
  disabled?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const launcher = useRef<HTMLButtonElement>(null)
  const { contacts, tasks } = useShowcase()
  const task = tasks.find((task) => task.id === taskId)
  const enabled =
    contacts.some(
      (contact) => contact.id === contactId && contact.stage !== "Archived",
    ) &&
    (!taskId || Boolean(task))
  return (
    <>
      <Button
        ref={launcher}
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || !enabled}
        onClick={() => setOpen(true)}
      >
        <CalendarPlus />
        {taskId ? "Schedule appointment" : "New appointment"}
      </Button>
      {open && (
        <EventEditor
          finalFocus={launcher}
          defaultStart={`${task?.dueDate ?? DEMO_DATE}T09:00`}
          defaultTitle={task?.title.slice(0, 120)}
          contactId={contactId}
          dealId={dealId}
          taskId={taskId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
