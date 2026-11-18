"use client"

import { useRef, type ComponentProps } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const DiscardChangesDialog = ({
  open,
  onOpenChange,
  onDiscard,
  finalFocus,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiscard: () => void
  finalFocus?: ComponentProps<typeof AlertDialogContent>["finalFocus"]
}) => {
  const keepEditing = useRef<HTMLButtonElement>(null)
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent initialFocus={keepEditing} finalFocus={finalFocus}>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>
            Your changes have not been saved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={keepEditing}>Keep editing</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDiscard}>
            Discard changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
