import type { ComponentProps, ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type PageHeaderProps = Omit<ComponentProps<"header">, "title"> & {
  title: string
  eyebrow?: ReactNode
  count?: number
  actions?: ReactNode
}

export const PageHeader = ({
  title,
  eyebrow,
  count,
  actions,
  className,
  ...props
}: PageHeaderProps) => (
  <header
    data-slot="page-header"
    className={cn(
      "flex min-w-0 flex-wrap items-center justify-between gap-4",
      className,
    )}
    {...props}
  >
    <div className="min-w-0 space-y-2">
      {eyebrow && <p className="text-xs text-muted-foreground">{eyebrow}</p>}
      <h1 className="naum-page-title flex flex-wrap items-center gap-3">
        {title}
        {count !== undefined && (
          <Badge
            variant="secondary"
            className="bg-chart-3/10 text-foreground ring-1 ring-chart-3/20"
          >
            {count}
          </Badge>
        )}
      </h1>
    </div>
    {actions && (
      <div
        data-slot="page-header-actions"
        className="flex min-w-0 flex-wrap items-center gap-2"
      >
        {actions}
      </div>
    )}
  </header>
)
