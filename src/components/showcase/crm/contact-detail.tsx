"use client"

import { formatMoney } from "@/lib/money-format"

import Link from "next/link"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SelectControl } from "@/components/ui/select-control"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { RelatedTasks } from "../tasks/related-tasks"
import { ContactTimeline } from "./contact-timeline"
import { CONTACT_STAGES, DEMO_DATE, type Contact } from "../showcase-data"
import { useShowcase } from "../showcase-provider"
import { ContactAvatar } from "./contact-avatar"
import { DealStageBadge } from "./deal-stage-badge"

export const ContactDetail = ({
  contact,
  onClose,
}: {
  contact?: Contact
  onClose: () => void
}) => {
  const { saveContact, deals } = useShowcase()
  return (
    <Sheet
      open={Boolean(contact)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent className="workspace-overlay workspace-detail-sheet overflow-y-auto sm:max-w-lg">
        {contact && (
          <>
            <Card
              variant="mesh"
              className="naum-mesh-indigo mx-4 mt-4 shrink-0 gap-0 py-0"
            >
              <SheetHeader className="pr-12">
                <ContactAvatar
                  name={contact.name}
                  className="mb-3 size-14"
                  onMesh
                />
                <SheetTitle className="text-xl font-normal text-white">
                  {contact.name}
                </SheetTitle>
                <SheetDescription className="text-white/85">
                  {contact.role} · {contact.company}
                </SheetDescription>
              </SheetHeader>
            </Card>
            <div className="workspace-stack px-4 pt-6 pb-4">
              <Card size="sm">
                <CardContent className="naum-form">
                  <div className="naum-field">
                    <Label htmlFor="detail-stage">Relationship</Label>
                    <SelectControl
                      id="detail-stage"
                      value={contact.stage}
                      className="w-full"
                      items={CONTACT_STAGES.map((stage) => ({
                        value: stage,
                        label: stage,
                      }))}
                      onValueChange={(stage) => {
                        if (stage) {
                          saveContact({ ...contact, stage })
                          toast.success("Relationship updated")
                        }
                      }}
                    />
                  </div>
                  <dl className="workspace-details">
                    <div>
                      <dt>Email</dt>
                      <dd>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </dd>
                    </div>
                    <div>
                      <dt>Owner</dt>
                      <dd>{contact.owner}</dd>
                    </div>
                    <div>
                      <dt>Last contacted</dt>
                      <dd>
                        {format(parseISO(contact.lastContact), "d MMM yyyy")}
                      </dd>
                    </div>
                    <div>
                      <dt>Relationship value</dt>
                      <dd>{formatMoney(contact.value)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              <section className="space-y-3" aria-label="Contact opportunities">
                <h3 className="font-medium">Opportunities</h3>
                {deals
                  .filter((deal) => deal.contactId === contact.id)
                  .map((deal) => (
                    <Card size="sm" key={deal.id}>
                      <CardContent>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-left whitespace-normal"
                          nativeButton={false}
                          render={
                            <Link
                              href={`/showcase/crm/pipeline?deal=${deal.id}`}
                            />
                          }
                        >
                          {deal.title}
                        </Button>
                        <div className="mt-2 flex items-center justify-between">
                          <DealStageBadge stage={deal.stage} />
                          <span className="text-sm tabular-nums">
                            {formatMoney(deal.value)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {!deals.some((deal) => deal.contactId === contact.id) && (
                  <p className="text-sm text-muted-foreground">
                    No opportunities yet.
                  </p>
                )}
              </section>
              <RelatedTasks contactId={contact.id} />
              <section className="space-y-4" aria-label="Contact activity">
                <h3 className="font-medium">Activity</h3>
                <Card size="sm">
                  <CardContent>
                    <form
                      className="naum-form"
                      onSubmit={(event) => {
                        event.preventDefault()
                        const form = event.currentTarget
                        const note = new FormData(form).get("note")
                        if (typeof note !== "string" || !note.trim()) return
                        saveContact({
                          ...contact,
                          notes: [
                            {
                              id: crypto.randomUUID(),
                              text: note.trim(),
                              date: DEMO_DATE,
                            },
                            ...contact.notes,
                          ],
                        })
                        form.reset()
                        toast.success("Note added")
                      }}
                    >
                      <Label htmlFor="contact-note">Add a note</Label>
                      <Textarea
                        id="contact-note"
                        name="note"
                        required
                        maxLength={2000}
                        placeholder="What would you like to remember?"
                      />
                      <Button type="submit" size="sm" className="self-end">
                        Save note
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                <ContactTimeline contact={contact} />
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
