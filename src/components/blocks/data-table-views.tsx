"use client"

import { useId, useState, type FormEvent } from "react"
import { Bookmark, Save, Trash2 } from "lucide-react"
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

export type DataTableViewItem = { id: string; name: string; readOnly?: boolean }
export type DataTableViewsProps = {
  views: readonly DataTableViewItem[]
  selected?: string
  onSelect: (id: string) => void
  onSave: (name: string) => void
  onUpdate?: (id: string) => void
  onDelete?: (id: string) => void
}

export const DataTableViews = ({
  views,
  selected,
  onSelect,
  onSave,
  onUpdate,
  onDelete,
}: DataTableViewsProps) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const id = useId()
  const current = views.find((view) => view.id === selected)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = String(
      new FormData(event.currentTarget).get("name") ?? "",
    ).trim()
    if (
      !name ||
      views.some((view) => view.name.toLowerCase() === name.toLowerCase())
    ) {
      setError("Choose a unique view name.")
      return
    }
    onSave(name)
    setOpen(false)
  }
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Saved views">
      <Bookmark className="size-4 text-muted-foreground" aria-hidden />
      <Label htmlFor={`${id}-view`} className="sr-only">
        Saved view
      </Label>
      <SelectControl
        id={`${id}-view`}
        placeholder="Custom view"
        value={current?.id ?? null}
        items={views.map((view) => ({ value: view.id, label: view.name }))}
        onValueChange={(value) => value && onSelect(value)}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setError("")
          setOpen(true)
        }}
      >
        <Save />
        Save view
      </Button>
      {current && !current.readOnly && (
        <>
          <Button
            variant="ghost"
            size="sm"
            disabled={!onUpdate}
            onClick={() => onUpdate?.(current.id)}
          >
            Update view
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete view ${current.name}`}
            disabled={!onDelete}
            onClick={() => onDelete?.(current.id)}
          >
            <Trash2 />
          </Button>
        </>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save view</DialogTitle>
            <DialogDescription>
              Keep the current filters, sorting and columns.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-name`}>View name</Label>
              <Input
                autoFocus
                id={`${id}-name`}
                name="name"
                required
                maxLength={60}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
              />
            </div>
            {error && (
              <p
                id={`${id}-error`}
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save view</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
