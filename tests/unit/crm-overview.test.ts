import { expect, it } from "vitest"
import { getCrmOverview } from "@/components/showcase/crm/crm-overview-data"
import {
  INITIAL_APPOINTMENTS,
  INITIAL_CONTACTS,
  DEALS,
} from "@/components/showcase/showcase-data"

it("orders new appointments by time and recent contacts by their latest contact date", () => {
  const contacts = [
    { ...INITIAL_CONTACTS[0], lastContact: "2026-11-10" },
    { ...INITIAL_CONTACTS[1], lastContact: "2026-11-16" },
    { ...INITIAL_CONTACTS[2], stage: "Archived" as const },
  ]
  const appointments = [
    ...INITIAL_APPOINTMENTS,
    {
      ...INITIAL_APPOINTMENTS[1],
      id: "new",
      start: "2026-11-17T08:00",
      end: "2026-11-17T09:00",
    },
  ]
  const original = JSON.stringify({ contacts, appointments })
  const overview = getCrmOverview(contacts, appointments)
  expect(overview.upcoming[0].id).toBe("new")
  expect(overview.recentContacts.map((contact) => contact.id)).toEqual([
    contacts[1].id,
    contacts[0].id,
  ])
  expect(
    overview.metrics.find((metric) => metric.label === "Active contacts")
      ?.value,
  ).toBe(2)
  expect(JSON.stringify({ contacts, appointments })).toBe(original)
})

it("keeps metric totals and chart breakdowns in agreement", () => {
  const { metrics } = getCrmOverview(INITIAL_CONTACTS, INITIAL_APPOINTMENTS)
  const pipeline = DEALS.filter((deal) => deal.stage !== "Won").reduce(
    (sum, deal) => sum + deal.value,
    0,
  )
  expect(metrics[0].value).toBe(pipeline)
  expect(
    metrics[0].breakdown.reduce((sum, entry) => sum + entry.value, 0),
  ).toBe(pipeline)
  expect(
    metrics[2].breakdown.find((entry) => entry.label === "Open")?.value,
  ).toBe(pipeline)
})

it("derives up, down and unchanged indicators from the comparison values", () => {
  const { metrics } = getCrmOverview(INITIAL_CONTACTS, INITIAL_APPOINTMENTS)
  expect(metrics[0].trend).toEqual({
    direction: "down",
    label: "Down 8% compared with the previous period",
  })
  expect(metrics[2].trend.direction).toBe("up")
  const unchanged = getCrmOverview(
    INITIAL_CONTACTS.slice(0, 6),
    INITIAL_APPOINTMENTS,
  )
  expect(unchanged.metrics[1].trend.direction).toBe("flat")
})
