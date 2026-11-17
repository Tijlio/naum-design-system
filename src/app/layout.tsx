import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ShowcaseProvider } from "@/components/showcase/showcase-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-naum",
})

export const metadata: Metadata = {
  title: "Naum Design System",
  description:
    "Open-source shadcn + Base UI + Tailwind v4 design system with oklch glass and mesh surfaces.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", plusJakartaSans.variable)}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ShowcaseProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ShowcaseProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
