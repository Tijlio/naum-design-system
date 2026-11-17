export type FollowUpTask = {
  id: string
  title: string
  contactId: string
  dealId?: string
  dueDate: string
  completed: boolean
}
export type WorkspaceActivity = {
  id: string
  contactId: string
  entityId?: string
  kind: "contact" | "opportunity" | "appointment" | "task"
  timestamp: string
  title: string
  description: string
}
export const INITIAL_TASKS: FollowUpTask[] = [
  {
    id: "t1",
    title: "Send Forma proposal",
    contactId: "c2",
    dealId: "d2",
    dueDate: "2026-11-18",
    completed: false,
  },
  {
    id: "t2",
    title: "Confirm workspace rollout",
    contactId: "c1",
    dealId: "d1",
    dueDate: "2026-11-16",
    completed: false,
  },
  {
    id: "t3",
    title: "Send Fieldwork recap",
    contactId: "c5",
    dealId: "d4",
    dueDate: "2026-11-17",
    completed: true,
  },
]
export const INITIAL_ACTIVITIES: WorkspaceActivity[] = [
  {
    id: "a1",
    contactId: "c1",
    entityId: "d1",
    kind: "opportunity",
    timestamp: "2026-11-16T10:00",
    title: "Opportunity moved to Negotiation",
    description: "Studio North · Workspace rollout · Proposal → Negotiation",
  },
  {
    id: "a2",
    contactId: "c5",
    entityId: "t3",
    kind: "task",
    timestamp: "2026-11-17T10:00",
    title: "Task completed",
    description: "Send Fieldwork recap",
  },
]
