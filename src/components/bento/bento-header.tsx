"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Bell, ChevronDown, Mail, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { MotionPill } from "@/components/ui/motion"
import { NAV_PILLS } from "./bento-data"

export function BentoHeader() {
  const [activeTopPill, setActiveTopPill] = React.useState<string>("Finance")

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium tracking-tight text-foreground/80">
          Naum Inc.
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {NAV_PILLS.map((label) => {
            const selected = activeTopPill === label
            return (
              <Button
                key={label}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTopPill(label)}
                className="relative h-8 rounded-full px-3 text-xs font-normal text-foreground/80 hover:bg-transparent hover:text-foreground"
              >
                {selected && (
                  <MotionPill
                    layoutId="naum-top-pill"
                    className="bg-card shadow-xs ring-1 ring-foreground/5"
                  />
                )}
                {label}
                <ChevronDown className="size-3.5 opacity-60" />
              </Button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="glass"
          size="icon-sm"
          className="rounded-full"
          aria-label="Messages"
        >
          <Mail className="size-3.5" />
        </Button>
        <Button
          variant="glass"
          size="icon-sm"
          className="rounded-full"
          aria-label="Notifications"
        >
          <Bell className="size-3.5" />
        </Button>
        <Button
          variant="glass"
          size="icon-sm"
          className="rounded-full"
          aria-label="Search"
        >
          <Search className="size-3.5" />
        </Button>
        <ThemeToggle className="ml-1 h-8 px-3 text-xs font-normal" />
        <Button
          variant="glass"
          size="sm"
          nativeButton={false}
          render={<Link href="/preview" />}
          className="h-8 px-3 text-xs font-normal"
        >
          Component Preview
          <ArrowUpRight className="size-3.5 opacity-70" />
        </Button>
      </div>
    </header>
  )
}
