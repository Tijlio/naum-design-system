"use client"

import * as React from "react"
import {
  Calendar,
  Clock,
  FileText,
  Layers,
  LayoutGrid,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MotionPill } from "@/components/ui/motion"
import { navigationItemVariants } from "@/lib/navigation-styles"

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "employees", label: "Employees", icon: Users },
  { id: "overview", label: "Overviews", icon: Layers },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "planning", label: "Planning", icon: Calendar },
  { id: "history", label: "History", icon: Clock },
] as const

export function BentoSidebar() {
  const [activeNav, setActiveNav] = React.useState<string>("dashboard")

  return (
    <aside
      aria-label="Sidebar navigation"
      className="hidden flex-col gap-2.5 pt-1 md:flex"
    >
      {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => {
        const active = activeNav === id
        return (
          <Button
            key={id}
            variant="ghost"
            size="icon-lg"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            onClick={() => setActiveNav(id)}
            className={navigationItemVariants({ active })}
          >
            {active && (
              <MotionPill
                layoutId="naum-sidebar-active"
                className="bg-white shadow-sm ring-1 ring-foreground/5"
              />
            )}
            <Icon className="size-4" />
          </Button>
        )
      })}
    </aside>
  )
}
