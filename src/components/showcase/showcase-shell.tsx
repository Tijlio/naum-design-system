"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowUpRight,
  CalendarDays,
  Layers,
  LayoutDashboard,
  Users,
} from "lucide-react"
import { AppShell } from "@/components/blocks/app-shell"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { navigationItemVariants } from "@/lib/navigation-styles"
import { cn } from "@/lib/utils"
import { DemoControls } from "./demo-controls"
import { WorkspaceSearch } from "./workspace-search"

const NAVIGATION = [
  { label: "Calendar", href: "/showcase/calendar", icon: CalendarDays },
  { label: "Overview", href: "/showcase/crm", icon: LayoutDashboard },
  { label: "Contacts", href: "/showcase/crm/contacts", icon: Users },
]

export const ShowcaseShell = ({ children }: { children: ReactNode }) => {
  const path = usePathname()
  return (
    <AppShell
      navigation={NAVIGATION.map(({ label, href, icon: Icon }) => ({
        id: href,
        label,
        icon: <Icon />,
        render: <Link href={href} />,
        active: path === href,
      }))}
      brand={
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/showcase/crm" />}>
              <span className="workspace-logo flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground group-data-[collapsible=icon]:size-8">
                <Layers className="size-5" />
              </span>
              <span className="flex flex-col group-data-[collapsible=icon]:sr-only">
                <span className="font-semibold">Naum Studio</span>
                <span className="text-xs text-muted-foreground">Workspace</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      }
      footer={
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Component library"
              className={cn(
                navigationItemVariants(),
                "group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center",
              )}
              render={<Link href="/preview" />}
            >
              <Layers />
              <span className="group-data-[collapsible=icon]:sr-only">
                Component library
              </span>
              <ArrowUpRight className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<div />}>
              <Avatar className="size-8">
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <span className="flex flex-col group-data-[collapsible=icon]:sr-only">
                <span className="font-medium">Alex Morgan</span>
                <span className="text-xs text-muted-foreground">
                  alex@naum.example
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      }
      header={
        <>
          <span className="text-sm font-medium">Naum Studio</span>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Demo workspace
          </Badge>
        </>
      }
      actions={
        <>
          <DemoControls />
          <WorkspaceSearch />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            aria-label="Bento showcase"
            render={<Link href="/" />}
          >
            <ArrowUpRight />
          </Button>
        </>
      }
    >
      {children}
    </AppShell>
  )
}
