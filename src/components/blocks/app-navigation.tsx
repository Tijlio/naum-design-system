"use client"

import { useId, useState, type ReactElement, type ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { MotionPill } from "@/components/ui/motion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar"
import { navigationItemVariants } from "@/lib/navigation-styles"
import { cn } from "@/lib/utils"

type NavigationBase = {
  id: string
  label: string
  icon: ReactNode
  active?: boolean
}
export type AppNavigationItem = NavigationBase &
  (
    | { render: ReactElement; children?: never }
    | { render?: never; children: readonly AppNavigationItem[] }
  )
const isActive = (item: AppNavigationItem): boolean =>
  Boolean(item.active || item.children?.some(isActive))
const leaves = (
  items: readonly AppNavigationItem[],
  prefix = "",
): { item: NavigationBase & { render: ReactElement }; label: string }[] =>
  items.flatMap((item) =>
    item.children
      ? leaves(item.children, `${prefix}${item.label} / `)
      : [{ item, label: `${prefix}${item.label}` }],
  )

const NavigationBranch = ({
  item,
  navigationId,
  depth = 0,
}: {
  item: AppNavigationItem
  navigationId: string
  depth?: number
}) => {
  const { isMobile, state, setOpenMobile } = useSidebar()
  const [manualOpen, setManualOpen] = useState<boolean | undefined>(undefined)
  const active = isActive(item)
  const compact = state === "collapsed" && !isMobile
  const open = manualOpen ?? active
  const className = cn(
    navigationItemVariants({
      active: item.children ? compact && active : active,
    }),
    "group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center",
    depth > 0 && "h-9 w-full",
  )
  const pill = (
    <MotionPill
      layoutId={`${navigationId}-active-${depth}`}
      aria-hidden
      className="bg-white shadow-sm ring-1 ring-foreground/5"
    />
  )
  const content = (
    <>
      {(!item.children || compact) && active && pill}
      {item.icon}
      <span className="group-data-[collapsible=icon]:sr-only">
        {item.label}
      </span>
    </>
  )
  const navigate = () => {
    if (isMobile) setOpenMobile(false)
  }
  if (!item.children)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.label}
          className={className}
          isActive={active}
          aria-current={active ? "page" : undefined}
          render={item.render}
          onClick={navigate}
        >
          {content}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  if (compact)
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                tooltip={item.label}
                className={className}
                isActive={active}
                aria-label={item.label}
              />
            }
          >
            {content}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            aria-label={`${item.label} navigation`}
          >
            {leaves(item.children).map(({ item: child, label }) => (
              <DropdownMenuItem
                key={child.id}
                render={child.render}
                aria-current={child.active ? "page" : undefined}
                onClick={navigate}
              >
                {child.icon}
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  return (
    <Collapsible
      open={open}
      onOpenChange={setManualOpen}
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger render={<SidebarMenuButton className={className} />}>
        {content}
        <ChevronRight
          aria-hidden
          className={cn(
            "ml-auto transition-transform duration-(--naum-duration-fast)",
            open && "rotate-90",
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub className="mt-2 mr-0 ml-3 gap-2 border-0 pr-0 pl-3">
          {item.children.map((child) => (
            <NavigationBranch
              key={child.id}
              item={child}
              navigationId={navigationId}
              depth={depth + 1}
            />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const AppNavigation = ({
  items,
}: {
  items: readonly AppNavigationItem[]
}) => {
  const navigationId = useId()
  return (
    <SidebarMenu className="gap-2.5 group-data-[collapsible=icon]:items-center">
      {items.map((item) => (
        <NavigationBranch
          key={item.id}
          item={item}
          navigationId={navigationId}
        />
      ))}
    </SidebarMenu>
  )
}
