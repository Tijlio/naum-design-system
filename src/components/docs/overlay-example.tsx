"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { ExampleFrame } from "./example-frame"
import { ExampleStateControl, type ExampleState } from "./example-state-control"
import { ExampleStateContent } from "./example-state-content"
import { overlayExampleCode } from "./overlay-example-code"

const sides = ["right", "left", "top", "bottom"] as const

export const OverlayExample = ({ kind }: { kind: "dialog" | "sheet" }) => {
  const [state, setState] = useState<ExampleState>("ready")
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<(typeof sides)[number]>("right")
  const [showClose, setShowClose] = useState(true)
  const [name, setName] = useState("Naum Studio")
  const [saved, setSaved] = useState("")
  const [invalid, setInvalid] = useState(false)
  const id = useId()
  const isSheet = kind === "sheet"
  const Root = isSheet ? Sheet : Dialog
  const Trigger = isSheet ? SheetTrigger : DialogTrigger
  const Content = isSheet ? SheetContent : DialogContent
  const Header = isSheet ? SheetHeader : DialogHeader
  const Title = isSheet ? SheetTitle : DialogTitle
  const Description = isSheet ? SheetDescription : DialogDescription
  const Footer = isSheet ? SheetFooter : DialogFooter
  const Close = isSheet ? SheetClose : DialogClose
  return (
    <ExampleFrame
      controls={
        <>
          <ExampleStateControl value={state} onChange={setState} />
          {isSheet && (
            <div className="space-y-2">
              <Label htmlFor={`${id}-side`}>Side</Label>
              <SelectControl
                id={`${id}-side`}
                value={side}
                items={sides.map((value) => ({ value, label: value }))}
                onValueChange={(value) => value && setSide(value)}
                className="w-full"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${id}-close`}
              checked={showClose}
              onCheckedChange={setShowClose}
            />
            <Label htmlFor={`${id}-close`}>Show close button</Label>
          </div>
        </>
      }
      code={overlayExampleCode(kind, state, side, showClose)}
      contract={`${isSheet ? "Sheet" : "Dialog"} uses controlled open/onOpenChange (or defaultOpen). Trigger and Close compose with render={<Button />}. Content accepts showCloseButton${isSheet ? " and side: top | right | bottom | left" : ""}. Always include Title and Description. Focus stays inside the modal; Escape closes and restores focus to its trigger. Loading, error, empty and validation states belong to your form, not the overlay API. The state selector and Finish loading action make these examples repeatable without a server. Naum popup transitions and MotionFadeUp respect reduced motion.`}
    >
      <div className="w-full space-y-3 text-center">
        <Root open={open} onOpenChange={setOpen}>
          <Trigger render={<Button />}>Open {kind}</Trigger>
          <Content
            {...(isSheet ? { side } : {})}
            showCloseButton={showClose}
            className={
              isSheet
                ? "max-h-dvh overflow-y-auto"
                : "max-h-[calc(100dvh-2rem)] overflow-y-auto"
            }
          >
            <Header className="pr-12">
              <Title>Edit workspace</Title>
              <Description>Update your workspace name.</Description>
            </Header>
            <div className={isSheet ? "space-y-4 px-6" : "space-y-4"}>
              <ExampleStateControl
                label="Content state"
                value={state}
                onChange={setState}
              />
              <ExampleStateContent
                state={state}
                onRecover={() => setState("ready")}
                subject="workspace"
                emptyTitle="No workspace yet"
                emptyAction="Create workspace"
              >
                <form
                  id={`${id}-form`}
                  noValidate
                  className="space-y-2"
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (!name.trim()) {
                      setInvalid(true)
                      return
                    }
                    setInvalid(false)
                    setSaved(`Saved ${name.trim()}.`)
                    setOpen(false)
                  }}
                >
                  <Label htmlFor={`${id}-name`}>Workspace name</Label>
                  <Input
                    autoFocus
                    id={`${id}-name`}
                    value={name}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? `${id}-error` : undefined}
                    onChange={(event) => {
                      setName(event.target.value)
                      setInvalid(false)
                    }}
                  />
                  {invalid && (
                    <p
                      role="alert"
                      id={`${id}-error`}
                      className="text-sm text-destructive"
                    >
                      Enter a workspace name.
                    </p>
                  )}
                </form>
              </ExampleStateContent>
            </div>
            <Footer>
              <Close render={<Button variant="outline" />}>Cancel</Close>
              <Button
                type="submit"
                form={`${id}-form`}
                disabled={state !== "ready"}
              >
                Save workspace
              </Button>
            </Footer>
          </Content>
        </Root>
        <p role="status" className="text-sm text-muted-foreground">
          {saved}
        </p>
      </div>
    </ExampleFrame>
  )
}
