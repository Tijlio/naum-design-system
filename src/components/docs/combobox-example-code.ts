import type { ExampleState } from "./example-state-control"

export const comboboxExampleCode = (
  state: ExampleState,
  disabled: boolean,
) => `import { useRef, useState } from "react"
import { Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { MotionFadeUp } from "@/components/ui/motion"

const teams = ["Design", "Engineering", "Marketing", "Sales"]
export const TeamExample = () => {
  const [state, setState] = useState<"ready" | "loading" | "error" | "empty">("${state}")
  const [value, setValue] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const recover = () => { setState("ready"); setQuery(""); input.current?.focus() }
  return <div className="space-y-3">
    <Label htmlFor="team">Team</Label>
    <Combobox modal items={state === "ready" ? teams : []} value={value} onValueChange={setValue}
      inputValue={query} onInputValueChange={setQuery} disabled={${disabled}}>
      <ComboboxTrigger id="team" aria-label="Choose team" disabled={${disabled}} render={<Button variant="outline" />}>
        <ComboboxValue placeholder="Choose a team" />
      </ComboboxTrigger>
      <ComboboxContent aria-label="Choose team" aria-modal="true">
        <Label htmlFor="team-search" className="sr-only">Search teams</Label>
        <ComboboxInput id="team-search" ref={input} showClear showTrigger={false} disabled={${disabled}}
          aria-invalid={state === "error"} aria-describedby="team-help" placeholder="Search teams…" />
        {state === "ready" ? <ComboboxEmpty>
          <p>No matching teams.</p>
          <Button onClick={() => { setQuery(""); input.current?.focus() }}>Clear search</Button>
        </ComboboxEmpty> : <MotionFadeUp key={state} className="space-y-3 p-3">
          {state === "loading" && <>
            <div aria-busy="true"><Skeleton className="h-10 w-full" /></div>
            <p role="status">Loading teams…</p>
            <Button onClick={recover}>Finish loading</Button>
          </>}
          {state === "error" && <>
            <Alert variant="destructive"><AlertTitle>Could not load teams.</AlertTitle></Alert>
            <Button onClick={recover}>Retry</Button>
          </>}
          {state === "empty" && <Empty>
            <EmptyHeader><EmptyTitle>No teams yet</EmptyTitle></EmptyHeader>
            <Button onClick={recover}>Load sample teams</Button>
          </Empty>}
        </MotionFadeUp>}
    <p id="team-help" className="px-3 py-2 text-xs">{state === "error" ? "Try loading the teams again." : "Search, select or clear a team."}</p>
        <ComboboxList>{(team: string) => <ComboboxItem key={team} value={team}>{team}</ComboboxItem>}</ComboboxList>
      </ComboboxContent>
    </Combobox>
    <p role="status">Selected: {value || "None"}</p>
  </div>
}`
