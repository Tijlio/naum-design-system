"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactEditor } from "./contact-editor"

export const ContactForm = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        New contact
      </Button>
      {open && <ContactEditor onClose={() => setOpen(false)} />}
    </>
  )
}
