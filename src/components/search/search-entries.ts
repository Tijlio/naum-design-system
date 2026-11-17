export type SearchEntry = {
  id: string
  title: string
  description?: string
  group: "Pages" | "Contacts" | "Deals" | "Appointments"
  href: string
}

export const PAGE_ENTRIES: SearchEntry[] = [
  { id: "crm", title: "CRM overview", group: "Pages", href: "/showcase/crm" },
  {
    id: "contacts",
    title: "All contacts",
    group: "Pages",
    href: "/showcase/crm/contacts",
  },
  { id: "bento", title: "Bento dashboard", group: "Pages", href: "/" },
  {
    id: "components",
    title: "Component preview",
    group: "Pages",
    href: "/preview",
  },
]
