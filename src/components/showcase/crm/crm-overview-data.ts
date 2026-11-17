import {
  CONTACT_STAGES,
  CRM_COMPARISON,
  DEALS,
  DEMO_DATE,
  type Appointment,
  type Contact,
  type Deal,
} from "../showcase-data"

const getTrend = (value: number, previous: number) => {
  const direction: "up" | "down" | "flat" =
    value > previous ? "up" : value < previous ? "down" : "flat"
  const change = Math.round(Math.abs((value - previous) / previous) * 100)
  return {
    direction,
    label: `${direction === "up" ? "Up" : direction === "down" ? "Down" : "Unchanged"} ${change}% compared with the previous period`,
  }
}

export const getCrmOverview = (
  contacts: Contact[],
  appointments: Appointment[],
  deals: Deal[] = DEALS,
  day = DEMO_DATE,
) => {
  const active = contacts.filter((contact) => contact.stage !== "Archived")
  const openDeals = deals.filter((deal) => deal.stage !== "Won")
  const pipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0)
  const wonValue = deals
    .filter((deal) => deal.stage === "Won")
    .reduce((sum, deal) => sum + deal.value, 0)
  const metrics = [
    {
      label: "Pipeline value",
      value: pipelineValue,
      detail: `${openDeals.length} open opportunities`,
      breakdown: openDeals.map((deal) => ({
        label: deal.title,
        value: deal.value,
      })),
      breakdownLabel: "Pipeline value by opportunity, in euros",
      color: "var(--chart-3)",
      currency: true,
      previous: CRM_COMPARISON.pipelineValue,
    },
    {
      label: "Active contacts",
      value: active.length,
      detail: `${active.filter((contact) => contact.stage === "Lead").length} leads to follow up`,
      breakdown: CONTACT_STAGES.filter((stage) => stage !== "Archived").map(
        (stage) => ({
          label: stage,
          value: active.filter((contact) => contact.stage === stage).length,
        }),
      ),
      breakdownLabel: "Active contacts by relationship",
      color: "var(--chart-1)",
      currency: false,
      previous: CRM_COMPARISON.activeContacts,
    },
    {
      label: "Won this month",
      value: wonValue,
      detail: "November 2026",
      breakdown: [
        { label: "Won", value: wonValue },
        { label: "Open", value: pipelineValue },
      ],
      breakdownLabel: "Won versus open opportunity value, in euros",
      color: "var(--chart-5)",
      currency: true,
      previous: CRM_COMPARISON.wonValue,
    },
  ]
  return {
    openDeals,
    metrics: metrics.map((metric) => ({
      ...metric,
      trend: getTrend(metric.value, metric.previous),
    })),
    appointmentCount: appointments.filter(
      (event) => event.start.slice(0, 10) === day,
    ).length,
    upcoming: appointments
      .filter((event) => event.contactId && event.start >= day)
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 3),
    recentContacts: [...active]
      .sort(
        (a, b) =>
          b.lastContact.localeCompare(a.lastContact) ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 4),
  }
}
