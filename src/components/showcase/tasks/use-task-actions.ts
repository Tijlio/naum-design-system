"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { useShowcase } from "../showcase-provider"
import type { FollowUpTask } from "./task-data"
export const useTaskActions = () => {
  const { saveTask } = useShowcase()
  const completeTask = useCallback(
    (task: FollowUpTask, completed: boolean) => {
      if (task.completed === completed) return
      saveTask({ ...task, completed })
      toast.success(completed ? "Task completed" : "Task reopened", {
        description: task.title,
        action: { label: "Undo", onClick: () => saveTask(task) },
      })
    },
    [saveTask],
  )
  return { completeTask }
}
