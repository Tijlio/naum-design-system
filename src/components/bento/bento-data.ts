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

export interface KpiSeriesPoint {
  day: string
  lastWeek: number
  thisWeek: number
}

export type KpiChartType = "line" | "area" | "bar"

export interface KpiCardItem {
  title: string
  major: string
  minor: string
  trend: "up" | "down"
  delta: string
  lineColor: string
  chartType: KpiChartType
  series: KpiSeriesPoint[]
}

export const KPI_CARDS: KpiCardItem[] = [
  {
    title: "Sales This Month",
    major: "23",
    minor: ",876",
    trend: "down",
    delta: "-12%",
    lineColor: "#e14d2a",
    chartType: "line",
    series: [
      { day: "Mon", lastWeek: 88, thisWeek: 62 },
      { day: "Tue", lastWeek: 82, thisWeek: 66 },
      { day: "Wed", lastWeek: 72, thisWeek: 78 },
      { day: "Thu", lastWeek: 92, thisWeek: 64 },
      { day: "Fri", lastWeek: 108, thisWeek: 72 },
      { day: "Sat", lastWeek: 94, thisWeek: 98 },
      { day: "Sun", lastWeek: 86, thisWeek: 106 },
    ],
  },
  {
    title: "Overdue Sales Invoice",
    major: "93",
    minor: ",422",
    trend: "up",
    delta: "+36%",
    lineColor: "#16a34a",
    chartType: "area",
    series: [
      { day: "Mon", lastWeek: 90, thisWeek: 58 },
      { day: "Tue", lastWeek: 80, thisWeek: 64 },
      { day: "Wed", lastWeek: 68, thisWeek: 94 },
      { day: "Thu", lastWeek: 96, thisWeek: 112 },
      { day: "Fri", lastWeek: 84, thisWeek: 104 },
      { day: "Sat", lastWeek: 74, thisWeek: 132 },
      { day: "Sun", lastWeek: 82, thisWeek: 126 },
    ],
  },
  {
    title: "Overdue Purchase Invoice",
    major: "170",
    minor: ",024",
    trend: "up",
    delta: "+24%",
    lineColor: "#16a34a",
    chartType: "bar",
    series: [
      { day: "Mon", lastWeek: 92, thisWeek: 68 },
      { day: "Tue", lastWeek: 84, thisWeek: 72 },
      { day: "Wed", lastWeek: 64, thisWeek: 112 },
      { day: "Thu", lastWeek: 78, thisWeek: 124 },
      { day: "Fri", lastWeek: 94, thisWeek: 114 },
      { day: "Sat", lastWeek: 88, thisWeek: 138 },
      { day: "Sun", lastWeek: 78, thisWeek: 146 },
    ],
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
