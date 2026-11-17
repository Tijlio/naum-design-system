import type { NaumTone } from "@/lib/tone"
import type { Appointment } from "../showcase-data"

export const CALENDAR_TONES: Record<Appointment["calendar"], NaumTone> = {
  Sales: "lavender",
  Team: "mint",
  Personal: "amber",
}
