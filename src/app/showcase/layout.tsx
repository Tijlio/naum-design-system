import type { ReactNode } from "react"
import { ShowcaseProvider } from "@/components/showcase/showcase-provider"
import { ShowcaseShell } from "@/components/showcase/showcase-shell"

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return (
    <ShowcaseProvider>
      <ShowcaseShell>{children}</ShowcaseShell>
    </ShowcaseProvider>
  )
}
