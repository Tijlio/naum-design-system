import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PipelineWorkspace } from "@/components/showcase/crm/pipeline-workspace"

export default function PipelinePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <PipelineWorkspace />
    </Suspense>
  )
}
