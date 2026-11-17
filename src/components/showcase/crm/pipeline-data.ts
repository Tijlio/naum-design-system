import { DEAL_STAGES, type Contact, type Deal } from "../showcase-data"

export const getPipelineColumns = (
  deals: Deal[],
  contacts: Contact[],
  query = "",
) => {
  const names = new Map(
    contacts.map((contact) => [
      contact.id,
      `${contact.name} ${contact.company}`,
    ]),
  )
  const search = query.trim().toLowerCase()
  const matching = deals.filter((deal) =>
    `${deal.title} ${names.get(deal.contactId) ?? ""}`
      .toLowerCase()
      .includes(search),
  )
  return DEAL_STAGES.map((stage) => {
    const entries = matching.filter((deal) => deal.stage === stage)
    return {
      stage,
      deals: entries,
      value: entries.reduce((sum, deal) => sum + deal.value, 0),
    }
  })
}
