"use client"

import { useState, type ComponentProps } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShowcase } from "../showcase-provider"
import { TaskEditor, type TaskEditorProps } from "./task-editor"
export const TaskFormTrigger = ({
  task,
  contactId,
  dealId,
  variant,
}: Omit<TaskEditorProps, "onClose"> & {
  variant?: ComponentProps<typeof Button>["variant"]
}) => {
  const [open, setOpen] = useState(false)
  const { contacts } = useShowcase()
  const enabled = contacts.some(
    (contact) =>
      contact.stage !== "Archived" ||
      contact.id === (task?.contactId ?? contactId),
  )
  return (
    <>
      <Button
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
          task={task}
          contactId={contactId}
          dealId={dealId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
