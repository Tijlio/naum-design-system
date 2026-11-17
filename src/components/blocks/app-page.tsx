"use client"

import type { ComponentProps } from "react"
import { MotionFadeUp } from "@/components/ui/motion"
import { cn } from "@/lib/utils"

export const AppPage = ({
  className,
  ...props
}: ComponentProps<typeof MotionFadeUp>) => (
  <MotionFadeUp
    data-slot="app-page"
    className={cn("flex min-w-0 flex-col gap-(--naum-space-page)", className)}
    {...props}
  />
)
