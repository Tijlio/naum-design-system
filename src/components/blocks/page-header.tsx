import type { ComponentProps, ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type PageHeaderProps = Omit<
  ComponentProps<"header">,
  "title" | "children"
> & {
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
      "flex min-w-0 flex-wrap items-center justify-between gap-(--naum-space-section)",
      className,
    )}
    {...props}
  >
    <div className="min-w-0 space-y-2">
      {eyebrow && <p className="text-xs text-muted-foreground">{eyebrow}</p>}
      <h1 className="naum-page-title flex flex-wrap items-center gap-(--naum-space-control)">
        {title}
        {count !== undefined && (
          <Badge variant="soft" tone="mint">
            {count}
          </Badge>
        )}
      </h1>
    </div>
    {actions && (
      <div
        data-slot="page-header-actions"
        className="flex min-w-0 flex-wrap items-center gap-(--naum-space-inline)"
      >
        {actions}
      </div>
    )}
  </header>
)
