"use client"

import { format, parseISO } from "date-fns"
import { MotionLayout } from "@/components/ui/motion"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useShowcase } from "../showcase-provider"
import { useTaskActions } from "./use-task-actions"
import { TaskFormTrigger } from "./task-form-trigger"
export const RelatedTasks = ({
  contactId,
  dealId,
}: {
  contactId: string
  dealId?: string
}) => {
  const { tasks } = useShowcase()
  const { completeTask } = useTaskActions()
  const matching = tasks
    .filter(
      (task) =>
        task.contactId === contactId && (!dealId || task.dealId === dealId),
    )
    .sort(
      (a, b) =>
        Number(a.completed) - Number(b.completed) ||
        a.dueDate.localeCompare(b.dueDate),
    )
  return (
    <section aria-label="Follow-up tasks" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-medium">Tasks</h3>
        <TaskFormTrigger contactId={contactId} dealId={dealId} />
      </div>
      {matching.map((task) => (
        <MotionLayout key={task.id}>
          <Card size="sm">
            <CardContent className="flex items-start gap-3">
              <Checkbox
                className="mt-1"
                aria-label={`Complete ${task.title}`}
                checked={task.completed}
                onCheckedChange={(completed) => completeTask(task, completed)}
              />
              <div className="min-w-0 flex-1">
                <TaskFormTrigger task={task} />
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    Due {format(parseISO(task.dueDate), "d MMM yyyy")}
                  </span>
                  {task.completed && (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </MotionLayout>
      ))}
      {!matching.length && (
        <p className="text-sm text-muted-foreground">No follow-up tasks.</p>
      )}
    </section>
  )
}
