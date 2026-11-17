# Integration and component contracts

## Supported setup

The reference application uses React 19, TypeScript strict mode, Tailwind CSS v4, shadcn `base-maia`, Base UI and Next.js App Router. Most components are ordinary React components. Next.js is only used by the showcase pages; the registry installation check compiles the components without Next.js.

Use the [catalog](components.md) for installable names and exports. Public props extend their underlying primitive or element props. UI components own styling and interaction primitives; consuming applications own data loading, validation, permissions, mutations and routing. Dashboard fixtures are not a domain component API.

The registry theme changes semantic global tokens and base styles. Review the resulting CSS when integrating into an existing brand. The shared `utils.ts` is placed under `aliases.lib`; `aliases.utils` must identify that file. Installing over existing files is a deliberate consumer decision: review the CLI output before accepting replacements.

## Providers and fonts

A client boundary for Next.js (omit the directive in applications that do not use React Server Components):

```tsx
"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { MotionProvider } from "@/components/ui/motion"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <MotionProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </MotionProvider>
  </ThemeProvider>
)
```

Mount `Toaster` once. `ThemeProvider` uses `next-themes`; the default `Toaster` follows its theme. Applications managing themes another way can pass `theme="light"`, `"dark"` or `"system"` directly to `Toaster`.

`font-sans` and `font-heading` use `--font-naum`. The theme provides a named Plus Jakarta Sans/system fallback stack; it does not supply font bytes. To reproduce the showcase in Next.js:

```tsx
import { Plus_Jakarta_Sans } from "next/font/google"

const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-naum" })
// Apply font.variable to the root <html> and wrap the body content in Providers.
```

Other hosts can load or self-host the same font and set `--font-naum` to their font family. Changing that token changes headings and body text together.

## Button

Variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`, `glass`, `glow`, `mesh`.

Sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`. `mesh` is intended for contrasting mesh surfaces, not a plain white background. Every icon-only button requires an accessible name. Loading is application state composed with `Spinner`, `disabled` and `aria-busy`; it is not a separate asynchronous Button API.

```tsx
<Button variant="glass" size="icon-sm" aria-label="Open settings">
  <Settings />
</Button>
<Button disabled={saving} aria-busy={saving}>
  {saving && <Spinner aria-hidden="true" />}
  Save changes
</Button>
```

Use Base UI's `render` contract for links, with `nativeButton={false}`. Keep navigation on links and form submission on buttons.

## Card and surfaces

`Card` variants: `default`, `glass`, `frosted`, `mesh`. Sizes: `default` and `sm`. Compose headers, actions, content and footers rather than making each screen's own card shell. Card titles are styled containers, not heading elements; give content an appropriate semantic heading when it forms a document section.

```tsx
<Card variant="mesh" className="naum-mesh-indigo">
  <CardHeader>
    <CardTitle>
      <h2>Monthly overview</h2>
    </CardTitle>
    <CardDescription>Revenue and expenditure</CardDescription>
  </CardHeader>
  <CardContent>{children}</CardContent>
</Card>
```

Mesh utilities: `naum-mesh-lime`, `coral`, `indigo`, `amber`, `rose` and `mint`. Glass uses the `--glass-*` tokens; frosted uses `--surface-frosted`. Evaluate contrast against the actual composited background, especially for translucent surfaces and gradients. Automated contrast checks cannot establish every background combination.

`AmbientBackdrop` is an optional fixed, decorative layer. Its host should establish a stacking context (`relative isolate`) and place content above it (`relative z-10`).

## Forms and selection

Use shared `Input`, `Textarea`, `Label`, `Field`, `Select`, `Combobox`, `Checkbox`, `Switch` and related controls. Associate labels with control IDs. Use `aria-describedby` for descriptions/errors and `aria-invalid` for invalid controls. `Field` supplies layout; consumers still own ID associations and validation.

```tsx
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input
    id="email"
    aria-invalid={Boolean(error)}
    aria-describedby={error ? "email-error" : undefined}
  />
  {error && <FieldError id="email-error">{error}</FieldError>}
</Field>
```

Provide Base UI `Select` with `items` when values differ from their display labels. This lets the selected label render correctly before the popup has mounted:

```tsx
const regions = [{ value: "eu-west", label: "EU West" }]

<Label htmlFor="region">Region</Label>
<Select items={regions} defaultValue="eu-west">
  <SelectTrigger id="region"><SelectValue /></SelectTrigger>
  <SelectContent>
    {regions.map((region) => <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>)}
  </SelectContent>
</Select>
```

`SelectControl` composes the shared Select parts for a labeled string option list. Supply `items`, a controlled `value`/`onValueChange` pair or `defaultValue`, and optionally `name` for form submission. It forwards trigger labeling, invalid and disabled states. Use the compound Select API when the popup needs custom content.

`DateTimePicker` composes Calendar, Popover and SelectControl. Its controlled value is a local ISO date/time string (`yyyy-MM-ddTHH:mm`); `dateOnly` hides the time controls and emits midnight for the chosen date. Supply an accessible `label` and connect any external Label with `id`. An optional `name` adds hidden form transport. Validation and timezone conversion belong to the consuming form.

Label `ComboboxInput` via its own `id`. Its internal open/clear buttons have overridable default accessible names. A scalar Slider value renders one thumb; an array renders one per value. Name a single Slider with `aria-label`/`aria-labelledby`; use `getAriaLabel(index)` for distinct range-thumb names. Thumb indices are supplied for SSR.

Checkbox, Switch, Select and Combobox support the underlying controlled and uncontrolled contracts. Do not switch an instance between those modes. Use native `disabled` and `readOnly` props where supported rather than recreating their behavior in screen code.

## Motion

`MotionProvider` defaults to `reducedMotion="user"`. Wrap animated content in it; use `reducedMotion="always"` to enforce reduced motion. `MotionFadeUp`, `MotionStagger`, `MotionStaggerItem`, `MotionDrawPath`, `MotionPill`, `MotionLayout` and `MotionExpand` also honor that configured policy for their custom opacity, stagger and SVG drawing transitions.

The primitives forward the corresponding `HTMLMotionProps`/`SVGMotionProps`, including IDs, ARIA attributes, refs, styles and handlers. Defaults are applied first; explicitly supplied motion props such as `initial`, `animate`, `variants` and `transition` override them. Consumers overriding animation behavior must preserve the motion policy.

`MotionPresence` exposes the presence boundary for enter/exit animations. Use `MotionExpand axis="x"` for horizontal reveals and `axis="y"` for vertical reveals. Its default overflow clipping can be overridden when a revealed surface needs to show a popup.

`MotionLayout` animates position changes and shared element transitions; it disables layout movement and shared layout IDs when reduced motion is active.

Use unique or locally scoped `layoutId` values for pills when multiple independent instances appear together. CSS motion uses `ease-naum` and the shared duration tokens. The theme reduces CSS transitions and animations under the system preference. Hover/press movement is guarded by motion preference.

Recharts animation is separate from MotionConfig. The examples use `useReducedMotionConfig()` and `isAnimationActive={reducedMotion === false}`; use the same contract for application-owned series.

## Overlays, charts and lists

Always give dialogs and drawers a title within their content. `CommandDialog` includes its hidden accessible title and description inside the popup. Supply meaningful values when its purpose differs from a generic command palette. Bind keyboard shortcuts to actual actions; shortcut labels alone do not register handlers.

Popup primitives share the opaque `naum-popup-surface`; each component retains its own positioning, focus and selection behavior. Theme changes should be made to that utility instead of copying long selector strings into components.

`ChartContainer` supplies size, context and theme colors; `ChartTooltipContent` and the legend consume the config. Provide textual meaning for charts and do not rely on color alone. Application-owned series and formatting remain outside the generic container.

`ItemGroup` declares a list. Give each child `Item` `role="listitem"`, or use appropriately semantic elements with the `render` prop. Name carousels and their slides where context is not otherwise clear. ScrollArea viewports and overflowing Table containers are keyboard focusable.

`SidebarMenuSkeleton` defaults to a deterministic `70%` width to keep SSR and hydration consistent. Pass `width="55%"` (or another CSS width) for deliberate variation. Sidebar open state may be controlled externally; cookie restoration is the host application's responsibility.

## Tokens and extension

`src/styles/naum.css` is the source for the showcase and registry theme. It contains semantic colors, light/dark values, typography, radii, glass, shadows, easing/durations and shared surface utilities. `src/app/globals.css` imports it after framework CSS.

`naum-page-title` provides the shared page-heading font, weight, tracking and responsive size used by Bento, the app shell and preview.

Change semantic tokens rather than scattering palette values in screens. Existing extension points include `--surface-frosted`, `--glass-*`, `--naum-shadow-*`, `--naum-duration-*`, `--radius` and `--font-naum`. Use CVA variants for actual repeated component styles. Keep domain-specific data and form behavior out of generic primitives.

Prefer small compositions of the existing controls. Do not add a wrapper only to shorten JSX, and do not split tightly coupled compound components into dozens of files. Match the source APIs and extend them only for a demonstrated consumer requirement.
