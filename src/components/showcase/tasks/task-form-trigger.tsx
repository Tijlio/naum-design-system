"use client"

import { useRef, useState, type ComponentProps } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShowcase } from "../showcase-provider"
import { TaskEditor, type TaskEditorProps } from "./task-editor"
export const TaskFormTrigger = ({
  task,
  contactId,
  dealId,
  variant,
}: Omit<TaskEditorProps, "onClose" | "finalFocus"> & {
  variant?: ComponentProps<typeof Button>["variant"]
}) => {
  const [open, setOpen] = useState(false)
  const launcher = useRef<HTMLButtonElement>(null)
  const { contacts } = useShowcase()
  const enabled = contacts.some((contact) =>
    task
      ? contact.id === task.contactId
      : contact.stage !== "Archived" &&
        (!contactId || contact.id === contactId),
  )
  return (
    <>
      <Button
        ref={launcher}
        type="button"
        variant={variant ?? (task ? "link" : "outline")}
        size="sm"
        disabled={!enabled}
        className={
          task
            ? "h-auto justify-start p-0 text-left whitespace-normal"
            : undefined
        }
        aria-label={task ? `Edit task ${task.title}` : undefined}
        onClick={() => setOpen(true)}
      >
        {task ? (
          task.title
        ) : (
          <>
            <Plus />
            New task
          </>
        )}
      </Button>
      {open && (
        <TaskEditor
          finalFocus={launcher}
          task={task}
          contactId={contactId}
          dealId={dealId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
