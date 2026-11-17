"use client"

import { useReducedMotionConfig } from "motion/react"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const CHART_DATA = [
  { month: "May", actual: 142, target: 130 },
  { month: "Jun", actual: 158, target: 140 },
  { month: "Jul", actual: 136, target: 145 },
  { month: "Aug", actual: 171, target: 150 },
  { month: "Sep", actual: 164, target: 155 },
  { month: "Oct", actual: 189, target: 165 },
]

const CHART_CONFIG = {
  actual: {
    label: "Actual",
    color: "var(--chart-1)",
  },
  target: {
    label: "Target",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartCard() {
  const reducedMotion = useReducedMotionConfig()
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Chart (shadcn Chart + Recharts)</CardTitle>
        <CardDescription>
          Uses `--chart-1` and `--chart-2` oklch tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={CHART_CONFIG} className="h-56 w-full">
          <AreaChart data={CHART_DATA} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-actual)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-actual)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <filter
                id="naum-chart-glow"
                x="-10%"
                y="-10%"
                width="120%"
                height="120%"
              >
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="target"
              type="monotone"
              stroke="var(--color-target)"
              fill="transparent"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              isAnimationActive={reducedMotion === false}
              animationDuration={650}
            />
            <Area
              dataKey="actual"
              type="monotone"
              stroke="var(--color-actual)"
              fill="url(#fillActual)"
              strokeWidth={2}
              filter="url(#naum-chart-glow)"
              isAnimationActive={reducedMotion === false}
              animationDuration={850}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
