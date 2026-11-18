"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShowcase } from "./showcase-provider"

export const CustomerContext = ({
  contactId,
  dealId,
  taskId,
  onNavigate,
}: {
  contactId?: string
  dealId?: string
  taskId?: string
  onNavigate?: (href: string) => void
}) => {
  const { contacts, deals, tasks } = useShowcase()
  const contact = contacts.find((contact) => contact.id === contactId)
  const deal = deals.find((deal) => deal.id === dealId)
  const task = tasks.find((task) => task.id === taskId)
  const links = [
    ...(contact
      ? [
          {
            label: `Contact: ${contact.name}`,
            href: `/showcase/crm/contacts?contact=${encodeURIComponent(contact.id)}`,
          },
        ]
      : []),
    ...(deal
      ? [
          {
            label: `Opportunity: ${deal.title}`,
            href: `/showcase/crm/pipeline?deal=${encodeURIComponent(deal.id)}`,
          },
        ]
      : []),
    ...(task
      ? [
          {
            label: `Task: ${task.title}`,
            href: `/showcase/crm/tasks?task=${encodeURIComponent(task.id)}`,
          },
        ]
      : []),
  ]
  if (!links.length) return null
  return (
    <nav
      aria-label="Related records"
      className="flex flex-wrap gap-(--naum-space-inline)"
    >
      {links.map((link) => (
        <Button
          key={link.href}
          variant="link"
          size="sm"
          className="h-auto max-w-full p-0 text-left whitespace-normal"
          nativeButton={false}
          render={
            <Link
              href={link.href}
              onClick={(event) => {
                if (
                  onNavigate &&
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey
                ) {
                  event.preventDefault()
                  onNavigate(link.href)
                }
              }}
            />
          }
        >
          {link.label}
          <ArrowUpRight aria-hidden />
        </Button>
      ))}
    </nav>
  )
}
