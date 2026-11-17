"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Bell,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  Layers,
  LayoutGrid,
  Mail,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react"
import { AmbientBackdrop } from "@/components/ui/ambient-backdrop"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MotionDrawPath,
  MotionFadeUp,
  MotionPill,
  MotionProvider,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/ui/motion"

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "employees", label: "Medewerkers", icon: Users },
  { id: "overview", label: "Overzichten", icon: Layers },
  { id: "documents", label: "Documenten", icon: FileText },
  { id: "planning", label: "Planning", icon: Calendar },
  { id: "history", label: "Historiek", icon: Clock },
] as const

const NAV_PILLS = [
  "Finance",
  "Cash Management",
  "Sales",
  "Purchasing",
  "Payroll",
]

const QUICK_ACTIONS = [
  "Sales Quote",
  "Sales Order",
  "Sales Invoice",
  "Purchase Quote",
  "Purchase Order",
]

const ACTIVITY_FILTERS = ["Ongoing Sales", "Ongoing Purchase", "Payments"]

const KPI_CARDS = [
  {
    title: "Sales This Month",
    major: "23",
    minor: ",876",
    trend: "down" as const,
    delta: "-12%",
    lineColor: "#e14d2a",
    pathThisWeek: "M 0 38 C 35 42, 65 18, 100 28 C 135 38, 155 12, 190 18",
    pathLastWeek: "M 0 28 C 40 24, 70 34, 100 22 C 130 12, 160 28, 190 26",
  },
  {
    title: "Overdue Sales Invoice",
    major: "93",
    minor: ",422",
    trend: "up" as const,
    delta: "+36%",
    lineColor: "#16a34a",
    pathThisWeek: "M 0 36 C 30 34, 65 24, 100 26 C 135 28, 155 10, 190 14",
    pathLastWeek: "M 0 26 C 40 32, 75 18, 110 24 C 145 30, 165 20, 190 22",
  },
  {
    title: "Overdue Purchase Invoice",
    major: "170",
    minor: ",024",
    trend: "up" as const,
    delta: "+24%",
    lineColor: "#16a34a",
    pathThisWeek: "M 0 34 C 35 22, 70 30, 105 18 C 140 8, 165 20, 190 12",
    pathLastWeek: "M 0 24 C 35 28, 70 20, 105 32 C 140 42, 165 26, 190 28",
  },
]

const ACTIVITY_CARDS = [
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
] as const

function ActivityMotif({
  motif,
}: {
  motif: (typeof ACTIVITY_CARDS)[number]["motif"]
}) {
  switch (motif) {
    case "wave":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <line x1="8" y1="20" x2="112" y2="20" strokeDasharray="2 3" strokeWidth="1" />
          <MotionDrawPath
            d="M 22 20 L 34 20 L 40 12 L 46 28 L 52 6 L 58 34 L 64 14 L 70 24 L 76 20 L 98 20"
            strokeWidth="1.2"
          />
        </svg>
      )
    case "arc":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <path d="M 20 34 A 40 40 0 0 1 100 34" strokeWidth="1" strokeDasharray="2 3" />
          <MotionDrawPath d="M 32 34 A 28 28 0 0 1 88 34" strokeWidth="1.1" />
          <line x1="16" y1="34" x2="104" y2="34" strokeWidth="1" />
        </svg>
      )
    case "target":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <line x1="14" y1="20" x2="106" y2="20" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx="60" cy="20" r="14" strokeWidth="1" />
          <circle cx="60" cy="20" r="6" strokeWidth="1.2" />
          <circle cx="60" cy="20" r="1.5" fill="white" />
        </svg>
      )
    case "rings":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <circle cx="46" cy="20" r="13" strokeWidth="1" />
          <circle cx="60" cy="20" r="13" strokeWidth="1" />
          <circle cx="74" cy="20" r="13" strokeWidth="1" />
        </svg>
      )
    case "infinity":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <MotionDrawPath
            d="M 40 20 C 40 10, 54 10, 60 20 C 66 30, 80 30, 80 20 C 80 10, 66 10, 60 20 C 54 30, 40 30, 40 20 Z"
            strokeWidth="1.1"
          />
        </svg>
      )
    case "orbit":
      return (
        <svg viewBox="0 0 120 40" className="h-10 w-full stroke-white/70" fill="none">
          <ellipse cx="60" cy="20" rx="28" ry="11" strokeWidth="1" />
          <circle cx="60" cy="20" r="2.5" fill="white" />
          <circle cx="84" cy="14" r="2" fill="white" />
        </svg>
      )
  }
}

export default function UiPage() {
  const [activeNav, setActiveNav] = React.useState<string>("dashboard")
  const [activeTopPill, setActiveTopPill] = React.useState<string>("Finance")

  return (
    <MotionProvider>
      <div className="relative isolate min-h-screen bg-background text-foreground">
        <AmbientBackdrop />

        <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-6 md:p-10">
          {/* Top pill bar */}
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium tracking-tight text-foreground/80">
                Cronus Inc.
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {NAV_PILLS.map((label) => {
                  const selected = activeTopPill === label
                  return (
                    <Button
                      key={label}
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTopPill(label)}
                      className="relative h-8 rounded-full px-3 text-xs font-normal text-foreground/80 hover:bg-transparent hover:text-foreground"
                    >
                      {selected && (
                        <MotionPill
                          layoutId="ui-top-pill"
                          className="bg-card shadow-xs ring-1 ring-foreground/5"
                        />
                      )}
                      {label}
                      <ChevronDown className="size-3.5 opacity-60" />
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="glass"
                size="icon-sm"
                className="rounded-full"
                aria-label="Berichten"
              >
                <Mail className="size-3.5" />
              </Button>
              <Button
                variant="glass"
                size="icon-sm"
                className="rounded-full"
                aria-label="Meldingen"
              >
                <Bell className="size-3.5" />
              </Button>
              <Button
                variant="glass"
                size="icon-sm"
                className="rounded-full"
                aria-label="Zoeken"
              >
                <Search className="size-3.5" />
              </Button>
              <Button
                variant="glass"
                size="sm"
                nativeButton={false}
                render={<Link href="/preview" />}
                className="ml-1 h-8 px-3 text-xs font-normal"
              >
                Component Preview
                <ArrowUpRight className="size-3.5 opacity-70" />
              </Button>
            </div>
          </header>

          {/* Main layout with left rail */}
          <div className="flex items-start gap-5">
            {/* Left vertical icon rail with sliding active pill */}
            <aside
              aria-label="Zijnavigatie"
              className="hidden flex-col gap-2.5 pt-1 md:flex"
            >
              {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => {
                const active = activeNav === id
                return (
                  <Button
                    key={id}
                    variant="ghost"
                    size="icon-lg"
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setActiveNav(id)}
                    className={
                      active
                        ? "relative rounded-full text-foreground hover:bg-transparent dark:text-black"
                        : "relative rounded-full bg-surface-frosted text-foreground/65 ring-1 ring-white/50 backdrop-blur-md hover:bg-card/80 hover:text-foreground dark:ring-white/10"
                    }
                  >
                    {active && (
                      <MotionPill
                        layoutId="ui-sidebar-active"
                        className="bg-white shadow-sm ring-1 ring-foreground/5"
                      />
                    )}
                    <Icon className="size-4" />
                  </Button>
                )
              })}
            </aside>

            <div className="flex min-w-0 flex-1 flex-col gap-6">
              {/* Title & quick actions */}
              <MotionFadeUp>
                <section className="flex flex-col gap-4">
                  <h1 className="font-heading text-4xl font-normal tracking-tight">
                    Dashboard
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {QUICK_ACTIONS.map((action) => (
                      <Button
                        key={action}
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-full border-foreground/15 bg-transparent px-3.5 text-xs font-normal hover:bg-card"
                      >
                        <Plus className="size-3.5 opacity-70" />
                        {action}
                      </Button>
                    ))}
                    <Button
                      variant="default"
                      size="icon-sm"
                      className="rounded-full bg-card text-foreground ring-1 ring-border hover:bg-card/80"
                      aria-label="Meer acties"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </section>
              </MotionFadeUp>

              {/* Top bento row: 3 white KPI cards + 1 Insights mesh card */}
              <MotionStagger className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-9">
                  {KPI_CARDS.map((kpi) => (
                    <MotionStaggerItem key={kpi.title} className="flex">
                      <Card
                        variant="default"
                        className="w-full justify-between transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                      >
                        <CardHeader className="pb-0">
                          <CardTitle className="text-sm font-normal text-muted-foreground">
                            {kpi.title}
                          </CardTitle>
                          <CardAction>
                            <Button
                              variant="secondary"
                              size="icon-sm"
                              className="rounded-full"
                              aria-label={`Open ${kpi.title}`}
                            >
                              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                            </Button>
                          </CardAction>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-5">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-normal tracking-tight tabular-nums">
                              <span className="mr-1 text-lg text-muted-foreground">
                                $
                              </span>
                              {kpi.major}
                              <span className="text-muted-foreground">
                                {kpi.minor}
                              </span>
                            </span>
                            <span
                              className={
                                kpi.trend === "up"
                                  ? "inline-flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                                  : "inline-flex size-5 items-center justify-center rounded-full bg-orange-600 text-white"
                              }
                            >
                              {kpi.trend === "up" ? (
                                <ArrowUp className="size-3" />
                              ) : (
                                <ArrowDown className="size-3" />
                              )}
                            </span>
                          </div>

                          {/* Subtle 1px comparison sparkline */}
                          <div className="flex flex-col gap-2">
                            <div className="relative flex items-center gap-2">
                              <div className="flex h-16 flex-col justify-between py-0.5 text-[10px] leading-none text-muted-foreground/70 tabular-nums">
                                <span>160</span>
                                <span>120</span>
                                <span>80</span>
                                <span>40</span>
                              </div>
                              <svg
                                viewBox="0 0 190 48"
                                preserveAspectRatio="none"
                                className="h-16 min-w-0 flex-1"
                                fill="none"
                              >
                                <line
                                  x1="0"
                                  y1="12"
                                  x2="190"
                                  y2="12"
                                  stroke="currentColor"
                                  strokeOpacity="0.08"
                                  strokeDasharray="2 3"
                                />
                                <line
                                  x1="0"
                                  y1="26"
                                  x2="190"
                                  y2="26"
                                  stroke="currentColor"
                                  strokeOpacity="0.08"
                                  strokeDasharray="2 3"
                                />
                                <line
                                  x1="0"
                                  y1="40"
                                  x2="190"
                                  y2="40"
                                  stroke="currentColor"
                                  strokeOpacity="0.08"
                                  strokeDasharray="2 3"
                                />
                                <line
                                  x1="138"
                                  y1="4"
                                  x2="138"
                                  y2="44"
                                  stroke="currentColor"
                                  strokeOpacity="0.25"
                                  strokeDasharray="2 2"
                                />
                                <MotionDrawPath
                                  d={kpi.pathLastWeek}
                                  stroke="currentColor"
                                  strokeOpacity="0.55"
                                  strokeWidth="1.15"
                                  delay={0.1}
                                />
                                <MotionDrawPath
                                  d={kpi.pathThisWeek}
                                  stroke={kpi.lineColor}
                                  strokeWidth="1.25"
                                  delay={0.2}
                                />
                              </svg>
                              <Badge
                                variant="secondary"
                                className={
                                  kpi.trend === "up"
                                    ? "absolute -top-1 right-6 h-5 rounded-full bg-emerald-500/15 px-2 text-[10px] font-medium text-emerald-700 dark:text-emerald-300"
                                    : "absolute -top-1 right-6 h-5 rounded-full bg-orange-500/15 px-2 text-[10px] font-medium text-orange-700 dark:text-orange-300"
                                }
                              >
                                {kpi.delta}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-foreground" />
                                Last Week
                              </span>
                              <span className="inline-flex items-center gap-1.5">
                                <span
                                  className="size-1.5 rounded-full"
                                  style={{ backgroundColor: kpi.lineColor }}
                                />
                                This Week
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </MotionStaggerItem>
                  ))}
                </div>

                {/* Insights mesh card */}
                <MotionStaggerItem className="flex lg:col-span-3">
                  <Card
                    variant="mesh"
                    className="naum-mesh-amber w-full justify-between transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                  >
                    <CardHeader>
                      <CardTitle className="text-sm font-normal text-white/90">
                        Insights
                      </CardTitle>
                      <CardAction>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                          aria-label="Open Insights"
                        >
                          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                        </Button>
                      </CardAction>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-5">
                      <svg
                        viewBox="0 0 180 76"
                        className="h-20 w-full stroke-white/65"
                        fill="none"
                      >
                        <ellipse cx="90" cy="38" rx="70" ry="24" strokeWidth="1" />
                        <ellipse cx="90" cy="38" rx="50" ry="17" strokeWidth="1" />
                        <ellipse cx="90" cy="38" rx="30" ry="10" strokeWidth="1" />
                        <circle cx="90" cy="38" r="2.5" fill="white" />
                      </svg>

                      <div className="flex flex-col gap-1">
                        <p className="text-xs leading-relaxed text-white/85">
                          Since yesterday your sales have increased by
                        </p>
                        <p className="text-3xl font-normal tracking-tight tabular-nums">
                          $2,756
                          <span className="text-xl text-white/70">.50</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </MotionStaggerItem>
              </MotionStagger>

              {/* Bottom frosted container with mesh activity cards */}
              <MotionFadeUp delay={0.18}>
                <Card variant="frosted" className="gap-4">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-foreground/70" />
                      <CardTitle className="text-base font-normal">
                        Activities
                      </CardTitle>
                      <Badge className="h-5 rounded-full bg-foreground px-2 text-[11px] font-medium text-background">
                        36
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      For this month
                    </CardDescription>
                    <CardAction className="hidden flex-wrap items-center gap-1.5 sm:flex">
                      {ACTIVITY_FILTERS.map((filter) => (
                        <Button
                          key={filter}
                          variant="default"
                          size="xs"
                          className="h-7 rounded-full bg-card px-2.5 text-[11px] font-normal text-foreground ring-1 ring-foreground/6 hover:bg-card/80"
                        >
                          {filter}
                          <X className="size-3 opacity-60" />
                        </Button>
                      ))}
                    </CardAction>
                  </CardHeader>

                  <CardContent>
                    <MotionStagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                      {ACTIVITY_CARDS.map((item) => (
                        <MotionStaggerItem key={item.title} className="flex">
                          <Card
                            variant="mesh"
                            size="sm"
                            className={`${item.mesh} w-full justify-between gap-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5`}
                          >
                            <CardHeader className="px-4">
                              <CardTitle className="whitespace-pre-line text-xs leading-snug font-normal text-white/95">
                                {item.title}
                              </CardTitle>
                              <CardAction>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  className="rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
                                  aria-label={item.title.replace("\n", " ")}
                                >
                                  <ArrowUpRight className="size-3 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                                </Button>
                              </CardAction>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-3 px-4">
                              <ActivityMotif motif={item.motif} />
                              <div className="flex items-end gap-2">
                                <span className="text-2xl leading-none font-normal tabular-nums">
                                  {item.count}
                                </span>
                                <div className="flex flex-col text-[10px] leading-tight text-white/80">
                                  <span
                                    className={
                                      item.positive
                                        ? "inline-flex w-fit items-center rounded-full bg-emerald-400 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-950"
                                        : "inline-flex w-fit items-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[9px] font-semibold text-white"
                                    }
                                  >
                                    {item.delta}
                                  </span>
                                  <span className="mt-0.5">Last 7 days</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </MotionStaggerItem>
                      ))}
                    </MotionStagger>
                  </CardContent>
                </Card>
              </MotionFadeUp>
            </div>
          </div>
        </main>
      </div>
    </MotionProvider>
  )
}
