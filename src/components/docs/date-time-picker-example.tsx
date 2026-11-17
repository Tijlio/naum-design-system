"use client"

import { useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Label } from "@/components/ui/label"
import { ExampleFrame } from "./example-frame"
import { ExampleStateContent } from "./example-state-content"
import { ExampleStateControl, type ExampleState } from "./example-state-control"
import { dateTimePickerExampleCode } from "./date-time-picker-example-code"

const INITIAL_DATE = "2026-11-17T09:30"
const MINIMUM_DAY = "2026-11-17"

export const DateTimePickerExample = () => {
  const [state, setState] = useState<ExampleState>("ready")
  const [value, setValue] = useState(INITIAL_DATE)
  const [dateOnly, setDateOnly] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const exampleRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const invalid = !!value && value.slice(0, 10) < MINIMUM_DAY
  const changeState = (next: ExampleState) => {
    setState(next)
    const initial = dateOnly
      ? `${INITIAL_DATE.slice(0, 10)}T00:00`
      : INITIAL_DATE
    setValue(
      next === "empty"
        ? ""
        : next === "error"
          ? `2026-11-16T${dateOnly ? "00:00" : "09:30"}`
          : initial,
    )
  }
  const recover = () => {
    changeState("ready")
    requestAnimationFrame(() =>
      exampleRef.current
        ?.querySelector<HTMLButtonElement>('button[aria-label="Appointment"]')
        ?.focus(),
    )
  }
  return (
    <ExampleFrame
      controls={
        <>
          <ExampleStateControl value={state} onChange={changeState} />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${id}-date-only`}
                checked={dateOnly}
                onCheckedChange={(checked) => {
                  setDateOnly(checked)
                  if (checked && value) setValue(`${value.slice(0, 10)}T00:00`)
                }}
              />
              <Label htmlFor={`${id}-date-only`}>Date only</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`${id}-disabled`}
                checked={disabled}
                onCheckedChange={setDisabled}
              />
              <Label htmlFor={`${id}-disabled`}>Disabled</Label>
            </div>
          </div>
        </>
      }
      code={dateTimePickerExampleCode(state, dateOnly, disabled)}
      contract="Controlled value/onValueChange use a local ISO string (yyyy-MM-ddTHH:mm), without timezone conversion. An empty string shows “Choose a date”. dateOnly emits midnight for selected days. name adds a hidden form field. id, label, disabled, aria-invalid and aria-describedby are forwarded. Validation and loading belong to the host form. The error example requires 17 November 2026 or later; choose a valid day to recover. Calendar navigation, time selectors and Done use Naum controls and popup transitions. Finish loading is a deterministic demo action."
    >
      <div ref={exampleRef} className="w-full max-w-sm space-y-3">
        {state === "loading" ? (
          <ExampleStateContent
            state={state}
            onRecover={recover}
            subject="appointment"
            emptyTitle=""
            emptyAction=""
          />
        ) : (
          <>
            <Label htmlFor={`${id}-date`}>Appointment</Label>
            <DateTimePicker
              id={`${id}-date`}
              name="appointment"
              label="Appointment"
              value={value}
              dateOnly={dateOnly}
              disabled={disabled}
              onValueChange={(next) => {
                setValue(next)
                setState(next.slice(0, 10) < MINIMUM_DAY ? "error" : "ready")
              }}
              aria-invalid={invalid}
              aria-describedby={`${id}-help`}
            />
            <p
              id={`${id}-help`}
              role={invalid ? "alert" : undefined}
              className={
                invalid
                  ? "text-sm text-destructive"
                  : "text-sm text-muted-foreground"
              }
            >
              {invalid
                ? "Choose 17 November 2026 or later."
                : !value
                  ? "No appointment selected."
                  : "17 November 2026 or later."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled || !value}
                onClick={() => {
                  setValue("")
                  setState("empty")
                }}
              >
                Clear date
              </Button>
              {invalid && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={recover}
                >
                  Use valid date
                </Button>
              )}
            </div>
            <p
              role="status"
              className="text-xs break-all text-muted-foreground"
            >
              Value: {value || "(empty)"}
            </p>
          </>
        )}
      </div>
    </ExampleFrame>
  )
}
