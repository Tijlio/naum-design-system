"use client"

import Link from "next/link"
import {
  CalendarDays,
  CheckCheck,
  Flag,
  MessageSquare,
  Users,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { ActivityTimeline } from "@/components/blocks/activity-timeline"
import { Button } from "@/components/ui/button"
import { useShowcase } from "../showcase-provider"
import type { Contact } from "../showcase-data"
import { getContactTimeline } from "./contact-timeline-data"
const ICONS = {
  note: MessageSquare,
  contact: Users,
  opportunity: Flag,
  appointment: CalendarDays,
  task: CheckCheck,
}
export const ContactTimeline = ({ contact }: { contact: Contact }) => {
  const { appointments, activities, tasks, deals } = useShowcase()
  const entries = getContactTimeline(
    contact,
    appointments,
    activities,
    tasks,
    deals,
  )
  return (
    <ActivityTimeline
      label="Contact timeline"
      entries={entries.map((entry) => {
        const Icon = ICONS[entry.kind]
        return {
          ...entry,
          dateTime: entry.timestamp,
          dateLabel: format(
            parseISO(entry.timestamp),
            entry.kind === "note" ? "d MMM yyyy" : "d MMM yyyy · HH:mm",
          ),
          icon: <Icon />,
          action: entry.href ? (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              nativeButton={false}
              render={<Link href={entry.href} />}
            >
              Open {entry.kind}
            </Button>
          ) : undefined,
        }
      })}
    />
  )
}
