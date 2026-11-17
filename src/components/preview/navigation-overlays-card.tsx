"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function NavigationOverlaysCard() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Navigation, Menubar, HoverCard, Drawer &amp; ContextMenu</CardTitle>
        <CardDescription>
          Interactive menus and secondary overlays
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-8 rounded-full px-3 text-xs">
                  Overview
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-56 gap-1 p-1">
                    <li>
                      <NavigationMenuLink
                        href="#"
                        className="block rounded-xl px-3 py-2 text-xs hover:bg-muted/70"
                      >
                        Tokens &amp; Surfaces
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="#"
                        className="block rounded-xl px-3 py-2 text-xs hover:bg-muted/70"
                      >
                        Motion Primitives
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-8 rounded-full px-3 text-xs">
                  Guides
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-56 p-3 text-xs text-muted-foreground">
                    Install directly from GitHub via the `@naum` registry.
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Export <MenubarShortcut>⌘E</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Toggle Sidebar</MenubarItem>
                <MenubarItem>Reset Layout</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <HoverCard>
            <HoverCardTrigger
              render={<Button variant="glass" size="sm" />}
            >
              <Sparkles className="size-3.5" />
              HoverCard
            </HoverCardTrigger>
            <HoverCardContent className="w-64 rounded-2xl text-xs">
              <div className="font-medium text-foreground">Naum Design System</div>
              <p className="mt-1 text-muted-foreground">
                Built with Base UI, Tailwind v4 oklch tokens and Motion.
              </p>
            </HoverCardContent>
          </HoverCard>

          <Drawer>
            <DrawerTrigger render={<Button variant="outline" size="sm" />}>
              Open Drawer
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Mobile-friendly Drawer</DrawerTitle>
                <DrawerDescription>
                  Swipeable bottom sheet powered by Vaul.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose render={<Button variant="outline" size="sm" />}>
                  Close
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <ContextMenu>
            <ContextMenuTrigger className="flex h-9 items-center rounded-2xl border border-dashed border-border px-4 text-xs text-muted-foreground select-none">
              Right-click here (ContextMenu)
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                Duplicate <ContextMenuShortcut>⌘D</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>Copy Link</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </CardContent>
    </Card>
  )
}
