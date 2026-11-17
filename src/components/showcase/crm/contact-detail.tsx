"use client"

import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { MotionFadeUp } from "@/components/ui/motion"
import {
  CONTACT_STAGES,
  DEALS,
  DEMO_DATE,
  formatMoney,
  type Contact,
} from "../showcase-data"
import { useShowcase } from "../showcase-provider"

export const ContactDetail = ({
  contact,
  onClose,
}: {
  contact?: Contact
  onClose: () => void
}) => {
  const { saveContact } = useShowcase()
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
                <Avatar className="mb-3 size-14">
                  <AvatarFallback className="bg-white/20 text-white">
                    {contact.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
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
                <CardContent className="workspace-form">
                  <div className="workspace-field">
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
                      <dt>Relationship value</dt>
                      <dd>{formatMoney(contact.value)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              <section className="space-y-3" aria-label="Contact opportunities">
                <h3 className="font-medium">Opportunities</h3>
                {DEALS.filter((deal) => deal.contactId === contact.id).map(
                  (deal) => (
                    <Card size="sm" key={deal.id}>
                      <CardContent>
                        <p className="text-sm font-medium">{deal.title}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge variant="outline">{deal.stage}</Badge>
                          <span className="text-sm tabular-nums">
                            {formatMoney(deal.value)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
                {!DEALS.some((deal) => deal.contactId === contact.id) && (
                  <p className="text-sm text-muted-foreground">
                    No opportunities yet.
                  </p>
                )}
              </section>
              <section className="space-y-4" aria-label="Contact activity">
                <h3 className="font-medium">Activity</h3>
                <Card size="sm">
                  <CardContent>
                    <form
                      className="workspace-form"
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
                {contact.notes.map((note) => (
                  <MotionFadeUp
                    key={note.id}
                    className="workspace-timeline-item"
                  >
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(note.date), "d MMM yyyy")} · Alex Morgan
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm">
                      {note.text}
                    </p>
                  </MotionFadeUp>
                ))}
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
