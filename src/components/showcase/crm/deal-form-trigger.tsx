"use client"

import { useRef, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShowcase } from "../showcase-provider"
import { DealEditor } from "./deal-editor"

export const DealFormTrigger = ({ contactId }: { contactId: string }) => {
  const [open, setOpen] = useState(false)
  const launcher = useRef<HTMLButtonElement>(null)
  const { contacts } = useShowcase()
  const enabled = contacts.some(
    (contact) => contact.id === contactId && contact.stage !== "Archived",
  )
  return (
    <>
      <Button
        ref={launcher}
        type="button"
        variant="outline"
        size="sm"
        disabled={!enabled}
        onClick={() => setOpen(true)}
      >
        <Plus />
        New opportunity
      </Button>
      {open && (
        <DealEditor
          finalFocus={launcher}
          deal={null}
          contactId={contactId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
