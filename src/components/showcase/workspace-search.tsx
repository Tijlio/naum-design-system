"use client"

import { SiteSearch } from "@/components/search/site-search"
import {
  PAGE_ENTRIES,
  type SearchEntry,
} from "@/components/search/search-entries"
import { DEALS } from "./showcase-data"
import { useShowcase } from "./showcase-provider"

export const WorkspaceSearch = () => {
  const { contacts } = useShowcase()
  const entries: SearchEntry[] = [
    ...PAGE_ENTRIES,
    ...contacts
      .filter((contact) => contact.stage !== "Archived")
      .map((contact): SearchEntry => ({
        id: contact.id,
        title: contact.name,
        description: contact.company,
        group: "Contacts",
        href: `/showcase/crm/contacts?contact=${contact.id}`,
      })),
    ...DEALS.map((deal): SearchEntry => ({
      id: deal.id,
      title: deal.title,
      group: "Deals",
      href: `/showcase/crm/contacts?contact=${deal.contactId}`,
    })),
  ]
  return <SiteSearch entries={entries} />
}
