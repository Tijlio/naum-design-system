import {
  ComponentExamples,
  INTERACTIVE_COMPONENTS as BASIC_COMPONENTS,
} from "./component-examples"
import { OverlayExample } from "./overlay-example"

export const INTERACTIVE_COMPONENTS = [...BASIC_COMPONENTS, "dialog", "sheet"]

export const InteractiveExamples = ({ name }: { name: string }) => {
  if (name === "dialog" || name === "sheet")
    return <OverlayExample kind={name} />
  return <ComponentExamples name={name} />
}
