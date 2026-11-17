import { expect, it } from "vitest"
import { getPipelineColumns } from "@/components/showcase/crm/pipeline-data"
import { DEALS, INITIAL_CONTACTS } from "@/components/showcase/showcase-data"

it("counts each opportunity exactly once and keeps stage totals consistent", () => {
  const columns = getPipelineColumns(DEALS, INITIAL_CONTACTS)
  expect(columns.map((column) => column.stage)).toEqual([
    "Discovery",
    "Proposal",
    "Negotiation",
    "Won",
  ])
  expect(columns.flatMap((column) => column.deals)).toHaveLength(DEALS.length)
  expect(columns.reduce((sum, column) => sum + column.value, 0)).toBe(
    DEALS.reduce((sum, deal) => sum + deal.value, 0),
  )
  const moved = DEALS.map((deal, i) =>
    i ? deal : { ...deal, stage: "Won" as const },
  )
  expect(getPipelineColumns(moved, INITIAL_CONTACTS).at(-1)?.value).toBe(52500)
  expect(DEALS[0].stage).toBe("Negotiation")
})

it("searches titles, contact names and companies without dropping empty stages", () => {
  for (const query of ["EMMA", " studio north ", "workspace rollout"]) {
    const columns = getPipelineColumns(DEALS, INITIAL_CONTACTS, query)
    expect(columns).toHaveLength(4)
    expect(
      columns.flatMap((column) => column.deals).map((deal) => deal.id),
    ).toEqual([DEALS[0].id])
  }
  expect(
    getPipelineColumns(DEALS, INITIAL_CONTACTS, "no match").every(
      (column) => column.value === 0 && column.deals.length === 0,
    ),
  ).toBe(true)
})
