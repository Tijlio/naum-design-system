"use client"

import { useId, type ComponentProps } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { CONTACT_STAGES, DEMO_DATE, type Contact } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { assertValid, validateContact } from "../workspace-validation"
import { useWorkspaceForm } from "../forms/use-workspace-form"
import { WorkspaceFieldError } from "../forms/workspace-field-error"
import { DiscardChangesDialog } from "../forms/discard-changes-dialog"

export const ContactEditor = ({
  onClose,
  finalFocus,
}: {
  onClose: () => void
  finalFocus?: ComponentProps<typeof DialogContent>["finalFocus"]
}) => {
  const { saveContact } = useShowcase()
  const form = useWorkspaceForm(onClose)
  const router = useRouter()
  const id = useId()
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) form.requestClose()
      }}
    >
      <DialogContent finalFocus={finalFocus} className="workspace-dialog">
        <DialogHeader className="workspace-overlay-heading">
          <DialogTitle>New contact</DialogTitle>
          <DialogDescription>Add someone to your workspace.</DialogDescription>
        </DialogHeader>
        <form
          {...form.formProps}
          className="naum-form"
          onSubmit={form.submit((data) => {
            const stage = CONTACT_STAGES.find(
              (stage) => stage === data.get("stage"),
            )
            const contact: Contact = {
              id: crypto.randomUUID(),
              name: String(data.get("name") ?? "").trim(),
              email: String(data.get("email") ?? "").trim(),
              company: String(data.get("company") ?? "").trim(),
              role: "Contact",
              stage: stage ?? "Lead",
              owner: "Alex Morgan",
              value: 0,
              lastContact: DEMO_DATE,
              notes: [],
            }
            assertValid(validateContact(contact))
            saveContact(contact)
            toast.success("Contact added", {
              action: {
                label: "View contact",
                onClick: () =>
                  router.push(`/showcase/crm/contacts?contact=${contact.id}`),
              },
            })
          })}
        >
          <div className="naum-field">
            <Label htmlFor={`${id}-name`}>Full name</Label>
            <Input
              id={`${id}-name`}
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              autoFocus
              {...form.field("name")}
            />
            <WorkspaceFieldError {...form.error("name")} />
          </div>
          <div className="naum-field">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              {...form.field("email")}
            />
            <WorkspaceFieldError {...form.error("email")} />
          </div>
          <div className="naum-field">
            <Label htmlFor={`${id}-company`}>Company</Label>
            <Input
              id={`${id}-company`}
              name="company"
              required
              maxLength={100}
              autoComplete="organization"
              {...form.field("company")}
            />
            <WorkspaceFieldError {...form.error("company")} />
          </div>
          <div className="naum-field">
            <Label htmlFor={`${id}-stage`}>Relationship</Label>
            <SelectControl
              id={`${id}-stage`}
              name="stage"
              defaultValue="Lead"
              className="w-full"
              items={CONTACT_STAGES.filter((stage) => stage !== "Archived").map(
                (stage) => ({ value: stage, label: stage }),
              )}
              {...form.field("stage")}
              onValueChange={() => form.markDirty("stage")}
            />
            <WorkspaceFieldError {...form.error("stage")} />
          </div>
          <WorkspaceFieldError {...form.error("_form")} />
          <div className="flex justify-end gap-(--naum-space-inline)">
            <Button
              variant="outline"
              type="button"
              disabled={form.saving}
              onClick={form.requestClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.saving}>
              <Plus />
              Add contact
            </Button>
          </div>
        </form>
        <DiscardChangesDialog {...form.discardProps} />
      </DialogContent>
    </Dialog>
  )
}
