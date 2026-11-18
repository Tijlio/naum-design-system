import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const MissingRecordNotice = ({
  record,
  onDismiss,
}: {
  record: string
  onDismiss: () => void
}) => (
  <Card size="sm" role="status">
    <CardContent className="flex flex-wrap items-center justify-between gap-(--naum-space-control)">
      <p>{record} is no longer available.</p>
      <Button variant="outline" size="sm" onClick={onDismiss}>
        Return to overview
      </Button>
    </CardContent>
  </Card>
)
