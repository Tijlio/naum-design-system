"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, ExternalLink, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AmbientBackdrop } from "@/components/ui/ambient-backdrop"
import { MotionFadeUp, MotionProvider } from "@/components/ui/motion"
import { SourceReference } from "./source-reference"
import { BlockExamples } from "./block-examples"
import { CodeSample } from "./code-sample"
import {
  InteractiveExamples,
  INTERACTIVE_COMPONENTS,
} from "./interactive-examples"

export type CatalogEntry = {
  name: string
  title: string
  description: string
  path: string
  block: boolean
}

export const ComponentExplorer = ({ entries }: { entries: CatalogEntry[] }) => {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState("button")
  const entry = entries.find((item) => item.name === selected) ?? entries[0]
  const matches = entries.filter((item) =>
    `${item.name} ${item.title}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <MotionProvider>
      <div className="relative isolate min-h-screen bg-background text-foreground">
        <AmbientBackdrop />
        <main className="relative z-10 mx-auto max-w-7xl space-y-6 p-4 md:p-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <Link href="/preview" className="text-sm text-muted-foreground">
                Naum / Component preview
              </Link>
              <h1 className="naum-page-title">Documentation</h1>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href="/showcase/crm" />}
              >
                Open app <ExternalLink />
              </Button>
            </div>
          </header>
          <div className="grid items-start gap-6 md:grid-cols-[15rem_minmax(0,1fr)]">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Component library</CardTitle>
                <CardDescription>
                  {entries.length} installable items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="catalog-search" className="sr-only">
                  Find a component
                </Label>
                <div className="relative">
                  <Search
                    aria-hidden
                    className="absolute top-2.5 left-3 size-4 text-muted-foreground"
                  />
                  <Input
                    id="catalog-search"
                    placeholder="Find a component…"
                    className="pl-9"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <nav
                  aria-label="Component catalog"
                  className="max-h-64 space-y-1 overflow-y-auto md:max-h-[65vh]"
                >
                  {matches.map((item) => (
                    <Button
                      key={item.name}
                      variant={selected === item.name ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      aria-pressed={selected === item.name}
                      onClick={() => setSelected(item.name)}
                    >
                      {item.name}
                      {item.block && (
                        <Badge variant="outline" className="ml-auto">
                          Block
                        </Badge>
                      )}
                    </Button>
                  ))}
                  {!matches.length && (
                    <p
                      role="status"
                      className="p-3 text-sm text-muted-foreground"
                    >
                      No matching components.
                    </p>
                  )}
                </nav>
              </CardContent>
            </Card>
            <MotionFadeUp key={entry.name} className="min-w-0">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-xl">{entry.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      nativeButton={false}
                      render={
                        <a
                          href={`https://github.com/Tijlio/naum-design-system/blob/main/${entry.path}`}
                          target="_blank"
                          rel="noreferrer"
                        />
                      }
                    >
                      Source & types <ExternalLink />
                    </Button>
                  </div>
                  <CardDescription>{entry.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section aria-label="Installation">
                    <h2 className="mb-2 flex items-center gap-2 font-medium">
                      <BookOpen className="size-4" />
                      Install
                    </h2>
                    <CodeSample
                      label="Copy install command"
                      code={`pnpm dlx shadcn@4.23.0 add https://raw.githubusercontent.com/Tijlio/naum-design-system/main/public/r/${entry.name}.json`}
                    />
                  </section>
                  {entry.block ? (
                    <BlockExamples key={entry.name} name={entry.name} />
                  ) : INTERACTIVE_COMPONENTS.includes(entry.name) ? (
                    <InteractiveExamples key={entry.name} name={entry.name} />
                  ) : (
                    <div className="space-y-3">
                      <h2 className="font-medium">Reference & examples</h2>
                      <SourceReference key={entry.name} name={entry.name} />
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Open the source for the complete typed API. The
                        component preview demonstrates shared controls,
                        overlays, charts and layout compositions.
                      </p>
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={<Link href="/preview" />}
                      >
                        Component preview <ExternalLink />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </MotionFadeUp>
          </div>
        </main>
      </div>
    </MotionProvider>
  )
}
