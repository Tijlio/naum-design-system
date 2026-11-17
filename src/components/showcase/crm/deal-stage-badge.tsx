import { Badge } from "@/components/ui/badge"
import type { Deal } from "../showcase-data"

const TONES: Record<Deal["stage"], string> = {
  Negotiation: "lavender",
  Proposal: "amber",
  Discovery: "mint",
  Won: "mint",
}

export const DealStageBadge = ({ stage }: Pick<Deal, "stage">) => (
  <Badge variant="outline" className="crm-accent" data-tone={TONES[stage]}>
    {stage}
  </Badge>
)
