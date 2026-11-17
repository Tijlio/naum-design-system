import type { ReactNode } from "react"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { MotionFadeUp } from "@/components/ui/motion"
import { Skeleton } from "@/components/ui/skeleton"
import type { ExampleState } from "./example-state-control"

export const ExampleStateContent = ({
  state,
  onRecover,
  children,
  subject,
  emptyTitle,
  emptyAction,
}: {
  state: ExampleState
  onRecover: () => void
  children?: ReactNode
  subject: string
  emptyTitle: string
  emptyAction: string
}) => (
  <MotionFadeUp key={state} className="w-full space-y-4">
    {state === "ready" ? (
      children
    ) : state === "loading" ? (
      <>
        <div aria-busy="true" className="space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </div>
        <p role="status" className="text-sm text-muted-foreground">
          Loading {subject}…
        </p>
        <Button variant="outline" size="sm" onClick={onRecover}>
          Finish loading
        </Button>
      </>
    ) : state === "error" ? (
      <>
        <Alert variant="destructive">
          <AlertTitle>Could not load {subject}.</AlertTitle>
        </Alert>
        <Button variant="outline" size="sm" onClick={onRecover}>
          Retry
        </Button>
      </>
    ) : (
      <Empty className="p-4">
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
        </EmptyHeader>
        <Button variant="outline" size="sm" onClick={onRecover}>
          {emptyAction}
        </Button>
      </Empty>
    )}
  </MotionFadeUp>
)
