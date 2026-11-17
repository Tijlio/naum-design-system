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
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AmbientBackdrop } from "@/components/ui/ambient-backdrop"
import { MotionProvider } from "@/components/ui/motion"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { WorkspaceSearch } from "./workspace-search"

const NAVIGATION = [
  { label: "Calendar", href: "/showcase/calendar", icon: CalendarDays },
  { label: "Overview", href: "/showcase/crm", icon: LayoutDashboard },
  { label: "Contacts", href: "/showcase/crm/contacts", icon: Users },
]

const WorkspaceNavigation = () => {
  const path = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      aria-label="Workspace navigation"
    >
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/showcase/crm" />}>
              <span className="workspace-logo group-data-[collapsible=icon]:size-8">
                <Layers className="size-5" />
              </span>
              <span className="flex flex-col group-data-[collapsible=icon]:sr-only">
                <span className="font-semibold">Naum Studio</span>
                <span className="text-xs text-muted-foreground">Workspace</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {NAVIGATION.map(({ label, href, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  tooltip={label}
                  isActive={path === href}
                  aria-current={path === href ? "page" : undefined}
                  render={<Link href={href} />}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false)
                  }}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Component library"
              render={<Link href="/preview" />}
            >
              <Layers />
              <span>Component library</span>
              <ArrowUpRight className="ml-auto" />
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
      </SidebarFooter>
    </Sidebar>
  )
}

export const ShowcaseShell = ({ children }: { children: ReactNode }) => (
  <MotionProvider>
    <div className="relative isolate min-h-screen">
      <AmbientBackdrop />
      <SidebarProvider className="relative z-10">
        <WorkspaceNavigation />
        <SidebarInset className="workspace-inset">
          <header className="workspace-header">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm font-medium">Naum Studio</span>
              <Badge variant="outline" className="hidden sm:inline-flex">
                Demo workspace
              </Badge>
            </div>
            <div className="flex items-center gap-2">
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
            </div>
          </header>
          <main className="workspace-page">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  </MotionProvider>
)
