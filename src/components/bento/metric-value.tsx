export const BentoMetricValue = ({
  major,
  minor,
  currency,
}: {
  major: string
  minor?: string
  currency?: string
}) => {
  return (
    <span className="text-3xl font-normal tracking-tight tabular-nums">
      {currency && (
        <span className="mr-1 text-lg text-muted-foreground">{currency}</span>
      )}
      {major}
      {minor && <span className="text-muted-foreground">{minor}</span>}
    </span>
  )
}
