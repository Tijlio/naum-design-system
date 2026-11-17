"use client"

import { SiteSearch } from "@/components/search/site-search"
import {
  PAGE_ENTRIES,
  type SearchEntry,
} from "@/components/search/search-entries"
import { useShowcase } from "./showcase-provider"

export const WorkspaceSearch = () => {
  const { contacts, appointments, deals } = useShowcase()
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
    ...deals.map((deal): SearchEntry => ({
      id: deal.id,
      title: deal.title,
      group: "Deals",
      href: `/showcase/crm/contacts?contact=${deal.contactId}`,
    })),
    ...appointments.map((appointment): SearchEntry => ({
      id: appointment.id,
      title: appointment.title,
      description: appointment.start.slice(0, 10),
      group: "Appointments",
      href: `/showcase/calendar?event=${appointment.id}`,
    })),
  ]
  return <SiteSearch entries={entries} />
}
