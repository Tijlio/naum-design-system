import type { ReactNode } from "react"
import { ShowcaseShell } from "@/components/showcase/showcase-shell"

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return <ShowcaseShell>{children}</ShowcaseShell>
}
