import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const BentoMetricTrend = ({
  direction,
  label,
}: {
  direction: "up" | "down" | "flat"
  label: string
}) => {
  const Icon =
    direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            role="img"
            tabIndex={0}
            aria-label={label}
            className={cn(
              "inline-flex size-5 shrink-0 items-center justify-center rounded-full text-white outline-none focus-visible:ring-2 focus-visible:ring-ring",
              direction === "up"
                ? "bg-emerald-500"
                : direction === "down"
                  ? "bg-orange-600"
                  : "bg-muted-foreground",
            )}
          />
        }
      >
        <Icon className="size-3" aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
