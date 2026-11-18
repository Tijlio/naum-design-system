import type { ComponentProps, ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
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

export const BentoStatCardArrow = () => (
  <ArrowUpRight
    aria-hidden
    data-slot="bento-stat-card-arrow"
    className="size-3.5 transition-transform duration-(--naum-duration-hover) ease-naum motion-safe:group-hover/card:translate-x-0.5 motion-safe:group-hover/card:-translate-y-0.5 motion-safe:group-has-[:focus-visible]/card:translate-x-0.5 motion-safe:group-has-[:focus-visible]/card:-translate-y-0.5"
  />
)

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
    data-bento-stat-card=""
    className={cn(
      "h-full w-full justify-between transition-[translate,box-shadow] duration-(--naum-duration-hover) ease-naum motion-safe:hover:-translate-y-0.5 motion-safe:has-[:focus-visible]:-translate-y-0.5",
      className,
    )}
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
