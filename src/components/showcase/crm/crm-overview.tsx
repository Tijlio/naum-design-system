"use client"

import Link from "next/link"
import { ArrowUpRight, ArrowRight, CalendarDays } from "lucide-react"
import { InsightCard } from "@/components/bento/insight-card"
import { BentoMetricValue } from "@/components/bento/metric-value"
import { format, parseISO } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MotionFadeUp,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/ui/motion"
import { DEALS, DEMO_DATE, formatMoney } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { RevenueChart } from "./revenue-chart"
import { MetricBreakdown } from "./metric-breakdown"

export const CrmOverview = () => {
  const { contacts, appointments } = useShowcase()
  const active = contacts.filter((contact) => contact.stage !== "Archived")
  const openDeals = DEALS.filter((deal) => deal.stage !== "Won")
  const metrics = [
    {
      label: "Pipeline value",
      value: formatMoney(openDeals.reduce((sum, deal) => sum + deal.value, 0)),
      detail: `${openDeals.length} open opportunities`,
      breakdown: openDeals.map((deal) => ({
        label: deal.title,
        value: deal.value,
      })),
      breakdownLabel: "Pipeline value by opportunity, in euros",
      color: "var(--chart-3)",
      currency: true,
    },
    {
      label: "Active contacts",
      value: String(active.length),
      detail: `${active.filter((contact) => contact.stage === "Lead").length} leads to follow up`,
      breakdown: ["Lead", "Customer", "Partner"].map((stage) => ({
        label: stage,
        value: active.filter((contact) => contact.stage === stage).length,
      })),
      breakdownLabel: "Active contacts by relationship",
      color: "var(--chart-1)",
      currency: false,
    },
    {
      label: "Won this month",
      value: formatMoney(
        DEALS.filter((deal) => deal.stage === "Won").reduce(
          (sum, deal) => sum + deal.value,
          0,
        ),
      ),
      detail: "November 2026",
      breakdown: ["Won", "Open"].map((stage) => ({
        label: stage,
        value: DEALS.filter((deal) =>
          stage === "Won" ? deal.stage === "Won" : deal.stage !== "Won",
        ).reduce((sum, deal) => sum + deal.value, 0),
      })),
      breakdownLabel: "Won versus open opportunity value, in euros",
      color: "var(--chart-5)",
      currency: true,
    },
  ]
  return (
    <div className="workspace-stack">
      <MotionFadeUp>
        <div className="workspace-heading">
          <div>
            <p className="workspace-eyebrow">Tuesday, 17 November 2026</p>
            <h1 className="workspace-title">Good morning, Alex</h1>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/showcase/crm/contacts" />}
          >
            View contacts
            <ArrowUpRight />
          </Button>
        </div>
      </MotionFadeUp>
      <MotionStagger className="workspace-metrics">
        {metrics.map((metric) => (
          <MotionStaggerItem key={metric.label}>
            <Card
              variant="default"
              className="h-full justify-between naum-card-lift"
            >
              <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <CardAction>
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    nativeButton={false}
                    aria-label={`Open ${metric.label}`}
                    render={<Link href="/showcase/crm/contacts" />}
                  >
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  <BentoMetricValue
                    value={metric.value.replace("€", "")}
                    currency={metric.value.startsWith("€") ? "€" : undefined}
                  />
                </p>
                <MetricBreakdown
                  data={metric.breakdown}
                  label={metric.breakdownLabel}
                  color={metric.color}
                  currency={metric.currency}
                />
                <p className="text-xs text-muted-foreground">{metric.detail}</p>
              </CardContent>
            </Card>
          </MotionStaggerItem>
        ))}
        <MotionStaggerItem>
          <InsightCard
            title="Appointments"
            action={
              <Button
                variant="mesh"
                size="icon-sm"
                nativeButton={false}
                aria-label="Open appointments"
                render={<Link href="/showcase/calendar" />}
              >
                <ArrowUpRight className="size-3.5" />
              </Button>
            }
          >
            <div className="space-y-1">
              <p className="text-xs text-white/85">Tuesday, 17 November</p>
              <p className="text-3xl font-normal tracking-tight tabular-nums">
                {
                  appointments.filter(
                    (event) => event.start.slice(0, 10) === DEMO_DATE,
                  ).length
                }
              </p>
            </div>
          </InsightCard>
        </MotionStaggerItem>
      </MotionStagger>
      <div className="grid gap-5 lg:grid-cols-3">
        <RevenueChart />
        <Card variant="frosted" className="crm-conversations">
          <CardHeader>
            <CardTitle>
              <h2>Coming up</h2>
            </CardTitle>
            <CardDescription>Your next conversations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {appointments
              .filter((event) => event.contactId && event.start >= DEMO_DATE)
              .slice(0, 3)
              .map((event) => (
                <div className="flex items-start gap-3" key={event.id}>
                  <span
                    className="workspace-icon crm-accent"
                    data-tone="lavender"
                  >
                    <CalendarDays className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Button
                      variant="link"
                      className="h-auto justify-start whitespace-normal p-0 text-left"
                      nativeButton={false}
                      render={
                        <Link
                          href={`/showcase/crm/contacts?contact=${event.contactId}`}
                        />
                      }
                    >
                      {event.title}
                    </Button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(parseISO(event.start), "EEE d MMM · HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card variant="default" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <h2>Open opportunities</h2>
            </CardTitle>
            <CardDescription>
              Keep your next conversation in sight
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{openDeals.length} active</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-auto p-0"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/showcase/crm/contacts?contact=${deal.contactId}`}
                          />
                        }
                      >
                        {deal.title}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="crm-accent"
                        data-tone={
                          deal.stage === "Negotiation"
                            ? "lavender"
                            : deal.stage === "Proposal"
                              ? "amber"
                              : "mint"
                        }
                      >
                        {deal.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(deal.value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card variant="frosted">
          <CardHeader>
            <CardTitle>
              <h2>Your people</h2>
            </CardTitle>
            <CardDescription>Recently in touch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {active.slice(0, 4).map((contact) => (
              <Link
                key={contact.id}
                href={`/showcase/crm/contacts?contact=${contact.id}`}
                className="workspace-person"
              >
                <Avatar>
                  <AvatarFallback className="crm-accent" data-tone="lavender">
                    {contact.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {contact.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {contact.company}
                  </span>
                </span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
