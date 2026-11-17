import type { ComponentProps, ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toolbarVariants = cva(
  "flex min-w-0 flex-wrap items-center justify-between gap-3",
  {
    variants: { variant: { plain: "", inset: "p-6" } },
    defaultVariants: { variant: "plain" },
  },
)

export type PageToolbarProps = ComponentProps<"div"> &
  VariantProps<typeof toolbarVariants> & { actions?: ReactNode }

export const PageToolbar = ({
  children,
  actions,
  variant,
  className,
  ...props
}: PageToolbarProps) => (
  <div
    role="group"
    data-slot="page-toolbar"
    className={cn(toolbarVariants({ variant }), className)}
    {...props}
  >
    <div
      data-slot="page-toolbar-controls"
      className="flex min-w-0 flex-1 basis-full flex-wrap items-center gap-3 sm:basis-0"
    >
      {children}
    </div>
    {actions && (
      <div
        data-slot="page-toolbar-actions"
        className="ml-auto flex min-w-0 flex-wrap items-center gap-2"
      >
        {actions}
      </div>
    )}
  </div>
)
