"use client"

import { MissingRecordNotice } from "../missing-record-notice"
import { useRecordFocus } from "../forms/use-record-focus"
import { AppPage } from "@/components/blocks/app-page"
import { PageToolbar } from "@/components/blocks/page-toolbar"
import { PageHeader } from "@/components/blocks/page-header"
import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import { DataTable } from "@/components/blocks/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchInput } from "@/components/ui/search-input"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import { DEMO_DATE } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { useWorkspaceTable } from "../use-workspace-table"
import { WorkspaceSavedViews } from "../workspace-saved-views"
import { useTaskActions } from "./use-task-actions"
import { TaskEditor } from "./task-editor"
import { TaskFormTrigger } from "./task-form-trigger"
import type { FollowUpTask } from "./task-data"
export const TasksWorkspace = () => {
  const { tasks, contacts, saveTask, persistence } = useShowcase()
  const { completeTask } = useTaskActions()
  const { captureFocus, restoreFocus } = useRecordFocus()
  const params = useSearchParams(),
    router = useRouter()
  const edit = useCallback(
    (id?: string) => {
      if (id) captureFocus()
      const url = new URL(window.location.href)
      if (id) url.searchParams.set("task", id)
      else url.searchParams.delete("task")
      router[id ? "push" : "replace"](`${url.pathname}${url.search}`, {
        scroll: false,
      })
    },
    [router, captureFocus],
  )
  const columns = useMemo<ColumnDef<FollowUpTask>[]>(
    () => [
      {
        id: "title",
        header: "Task",
        accessorFn: (task) =>
          `${task.title} ${contacts.find((contact) => contact.id === task.contactId)?.name ?? ""}`,
        enableHiding: false,
        cell: ({ row }) => (
          <div>
            <Button
              variant="link"
              className="h-auto p-0 text-left whitespace-normal"
              onClick={() => edit(row.original.id)}
            >
              {row.original.title}
            </Button>
            <p className="mt-1 text-xs text-muted-foreground md:hidden">
              {
                contacts.find(
                  (contact) => contact.id === row.original.contactId,
                )?.name
              }{" "}
              · Due {format(parseISO(row.original.dueDate), "d MMM")}
            </p>
            {!row.original.completed && row.original.dueDate < DEMO_DATE && (
              <Badge variant="destructive" className="mt-1 md:hidden">
                Overdue
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "contact",
        header: "Contact",
        accessorFn: (task) =>
          contacts.find((contact) => contact.id === task.contactId)?.name ?? "",
        enableGlobalFilter: false,
      },
      {
        accessorKey: "dueDate",
        header: "Due date",
        enableGlobalFilter: false,
        cell: ({ row }) => (
          <div className="space-y-1">
            <span>{format(parseISO(row.original.dueDate), "d MMM yyyy")}</span>
            {!row.original.completed && row.original.dueDate < DEMO_DATE && (
              <Badge variant="destructive">Overdue</Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: "completed",
        header: "Status",
        enableGlobalFilter: false,
        filterFn: (row, _id, value) =>
          value === "Overdue"
            ? !row.original.completed && row.original.dueDate < DEMO_DATE
            : row.original.completed === (value === "Completed"),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              aria-label={`Complete ${row.original.title}`}
              checked={row.original.completed}
              onCheckedChange={(completed) =>
                completeTask(row.original, completed)
              }
            />
            <span className="text-xs text-muted-foreground">
              {row.original.completed ? "Completed" : "Open"}
            </span>
          </div>
        ),
      },
    ],
    [contacts, edit, completeTask],
  )
  const { table, view, update, apply, selectedView } = useWorkspaceTable({
    scope: "tasks",
    data: tasks,
    columns,
    getRowId: (task) => task.id,
  })
  const selected = tasks.find((task) => task.id === params.get("task"))
  return (
    <AppPage>
      {persistence !== "loading" && params.has("task") && !selected && (
        <MissingRecordNotice record="Task" onDismiss={() => edit()} />
      )}
      <PageHeader
        eyebrow="Follow-ups"
        title="Tasks"
        count={tasks.filter((task) => !task.completed).length}
        actions={<TaskFormTrigger variant="default" />}
      />
      <PageToolbar aria-label="View controls">
        <WorkspaceSavedViews
          scope="tasks"
          state={view}
          selected={selectedView}
          onApply={apply}
        />
      </PageToolbar>
      <DataTable
        table={table}
        label="Tasks"
        selectable
        getRowLabel={(task) => task.title}
        mobileHiddenColumns={["contact", "dueDate"]}
        columnLabels={{
          contact: "Contact",
          dueDate: "Due date",
          completed: "Status",
        }}
        columnClassNames={{
          contact: "w-36",
          dueDate: "w-36",
          completed: "w-28 md:w-36",
        }}
        toolbar={
          <>
            <SearchInput
              className="max-w-sm"
              label="Search tasks"
              placeholder="Search tasks…"
              value={view.query}
              onChange={(event) => update("query", event.target.value)}
            />
            <Label htmlFor="task-status-filter" className="sr-only">
              Filter by status
            </Label>
            <SelectControl
              id="task-status-filter"
              value={view.filters.completed ?? "Open"}
              items={[
                { value: "Open", label: "Open" },
                { value: "Completed", label: "Completed" },
                { value: "Overdue", label: "Overdue" },
              ]}
              onValueChange={(value) =>
                value &&
                update("filters", (current) => ({
                  ...current,
                  completed: value,
                }))
              }
            />
          </>
        }
        bulkActions={(records) => (
          <Button
            variant="outline"
            disabled={records.every((task) => task.completed)}
            onClick={() => {
              records
                .filter((task) => !task.completed)
                .forEach((task) => saveTask({ ...task, completed: true }))
              table.resetRowSelection()
              toast.success("Tasks completed", {
                action: {
                  label: "Undo",
                  onClick: () => records.forEach(saveTask),
                },
              })
            }}
          >
            Complete {records.length}
          </Button>
        )}
      />
      {selected && (
        <TaskEditor
          finalFocus={restoreFocus}
          key={selected.id}
          task={selected}
          onClose={() => edit()}
        />
      )}
    </AppPage>
  )
}
