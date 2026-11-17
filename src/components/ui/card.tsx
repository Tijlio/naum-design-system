import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import type { NaumTone } from "@/lib/tone"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden py-(--card-spacing) text-sm text-card-foreground has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
  {
    variants: {
      variant: {
        default: "naum-surface-card",
        glass:
          "naum-glass-card rounded-3xl transition-all duration-(--naum-duration-normal) hover:border-foreground/15",
        frosted: "naum-surface-frosted",
        mesh: "rounded-3xl border border-white/15 text-white shadow-sm [&_[data-slot=card-description]]:text-white/80",
      },
      size: {
        default: "[--card-spacing:var(--naum-inset-panel)]",
        sm: "[--card-spacing:var(--naum-inset-compact)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Card({
  className,
  variant = "default",
  size = "default",
  tone,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { tone?: NaumTone }) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      data-tone={tone}
      className={cn(
        cardVariants({ variant, size }),
        tone && "naum-tone",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-2 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-base font-medium", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className,
      )}
      {...props}
    />
  )
}

export {
  Card,
  cardVariants,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
