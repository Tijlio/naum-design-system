export const NAV_PILLS = [
  "Finance",
  "Cash Management",
  "Sales",
  "Purchasing",
  "Payroll",
] as const

export const QUICK_ACTIONS = [
  "Sales Quote",
  "Sales Order",
  "Sales Invoice",
  "Purchase Quote",
  "Purchase Order",
] as const

export const ACTIVITY_FILTERS = [
  "Ongoing Sales",
  "Ongoing Purchase",
  "Payments",
] as const

export interface KpiCardItem {
  title: string
  major: string
  minor: string
  trend: "up" | "down"
  delta: string
  lineColor: string
  pathThisWeek: string
  pathLastWeek: string
}

export const KPI_CARDS: KpiCardItem[] = [
  {
    title: "Sales This Month",
    major: "23",
    minor: ",876",
    trend: "down",
    delta: "-12%",
    lineColor: "#e14d2a",
    pathThisWeek: "M 0 38 C 35 42, 65 18, 100 28 C 135 38, 155 12, 190 18",
    pathLastWeek: "M 0 28 C 40 24, 70 34, 100 22 C 130 12, 160 28, 190 26",
  },
  {
    title: "Overdue Sales Invoice",
    major: "93",
    minor: ",422",
    trend: "up",
    delta: "+36%",
    lineColor: "#16a34a",
    pathThisWeek: "M 0 36 C 30 34, 65 24, 100 26 C 135 28, 155 10, 190 14",
    pathLastWeek: "M 0 26 C 40 32, 75 18, 110 24 C 145 30, 165 20, 190 22",
  },
  {
    title: "Overdue Purchase Invoice",
    major: "170",
    minor: ",024",
    trend: "up",
    delta: "+24%",
    lineColor: "#16a34a",
    pathThisWeek: "M 0 34 C 35 22, 70 30, 105 18 C 140 8, 165 20, 190 12",
    pathLastWeek: "M 0 24 C 35 28, 70 20, 105 32 C 140 42, 165 26, 190 28",
  },
]

export type ActivityMotifKind =
  | "wave"
  | "arc"
  | "target"
  | "rings"
  | "infinity"
  | "orbit"

export interface ActivityCardItem {
  title: string
  count: number
  delta: string
  positive: boolean
  mesh: string
  motif: ActivityMotifKind
}

export const ACTIVITY_CARDS: ActivityCardItem[] = [
  {
    title: "Sales\nQuotes",
    count: 2,
    delta: "+2",
    positive: true,
    mesh: "naum-mesh-lime",
    motif: "wave",
  },
  {
    title: "Sales\nOrders",
    count: 4,
    delta: "-1",
    positive: false,
    mesh: "naum-mesh-coral",
    motif: "arc",
  },
  {
    title: "Sales\nInvoices",
    count: 7,
    delta: "+3",
    positive: true,
    mesh: "naum-mesh-indigo",
    motif: "target",
  },
  {
    title: "Purchase\nOrders",
    count: 5,
    delta: "+2",
    positive: true,
    mesh: "naum-mesh-amber",
    motif: "rings",
  },
  {
    title: "Ongoing\nInvoices",
    count: 0,
    delta: "0",
    positive: true,
    mesh: "naum-mesh-rose",
    motif: "infinity",
  },
  {
    title: "Invoices Due\nNext Week",
    count: 5,
    delta: "-2",
    positive: false,
    mesh: "naum-mesh-mint",
    motif: "orbit",
  },
]
