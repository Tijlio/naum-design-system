"use client"

import Link from "next/link"
import { ArrowUpRight, ArrowRight, CalendarDays } from "lucide-react"
import { InsightCard } from "@/components/bento/insight-card"
import { BentoStatCard } from "@/components/blocks/bento-stat-card"
import { format, parseISO } from "date-fns"
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
import { formatMoney, formatMoneyParts } from "@/lib/money-format"
import { useShowcase } from "../showcase-provider"
import { ContactAvatar } from "./contact-avatar"
import { DealStageBadge } from "./deal-stage-badge"
import { RevenueChart } from "./revenue-chart"
import { MetricBreakdown } from "./metric-breakdown"
import { getCrmOverview } from "./crm-overview-data"

export const CrmOverview = () => {
  const { contacts, appointments, deals } = useShowcase()
  const { openDeals, metrics, appointmentCount, upcoming, recentContacts } =
    getCrmOverview(contacts, appointments, deals)
  return (
    <div className="workspace-stack">
      <MotionFadeUp>
        <div className="workspace-heading">
          <div>
            <p className="workspace-eyebrow">Tuesday, 17 November 2026</p>
            <h1 className="naum-page-title">Good morning, Alex</h1>
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
            <BentoStatCard
              title={metric.label}
              value={
                metric.currency
                  ? formatMoneyParts(metric.value)
                  : { major: String(metric.value) }
              }
              trend={metric.trend}
              action={
                <Button
                  variant="secondary"
                  size="icon-sm"
                  nativeButton={false}
                  aria-label={`Open ${metric.label}`}
                  render={<Link href="/showcase/crm/contacts" />}
                >
                  <ArrowUpRight className="size-3.5" />
                </Button>
              }
            >
              <MetricBreakdown
                data={metric.breakdown}
                label={metric.breakdownLabel}
                color={metric.color}
                currency={metric.currency}
              />
              <p className="text-xs text-muted-foreground">{metric.detail}</p>
            </BentoStatCard>
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
                {appointmentCount}
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
            {upcoming.map((event) => (
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
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity</TableHead>
                  <TableHead className="hidden w-28 sm:table-cell">
                    Stage
                  </TableHead>
                  <TableHead className="w-24 text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="whitespace-normal">
                      <Button
                        variant="link"
                        className="h-auto justify-start p-0 text-left whitespace-normal"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/showcase/crm/contacts?contact=${deal.contactId}`}
                          />
                        }
                      >
                        {deal.title}
                      </Button>
                      <div className="mt-2 sm:hidden">
                        <DealStageBadge stage={deal.stage} />
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <DealStageBadge stage={deal.stage} />
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
            {recentContacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/showcase/crm/contacts?contact=${contact.id}`}
                className="workspace-person"
              >
                <ContactAvatar name={contact.name} />
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
