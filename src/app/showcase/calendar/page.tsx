import { Suspense } from "react"
import { CalendarWorkspace } from "@/components/showcase/calendar/calendar-workspace"
import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <CalendarWorkspace />
    </Suspense>
  )
}
