"use client"

import { useState, type CSSProperties } from "react"
import { CalendarDays, LayoutDashboard, Users } from "lucide-react"
import { BentoStatCard } from "@/components/blocks/bento-stat-card"
import { AppNavigation } from "@/components/blocks/app-navigation"
import { InsightCard } from "@/components/bento/insight-card"
import { Button } from "@/components/ui/button"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SelectControl } from "@/components/ui/select-control"
import { Label } from "@/components/ui/label"
import { TimelineExample } from "./timeline-example"
import { DataTableExample } from "./data-table-example"
import { SavedViewsExample } from "./saved-views-example"
import { CodeSample } from "./code-sample"

export const BlockExamples = ({ name }: { name: string }) => {
  const [direction, setDirection] = useState<"up" | "down" | "flat">("up")
  const [active, setActive] = useState("overview")
  const [opened, setOpened] = useState(false)
  const navigation = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard /> },
    { id: "contacts", label: "Contacts", icon: <Users /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays /> },
  ]
  if (name === "activity-timeline") return <TimelineExample />
  if (name === "data-table") return <DataTableExample />
  if (name === "data-table-views") return <SavedViewsExample />
  const code =
    name === "bento-stat-card"
      ? `import { BentoStatCard } from "@/components/blocks/bento-stat-card"\n\n<BentoStatCard title="Revenue" value={{ currency: "€", major: "24", minor: ",500" }}\n  trend={{ direction: "${direction}", label: "Compared with last month" }}>\n  <p>Last 30 days</p>\n</BentoStatCard>`
      : name === "bento-insight-card"
        ? 'import { InsightCard } from "@/components/bento/insight-card"\nimport { Button } from "@/components/ui/button"\n\n<InsightCard title="Appointments" action={<Button nativeButton={false} render={<a href="/calendar" />}>Open calendar</Button>}>\n  <p>4 appointments this week</p>\n</InsightCard>'
        : name === "app-navigation"
          ? 'import { AppNavigation } from "@/components/blocks/app-navigation"\nimport { LayoutDashboard } from "lucide-react"\n\n// Inside SidebarProvider and MotionProvider:\n<AppNavigation items={[{ id: "overview", label: "Overview",\n  icon: <LayoutDashboard />, render: <a href="/overview" />, active: true }]} />'
          : 'import { AppShell } from "@/components/blocks/app-shell"\nimport { LayoutDashboard } from "lucide-react"\n\n<AppShell brand={<span>Acme</span>}\n  navigation={[{ id: "overview", label: "Overview", icon: <LayoutDashboard />,\n    render: <a href="/overview" />, active: true }]}\n  header={<span>Workspace</span>}>\n  <h1 className="naum-page-title">Overview</h1>\n</AppShell>'
  return (
    <div className="space-y-6">
      {name === "bento-stat-card" && (
        <div className="max-w-xs space-y-2">
          <Label htmlFor="block-trend">Trend</Label>
          <SelectControl
            id="block-trend"
            value={direction}
            onValueChange={(value) => value && setDirection(value)}
            items={[
              { value: "up", label: "Up" },
              { value: "down", label: "Down" },
              { value: "flat", label: "Unchanged" },
            ]}
          />
        </div>
      )}
      <div
        aria-label="Block preview"
        className="rounded-3xl bg-surface-frosted p-4 sm:p-6"
      >
        {name === "bento-stat-card" && (
          <div className="mx-auto max-w-sm">
            <BentoStatCard
              title="Revenue"
              value={{ currency: "€", major: "24", minor: ",500" }}
              trend={{ direction, label: "Compared with last month" }}
            >
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </BentoStatCard>
          </div>
        )}
        {name === "bento-insight-card" && (
          <div className="mx-auto max-w-sm">
            <InsightCard
              title="Appointments"
              action={
                <Button
                  variant="mesh"
                  size="sm"
                  onClick={() => setOpened((value) => !value)}
                >
                  Open calendar
                </Button>
              }
            >
              <p>
                {opened
                  ? "Tuesday, 17 November · 09:30"
                  : "4 appointments this week"}
              </p>
            </InsightCard>
          </div>
        )}
        {name === "app-navigation" && (
          <SidebarProvider
            className="min-h-0!"
            style={{ "--sidebar-width": "100%" } as CSSProperties}
          >
            <div className="w-full max-w-xs">
              <AppNavigation
                items={[
                  {
                    id: "crm",
                    label: "CRM",
                    icon: <Users />,
                    children: navigation.map((item) => ({
                      ...item,
                      active: active === item.id,
                      render: <button onClick={() => setActive(item.id)} />,
                    })),
                  },
                ]}
              />
            </div>
          </SidebarProvider>
        )}
        {name === "app-shell" && (
          <iframe
            title="App shell live example"
            src="/showcase/crm"
            className="h-[32rem] w-full rounded-2xl border-0"
          />
        )}
      </div>
      <section aria-label="Block usage">
        <h2 className="mb-2 font-medium">Usage</h2>
        <CodeSample code={code} />
      </section>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Blocks compose Naum primitives and ship with their theme and
        dependencies. Pass application-owned data and actions through props.
        AppShell includes MotionProvider; wrap standalone navigation and
        animated cards in MotionProvider. Supply named actions, meaningful trend
        labels and accessible chart content.
      </p>
    </div>
  )
}
