"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export const CodeSample = ({
  code,
  label = "Copy code",
}: {
  code: string
  label?: string
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const copied = copiedCode === code
  const [error, setError] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setError(false)
    } catch {
      setError(true)
    }
  }
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={copy} aria-label={label}>
          {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre
        className="max-h-96 max-w-full overflow-auto rounded-2xl bg-muted/60 p-4 text-xs leading-relaxed"
        tabIndex={0}
        aria-label="Code sample"
      >
        <code>{code}</code>
      </pre>
      <span role="status" className="text-xs text-muted-foreground">
        {error
          ? "Copy unavailable. Select and copy the code above."
          : copied
            ? "Copied to clipboard."
            : ""}
      </span>
    </div>
  )
}
