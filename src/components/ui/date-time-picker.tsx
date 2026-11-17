"use client"

import { useId, useState, type ComponentProps } from "react"
import { format, isValid, parseISO } from "date-fns"
import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SelectControl } from "@/components/ui/select-control"
import { cn } from "@/lib/utils"

const HOURS = Array.from({ length: 24 }, (_, hour) => ({
  value: String(hour).padStart(2, "0"),
  label: String(hour).padStart(2, "0"),
}))
const MINUTES = Array.from({ length: 60 }, (_, minute) => ({
  value: String(minute).padStart(2, "0"),
  label: String(minute).padStart(2, "0"),
}))

export const DateTimePicker = ({
  value,
  onValueChange,
  dateOnly = false,
  label = "Date and time",
  className,
  name,
  ...props
}: Pick<
  ComponentProps<typeof Button>,
  "id" | "disabled" | "aria-invalid" | "aria-describedby" | "aria-label"
> & {
  value: string
  onValueChange: (value: string) => void
  dateOnly?: boolean
  label?: string
  className?: string
  name?: string
}) => {
  const [open, setOpen] = useState(false)
  const generatedId = useId()
  const parsed = parseISO(value)
  const selected = isValid(parsed) ? parsed : undefined
  const time = selected ? format(selected, "HH:mm") : "09:00"
  const hour = time.slice(0, 2),
    minute = time.slice(3, 5)
  const updateTime = (hour: string, minute: string) => {
    const day = selected
      ? format(selected, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
    onValueChange(`${day}T${hour}:${minute}`)
  }
  const hourId = `${props.id ?? generatedId}-hour`
  const minuteId = `${props.id ?? generatedId}-minute`
  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                "w-full min-w-0 justify-between border-input bg-input/30 font-normal",
                !selected && "text-muted-foreground",
                className,
              )}
              {...props}
              aria-label={props["aria-label"] ?? label}
            />
          }
        >
          <span className="truncate">
            {selected
              ? format(
                  selected,
                  dateOnly ? "dd MMM yyyy" : "dd MMM yyyy, HH:mm",
                )
              : "Choose a date"}
          </span>
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto max-w-[calc(100vw-2rem)] gap-3 p-3"
          aria-label={`${label} picker`}
        >
          <PopoverTitle className="sr-only">{label}</PopoverTitle>
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            weekStartsOn={1}
            className="p-0"
            onSelect={(day) => {
              if (!day) return
              onValueChange(
                dateOnly
                  ? `${format(day, "yyyy-MM-dd")}T00:00`
                  : `${format(day, "yyyy-MM-dd")}T${time}`,
              )
              if (dateOnly) setOpen(false)
            }}
          />
          {!dateOnly && (
            <div className="grid grid-cols-2 gap-3 border-t pt-3">
              <div className="grid gap-2">
                <Label htmlFor={hourId}>Hour</Label>
                <SelectControl
                  id={hourId}
                  aria-label={`${label} hour`}
                  className="w-full"
                  items={HOURS}
                  value={hour}
                  onValueChange={(next) => {
                    if (next) updateTime(next, minute)
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={minuteId}>Minute</Label>
                <SelectControl
                  id={minuteId}
                  aria-label={`${label} minute`}
                  className="w-full"
                  items={MINUTES}
                  value={minute}
                  onValueChange={(next) => {
                    if (next) updateTime(hour, next)
                  }}
                />
              </div>
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </PopoverContent>
      </Popover>
    </>
  )
}
