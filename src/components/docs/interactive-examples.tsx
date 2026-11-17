import {
  ComponentExamples,
  INTERACTIVE_COMPONENTS as BASIC_COMPONENTS,
} from "./component-examples"
import { OverlayExample } from "./overlay-example"
import { DateTimePickerExample } from "./date-time-picker-example"
import { ComboboxExample } from "./combobox-example"

export const INTERACTIVE_COMPONENTS = [
  ...BASIC_COMPONENTS,
  "dialog",
  "sheet",
  "date-time-picker",
  "combobox",
]

export const InteractiveExamples = ({ name }: { name: string }) => {
  if (name === "dialog" || name === "sheet")
    return <OverlayExample kind={name} />
  if (name === "date-time-picker") return <DateTimePickerExample />
  if (name === "combobox") return <ComboboxExample />
  return <ComponentExamples name={name} />
}
