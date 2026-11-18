"use client"

import { useRef, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactEditor } from "./contact-editor"

export const ContactForm = () => {
  const [open, setOpen] = useState(false)
  const launcher = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={launcher} onClick={() => setOpen(true)}>
        <Plus />
        New contact
      </Button>
      {open && (
        <ContactEditor finalFocus={launcher} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
