"use client"

import { useState } from "react"
import {
  DataTableViews,
  type DataTableViewItem,
} from "@/components/blocks/data-table-views"
import { CodeSample } from "./code-sample"
export const SavedViewsExample = () => {
  const [views, setViews] = useState<DataTableViewItem[]>([
    { id: "all", name: "All members", readOnly: true },
  ])
  const [status, setStatus] = useState("")
  const [selected, setSelected] = useState<string | undefined>("all")
  return (
    <div className="space-y-6">
      <DataTableViews
        views={views}
        selected={selected}
        onSelect={setSelected}
        onSave={(name) => {
          const id = crypto.randomUUID()
          setViews((current) => [...current, { id, name }])
          setSelected(id)
        }}
        onUpdate={() => setStatus("View updated")}
        onDelete={(id) => {
          setViews((current) => current.filter((view) => view.id !== id))
          setSelected("all")
        }}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {status || views.find((view) => view.id === selected)?.name}
      </p>
      <CodeSample
        code={
          'import { DataTableViews } from "@/components/blocks/data-table-views"\n\n<DataTableViews views={views} selected={selectedId}\n  onSelect={applyView} onSave={saveCurrentView}\n  onUpdate={updateView} onDelete={deleteView} />\n\n// The host owns the saved state, URL and persistence.\n// Items with readOnly: true cannot be updated or deleted.'
        }
      />
    </div>
  )
}
