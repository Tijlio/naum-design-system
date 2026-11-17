"use client"

import { useState, type ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { MotionFadeUp, MotionPresence } from "@/components/ui/motion"
import { CodeSample } from "./code-sample"

const buttonVariants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
  "glass",
  "glow",
] as const
const cardVariants = ["default", "glass", "frosted", "mesh"] as const
const states = ["default", "disabled", "invalid", "read-only"] as const
const options = <T extends string>(values: readonly T[]) =>
  values.map((value) => ({ value, label: value }))

export const INTERACTIVE_COMPONENTS = [
  "button",
  "card",
  "input",
  "badge",
  "select-control",
  "motion",
]

export const ComponentExamples = ({ name }: { name: string }) => {
  const [buttonVariant, setButtonVariant] =
    useState<NonNullable<ComponentProps<typeof Button>["variant"]>>("default")
  const [cardVariant, setCardVariant] =
    useState<(typeof cardVariants)[number]>("default")
  const [size, setSize] = useState<"sm" | "default" | "lg">("default")
  const [state, setState] = useState<(typeof states)[number]>("default")
  const [label, setLabel] = useState("Continue")
  const [replay, setReplay] = useState(0)
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState<string | null>("design")
  const disabled = state === "disabled"
  let preview, code, contract
  switch (name) {
    case "button":
      preview = (
        <div className="space-y-3 text-center">
          <Button
            variant={buttonVariant}
            size={size}
            disabled={disabled}
            onClick={() => setCount((value) => value + 1)}
          >
            {label || "Continue"}
          </Button>
          <p role="status" className="text-xs text-muted-foreground">
            {count ? `Activated ${count} times` : ""}
          </p>
        </div>
      )
      code = `import { Button } from "@/components/ui/button"\n\n<Button variant="${buttonVariant}" size="${size}"${disabled ? " disabled" : ""}>\n  ${label.replace(/[<>&{}]/g, "")}\n</Button>`
      contract =
        "variant: default | outline | secondary | ghost | destructive | link | glass | mesh | glow. size: default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg. Base UI button props and refs are forwarded. Supply aria-label for icon-only actions; use nativeButton={false} with a link render prop."
      break
    case "card":
      preview = (
        <Card
          variant={cardVariant}
          className={
            cardVariant === "mesh"
              ? "naum-mesh-indigo w-full max-w-sm"
              : "w-full max-w-sm"
          }
        >
          <CardHeader>
            <CardTitle>{label || "Workspace"}</CardTitle>
            <CardDescription>Your next conversation</CardDescription>
          </CardHeader>
          <CardContent>Compose content with shared controls.</CardContent>
        </Card>
      )
      code = `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"\n\n<Card variant="${cardVariant}"${cardVariant === "mesh" ? ' className="naum-mesh-indigo"' : ""}>\n  <CardHeader><CardTitle>Workspace</CardTitle></CardHeader>\n  <CardContent>Your content</CardContent>\n</Card>`
      contract =
        "variant: default | glass | frosted | mesh. size: default | sm. Optional tone: lavender | mint | amber supplies a shared decorative palette. Mesh cards need a mesh-* background class. CardHeader, CardTitle, CardDescription, CardAction, CardContent and CardFooter compose the layout. Native div props are forwarded."
      break
    case "input":
      preview = (
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="example-email">Email</Label>
          <Input
            id="example-email"
            placeholder="alex@example.com"
            disabled={disabled}
            readOnly={state === "read-only"}
            aria-invalid={state === "invalid"}
            aria-describedby={state === "invalid" ? "example-error" : undefined}
          />
          <p id="example-error" className="text-sm text-destructive">
            {state === "invalid" ? "Enter a valid email address." : ""}
          </p>
        </div>
      )
      code = `import { Input } from "@/components/ui/input"\nimport { Label } from "@/components/ui/label"\n\n<Label htmlFor="email">Email</Label>\n<Input id="email" type="email"${disabled ? " disabled" : ""}${state === "read-only" ? " readOnly" : ""}${state === "invalid" ? ' aria-invalid="true" aria-describedby="email-error"' : ""} />${state === "invalid" ? '\n<p id="email-error">Enter a valid email address.</p>' : ""}`
      contract =
        "Native input props and refs are forwarded. Connect Label with id/htmlFor. Use disabled, readOnly, aria-invalid and aria-describedby for states and associated messages. Validation belongs to the form."
      break
    case "badge":
      preview = (
        <div className="flex flex-wrap gap-2">
          <Badge>{label || "Active"}</Badge>
          <Badge variant="secondary">Pending</Badge>
          <Badge variant="outline">Archived</Badge>
          <Badge variant="destructive">Overdue</Badge>
          <Badge variant="soft" tone="lavender">
            Sales
          </Badge>
          <Badge variant="soft" tone="mint">
            Team
          </Badge>
          <Badge variant="soft" tone="amber">
            Personal
          </Badge>
        </div>
      )
      code = `import { Badge } from "@/components/ui/badge"\n\n<Badge variant="secondary">Pending</Badge>`
      contract =
        "variant: default | secondary | destructive | outline | ghost | link | soft. tone: lavender | mint | amber for soft badges. The render prop can change the element. A badge communicates status; pair colors with meaningful text."
      break
    case "select-control":
      preview = (
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="example-team">Team</Label>
          <SelectControl
            id="example-team"
            disabled={disabled}
            value={selected}
            onValueChange={setSelected}
            items={[
              { value: "design", label: "Design" },
              { value: "sales", label: "Sales" },
            ]}
          />
        </div>
      )
      code =
        'import { useState } from "react"\nimport { Label } from "@/components/ui/label"\nimport { SelectControl } from "@/components/ui/select-control"\n\nconst [team, setTeam] = useState<string | null>("design")\n\n<Label htmlFor="team">Team</Label>\n<SelectControl id="team" value={team} onValueChange={setTeam}\n  items={[{ value: "design", label: "Design" }, { value: "sales", label: "Sales" }]} />'
      contract =
        "items: readonly { value, label, disabled? }[]. Use value/onValueChange for controlled selection or defaultValue for uncontrolled selection. Also accepts id, name, placeholder, disabled and ARIA labeling/validation props."
      break
    default:
      preview = (
        <div className="space-y-4 text-center">
          <Button
            variant="outline"
            onClick={() => setReplay((value) => value + 1)}
          >
            Replay animation
          </Button>
          <MotionPresence mode="wait">
            <MotionFadeUp key={replay}>
              <Badge variant="secondary">MotionFadeUp</Badge>
            </MotionFadeUp>
          </MotionPresence>
        </div>
      )
      code =
        'import { MotionProvider, MotionFadeUp } from "@/components/ui/motion"\n\n<MotionProvider>\n  <MotionFadeUp><p>Your content</p></MotionFadeUp>\n</MotionProvider>'
      contract =
        "Wrap animated content in MotionProvider. MotionFadeUp accepts motion div props and optional delay. MotionExpand uses axis x or y. MotionStagger/Item animate groups; MotionPill shares active navigation transitions. System reduced-motion preferences are respected."
  }
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {["button", "card", "badge"].includes(name) && (
          <div className="space-y-2">
            <Label htmlFor="example-label">Label</Label>
            <Input
              id="example-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>
        )}
        {name === "button" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="example-variant">Variant</Label>
              <SelectControl
                id="example-variant"
                value={buttonVariant}
                items={options(buttonVariants)}
                onValueChange={(value) => value && setButtonVariant(value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="example-size">Size</Label>
              <SelectControl
                id="example-size"
                value={size}
                items={options(["sm", "default", "lg"] as const)}
                onValueChange={(value) => value && setSize(value)}
              />
            </div>
          </>
        )}
        {name === "card" && (
          <div className="space-y-2">
            <Label htmlFor="example-variant">Surface</Label>
            <SelectControl
              id="example-variant"
              value={cardVariant}
              items={options(cardVariants)}
              onValueChange={(value) => value && setCardVariant(value)}
            />
          </div>
        )}
        {["button", "input", "select-control"].includes(name) && (
          <div className="space-y-2">
            <Label htmlFor="example-state">State</Label>
            <SelectControl
              id="example-state"
              value={state}
              items={options(
                name === "input" ? states : (["default", "disabled"] as const),
              )}
              onValueChange={(value) => value && setState(value)}
            />
          </div>
        )}
      </div>
      <div
        aria-label="Live example"
        className="flex min-h-52 items-center justify-center rounded-3xl bg-surface-frosted p-6"
      >
        {preview}
      </div>
      <section aria-label="Usage">
        <h3 className="mb-2 font-medium">Usage</h3>
        <CodeSample code={code} />
      </section>
      <section aria-label="API">
        <h3 className="mb-2 font-medium">API & accessibility</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {contract}
        </p>
      </section>
    </div>
  )
}
