"use client"

import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

export function PreviewHeader({
  onOpenCommand,
}: {
  onOpenCommand: () => void
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Naum</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Component Preview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="naum-page-title">Design System Preview</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onOpenCommand}>
          <Search className="size-3.5" />
          Search
          <Kbd>⌘K</Kbd>
        </Button>
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/docs" />}
        >
          Documentation
        </Button>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/" />}
        >
          Bento showcase
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </header>
  )
}
