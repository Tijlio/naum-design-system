import type { NaumTone } from "@/lib/tone"
import type { Deal } from "../showcase-data"

export const DEAL_TONES: Record<Deal["stage"], NaumTone> = {
  Discovery: "mint",
  Proposal: "amber",
  Negotiation: "lavender",
  Won: "mint",
}
