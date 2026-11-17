import type { ExampleState } from "./example-state-control"

export const dateTimePickerExampleCode = (
  state: ExampleState,
  dateOnly: boolean,
  disabled: boolean,
) => `import { useState } from "react"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MotionFadeUp } from "@/components/ui/motion"

export const AppointmentExample = () => {
  const [loading, setLoading] = useState(${state === "loading"})
  const [value, setValue] = useState("${state === "empty" ? "" : (state === "error" ? "2026-11-16" : "2026-11-17") + (dateOnly ? "T00:00" : "T09:30")}")
  // Validate local dates in your form; this picker does not apply constraints.
  const invalid = !!value && value.slice(0, 10) < "2026-11-17"
  return <MotionFadeUp key={String(loading)} className="space-y-3">
    {loading ? <>
      <div aria-busy="true"><Skeleton className="h-10 w-full" /></div>
      <p role="status">Loading appointment…</p>
      <Button onClick={() => setLoading(false)}>Finish loading</Button>
    </> : <>
      <Label htmlFor="appointment">Appointment</Label>
      <DateTimePicker id="appointment" name="appointment" label="Appointment"
        value={value} onValueChange={setValue} dateOnly={${dateOnly}} disabled={${disabled}}
        aria-invalid={invalid} aria-describedby="appointment-help" />
      <p id="appointment-help" role={invalid ? "alert" : undefined}>
        {invalid ? "Choose 17 November 2026 or later." : !value ? "No appointment selected." : "17 November 2026 or later."}
      </p>
      <Button disabled={${disabled} || !value} onClick={() => setValue("")}>Clear date</Button>
      {invalid && <Button disabled={${disabled}} onClick={() => setValue("2026-11-17T${dateOnly ? "00:00" : "09:30"}")}>Use valid date</Button>}
      <p role="status">Value: {value || "(empty)"}</p>
    </>}
  </MotionFadeUp>
}`
