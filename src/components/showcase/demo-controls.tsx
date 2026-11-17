"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useShowcase } from "./showcase-provider"

export const DemoControls = () => {
  const { resetDemo, persistence } = useShowcase()
  const [open, setOpen] = useState(false)
  return (
    <>
      {persistence === "session" && (
        <Badge variant="outline" role="status">
          Session only
        </Badge>
      )}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          render={
            <Button variant="glass" size="icon-sm" aria-label="Reset demo data">
              <RotateCcw />
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset demo data?</AlertDialogTitle>
            <AlertDialogDescription>
              This replaces contacts, appointments, opportunities, tasks and
              saved views with the original demo data in this browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetDemo()
                setOpen(false)
                toast.success("Demo data reset")
              }}
            >
              Reset demo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
