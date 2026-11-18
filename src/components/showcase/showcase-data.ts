export type ContactStage = "Lead" | "Customer" | "Partner" | "Archived"
export type ContactNote = { id: string; text: string; date: string }
export type Contact = {
  id: string
  name: string
  company: string
  role: string
  email: string
  stage: ContactStage
  owner: string
  value: number
  lastContact: string
  notes: ContactNote[]
}
export const DEAL_STAGES = [
  "Discovery",
  "Proposal",
  "Negotiation",
  "Won",
] as const
export type Deal = {
  id: string
  title: string
  contactId: string
  value: number
  stage: (typeof DEAL_STAGES)[number]
}
export type Appointment = {
  id: string
  title: string
  start: string
  end: string
  calendar: "Sales" | "Team" | "Personal"
  contactId?: string
  dealId?: string
  taskId?: string
  allDay: boolean
  description: string
}

// A stable demo week keeps examples and visual reviews reproducible.
export const DEMO_DATE = "2026-11-17"
// Illustrative previous-period values for the demo KPI comparisons.
export const CRM_COMPARISON = {
  pipelineValue: 70000,
  activeContacts: 6,
  wonValue: 24000,
}
export const CONTACT_STAGES: ContactStage[] = [
  "Lead",
  "Customer",
  "Partner",
  "Archived",
]
export const CALENDARS = ["Sales", "Team", "Personal"] as const
export const INITIAL_CONTACTS: Contact[] = [
  {
    id: "c1",
    name: "Emma Laurent",
    company: "Studio North",
    role: "Co-founder",
    email: "emma@studionorth.example",
    stage: "Customer",
    owner: "Alex Morgan",
    value: 24500,
    lastContact: "2026-11-16",
    notes: [
      {
        id: "n1",
        text: "Interested in extending the workspace rollout to the full team.",
        date: "2026-11-16",
      },
    ],
  },
  {
    id: "c2",
    name: "Oliver Chen",
    company: "Forma",
    role: "Head of Design",
    email: "oliver@forma.example",
    stage: "Lead",
    owner: "Alex Morgan",
    value: 18000,
    lastContact: "2026-11-15",
    notes: [
      {
        id: "n2",
        text: "Send the proposal before our Wednesday review.",
        date: "2026-11-15",
      },
    ],
  },
  {
    id: "c3",
    name: "Sofia De Smet",
    company: "Atelier Eight",
    role: "Managing Director",
    email: "sofia@ateliereight.example",
    stage: "Partner",
    owner: "Maya Patel",
    value: 32000,
    lastContact: "2026-11-17",
    notes: [],
  },
  {
    id: "c4",
    name: "Liam Williams",
    company: "Orbit Labs",
    role: "Product Lead",
    email: "liam@orbit.example",
    stage: "Lead",
    owner: "Maya Patel",
    value: 12500,
    lastContact: "2026-11-12",
    notes: [],
  },
  {
    id: "c5",
    name: "Noor Janssens",
    company: "Fieldwork",
    role: "Operations Lead",
    email: "noor@fieldwork.example",
    stage: "Customer",
    owner: "Alex Morgan",
    value: 28000,
    lastContact: "2026-11-14",
    notes: [],
  },
  {
    id: "c6",
    name: "Lucas Martin",
    company: "Common Ground",
    role: "Founder",
    email: "lucas@common.example",
    stage: "Lead",
    owner: "Maya Patel",
    value: 9600,
    lastContact: "2026-11-10",
    notes: [],
  },
  {
    id: "c7",
    name: "Amira Hassan",
    company: "Sunday Studio",
    role: "Creative Director",
    email: "amira@sunday.example",
    stage: "Customer",
    owner: "Alex Morgan",
    value: 16000,
    lastContact: "2026-11-13",
    notes: [],
  },
  {
    id: "c8",
    name: "Theo Vermeulen",
    company: "Morrow",
    role: "Project Director",
    email: "theo@morrow.example",
    stage: "Partner",
    owner: "Maya Patel",
    value: 21500,
    lastContact: "2026-11-11",
    notes: [],
  },
]
export const DEALS: Deal[] = [
  {
    id: "d1",
    title: "Studio North · Workspace rollout",
    contactId: "c1",
    value: 24500,
    stage: "Negotiation",
  },
  {
    id: "d2",
    title: "Forma · Brand platform",
    contactId: "c2",
    value: 18000,
    stage: "Proposal",
  },
  {
    id: "d3",
    title: "Orbit Labs · Product sprint",
    contactId: "c4",
    value: 12500,
    stage: "Discovery",
  },
  {
    id: "d4",
    title: "Fieldwork · Annual partnership",
    contactId: "c5",
    value: 28000,
    stage: "Won",
  },
  {
    id: "d5",
    title: "Common Ground · Discovery",
    contactId: "c6",
    value: 9600,
    stage: "Discovery",
  },
]
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "e1",
    title: "Weekly planning",
    start: "2026-11-16T09:00",
    end: "2026-11-16T09:45",
    calendar: "Team",
    allDay: false,
    description: "Priorities and projects for the week.",
  },
  {
    id: "e2",
    title: "Studio North · Kick-off",
    start: "2026-11-17T09:30",
    end: "2026-11-17T10:30",
    calendar: "Sales",
    contactId: "c1",
    allDay: false,
    description: "Workspace rollout and next steps.",
  },
  {
    id: "e3",
    title: "Design review",
    start: "2026-11-17T11:00",
    end: "2026-11-17T12:00",
    calendar: "Team",
    allDay: false,
    description: "Review the next product iteration.",
  },
  {
    id: "e4",
    title: "Project check-in",
    start: "2026-11-17T11:30",
    end: "2026-11-17T12:30",
    calendar: "Sales",
    contactId: "c3",
    allDay: false,
    description: "Atelier Eight partnership.",
  },
  {
    id: "e5",
    title: "Focus time",
    start: "2026-11-17T14:00",
    end: "2026-11-17T16:00",
    calendar: "Personal",
    allDay: false,
    description: "Proposals and follow-ups.",
  },
  {
    id: "e6",
    title: "Forma · Proposal review",
    start: "2026-11-18T10:00",
    end: "2026-11-18T11:00",
    calendar: "Sales",
    contactId: "c2",
    allDay: false,
    description: "Review scope, timing and investment.",
  },
  {
    id: "e7",
    title: "Team offsite",
    start: "2026-11-19T00:00",
    end: "2026-11-20T00:00",
    calendar: "Team",
    allDay: true,
    description: "A day together at the studio.",
  },
  {
    id: "e8",
    title: "Orbit Labs · Discovery",
    start: "2026-11-20T13:00",
    end: "2026-11-20T14:00",
    calendar: "Sales",
    contactId: "c4",
    allDay: false,
    description: "Explore the product sprint.",
  },
]
export const REVENUE_SERIES = [
  { month: "Jun", revenue: 26, target: 30 },
  { month: "Jul", revenue: 34, target: 33 },
  { month: "Aug", revenue: 29, target: 36 },
  { month: "Sep", revenue: 43, target: 39 },
  { month: "Oct", revenue: 48, target: 42 },
  { month: "Nov", revenue: 57, target: 45 },
]
