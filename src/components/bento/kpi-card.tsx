"use client"

import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { KpiCardItem } from "./bento-data"

export function KpiCard({ kpi }: { kpi: KpiCardItem }) {
  const chartConfig = {
    lastWeek: {
      label: "Last Week",
      color: "var(--foreground)",
    },
    thisWeek: {
      label: "This Week",
      color: kpi.lineColor,
    },
  } satisfies ChartConfig

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

      <CardContent className="flex flex-col gap-4">
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

        <div className="relative flex flex-col gap-2">
          <Badge
            variant="secondary"
            className={
              kpi.trend === "up"
                ? "pointer-events-none absolute -top-1 right-3 z-10 h-5 rounded-full bg-emerald-500/15 px-2 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                : "pointer-events-none absolute -top-1 right-3 z-10 h-5 rounded-full bg-orange-500/15 px-2 text-[10px] font-medium text-orange-700 dark:text-orange-300"
            }
          >
            {kpi.delta}
          </Badge>

          <ChartContainer config={chartConfig} className="h-24 w-full">
            <LineChart
              data={kpi.series}
              margin={{ top: 8, right: 6, left: -12, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeDasharray="2 3"
              />
              <XAxis dataKey="day" hide />
              <YAxis
                domain={[30, 170]}
                ticks={[40, 80, 120, 160]}
                width={32}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              />
              <ReferenceLine
                x="Fri"
                stroke="currentColor"
                strokeOpacity={0.22}
                strokeDasharray="2 2"
              />
              <ChartTooltip
                cursor={{
                  stroke: "currentColor",
                  strokeOpacity: 0.2,
                  strokeDasharray: "2 2",
                }}
                content={<ChartTooltipContent />}
              />
              <Line
                dataKey="lastWeek"
                type="monotone"
                stroke="var(--color-lastWeek)"
                strokeOpacity={0.55}
                strokeWidth={1.2}
                dot={false}
                activeDot={{ r: 3 }}
                animationDuration={650}
                animationEasing="ease-out"
              />
              <Line
                dataKey="thisWeek"
                type="monotone"
                stroke="var(--color-thisWeek)"
                strokeWidth={1.6}
                dot={false}
                activeDot={{ r: 4 }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </LineChart>
          </ChartContainer>

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
