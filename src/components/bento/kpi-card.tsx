"use client"

import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MotionDrawPath } from "@/components/ui/motion"
import type { KpiCardItem } from "./bento-data"

export function KpiCard({ kpi }: { kpi: KpiCardItem }) {
  return (
    <Card
      variant="default"
      className="w-full justify-between transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
    >
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-normal text-muted-foreground">
          {kpi.title}
        </CardTitle>
        <CardAction>
          <Button
            variant="secondary"
            size="icon-sm"
            className="rounded-full"
            aria-label={`Open ${kpi.title}`}
          >
            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-normal tracking-tight tabular-nums">
            <span className="mr-1 text-lg text-muted-foreground">$</span>
            {kpi.major}
            <span className="text-muted-foreground">{kpi.minor}</span>
          </span>
          <span
            className={
              kpi.trend === "up"
                ? "inline-flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                : "inline-flex size-5 items-center justify-center rounded-full bg-orange-600 text-white"
            }
          >
            {kpi.trend === "up" ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            )}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative flex items-center gap-2">
            <div className="flex h-16 flex-col justify-between py-0.5 text-[10px] leading-none text-muted-foreground/70 tabular-nums">
              <span>160</span>
              <span>120</span>
              <span>80</span>
              <span>40</span>
            </div>
            <svg
              viewBox="0 0 190 48"
              preserveAspectRatio="none"
              className="h-16 min-w-0 flex-1"
              fill="none"
            >
              <line
                x1="0"
                y1="12"
                x2="190"
                y2="12"
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="2 3"
              />
              <line
                x1="0"
                y1="26"
                x2="190"
                y2="26"
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="2 3"
              />
              <line
                x1="0"
                y1="40"
                x2="190"
                y2="40"
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="2 3"
              />
              <line
                x1="138"
                y1="4"
                x2="138"
                y2="44"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeDasharray="2 2"
              />
              <MotionDrawPath
                d={kpi.pathLastWeek}
                stroke="currentColor"
                strokeOpacity="0.55"
                strokeWidth="1.15"
                delay={0.1}
              />
              <MotionDrawPath
                d={kpi.pathThisWeek}
                stroke={kpi.lineColor}
                strokeWidth="1.25"
                delay={0.2}
              />
            </svg>
            <Badge
              variant="secondary"
              className={
                kpi.trend === "up"
                  ? "absolute -top-1 right-6 h-5 rounded-full bg-emerald-500/15 px-2 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                  : "absolute -top-1 right-6 h-5 rounded-full bg-orange-500/15 px-2 text-[10px] font-medium text-orange-700 dark:text-orange-300"
              }
            >
              {kpi.delta}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-foreground" />
              Last Week
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: kpi.lineColor }}
              />
              This Week
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
