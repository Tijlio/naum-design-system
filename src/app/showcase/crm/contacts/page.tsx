import { Suspense } from "react"
import { ContactsWorkspace } from "@/components/showcase/crm/contacts-workspace"
import { Skeleton } from "@/components/ui/skeleton"

export default function ContactsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ContactsWorkspace />
    </Suspense>
  )
}
