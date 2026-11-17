import { useId } from "react"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"

export type ExampleState = "ready" | "loading" | "error" | "empty"
const states = [
  { value: "ready", label: "Ready" },
  { value: "loading", label: "Loading" },
  { value: "error", label: "Error" },
  { value: "empty", label: "Empty" },
] as const

export const ExampleStateControl = ({
  value,
  onChange,
  label = "Example state",
}: {
  value: ExampleState
  onChange: (value: ExampleState) => void
  label?: string
}) => {
  const id = useId()
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <SelectControl
        id={id}
        value={value}
        items={states}
        onValueChange={(next) => next && onChange(next)}
        className="w-full"
      />
    </div>
  )
}
