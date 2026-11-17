"use client"

import { useState } from "react"
import { AppPage } from "@/components/blocks/app-page"
import { PageHeader } from "@/components/blocks/page-header"
import { PageToolbar } from "@/components/blocks/page-toolbar"
import { SearchInput } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { CodeSample } from "./code-sample"
import { ExampleFrame } from "./example-frame"

const names = ["Emma Laurent", "Oliver Chen", "Noor Janssens"]
const components = ["app-page", "page-header", "page-toolbar", "search-input"]

export const PageCompositionExample = () => {
  const [query, setQuery] = useState("")
  const [variant, setVariant] = useState<"plain" | "inset">("plain")
  const [disabled, setDisabled] = useState(false)
  const matches = names.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  )
  const code = `import { useState } from "react"
import { AppPage } from "@/components/blocks/app-page"
import { PageHeader } from "@/components/blocks/page-header"
import { PageToolbar } from "@/components/blocks/page-toolbar"
import { SearchInput } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"

// Inside AppShell, or another MotionProvider.
export const ContactsExample = () => {
  const [query, setQuery] = useState("")
  const contacts = ["Emma Laurent", "Oliver Chen", "Noor Janssens"]
  const matches = contacts.filter(name => name.toLowerCase().includes(query.toLowerCase()))
  return <AppPage>
    <PageHeader eyebrow="Relationships" title="Contacts" count={contacts.length}
      actions={<Button disabled={!query || ${disabled}} onClick={() => setQuery("")}>Clear search</Button>} />
    <PageToolbar aria-label="Contact filters" variant="${variant}">
      <SearchInput label="Search demo contacts" value={query} disabled={${disabled}}
        onChange={event => setQuery(event.target.value)} />
    </PageToolbar>
    <ul>{matches.map(name => <li key={name}>{name}</li>)}</ul>
    <p role="status">{matches.length} matching contacts</p>
  </AppPage>
}`
  return (
    <div className="space-y-6">
      <section aria-label="Composition installation">
        <h3 className="mb-2 font-medium">Install this composition</h3>
        <CodeSample
          label="Copy composition install command"
          code={`pnpm dlx shadcn@4.23.0 add ${components.map((name) => `https://raw.githubusercontent.com/Tijlio/naum-design-system/main/public/r/${name}.json`).join(" ")}`}
        />
      </section>
      <ExampleFrame
        controls={
          <>
            <div className="space-y-2">
              <Label htmlFor="page-toolbar-variant">Toolbar padding</Label>
              <SelectControl
                id="page-toolbar-variant"
                value={variant}
                onValueChange={(value) => value && setVariant(value)}
                items={[
                  { value: "plain", label: "Plain" },
                  { value: "inset", label: "Inset" },
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="page-search-disabled"
                checked={disabled}
                onCheckedChange={setDisabled}
              />
              <Label htmlFor="page-search-disabled">Disable search</Label>
            </div>
          </>
        }
        code={code}
        contract="AppPage shares loaded-page spacing and MotionFadeUp; mount it inside MotionProvider (included in AppShell). PageHeader owns eyebrow, one h1, optional count (including zero) and actions. Keep total counts independent from filtered results. PageToolbar uses normal tab order, a named group and wrapping controls/actions slots: plain adds no padding, inset adds shared card padding. SearchInput requires a label, forwards input props/ref/name, and keeps className on its wrapper. It uses native search semantics and shared InputGroup focus, disabled, read-only and invalid styling. Specialized Command and Combobox search controls keep their own interaction contracts."
      >
        <AppPage className="w-full">
          <PageHeader
            eyebrow="Relationships"
            title="Contacts"
            count={names.length}
            actions={
              <Button
                disabled={!query || disabled}
                onClick={() => setQuery("")}
              >
                Clear search
              </Button>
            }
          />
          <PageToolbar aria-label="Contact filters" variant={variant}>
            <SearchInput
              label="Search demo contacts"
              value={query}
              disabled={disabled}
              onChange={(event) => setQuery(event.target.value)}
            />
          </PageToolbar>
          <ul className="space-y-2 text-sm">
            {matches.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p role="status" className="text-sm text-muted-foreground">
            {matches.length} matching contacts
          </p>
        </AppPage>
      </ExampleFrame>
    </div>
  )
}
