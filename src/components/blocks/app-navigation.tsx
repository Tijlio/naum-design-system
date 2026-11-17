"use client"

import { useId, type ReactElement, type ReactNode } from "react"
import { MotionPill } from "@/components/ui/motion"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { navigationItemVariants } from "@/lib/navigation-styles"
import { cn } from "@/lib/utils"

export type AppNavigationItem = {
  id: string
  label: string
  icon: ReactNode
  render: ReactElement
  active?: boolean
}

export const AppNavigation = ({
  items,
}: {
  items: readonly AppNavigationItem[]
}) => {
  const navigationId = useId()
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <SidebarMenu className="gap-2.5 group-data-[collapsible=icon]:items-center">
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            tooltip={item.label}
            className={cn(
              navigationItemVariants({ active: Boolean(item.active) }),
              "group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center",
            )}
            isActive={item.active}
            aria-current={item.active ? "page" : undefined}
            render={item.render}
            onClick={() => {
              if (isMobile) setOpenMobile(false)
            }}
          >
            {item.active && (
              <MotionPill
                layoutId={`${navigationId}-active`}
                aria-hidden="true"
                className="bg-white shadow-sm ring-1 ring-foreground/5"
              />
            )}
            {item.icon}
            <span className="group-data-[collapsible=icon]:sr-only">
              {item.label}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
