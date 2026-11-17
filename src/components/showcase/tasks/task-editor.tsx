"use client"

import { useId, useState, type FormEvent } from "react"
import { isValid, parseISO } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { DEMO_DATE } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import type { FollowUpTask } from "./task-data"

export type TaskEditorProps = {
  task?: FollowUpTask
  contactId?: string
  dealId?: string
  onClose: () => void
}
export const TaskEditor = ({
  task,
  contactId: initialContact,
  dealId: initialDeal,
  onClose,
}: TaskEditorProps) => {
  const { contacts, deals, saveTask, removeTask } = useShowcase()
  const id = useId()
  const options = contacts.filter(
    (contact) =>
      contact.stage !== "Archived" ||
      contact.id === (task?.contactId ?? initialContact),
  )
  const [contactId, setContactId] = useState(
    task?.contactId ?? initialContact ?? options[0]?.id ?? "",
  )
  const [dealId, setDealId] = useState(task?.dealId ?? initialDeal ?? "")
  const [dueDate, setDueDate] = useState(task?.dueDate ?? DEMO_DATE)
  const [completed, setCompleted] = useState(task?.completed ?? false)
  const [error, setError] = useState("")
  const available = deals.filter((deal) => deal.contactId === contactId)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const title = String(
      new FormData(event.currentTarget).get("title") ?? "",
    ).trim()
    if (
      !title ||
      !isValid(parseISO(dueDate)) ||
      !options.some((contact) => contact.id === contactId) ||
      (dealId && !available.some((deal) => deal.id === dealId))
    ) {
      setError("Enter a title, deadline and valid contact or opportunity.")
      return
    }
    saveTask({
      id: task?.id ?? crypto.randomUUID(),
      title,
      contactId,
      dealId: dealId || undefined,
      dueDate,
      completed,
    })
    toast.success(task ? "Task updated" : "Task created")
    onClose()
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="workspace-dialog sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the follow-up and deadline."
              : "Plan the next step for this relationship."}
          </DialogDescription>
        </DialogHeader>
        <form className="workspace-form" onSubmit={submit}>
          <div className="workspace-field">
            <Label htmlFor={`${id}-title`}>Title</Label>
            <Input
              autoFocus
              id={`${id}-title`}
              name="title"
              required
              maxLength={160}
              defaultValue={task?.title}
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor={`${id}-due`}>Due date</Label>
            <DateTimePicker
              id={`${id}-due`}
              className="w-full"
              label="Due date"
              value={`${dueDate}T00:00`}
              dateOnly
              onValueChange={(value) => setDueDate(value.slice(0, 10))}
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor={`${id}-contact`}>Contact</Label>
            <SelectControl
              id={`${id}-contact`}
              className="w-full"
              value={contactId}
              items={options.map((contact) => ({
                value: contact.id,
                label: contact.name,
              }))}
              onValueChange={(value) => {
                if (value) {
                  setContactId(value)
                  setDealId("")
                }
              }}
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor={`${id}-deal`}>Opportunity</Label>
            <SelectControl
              id={`${id}-deal`}
              className="w-full"
              value={dealId}
              items={[
                { value: "", label: "No opportunity" },
                ...available.map((deal) => ({
                  value: deal.id,
                  label: deal.title,
                })),
              ]}
              onValueChange={(value) => value !== null && setDealId(value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${id}-done`}
              checked={completed}
              onCheckedChange={setCompleted}
            />
            <Label htmlFor={`${id}-done`}>Completed</Label>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter className="flex-wrap sm:justify-between">
            {task && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  removeTask(task.id)
                  onClose()
                  toast.success("Task deleted", {
                    action: { label: "Undo", onClick: () => saveTask(task) },
                  })
                }}
              >
                Delete
              </Button>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save task</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
