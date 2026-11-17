import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { TasksWorkspace } from "@/components/showcase/tasks/tasks-workspace"
export default function TasksPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <TasksWorkspace />
    </Suspense>
  )
}
