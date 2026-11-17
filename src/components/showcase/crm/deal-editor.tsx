"use client"

import { useState, type FormEvent } from "react"
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
import { useShowcase } from "../showcase-provider"

export const DealEditor = ({
  deal,
  onClose,
}: {
  deal: Deal | null
  onClose: () => void
}) => {
  const { contacts, saveDeal, removeDeal } = useShowcase()
  const options = contacts.filter(
    (contact) => contact.stage !== "Archived" || contact.id === deal?.contactId,
  )
  const [contactId, setContactId] = useState(
    deal?.contactId ?? options[0]?.id ?? "",
  )
  const [stage, setStage] = useState<Deal["stage"]>(deal?.stage ?? "Discovery")
  const [error, setError] = useState("")
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const title = String(values.get("title") ?? "").trim()
    const value = Number(values.get("value"))
    if (
      !title ||
      !Number.isFinite(value) ||
      value < 0 ||
      !options.some((contact) => contact.id === contactId)
    ) {
      setError("Enter a title, valid value and contact.")
      return
    }
    saveDeal({
      id: deal?.id ?? crypto.randomUUID(),
      title,
      value,
      contactId,
      stage,
    })
    toast.success(deal ? "Opportunity updated" : "Opportunity created")
    onClose()
  }
  const remove = () => {
    if (!deal) return
    removeDeal(deal.id)
    onClose()
    toast.success("Opportunity deleted", {
      action: { label: "Undo", onClick: () => saveDeal(deal) },
    })
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
          className="workspace-form"
          onSubmit={submit}
          aria-describedby={error ? "deal-error" : undefined}
        >
          <div className="workspace-field">
            <Label htmlFor="deal-title">Title</Label>
            <Input
              id="deal-title"
              name="title"
              defaultValue={deal?.title}
              required
              maxLength={160}
              autoFocus
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor="deal-value">Value (€)</Label>
            <Input
              id="deal-value"
              name="value"
              type="number"
              min={0}
              max={1000000000}
              step="0.01"
              defaultValue={deal?.value ?? 0}
              required
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor="deal-contact">Contact</Label>
            <SelectControl
              id="deal-contact"
              className="w-full"
              value={contactId}
              onValueChange={(value) => value && setContactId(value)}
              items={options.map((contact) => ({
                value: contact.id,
                label: contact.name,
              }))}
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor="deal-stage">Stage</Label>
            <SelectControl
              id="deal-stage"
              className="w-full"
              value={stage}
              onValueChange={(value) => value && setStage(value)}
              items={DEAL_STAGES.map((value) => ({ value, label: value }))}
            />
          </div>
          {error && (
            <p
              id="deal-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <DialogFooter className="flex-wrap sm:justify-between">
            {deal && (
              <Button type="button" variant="destructive" onClick={remove}>
                Delete
              </Button>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save opportunity</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
