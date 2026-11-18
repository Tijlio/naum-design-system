"use client"

import { useCallback } from "react"
import { useWorkspaceNotice } from "../workspace-notice"
import { useShowcase } from "../showcase-provider"
import type { FollowUpTask } from "./task-data"
export const useTaskActions = () => {
  const notify = useWorkspaceNotice()
  const { saveTask } = useShowcase()
  const completeTask = useCallback(
    (task: FollowUpTask, completed: boolean) => {
      if (task.completed === completed) return
      saveTask({ ...task, completed })
      notify(completed ? "Task completed" : "Task reopened", {
        description: task.title,
        action: {
          label: "Undo",
          confirmation: "Task change undone",
          onClick: () => saveTask(task),
        },
      })
    },
    [saveTask, notify],
  )
  return { completeTask }
}
