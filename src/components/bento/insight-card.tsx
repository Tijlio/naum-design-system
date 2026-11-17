"use client"

import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function InsightCard() {
  return (
    <Card
      variant="mesh"
      className="naum-mesh-amber w-full justify-between naum-card-lift"
    >
      <CardHeader>
        <CardTitle className="text-sm font-normal text-white/90">
          Insights
        </CardTitle>
        <CardAction>
          <Button variant="mesh" size="icon-sm" aria-label="Open Insights">
            <ArrowUpRight className="size-3.5 transition-transform duration-200 motion-safe:group-hover/card:translate-x-0.5 motion-safe:group-hover/card:-translate-y-0.5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <svg
          viewBox="0 0 180 76"
          className="h-20 w-full stroke-white/65"
          fill="none"
        >
          <ellipse cx="90" cy="38" rx="70" ry="24" strokeWidth="1" />
          <ellipse cx="90" cy="38" rx="50" ry="17" strokeWidth="1" />
          <ellipse cx="90" cy="38" rx="30" ry="10" strokeWidth="1" />
          <circle cx="90" cy="38" r="2.5" fill="white" />
        </svg>

        <div className="flex flex-col gap-1">
          <p className="text-xs leading-relaxed text-white/85">
            Since yesterday your sales have increased by
          </p>
          <p className="text-3xl font-normal tracking-tight tabular-nums">
            $2,756<span className="text-xl text-white/70">.50</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
