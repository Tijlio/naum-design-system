"use client"

import * as React from "react"
import { ChevronsUpDown, Inbox } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"

const CAROUSEL_SLIDES = [
  { title: "Mesh Lime", mesh: "naum-mesh-lime" },
  { title: "Mesh Indigo", mesh: "naum-mesh-indigo" },
  { title: "Mesh Rose", mesh: "naum-mesh-rose" },
]

export function LayoutListsCard() {
  const [collapsibleOpen, setCollapsibleOpen] = React.useState(false)

  return (
    <Card className="md:col-span-2 xl:col-span-3">
      <CardHeader>
        <CardTitle>
          Carousel, Resizable, ScrollArea, Collapsible, AspectRatio, Item &amp; Empty
        </CardTitle>
        <CardDescription>
          Layout containers, list items and empty states
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Carousel + AspectRatio */}
        <div className="flex flex-col gap-3 px-8">
          <Carousel className="w-full">
            <CarouselContent>
              {CAROUSEL_SLIDES.map((slide) => (
                <CarouselItem key={slide.title}>
                  <AspectRatio ratio={16 / 9}>
                    <div
                      className={`${slide.mesh} flex size-full items-end rounded-2xl p-4 text-sm font-medium text-white`}
                    >
                      {slide.title}
                    </div>
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
            <div className="flex items-center justify-between rounded-2xl border border-border px-3 py-2 text-xs">
              <span>Collapsible details</span>
              <CollapsibleTrigger
                render={<Button variant="ghost" size="icon-xs" />}
              >
                <ChevronsUpDown className="size-3.5" />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-2 rounded-2xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Smoothly reveals secondary metadata without leaving the card.
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Resizable + ScrollArea + Item */}
        <div className="flex flex-col gap-3">
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-32 rounded-2xl border border-border"
          >
            <ResizablePanel defaultSize={45} className="p-3 text-xs">
              Left Panel
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55} className="p-3 text-xs">
              Right Panel
            </ResizablePanel>
          </ResizablePanelGroup>

          <ScrollArea className="h-32 rounded-2xl border border-border p-2">
            <ItemGroup>
              {["Theme tokens", "Glass surfaces", "Mesh gradients", "Motion"].map(
                (name) => (
                  <Item key={name} size="sm">
                    <ItemContent>
                      <ItemTitle className="text-xs">{name}</ItemTitle>
                      <ItemDescription className="text-[11px]">
                        Included in @naum/all
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                )
              )}
            </ItemGroup>
          </ScrollArea>
        </div>

        {/* Empty state */}
        <Empty className="border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox className="size-4" />
            </EmptyMedia>
            <EmptyTitle className="text-sm">No pending items</EmptyTitle>
            <EmptyDescription className="text-xs">
              Everything is synced with the latest design tokens.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}
