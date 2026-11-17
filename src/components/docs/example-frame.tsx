import type { ReactNode } from "react"
import { CodeSample } from "./code-sample"

export const ExampleFrame = ({
  controls,
  children,
  code,
  contract,
}: {
  controls: ReactNode
  children: ReactNode
  code: string
  contract: string
}) => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2">{controls}</div>
    <section
      aria-label="Live example"
      className="flex min-h-52 min-w-0 items-center justify-center rounded-3xl bg-surface-frosted p-4 sm:p-6"
    >
      {children}
    </section>
    <section aria-label="Usage">
      <h3 className="mb-2 font-medium">Usage</h3>
      <CodeSample code={code} />
    </section>
    <section aria-label="API">
      <h3 className="mb-2 font-medium">API & accessibility</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {contract}
      </p>
    </section>
  </div>
)
