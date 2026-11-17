"use client"

import Link from "next/link"
import {
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  TrendingUp,
  Users,
  Trophy,
} from "lucide-react"
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

export const CrmOverview = () => {
  const { contacts, appointments } = useShowcase()
  const active = contacts.filter((contact) => contact.stage !== "Archived")
  const openDeals = DEALS.filter((deal) => deal.stage !== "Won")
  const metrics = [
    {
      label: "Pipeline value",
      value: formatMoney(openDeals.reduce((sum, deal) => sum + deal.value, 0)),
      detail: `${openDeals.length} open opportunities`,
      mesh: "naum-mesh-lime",
      icon: TrendingUp,
    },
    {
      label: "Active contacts",
      value: String(active.length),
      detail: `${active.filter((contact) => contact.stage === "Lead").length} leads to follow up`,
      mesh: "naum-mesh-indigo",
      icon: Users,
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
      mesh: "naum-mesh-coral",
      icon: Trophy,
    },
    {
      label: "Appointments",
      value: String(
        appointments.filter((event) => event.start.slice(0, 10) === DEMO_DATE)
          .length,
      ),
      detail: "Tuesday, 17 November",
      mesh: "naum-mesh-mint",
      icon: CalendarDays,
    },
  ]
  return (
    <div className="workspace-stack crm-workspace">
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
        {metrics.map(({ icon: Icon, ...metric }) => (
          <MotionStaggerItem key={metric.label}>
            <Card
              variant="mesh"
              className={`crm-metric ${metric.mesh} h-full text-(--crm-metric-ink) naum-card-lift [&_[data-slot=card-description]]:text-inherit`}
            >
              <CardHeader>
                <CardDescription>{metric.label}</CardDescription>
                <CardAction>
                  <span className="crm-metric-icon">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="workspace-metric-value">{metric.value}</p>
                <p className="text-xs">{metric.detail}</p>
              </CardContent>
            </Card>
          </MotionStaggerItem>
        ))}
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
        <Card variant="glass" className="lg:col-span-2">
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
