"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import {
  CircleCheck,
  Info,
  TriangleAlert,
  OctagonAlert,
  Loader2,
} from "lucide-react"

const toastStyle: CSSProperties & Record<`--${string}`, string> = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "1.25rem",
}

const Toaster = ({
  className,
  icons,
  style,
  toastOptions,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme === "light" || theme === "dark" ? theme : "system"}
      className={cn("toaster group", className)}
      icons={{
        success: (
          <CircleCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
        ),
        info: <Info className="size-4 text-indigo-600 dark:text-indigo-400" />,
        warning: (
          <TriangleAlert className="size-4 text-amber-600 dark:text-amber-400" />
        ),
        error: <OctagonAlert className="size-4 text-destructive" />,
        loading: <Loader2 className="size-4 animate-spin" />,
        ...icons,
      }}
      style={{ ...toastStyle, ...style }}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn(
            "cn-toast rounded-3xl! border-foreground/6! bg-card/92! backdrop-blur-xl! shadow-naum-toast!",
            toastOptions?.classNames?.toast,
          ),
          title: cn(
            "font-medium! text-foreground!",
            toastOptions?.classNames?.title,
          ),
          description: cn(
            "text-muted-foreground! opacity-100!",
            toastOptions?.classNames?.description,
          ),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
