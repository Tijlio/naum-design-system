"use client"

import { useState } from "react"
import { ActivityTimeline } from "@/components/blocks/activity-timeline"
import { Button } from "@/components/ui/button"
import { CodeSample } from "./code-sample"
export const TimelineExample = () => {
  const [empty, setEmpty] = useState(false)
  const entries = [
    {
      id: "1",
      title: "Task completed",
      description: "Send the proposal",
      dateTime: "2026-11-17T10:00",
      dateLabel: "17 Nov 2026 · 10:00",
    },
    {
      id: "2",
      title: "Opportunity moved to Proposal",
      dateTime: "2026-11-16T14:00",
      dateLabel: "16 Nov 2026 · 14:00",
    },
  ]
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => setEmpty((value) => !value)}>
        {empty ? "Show activity" : "Show empty state"}
      </Button>
      <ActivityTimeline entries={empty ? [] : entries} />
      <CodeSample
        code={
          'import { ActivityTimeline } from "@/components/blocks/activity-timeline"\n\n<ActivityTimeline entries={[{ id: "1", title: "Proposal sent",\n  dateTime: "2026-11-17T10:00", dateLabel: "17 Nov 2026 · 10:00",\n  description: "Studio North" }]} />\n\n// Entries are displayed in the supplied order.\n// The host formats dates and supplies optional icons/actions.'
        }
      />
    </div>
  )
}
