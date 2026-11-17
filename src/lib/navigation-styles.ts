import { cva } from "class-variance-authority"

export const navigationItemVariants = cva(
  "relative isolate h-10 overflow-visible rounded-full border border-transparent bg-clip-padding data-active:bg-transparent",
  {
    variants: {
      active: {
        true: "text-foreground hover:bg-transparent focus:bg-transparent focus:text-foreground data-active:text-foreground dark:text-black dark:focus:text-black dark:data-active:text-black",
        false:
          "bg-surface-frosted text-foreground/65 ring-1 ring-white/50 backdrop-blur-md hover:bg-card/80 hover:text-foreground dark:ring-white/10 dark:hover:bg-card/80",
      },
    },
    defaultVariants: { active: false },
  },
)
