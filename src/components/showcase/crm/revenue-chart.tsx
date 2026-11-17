"use client"

import { useId } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useReducedMotionConfig } from "motion/react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { REVENUE_SERIES } from "../showcase-data"

const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--muted-foreground)" },
} satisfies ChartConfig

export const RevenueChart = () => {
  const gradient = useId().replace(/:/g, "")
  const reducedMotion = useReducedMotionConfig()
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>
          <h2>Revenue over time</h2>
        </CardTitle>
        <CardDescription>
          June–November 2026 · amounts in €1,000
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          role="region"
          config={config}
          className="h-64 w-full"
          aria-label="Revenue increased from €26,000 in June to €57,000 in November."
        >
          <AreaChart
            data={REVENUE_SERIES}
            margin={{ left: 0, right: 12, top: 12 }}
            accessibilityLayer
          >
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.22}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 5" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
            />
            <YAxis width={34} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="target"
              type="monotone"
              stroke="var(--color-target)"
              fill="transparent"
              strokeDasharray="4 4"
              isAnimationActive={false}
            />
            <Area
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill={`url(#${gradient})`}
              isAnimationActive={reducedMotion === false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
