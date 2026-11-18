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
  type AppNavigationVariant,
} from "@/components/blocks/app-navigation"

export type AppShellProps = {
  brand: ReactNode
  navigation: readonly AppNavigationItem[]
  navigationLabel?: string
  navigationVariant?: AppNavigationVariant
  footer?: ReactNode
  header?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export const AppShell = ({
  brand,
  navigation,
  navigationLabel = "Workspace",
  navigationVariant = "collapsible",
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
          className="data-[mobile=true]:naum-app-overlay [&_[data-slot=sidebar-inner]]:bg-transparent group-data-[collapsible=icon]:data-[side=left]:left-4 md:bg-transparent md:shadow-none"
        >
          <SidebarHeader className="p-3 group-data-[collapsible=icon]:h-20 group-data-[collapsible=icon]:shrink-0 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:[&_[data-slot=sidebar-menu]]:items-center">
            {brand}
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="group-data-[collapsible=icon]:px-0">
              <SidebarGroupLabel>{navigationLabel}</SidebarGroupLabel>
              <AppNavigation items={navigation} variant={navigationVariant} />
            </SidebarGroup>
          </SidebarContent>
          {footer && (
            <SidebarFooter className="p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:[&_[data-slot=sidebar-menu]]:items-center">
              {footer}
            </SidebarFooter>
          )}
        </Sidebar>
        <SidebarInset className="min-w-0 bg-transparent md:peer-data-[variant=inset]:shadow-none">
          <header
            data-slot="app-header"
            className="workspace-header flex min-h-20 flex-wrap items-center justify-between gap-(--naum-space-control) px-(--naum-inset-page) py-4 md:px-(--naum-inset-page-wide) md:py-6"
          >
            <div className="flex min-w-0 items-center gap-(--naum-space-control)">
              <SidebarTrigger />
              {header}
            </div>
            <div className="flex items-center gap-(--naum-space-inline)">
              {actions}
            </div>
          </header>
          <div className="mx-auto w-full max-w-[100rem] px-(--naum-inset-page) pt-2 pb-5 md:px-(--naum-inset-page-wide) md:pt-3 md:pb-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  </MotionProvider>
)
