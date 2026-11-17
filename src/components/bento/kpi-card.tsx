"use client"

import { useReducedMotionConfig } from "motion/react"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { KpiCardItem } from "./bento-data"
import { BentoStatCard } from "@/components/blocks/bento-stat-card"

function KpiChart({
  kpi,
  gradientId,
}: {
  kpi: KpiCardItem
  gradientId: string
}) {
  const reducedMotion = useReducedMotionConfig()
  const commonGrid = (
    <CartesianGrid
      vertical={false}
      stroke="currentColor"
      strokeOpacity={0.08}
      strokeDasharray="2 3"
    />
  )

  const commonAxes = (
    <>
      <XAxis dataKey="day" hide />
      <YAxis
        domain={[30, 170]}
        ticks={[40, 80, 120, 160]}
        width={32}
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
      />
      <ChartTooltip
        cursor={
          kpi.chartType === "bar"
            ? { fill: "var(--foreground)", fillOpacity: 0.04, stroke: "none" }
            : {
                stroke: "currentColor",
                strokeOpacity: 0.2,
                strokeDasharray: "2 2",
              }
        }
        content={<ChartTooltipContent />}
      />
    </>
  )

  if (kpi.chartType === "area") {
    return (
      <AreaChart
        data={kpi.series}
        margin={{ top: 8, right: 6, left: -12, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-thisWeek)"
              stopOpacity={0.32}
            />
            <stop
              offset="95%"
              stopColor="var(--color-thisWeek)"
              stopOpacity={0.0}
            />
          </linearGradient>
        </defs>
        {commonGrid}
        {commonAxes}
        <Area
          dataKey="lastWeek"
          type="monotone"
          stroke="var(--color-lastWeek)"
          strokeOpacity={0.45}
          strokeDasharray="3 3"
          fill="transparent"
          strokeWidth={1.2}
          isAnimationActive={reducedMotion === false}
          animationDuration={650}
        />
        <Area
          dataKey="thisWeek"
          type="monotone"
          stroke="var(--color-thisWeek)"
          fill={`url(#${gradientId})`}
          strokeWidth={1.7}
          isAnimationActive={reducedMotion === false}
          animationDuration={800}
        />
      </AreaChart>
    )
  }

  if (kpi.chartType === "bar") {
    return (
      <BarChart
        data={kpi.series}
        barGap={2}
        margin={{ top: 8, right: 6, left: -12, bottom: 0 }}
      >
        {commonGrid}
        {commonAxes}
        <Bar
          dataKey="lastWeek"
          fill="var(--color-lastWeek)"
          fillOpacity={0.18}
          radius={[4, 4, 4, 4]}
          barSize={6}
          isAnimationActive={reducedMotion === false}
          animationDuration={650}
        />
        <Bar
          dataKey="thisWeek"
          fill="var(--color-thisWeek)"
          radius={[4, 4, 4, 4]}
          barSize={6}
          isAnimationActive={reducedMotion === false}
          animationDuration={800}
        />
      </BarChart>
    )
  }

  return (
    <LineChart
      data={kpi.series}
      margin={{ top: 8, right: 6, left: -12, bottom: 0 }}
    >
      {commonGrid}
      {commonAxes}
      <ReferenceLine
        x="Fri"
        stroke="currentColor"
        strokeOpacity={0.22}
        strokeDasharray="2 2"
      />
      <Line
        dataKey="lastWeek"
        type="monotone"
        stroke="var(--color-lastWeek)"
        strokeOpacity={0.55}
        strokeWidth={1.2}
        dot={false}
        activeDot={{ r: 3 }}
        isAnimationActive={reducedMotion === false}
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
        isAnimationActive={reducedMotion === false}
        animationDuration={800}
        animationEasing="ease-out"
      />
    </LineChart>
  )
}

export function KpiCard({ kpi }: { kpi: KpiCardItem }) {
  const gradientId = React.useId().replace(/:/g, "")
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
    <BentoStatCard
      title={kpi.title}
      value={{ major: kpi.major, minor: kpi.minor, currency: "$" }}
      trend={{
        direction: kpi.trend,
        label: `${kpi.delta} compared with last week`,
      }}
      action={
        <Button
          variant="secondary"
          size="icon-sm"
          aria-label={`Open ${kpi.title}`}
        >
          <ArrowUpRight className="size-3.5 transition-transform duration-(--naum-duration-hover) motion-safe:group-hover/card:translate-x-0.5 motion-safe:group-hover/card:-translate-y-0.5" />
        </Button>
      }
    >
      <div className="relative flex flex-col gap-2">
        <Badge
          variant="secondary"
          className={
            kpi.trend === "up"
              ? "pointer-events-none absolute -top-1 right-3 z-10 h-5 rounded-full bg-(--trend-up-soft) px-2 text-[10px] font-medium text-(--trend-up-copy)"
              : "pointer-events-none absolute -top-1 right-3 z-10 h-5 rounded-full bg-(--trend-down-soft) px-2 text-[10px] font-medium text-(--trend-down-copy)"
          }
        >
          {kpi.delta}
        </Badge>

        <ChartContainer config={chartConfig} className="h-24 w-full">
          <KpiChart kpi={kpi} gradientId={gradientId} />
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
    </BentoStatCard>
  )
}
