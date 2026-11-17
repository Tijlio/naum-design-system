"use client"

import { Activity, ArrowUpRight, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MotionDrawPath,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/ui/motion"
import {
  ACTIVITY_CARDS,
  ACTIVITY_FILTERS,
  type ActivityMotifKind,
} from "./bento-data"

function ActivityMotif({ motif }: { motif: ActivityMotifKind }) {
  switch (motif) {
    case "wave":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <line x1="8" y1="20" x2="112" y2="20" strokeDasharray="2 3" strokeWidth="1" />
          <MotionDrawPath
            d="M 22 20 L 34 20 L 40 12 L 46 28 L 52 6 L 58 34 L 64 14 L 70 24 L 76 20 L 98 20"
            strokeWidth="1.2"
          />
        </svg>
      )
    case "arc":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <path d="M 20 34 A 40 40 0 0 1 100 34" strokeWidth="1" strokeDasharray="2 3" />
          <MotionDrawPath d="M 32 34 A 28 28 0 0 1 88 34" strokeWidth="1.1" />
          <line x1="16" y1="34" x2="104" y2="34" strokeWidth="1" />
        </svg>
      )
    case "target":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <line x1="14" y1="20" x2="106" y2="20" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="60" cy="20" r="14" strokeWidth="1" />
          <circle cx="60" cy="20" r="6" strokeWidth="1.2" />
          <circle cx="60" cy="20" r="1.5" fill="white" />
        </svg>
      )
    case "rings":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <circle cx="46" cy="20" r="13" strokeWidth="1" />
          <circle cx="60" cy="20" r="13" strokeWidth="1" />
          <circle cx="74" cy="20" r="13" strokeWidth="1" />
        </svg>
      )
    case "infinity":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <MotionDrawPath
            d="M 40 20 C 40 10, 54 10, 60 20 C 66 30, 80 30, 80 20 C 80 10, 66 10, 60 20 C 54 30, 40 30, 40 20 Z"
            strokeWidth="1.1"
          />
        </svg>
      )
    case "orbit":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <ellipse cx="60" cy="20" rx="28" ry="11" strokeWidth="1" />
          <circle cx="60" cy="20" r="2.5" fill="white" />
          <circle cx="84" cy="14" r="2" fill="white" />
        </svg>
      )
  }
}

export function ActivitiesSection() {
  return (
    <Card variant="frosted" className="gap-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-foreground/70" />
          <CardTitle className="text-base font-normal">Activities</CardTitle>
          <Badge className="h-5 rounded-full bg-foreground px-2 text-[11px] font-medium text-background">
            36
          </Badge>
        </div>
        <CardDescription className="text-xs">For this month</CardDescription>
        <CardAction className="hidden flex-wrap items-center gap-1.5 sm:flex">
          {ACTIVITY_FILTERS.map((filter) => (
            <Button
              key={filter}
              variant="default"
              size="xs"
              className="h-7 rounded-full bg-card px-2.5 text-[11px] font-normal text-foreground ring-1 ring-foreground/6 hover:bg-card/80"
            >
              {filter}
              <X className="size-3 opacity-60" />
            </Button>
          ))}
        </CardAction>
      </CardHeader>

      <CardContent>
        <MotionStagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ACTIVITY_CARDS.map((item) => (
            <MotionStaggerItem key={item.title} className="flex">
              <Card
                variant="mesh"
                size="sm"
                className={`${item.mesh} w-full justify-between gap-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5`}
              >
                <CardHeader className="px-4">
                  <CardTitle className="whitespace-pre-line text-xs leading-snug font-normal text-white/95">
                    {item.title}
                  </CardTitle>
                  <CardAction>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                      aria-label={item.title.replace("\n", " ")}
                    >
                      <ArrowUpRight className="size-3 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                    </Button>
                  </CardAction>
                </CardHeader>

                <CardContent className="flex flex-col gap-3 px-4">
                  <ActivityMotif motif={item.motif} />
                  <div className="flex items-end gap-2">
                    <span className="text-2xl leading-none font-normal tabular-nums">
                      {item.count}
                    </span>
                    <div className="flex flex-col text-[10px] leading-tight text-white/80">
                      <span
                        className={
                          item.positive
                            ? "inline-flex w-fit items-center rounded-full bg-emerald-400 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-950"
                            : "inline-flex w-fit items-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[9px] font-semibold text-white"
                        }
                      >
                        {item.delta}
                      </span>
                      <span className="mt-0.5">Last 7 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </CardContent>
    </Card>
  )
}
