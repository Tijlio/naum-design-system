"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheck, Info, TriangleAlert, OctagonAlert, Loader2 } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
        ),
        info: (
          <Info className="size-4 text-indigo-600 dark:text-indigo-400" />
        ),
        warning: (
          <TriangleAlert className="size-4 text-amber-600 dark:text-amber-400" />
        ),
        error: (
          <OctagonAlert className="size-4 text-destructive" />
        ),
        loading: (
          <Loader2 className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "1.25rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast rounded-3xl! border-foreground/6! bg-card/92! backdrop-blur-xl! shadow-[0_12px_32px_-8px_oklch(0.14_0.025_262/14%)]!",
          title: "font-medium! text-foreground!",
          description: "text-muted-foreground! opacity-100!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
