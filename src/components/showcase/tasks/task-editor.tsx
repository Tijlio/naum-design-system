"use client"

import { useId, useState, type ComponentProps } from "react"
import { useRouter } from "next/navigation"
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
import { WorkspaceNotice, useWorkspaceNotice } from "../workspace-notice"
import { useShowcase } from "../showcase-provider"
import { assertValid, validateTask } from "../workspace-validation"
import { useWorkspaceForm } from "../forms/use-workspace-form"
import { WorkspaceFieldError } from "../forms/workspace-field-error"
import { DiscardChangesDialog } from "../forms/discard-changes-dialog"
import { RelatedAppointments } from "../calendar/related-appointments"
import { CustomerContext } from "../customer-context"
import type { FollowUpTask } from "./task-data"

export type TaskEditorProps = {
  task?: FollowUpTask
  contactId?: string
  dealId?: string
  onClose: () => void
  finalFocus?: ComponentProps<typeof DialogContent>["finalFocus"]
}
export const TaskEditor = ({
  task,
  contactId: initialContact,
  dealId: initialDeal,
  onClose,
  finalFocus,
}: TaskEditorProps) => {
  const notify = useWorkspaceNotice()
  const workspace = useShowcase()
  const { contacts, deals, saveTask, removeTask } = workspace
  const options = contacts.filter(
    (contact) => contact.stage !== "Archived" || contact.id === task?.contactId,
  )
  const [contactId, setContactId] = useState(
    task?.contactId ?? initialContact ?? options[0]?.id ?? "",
  )
  const [dealId, setDealId] = useState(task?.dealId ?? initialDeal ?? "")
  const [dueDate, setDueDate] = useState(task?.dueDate ?? DEMO_DATE)
  const [completed, setCompleted] = useState(task?.completed ?? false)
  const available = deals.filter((deal) => deal.contactId === contactId)
  const form = useWorkspaceForm(onClose)
  const id = useId()
  const router = useRouter()
  const navigate = (href: string) =>
    form.requestLeave(() => {
      onClose()
      router.push(href)
    })
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
        className="workspace-dialog sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the follow-up and deadline."
              : "Plan the next step for this relationship."}
          </DialogDescription>
        </DialogHeader>
        <form
          {...form.formProps}
          className="naum-form"
          onSubmit={form.submit((data) => {
            const saved: FollowUpTask = {
              id: task?.id ?? crypto.randomUUID(),
              title: String(data.get("title") ?? "").trim(),
              contactId,
              dealId: dealId || undefined,
              dueDate,
              completed,
            }
            assertValid({
              ...validateTask(saved, workspace),
              ...(contactId &&
              !options.some((contact) => contact.id === contactId)
                ? { contact: "Choose an active contact." }
                : {}),
            })
            saveTask(saved)
            notify(task ? "Task updated" : "Task created", {
              action: {
                label: "View task",
                onClick: () =>
                  router.push(`/showcase/crm/tasks?task=${saved.id}`),
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
              maxLength={160}
              defaultValue={task?.title}
              autoFocus
              {...form.field("title")}
            />
            <WorkspaceFieldError {...form.error("title")} />
          </div>
          <div className="naum-field">
            <Label htmlFor={`${id}-due`}>Due date</Label>
            <DateTimePicker
              id={`${id}-due`}
              className="w-full"
              label="Due date"
              value={dueDate ? `${dueDate}T00:00` : ""}
              dateOnly
              onValueChange={(value) => {
                setDueDate(value.slice(0, 10))
                form.markDirty("due")
              }}
              {...form.field("due")}
            />
            <WorkspaceFieldError {...form.error("due")} />
          </div>
          <div className="naum-field">
            <Label htmlFor={`${id}-contact`}>Contact</Label>
            <SelectControl
              id={`${id}-contact`}
              className="w-full"
              value={
                options.some((contact) => contact.id === contactId)
                  ? contactId
                  : null
              }
              placeholder="Choose a contact"
              items={options.map((contact) => ({
                value: contact.id,
                label: contact.name,
              }))}
              onValueChange={(value) => {
                setContactId(value ?? "")
                setDealId("")
                form.markDirty("contact")
              }}
              {...form.field("contact")}
            />
            <WorkspaceFieldError {...form.error("contact")} />
          </div>
          <div className="naum-field">
            <Label htmlFor={`${id}-deal`}>Opportunity</Label>
            <SelectControl
              id={`${id}-deal`}
              className="w-full"
              value={
                !dealId || available.some((deal) => deal.id === dealId)
                  ? dealId
                  : null
              }
              placeholder="Choose an opportunity"
              items={[
                { value: "", label: "No opportunity" },
                ...available.map((deal) => ({
                  value: deal.id,
                  label: deal.title,
                })),
              ]}
              onValueChange={(value) => {
                setDealId(value ?? "")
                form.markDirty("deal")
              }}
              {...form.field("deal")}
            />
            <WorkspaceFieldError {...form.error("deal")} />
          </div>
          <div className="flex items-center gap-(--naum-space-inline)">
            <Checkbox
              id={`${id}-done`}
              checked={completed}
              onCheckedChange={(checked) => {
                setCompleted(checked)
                form.markDirty("completed")
              }}
            />
            <Label htmlFor={`${id}-done`}>Completed</Label>
          </div>
          <WorkspaceFieldError {...form.error("_form")} />
          <DialogFooter className="flex-wrap sm:justify-between">
            {task && (
              <Button
                type="button"
                variant="destructive"
                disabled={form.saving}
                onClick={() => {
                  const undo = removeTask(task.id)
                  notify("Task deleted", {
                    action: {
                      label: "Undo",
                      confirmation: "Task restored",
                      onClick: undo,
                    },
                  })
                  onClose()
                }}
              >
                Delete
              </Button>
            )}
            <div className="flex flex-wrap justify-end gap-(--naum-space-inline)">
              <Button
                type="button"
                variant="outline"
                disabled={form.saving}
                onClick={form.requestClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.saving}>
                Save task
              </Button>
            </div>
          </DialogFooter>
        </form>
        <CustomerContext
          contactId={contactId}
          dealId={dealId}
          onNavigate={navigate}
        />
        <WorkspaceNotice>
          {task && (
            <RelatedAppointments
              contactId={task.contactId}
              dealId={task.dealId}
              taskId={task.id}
              disabled={form.dirty}
              onNavigate={navigate}
            />
          )}
        </WorkspaceNotice>
        <DiscardChangesDialog {...form.discardProps} />
      </DialogContent>
    </Dialog>
  )
}
