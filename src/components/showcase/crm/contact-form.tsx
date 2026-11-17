"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { CONTACT_STAGES, DEMO_DATE, type ContactStage } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { Plus } from "lucide-react"

const isStage = (value: string): value is ContactStage =>
  CONTACT_STAGES.some((stage) => stage === value)

export const ContactForm = () => {
  const [open, setOpen] = useState(false)
  const { saveContact } = useShowcase()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus />
        New contact
      </DialogTrigger>
      <DialogContent className="workspace-dialog">
        <DialogHeader className="workspace-overlay-heading">
          <DialogTitle>New contact</DialogTitle>
          <DialogDescription>Add someone to your workspace.</DialogDescription>
        </DialogHeader>
        <form
          className="workspace-form"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            const name = data.get("name"),
              email = data.get("email"),
              company = data.get("company"),
              stage = data.get("stage")
            if (
              typeof name !== "string" ||
              !name.trim() ||
              typeof email !== "string" ||
              !email.trim() ||
              typeof company !== "string" ||
              !company.trim() ||
              typeof stage !== "string" ||
              !isStage(stage)
            )
              return
            saveContact({
              id: crypto.randomUUID(),
              name: name.trim(),
              email: email.trim(),
              company: company.trim(),
              role: "Contact",
              stage,
              owner: "Alex Morgan",
              value: 0,
              lastContact: DEMO_DATE,
              notes: [],
            })
            setOpen(false)
            toast.success("Contact added")
          }}
        >
          <div className="workspace-field">
            <Label htmlFor="contact-name">Full name</Label>
            <Input
              id="contact-name"
              name="name"
              required
              maxLength={100}
              autoComplete="name"
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor="contact-company">Company</Label>
            <Input
              id="contact-company"
              name="company"
              required
              maxLength={100}
              autoComplete="organization"
            />
          </div>
          <div className="workspace-field">
            <Label htmlFor="contact-stage">Relationship</Label>
            <SelectControl
              id="contact-stage"
              name="stage"
              defaultValue="Lead"
              className="w-full"
              items={CONTACT_STAGES.filter((stage) => stage !== "Archived").map(
                (stage) => ({ value: stage, label: stage }),
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add contact</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
