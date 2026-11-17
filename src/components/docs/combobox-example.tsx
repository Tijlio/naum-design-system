"use client"

import { useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { ExampleFrame } from "./example-frame"
import { ExampleStateContent } from "./example-state-content"
import { ExampleStateControl, type ExampleState } from "./example-state-control"
import { comboboxExampleCode } from "./combobox-example-code"

const TEAMS = ["Design", "Engineering", "Marketing", "Sales"]

export const ComboboxExample = () => {
  const [state, setState] = useState<ExampleState>("ready")
  const [value, setValue] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [disabled, setDisabled] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const changeState = (next: ExampleState) => {
    setState(next)
    setQuery("")
    setValue(null)
  }
  const recover = () => {
    changeState("ready")
    requestAnimationFrame(() => inputRef.current?.focus())
  }
  return (
    <ExampleFrame
      controls={
        <>
          <ExampleStateControl value={state} onChange={changeState} />
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${id}-disabled`}
              checked={disabled}
              onCheckedChange={setDisabled}
            />
            <Label htmlFor={`${id}-disabled`}>Disabled</Label>
          </div>
        </>
      }
      code={comboboxExampleCode(state, disabled)}
      contract="items provide the available values. This searchable popup keeps its input and recovery actions together. Use value/onValueChange for selection and inputValue/onInputValueChange for search text; these are separate controlled values. ComboboxInput supports showClear, disabled and ARIA props. This example uses modal and aria-modal to keep keyboard focus with the popup and its recovery actions. Arrow keys navigate, Enter selects and Escape dismisses and restores trigger focus. ComboboxEmpty handles filtered no-results; loading, request errors and an empty dataset are host states. Retry and Load sample teams recover without a server. Popup transitions and MotionFadeUp use Naum reduced-motion preferences. For object items, supply itemToStringLabel and stable value equality as needed."
    >
      <div className="w-full max-w-sm space-y-3">
        <Label htmlFor={`${id}-team`}>Team</Label>
        <Combobox
          modal
          items={state === "ready" ? TEAMS : []}
          value={value}
          onValueChange={setValue}
          inputValue={query}
          onInputValueChange={setQuery}
          disabled={disabled}
        >
          <ComboboxTrigger
            id={`${id}-team`}
            render={
              <Button variant="outline" className="w-full justify-between" />
            }
            aria-label="Choose team"
            disabled={disabled}
          >
            <ComboboxValue placeholder="Choose a team" />
          </ComboboxTrigger>
          <ComboboxContent aria-label="Choose team" aria-modal="true">
            <Label htmlFor={`${id}-search`} className="sr-only">
              Search teams
            </Label>
            <ComboboxInput
              ref={inputRef}
              id={`${id}-search`}
              placeholder="Search teams…"
              showTrigger={false}
              showClear
              disabled={disabled}
              aria-invalid={state === "error"}
              aria-describedby={`${id}-help`}
              className="w-full"
            />
            {state === "ready" ? (
              <ComboboxEmpty>
                <div className="space-y-2">
                  <p>No matching teams.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setQuery("")
                      inputRef.current?.focus()
                    }}
                  >
                    Clear search
                  </Button>
                </div>
              </ComboboxEmpty>
            ) : (
              <div className="p-3">
                <ExampleStateContent
                  state={state}
                  onRecover={recover}
                  subject="teams"
                  emptyTitle="No teams yet"
                  emptyAction="Load sample teams"
                />
              </div>
            )}
            <p
              id={`${id}-help`}
              className={
                state === "error"
                  ? "px-3 py-2 text-xs text-destructive"
                  : "px-3 py-2 text-xs text-muted-foreground"
              }
            >
              {state === "loading"
                ? "Loading available teams."
                : state === "error"
                  ? "Try loading the teams again."
                  : state === "empty"
                    ? "Load sample teams to choose one."
                    : "Search, select or clear a team."}
            </p>
            <ComboboxList>
              {(team: string) => (
                <ComboboxItem key={team} value={team}>
                  {team}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <p role="status" className="text-sm text-muted-foreground">
          Selected: {value || "None"}
        </p>
      </div>
    </ExampleFrame>
  )
}
