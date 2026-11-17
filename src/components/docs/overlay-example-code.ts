import type { ExampleState } from "./example-state-control"

export const overlayExampleCode = (
  kind: "dialog" | "sheet",
  state: ExampleState,
  side: "top" | "right" | "bottom" | "left",
  showClose: boolean,
) => {
  const name = kind === "dialog" ? "Dialog" : "Sheet"
  return `import { useState } from "react"
import { ${name}, ${name}Trigger, ${name}Content, ${name}Header, ${name}Title, ${name}Description, ${name}Footer, ${name}Close } from "@/components/ui/${kind}"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { MotionFadeUp } from "@/components/ui/motion"

export const WorkspaceExample = () => {
  const [open, setOpen] = useState(false)
  // Set this from your application's request state.
  const [state, setState] = useState<"ready" | "loading" | "error" | "empty">("${state}")
  const [name, setName] = useState("Naum Studio")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")
  return <>
    <${name} open={open} onOpenChange={setOpen}>
      <${name}Trigger render={<Button />}>Open ${kind}</${name}Trigger>
      <${name}Content${kind === "sheet" ? ` side="${side}"` : ""} showCloseButton={${showClose}} className="${kind === "sheet" ? "max-h-dvh" : "max-h-[calc(100dvh-2rem)]"} overflow-y-auto">
        <${name}Header className="pr-12">
          <${name}Title>Edit workspace</${name}Title>
          <${name}Description>Update your workspace name.</${name}Description>
        </${name}Header>
        <MotionFadeUp key={state}${kind === "sheet" ? ' className="px-6"' : ""}>
          {state === "loading" && <div className="space-y-3">
            <div aria-busy="true"><Skeleton className="h-10 w-full" /></div>
            <p role="status">Loading workspace…</p>
            <Button onClick={() => setState("ready")}>Finish loading</Button>
          </div>}
          {state === "error" && <div className="space-y-3">
            <Alert variant="destructive"><AlertTitle>Could not load workspace.</AlertTitle></Alert>
            <Button onClick={() => setState("ready")}>Retry</Button>
          </div>}
          {state === "empty" && <Empty>
            <EmptyHeader><EmptyTitle>No workspace yet</EmptyTitle></EmptyHeader>
            <Button onClick={() => setState("ready")}>Create workspace</Button>
          </Empty>}
          {state === "ready" && <form id="workspace-form" noValidate onSubmit={event => {
            event.preventDefault()
            if (!name.trim()) { setError("Enter a workspace name."); return }
            setSaved("Saved " + name.trim() + ".")
            setOpen(false)
          }}>
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input autoFocus id="workspace-name" value={name} onChange={event => { setName(event.target.value); setError("") }} aria-invalid={!!error} aria-describedby={error ? "workspace-error" : undefined} />
            {error && <p id="workspace-error" role="alert">{error}</p>}
          </form>}
        </MotionFadeUp>
        <${name}Footer>
          <${name}Close render={<Button variant="outline" />}>Cancel</${name}Close>
          <Button type="submit" form="workspace-form" disabled={state !== "ready"}>Save workspace</Button>
        </${name}Footer>
      </${name}Content>
    </${name}>
    <p role="status">{saved}</p>
  </>
}`
}
