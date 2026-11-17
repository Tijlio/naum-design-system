import { Badge } from "@/components/ui/badge"
import type { Deal } from "../showcase-data"
import { DEAL_TONES } from "./deal-tones"

export const DealStageBadge = ({ stage }: Pick<Deal, "stage">) => (
  <Badge variant="soft" tone={DEAL_TONES[stage]}>
    {stage}
  </Badge>
)
