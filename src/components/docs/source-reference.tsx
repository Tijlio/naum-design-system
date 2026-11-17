"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CodeSample } from "./code-sample"

type SourceState =
  | { status: "loading" }
  | { status: "ready"; code: string }
  | { status: "error" }
const getSource = (value: unknown): string => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("files" in value) ||
    !Array.isArray(value.files)
  )
    throw new Error("Invalid registry item")
  const file: unknown = value.files[0]
  if (
    typeof file !== "object" ||
    file === null ||
    !("content" in file) ||
    typeof file.content !== "string"
  )
    throw new Error("Missing source")
  return file.content
}

export const SourceReference = ({ name }: { name: string }) => {
  const [state, setState] = useState<SourceState>({ status: "loading" })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    fetch(`/r/${encodeURIComponent(name)}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Source unavailable")
        return response.json() as Promise<unknown>
      })
      .then((value) => {
        if (!controller.signal.aborted)
          setState({ status: "ready", code: getSource(value) })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" })
      })
    return () => controller.abort()
  }, [name, attempt])
  return (
    <section aria-label="Typed source API" className="space-y-3">
      <h3 className="font-medium">Typed source API</h3>
      {state.status === "loading" && (
        <Skeleton className="h-32 w-full" aria-label="Loading source" />
      )}
      {state.status === "ready" && (
        <CodeSample code={state.code} label="Copy component source" />
      )}
      {state.status === "error" && (
        <div role="alert" className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Source could not be loaded.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setState({ status: "loading" })
              setAttempt((value) => value + 1)
            }}
          >
            Retry source
          </Button>
        </div>
      )}
    </section>
  )
}
