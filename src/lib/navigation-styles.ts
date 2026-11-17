import { cva } from "class-variance-authority"

export const navigationItemVariants = cva(
  "relative isolate h-10 overflow-visible rounded-full border border-transparent bg-clip-padding data-active:bg-transparent",
  {
    variants: {
      active: {
        true: "text-foreground hover:bg-transparent focus:bg-transparent focus:text-foreground data-active:text-foreground text-(--naum-active-foreground) dark:text-(--naum-active-foreground) dark:focus:text-(--naum-active-foreground) dark:data-active:text-(--naum-active-foreground)",
        false:
          "bg-surface-frosted text-foreground/65 ring-1 ring-(--naum-frosted-ring) backdrop-blur-md hover:bg-card/80 hover:text-foreground dark:hover:bg-card/80",
      },
    },
    defaultVariants: { active: false },
  },
)
