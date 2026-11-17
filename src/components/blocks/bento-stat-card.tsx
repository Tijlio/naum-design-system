import type { ComponentProps, ReactNode } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BentoMetricValue } from "@/components/bento/metric-value"
import { BentoMetricTrend } from "@/components/bento/metric-trend"
import { cn } from "@/lib/utils"

export type BentoStatCardProps = {
  title: string
  value: ComponentProps<typeof BentoMetricValue>
  trend?: ComponentProps<typeof BentoMetricTrend>
  action?: ReactNode
  children?: ReactNode
  className?: string
}

export const BentoStatCard = ({
  title,
  value,
  trend,
  action,
  children,
  className,
}: BentoStatCardProps) => (
  <Card
    className={cn("h-full w-full justify-between naum-card-lift", className)}
  >
    <CardHeader>
      <CardTitle className="text-sm font-normal text-muted-foreground">
        {title}
      </CardTitle>
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BentoMetricValue {...value} />
        {trend && <BentoMetricTrend {...trend} />}
      </div>
      {children}
    </CardContent>
  </Card>
)
