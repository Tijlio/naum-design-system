"use client"

import { formatMoney } from "@/lib/money-format"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useReducedMotionConfig } from "motion/react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const MetricBreakdown = ({
  data,
  label,
  color,
  currency = false,
}: {
  data: { label: string; value: number }[]
  label: string
  color: string
  currency?: boolean
}) => {
  const reducedMotion = useReducedMotionConfig()
  return (
    <ChartContainer
      config={{ value: { label: currency ? "Value" : "Contacts", color } }}
      className="h-24 w-full"
      role="region"
      aria-label={label}
    >
      <BarChart
        data={data}
        margin={{ top: 8, right: 6, left: 0, bottom: 0 }}
        accessibilityLayer
      >
        <CartesianGrid
          vertical={false}
          stroke="currentColor"
          strokeOpacity={0.08}
          strokeDasharray="2 3"
        />
        <XAxis dataKey="label" hide />
        <YAxis
          width={40}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          tickFormatter={(value: number) =>
            currency ? `${value / 1000}k` : String(value)
          }
        />
        <ChartTooltip
          cursor={{
            fill: "var(--foreground)",
            fillOpacity: 0.04,
            stroke: "none",
          }}
          content={
            <ChartTooltipContent
              formatter={(value) =>
                currency ? formatMoney(Number(value)) : String(value)
              }
            />
          }
        />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[4, 4, 4, 4]}
          barSize={6}
          isAnimationActive={reducedMotion === false}
          animationDuration={650}
        />
      </BarChart>
    </ChartContainer>
  )
}
