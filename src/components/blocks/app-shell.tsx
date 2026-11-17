"use client"

import type { ReactNode } from "react"
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  AppNavigation,
  type AppNavigationItem,
} from "@/components/blocks/app-navigation"

export type AppShellProps = {
  brand: ReactNode
  navigation: readonly AppNavigationItem[]
  navigationLabel?: string
  footer?: ReactNode
  header?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export const AppShell = ({
  brand,
  navigation,
  navigationLabel = "Workspace",
  footer,
  header,
  actions,
  children,
}: AppShellProps) => (
  <MotionProvider>
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <AmbientBackdrop />
      <SidebarProvider className="relative z-10 has-data-[variant=inset]:bg-transparent">
        <Sidebar
          variant="inset"
          collapsible="icon"
          aria-label="Workspace navigation"
          className="data-[mobile=true]:naum-app-overlay [&_[data-slot=sidebar-inner]]:bg-transparent group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))] md:bg-transparent md:shadow-none"
        >
          <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
            {brand}
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{navigationLabel}</SidebarGroupLabel>
              <AppNavigation items={navigation} />
            </SidebarGroup>
          </SidebarContent>
          {footer && (
            <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
              {footer}
            </SidebarFooter>
          )}
        </Sidebar>
        <SidebarInset className="min-w-0 bg-transparent md:peer-data-[variant=inset]:shadow-none">
          <header
            data-slot="app-header"
            className="workspace-header flex min-h-20 flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8 md:py-6"
          >
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger />
              {header}
            </div>
            <div className="flex items-center gap-2">{actions}</div>
          </header>
          <div className="mx-auto w-full max-w-[100rem] px-5 pt-2 pb-5 md:px-8 md:pt-3 md:pb-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  </MotionProvider>
)
