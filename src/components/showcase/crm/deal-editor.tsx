"use client"

import { useId, useState, type ComponentProps } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import { DEAL_STAGES, type Deal } from "../showcase-data"
import { RelatedTasks } from "../tasks/related-tasks"
import { useShowcase } from "../showcase-provider"
import { assertValid, validateDeal } from "../workspace-validation"
import { useWorkspaceForm } from "../forms/use-workspace-form"
import { WorkspaceFieldError } from "../forms/workspace-field-error"
import { DiscardChangesDialog } from "../forms/discard-changes-dialog"
import { RelatedAppointments } from "../calendar/related-appointments"
import { withWorkspaceRecovery } from "../workspace-feedback"
import { CustomerContext } from "../customer-context"

export const DealEditor = ({
  deal,
  contactId: initialContact,
  onClose,
  finalFocus,
}: {
  deal: Deal | null
  contactId?: string
  onClose: () => void
  finalFocus?: ComponentProps<typeof DialogContent>["finalFocus"]
}) => {
  const workspace = useShowcase()
  const { contacts, saveDeal, removeDeal } = workspace
  const options = contacts.filter(
    (contact) => contact.stage !== "Archived" || contact.id === deal?.contactId,
  )
  const [contactId, setContactId] = useState(
    deal?.contactId ?? initialContact ?? options[0]?.id ?? "",
  )
  const [stage, setStage] = useState<Deal["stage"]>(deal?.stage ?? "Discovery")
  const form = useWorkspaceForm(onClose)
  const id = useId()
  const router = useRouter()
  const navigate = (href: string) =>
    form.requestLeave(() => {
      onClose()
      router.push(href)
    })
  const remove = () => {
    if (!deal) return
    const undo = removeDeal(deal.id)
    toast.success("Opportunity deleted", {
      action: { label: "Undo", onClick: withWorkspaceRecovery(undo) },
    })
    onClose()
  }
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
          <DialogTitle>
            {deal ? "Edit opportunity" : "New opportunity"}
          </DialogTitle>
          <DialogDescription>
            {deal
              ? "Update the value, contact or stage."
              : "Add an opportunity to your pipeline."}
          </DialogDescription>
        </DialogHeader>
        <form
          {...form.formProps}
          className="naum-form"
          onSubmit={form.submit((data) => {
            const saved: Deal = {
              id: deal?.id ?? crypto.randomUUID(),
              title: String(data.get("title") ?? "").trim(),
              value: Number(data.get("value")),
              contactId,
              stage,
            }
            assertValid({
              ...validateDeal(saved, workspace),
              ...(contactId &&
              !options.some((contact) => contact.id === contactId)
                ? { contact: "Choose an active contact." }
                : {}),
            })
            saveDeal(saved)
            toast.success(
              deal ? "Opportunity updated" : "Opportunity created",
              {
                action: {
                  label: "View opportunity",
                  onClick: () =>
                    router.push(`/showcase/crm/pipeline?deal=${saved.id}`),
                },
              },
            )
          })}
        >
          <div className="naum-field">
            <Label htmlFor={`${id}-title`}>Title</Label>
            <Input
              id={`${id}-title`}
              name="title"
              defaultValue={deal?.title}
              required
              maxLength={160}
              autoFocus
              {...form.field("title")}
            />
            <WorkspaceFieldError {...form.error("title")} />
          </div>
          <div className="naum-field">
            <Label htmlFor={`${id}-value`}>Value (€)</Label>
            <Input
              id={`${id}-value`}
              name="value"
              type="number"
              min={0}
              max={1000000000}
              step="0.01"
              defaultValue={deal?.value ?? 0}
              required
              {...form.field("value")}
            />
            <WorkspaceFieldError {...form.error("value")} />
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
              onValueChange={(value) => {
                setContactId(value ?? "")
                form.markDirty("contact")
              }}
              items={options.map((contact) => ({
                value: contact.id,
                label: contact.name,
              }))}
              {...form.field("contact")}
            />
            <WorkspaceFieldError {...form.error("contact")} />
          </div>
          <div className="naum-field">
            <Label htmlFor={`${id}-stage`}>Stage</Label>
            <SelectControl
              id={`${id}-stage`}
              className="w-full"
              value={stage}
              onValueChange={(value) => {
                if (value) setStage(value)
                form.markDirty("stage")
              }}
              items={DEAL_STAGES.map((value) => ({ value, label: value }))}
              {...form.field("stage")}
            />
            <WorkspaceFieldError {...form.error("stage")} />
          </div>
          <WorkspaceFieldError {...form.error("_form")} />
          <DialogFooter className="flex-wrap sm:justify-between">
            {deal && (
              <Button
                type="button"
                variant="destructive"
                disabled={form.saving}
                onClick={remove}
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
                Save opportunity
              </Button>
            </div>
          </DialogFooter>
        </form>
        <CustomerContext contactId={contactId} onNavigate={navigate} />
        {deal && <RelatedTasks contactId={deal.contactId} dealId={deal.id} />}
        {deal && (
          <RelatedAppointments
            contactId={deal.contactId}
            dealId={deal.id}
            disabled={form.dirty}
            onNavigate={navigate}
          />
        )}
        <DiscardChangesDialog {...form.discardProps} />
      </DialogContent>
    </Dialog>
  )
}
