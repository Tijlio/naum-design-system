"use client"

import { toast } from "sonner"
import { DataTableViews } from "@/components/blocks/data-table-views"
import type { DataTableViewState } from "@/lib/data-table-view"
import { useShowcase } from "./showcase-provider"
import {
  normalizeTableView,
  presetTableViews,
  type ViewScope,
} from "./table-views"

export const WorkspaceSavedViews = ({
  scope,
  state,
  selected,
  onApply,
}: {
  scope: ViewScope
  state: DataTableViewState
  selected?: string
  onApply: (state: DataTableViewState, id: string) => void
}) => {
  const { savedViews, saveView, removeView } = useShowcase()
  const presets = presetTableViews(scope)
  const custom = savedViews.filter((view) => view.scope === scope)
  const views = [
    ...presets.map((view) => ({ ...view, readOnly: true })),
    ...custom,
  ]
  const current = views.find((view) => view.id === selected)
  return (
    <DataTableViews
      views={views}
      selected={selected}
      dirty={Boolean(
        current &&
        JSON.stringify(normalizeTableView(current.state, scope)) !==
          JSON.stringify(state),
      )}
      onSelect={(id) => {
        const view = views.find((view) => view.id === id)
        if (view) onApply(view.state, view.id)
      }}
      onSave={(name) => {
        const id = crypto.randomUUID()
        saveView({ id, name, scope, state })
        onApply(state, id)
        toast.success("View saved")
      }}
      onUpdate={(id) => {
        const current = custom.find((view) => view.id === id)
        if (current) {
          saveView({ ...current, state })
          onApply(state, id)
          toast.success("View updated")
        }
      }}
      onDelete={(id) => {
        const current = custom.find((view) => view.id === id)
        if (current) {
          removeView(id)
          toast.success("View deleted", {
            action: { label: "Undo", onClick: () => saveView(current) },
          })
        }
      }}
    />
  )
}
